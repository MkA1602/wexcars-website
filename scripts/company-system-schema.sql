-- Company Management System Database Schema
-- Run this in your Supabase SQL editor

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    tax_id TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    description TEXT,
    contact_person TEXT NOT NULL,
    contact_position TEXT NOT NULL,
    business_license_url TEXT,
    tax_certificate_url TEXT,
    bank_details JSONB,
    subscription_plan TEXT DEFAULT 'basic',
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'suspended', 'rejected')),
    verification_status TEXT DEFAULT 'pending',
    verification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_fees table
CREATE TABLE IF NOT EXISTS public.company_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'AED',
    fee_type TEXT NOT NULL CHECK (fee_type IN ('listing', 'success', 'platform', 'subscription')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'refunded')),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    breakdown JSONB,
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_subscriptions table
CREATE TABLE IF NOT EXISTS public.company_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'AED',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_analytics table
CREATE TABLE IF NOT EXISTS public.company_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_listings INTEGER DEFAULT 0,
    active_listings INTEGER DEFAULT 0,
    sold_cars INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_inquiries INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    fees_paid DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add company_id to cars table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'company_id') THEN
        ALTER TABLE public.cars ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
END $$;

-- Add user_type to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'user_type') THEN
        ALTER TABLE public.users ADD COLUMN user_type TEXT DEFAULT 'individual' CHECK (user_type IN ('individual', 'company'));
    END IF;
END $$;

-- Add company_id to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'company_id') THEN
        ALTER TABLE public.users ADD COLUMN company_id UUID REFERENCES public.companies(id);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);
CREATE INDEX IF NOT EXISTS idx_company_fees_company_id ON public.company_fees(company_id);
CREATE INDEX IF NOT EXISTS idx_company_fees_car_id ON public.company_fees(car_id);
CREATE INDEX IF NOT EXISTS idx_company_fees_status ON public.company_fees(status);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company_id ON public.company_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_analytics_company_id ON public.company_analytics(company_id);
CREATE INDEX IF NOT EXISTS idx_company_analytics_date ON public.company_analytics(date);
CREATE INDEX IF NOT EXISTS idx_cars_company_id ON public.cars(company_id);

-- Create storage bucket for company documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-documents', 'company-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_analytics ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Users can view their own company" ON public.companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);

-- Company fees policies
CREATE POLICY "Users can view their company fees" ON public.company_fees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_fees.company_id 
            AND companies.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert fees for their company" ON public.company_fees
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_fees.company_id 
            AND companies.user_id = auth.uid()
        )
    );

-- Company subscriptions policies
CREATE POLICY "Users can view their company subscriptions" ON public.company_subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_subscriptions.company_id 
            AND companies.user_id = auth.uid()
        )
    );

-- Company analytics policies
CREATE POLICY "Users can view their company analytics" ON public.company_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.companies 
            WHERE companies.id = company_analytics.company_id 
            AND companies.user_id = auth.uid()
        )
    );

-- Storage policies for company documents
CREATE POLICY "Users can upload their own company documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'company-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own company documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'company-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own company documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'company-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own company documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'company-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create function to automatically create company analytics entry
CREATE OR REPLACE FUNCTION create_daily_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.company_analytics (
        company_id,
        date,
        total_listings,
        active_listings,
        sold_cars,
        total_views,
        total_inquiries,
        revenue,
        fees_paid
    )
    SELECT 
        NEW.company_id,
        CURRENT_DATE,
        COUNT(*),
        COUNT(*) FILTER (WHERE is_published = true AND is_sold = false),
        COUNT(*) FILTER (WHERE is_sold = true),
        0, -- total_views (would need separate tracking)
        0, -- total_inquiries (would need separate tracking)
        COALESCE(SUM(price) FILTER (WHERE is_sold = true), 0),
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)
    FROM public.cars c
    LEFT JOIN public.company_fees cf ON c.id = cf.car_id
    WHERE c.company_id = NEW.company_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update analytics when cars are added/updated
CREATE OR REPLACE FUNCTION update_company_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update today's analytics for the company
    INSERT INTO public.company_analytics (
        company_id,
        date,
        total_listings,
        active_listings,
        sold_cars,
        total_views,
        total_inquiries,
        revenue,
        fees_paid
    )
    SELECT 
        COALESCE(NEW.company_id, OLD.company_id),
        CURRENT_DATE,
        COUNT(*),
        COUNT(*) FILTER (WHERE is_published = true AND is_sold = false),
        COUNT(*) FILTER (WHERE is_sold = true),
        0,
        0,
        COALESCE(SUM(price) FILTER (WHERE is_sold = true), 0),
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)
    FROM public.cars c
    LEFT JOIN public.company_fees cf ON c.id = cf.car_id
    WHERE c.company_id = COALESCE(NEW.company_id, OLD.company_id)
    ON CONFLICT (company_id, date) DO UPDATE SET
        total_listings = EXCLUDED.total_listings,
        active_listings = EXCLUDED.active_listings,
        sold_cars = EXCLUDED.sold_cars,
        revenue = EXCLUDED.revenue,
        fees_paid = EXCLUDED.fees_paid;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cars table
