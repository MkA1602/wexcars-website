-- WexCars Database Setup Script
-- Run this in your Supabase SQL editor

-- Enable RLS on auth.users (if not already enabled)
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table for extended profile information
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cars table with enhanced pricing and features
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL, -- Price including VAT
    price_excl_vat DECIMAL(12,2), -- Price excluding VAT
    vat_rate DECIMAL(5,2) DEFAULT 5.00, -- VAT rate percentage (e.g., 5.00 for 5%)
    vat_amount DECIMAL(12,2), -- Calculated VAT amount
    currency TEXT DEFAULT 'AED',
    color TEXT,
    transmission TEXT,
    image TEXT NOT NULL,
    images TEXT, -- JSON array of additional images
    description TEXT,
    features TEXT, -- JSON array of car features
    specifications JSONB,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to existing cars table (if they don't exist)
DO $$ 
BEGIN
    -- Add price_excl_vat column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'price_excl_vat') THEN
        ALTER TABLE public.cars ADD COLUMN price_excl_vat DECIMAL(12,2);
    END IF;
    
    -- Add vat_rate column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'vat_rate') THEN
        ALTER TABLE public.cars ADD COLUMN vat_rate DECIMAL(5,2) DEFAULT 5.00;
    END IF;
    
    -- Add vat_amount column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'vat_amount') THEN
        ALTER TABLE public.cars ADD COLUMN vat_amount DECIMAL(12,2);
    END IF;
    
    -- Add features column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'features') THEN
        ALTER TABLE public.cars ADD COLUMN features TEXT;
    END IF;
    
    -- Add images column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'images') THEN
        ALTER TABLE public.cars ADD COLUMN images TEXT;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin users can view all profiles
CREATE POLICY "Admin users can view all profiles" ON public.users
    FOR SELECT USING (
        COALESCE(auth.jwt() ->> 'email', '') = 'mohammedlk27@gmail.com'
    );

-- Admin users can update any profile
CREATE POLICY "Admin users can update any profile" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Cars table policies
-- Everyone can view cars
CREATE POLICY "Anyone can view cars" ON public.cars
    FOR SELECT USING (true);

-- Users can insert their own cars
CREATE POLICY "Users can insert own cars" ON public.cars
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cars
CREATE POLICY "Users can update own cars" ON public.cars
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cars
CREATE POLICY "Users can delete own cars" ON public.cars
    FOR DELETE USING (auth.uid() = user_id);

-- Admin users can insert any car
CREATE POLICY "Admin users can insert any car" ON public.cars
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Admin users can update any car
CREATE POLICY "Admin users can update any car" ON public.cars
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Admin users can delete any car
CREATE POLICY "Admin users can delete any car" ON public.cars
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON public.cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_brand ON public.cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_category ON public.cars(category);
CREATE INDEX IF NOT EXISTS idx_cars_year ON public.cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_price ON public.cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON public.cars(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        CASE 
            WHEN NEW.email = 'mohammedlk27@gmail.com' THEN 'admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate VAT automatically
CREATE OR REPLACE FUNCTION public.calculate_vat()
RETURNS TRIGGER AS $$
BEGIN
    -- If price_excl_vat and vat_rate are provided, calculate vat_amount and total price
    IF NEW.price_excl_vat IS NOT NULL AND NEW.vat_rate IS NOT NULL THEN
        NEW.vat_amount := ROUND((NEW.price_excl_vat * NEW.vat_rate / 100), 2);
        NEW.price := NEW.price_excl_vat + NEW.vat_amount;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for VAT calculation
DROP TRIGGER IF EXISTS calculate_vat_trigger ON public.cars;
CREATE TRIGGER calculate_vat_trigger
    BEFORE INSERT OR UPDATE ON public.cars
    FOR EACH ROW 
    EXECUTE FUNCTION public.calculate_vat();

-- Sample data update for existing cars (optional)
-- Update existing cars with sample VAT information
UPDATE public.cars 
SET 
    price_excl_vat = ROUND(price / 1.05, 2),
    vat_rate = 5.00,
    vat_amount = ROUND(price - (price / 1.05), 2)
WHERE price_excl_vat IS NULL;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.cars TO anon, authenticated;

-- Ensure RLS is properly enabled
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.cars FORCE ROW LEVEL SECURITY; 