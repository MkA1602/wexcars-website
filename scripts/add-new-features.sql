-- Add new features for car pricing and admin controls
-- Run this in your Supabase SQL editor

-- Add new columns to existing cars table (if they don't exist)
DO $$ 
BEGIN
    -- Add netto price option (skip fee calculation)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'is_netto_price') THEN
        ALTER TABLE public.cars ADD COLUMN is_netto_price BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add new car indicator (instead of mileage)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'is_new_car') THEN
        ALTER TABLE public.cars ADD COLUMN is_new_car BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add admin fee waiver option
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'admin_fee_waived') THEN
        ALTER TABLE public.cars ADD COLUMN admin_fee_waived BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add fee paid status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'fee_paid') THEN
        ALTER TABLE public.cars ADD COLUMN fee_paid BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add service fee amount
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'service_fee_amount') THEN
        ALTER TABLE public.cars ADD COLUMN service_fee_amount DECIMAL(12,2) DEFAULT 0;
    END IF;

    -- Add service fee currency
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'service_fee_currency') THEN
        ALTER TABLE public.cars ADD COLUMN service_fee_currency TEXT DEFAULT 'EUR';
    END IF;

    -- Add fee model used
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'fee_model') THEN
        ALTER TABLE public.cars ADD COLUMN fee_model TEXT DEFAULT 'vat_on_top';
    END IF;

    -- Add published status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'is_published') THEN
        ALTER TABLE public.cars ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add published at timestamp
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cars' AND column_name = 'published_at') THEN
        ALTER TABLE public.cars ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add comments to the new columns
COMMENT ON COLUMN public.cars.is_netto_price IS 'If true, car price is netto (excluding VAT) and no service fee calculation is needed';
COMMENT ON COLUMN public.cars.is_new_car IS 'If true, car is new (no mileage required)';
COMMENT ON COLUMN public.cars.admin_fee_waived IS 'If true, admin has waived the service fee requirement';
COMMENT ON COLUMN public.cars.fee_paid IS 'If true, service fee has been paid';
COMMENT ON COLUMN public.cars.service_fee_amount IS 'Amount of service fee charged';
COMMENT ON COLUMN public.cars.service_fee_currency IS 'Currency of service fee';
COMMENT ON COLUMN public.cars.fee_model IS 'Fee model used for calculation';
COMMENT ON COLUMN public.cars.is_published IS 'If true, car ad is published and visible to public';
COMMENT ON COLUMN public.cars.published_at IS 'Timestamp when car was published';

-- Update RLS policies to allow admins to waive fees
-- This policy allows admins to update fee-related fields
CREATE POLICY IF NOT EXISTS "Admins can manage fee settings" ON public.cars
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- This policy allows admins to insert cars with waived fees
CREATE POLICY IF NOT EXISTS "Admins can insert with waived fees" ON public.cars
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'super_admin')
        )
    );