DROP TRIGGER IF EXISTS trigger_update_company_analytics ON public.cars;
CREATE TRIGGER trigger_update_company_analytics
    AFTER INSERT OR UPDATE OR DELETE ON public.cars
    FOR EACH ROW
    EXECUTE FUNCTION update_company_analytics();

-- Create function to calculate company fees
CREATE OR REPLACE FUNCTION calculate_listing_fee(car_price DECIMAL, currency TEXT DEFAULT 'AED')
RETURNS DECIMAL AS $$
BEGIN
    RETURN car_price * 0.02; -- 2% listing fee
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_success_fee(car_price DECIMAL, currency TEXT DEFAULT 'AED')
RETURNS DECIMAL AS $$
BEGIN
    RETURN car_price * 0.05; -- 5% success fee
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create fees when car is published
CREATE OR REPLACE FUNCTION create_listing_fee()
RETURNS TRIGGER AS $$
DECLARE
    company_uuid UUID;
    listing_fee DECIMAL;
BEGIN
    -- Only create fee when car is published
    IF NEW.is_published = true AND (OLD.is_published = false OR OLD IS NULL) THEN
        -- Get company_id from car
        company_uuid := NEW.company_id;
        
        -- Calculate listing fee
        listing_fee := calculate_listing_fee(NEW.price, NEW.currency);
        
        -- Insert fee record
        INSERT INTO public.company_fees (
            company_id,
            car_id,
            amount,
            currency,
            fee_type,
            status,
            due_date,
            breakdown
        ) VALUES (
            company_uuid,
            NEW.id,
            listing_fee,
            NEW.currency,
            'listing',
            'pending',
            NOW() + INTERVAL '7 days',
            jsonb_build_object(
                'listing_fee', listing_fee,
                'success_fee', calculate_success_fee(NEW.price, NEW.currency),
                'platform_fee', NEW.price * 0.01
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic fee creation
DROP TRIGGER IF EXISTS trigger_create_listing_fee ON public.cars;
CREATE TRIGGER trigger_create_listing_fee
    AFTER INSERT OR UPDATE ON public.cars
    FOR EACH ROW
    EXECUTE FUNCTION create_listing_fee();

-- Create function to create success fee when car is sold
CREATE OR REPLACE FUNCTION create_success_fee()
RETURNS TRIGGER AS $$
DECLARE
    company_uuid UUID;
    success_fee DECIMAL;
BEGIN
    -- Only create fee when car is marked as sold
    IF NEW.is_sold = true AND OLD.is_sold = false THEN
        -- Get company_id from car
        company_uuid := NEW.company_id;
        
        -- Calculate success fee
        success_fee := calculate_success_fee(NEW.price, NEW.currency);
        
        -- Insert fee record
        INSERT INTO public.company_fees (
            company_id,
            car_id,
            amount,
            currency,
            fee_type,
            status,
            due_date,
            breakdown
        ) VALUES (
            company_uuid,
            NEW.id,
            success_fee,
            NEW.currency,
            'success',
            'pending',
            NOW() + INTERVAL '7 days',
            jsonb_build_object(
                'success_fee', success_fee,
                'car_price', NEW.price,
                'sold_at', NEW.sold_at
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic success fee creation
DROP TRIGGER IF EXISTS trigger_create_success_fee ON public.cars;
CREATE TRIGGER trigger_create_success_fee
    AFTER UPDATE ON public.cars
    FOR EACH ROW
    EXECUTE FUNCTION create_success_fee();

-- Grant necessary permissions
GRANT ALL ON public.companies TO authenticated;
GRANT ALL ON public.company_fees TO authenticated;
GRANT ALL ON public.company_subscriptions TO authenticated;
GRANT ALL ON public.company_analytics TO authenticated;

-- Create views for easier querying
CREATE OR REPLACE VIEW company_dashboard_stats AS
SELECT 
    c.id,
    c.company_name,
    c.status,
    c.subscription_plan,
    COUNT(cars.id) as total_cars,
    COUNT(cars.id) FILTER (WHERE cars.is_published = true AND cars.is_sold = false) as active_cars,
    COUNT(cars.id) FILTER (WHERE cars.is_sold = true) as sold_cars,
    COALESCE(SUM(cars.price) FILTER (WHERE cars.is_sold = true), 0) as total_revenue,
    COALESCE(SUM(cf.amount) FILTER (WHERE cf.status = 'pending'), 0) as pending_fees
FROM public.companies c
LEFT JOIN public.cars ON cars.company_id = c.id
LEFT JOIN public.company_fees cf ON cf.company_id = c.id
GROUP BY c.id, c.company_name, c.status, c.subscription_plan;

-- Grant access to the view
GRANT SELECT ON company_dashboard_stats TO authenticated;

