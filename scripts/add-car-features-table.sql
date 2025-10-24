-- Create car_features table to store custom features
-- Run this in your Supabase SQL editor

-- Create car_features table
CREATE TABLE IF NOT EXISTS public.car_features (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feature_name TEXT NOT NULL UNIQUE,
    feature_category TEXT DEFAULT 'custom',
    usage_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster searches
CREATE INDEX IF NOT EXISTS idx_car_features_name ON public.car_features(feature_name);
CREATE INDEX IF NOT EXISTS idx_car_features_category ON public.car_features(feature_category);

-- Insert initial common features
INSERT INTO public.car_features (feature_name, feature_category, usage_count)
VALUES
    ('GPS Navigation', 'technology', 100),
    ('Bluetooth', 'technology', 100),
    ('Heated Seats', 'comfort', 100),
    ('Sunroof', 'comfort', 100),
    ('Leather Seats', 'interior', 100),
    ('Parking Sensors', 'safety', 100),
    ('Backup Camera', 'safety', 100),
    ('Apple CarPlay', 'technology', 100),
    ('Android Auto', 'technology', 100),
    ('Cruise Control', 'safety', 100),
    ('Lane Assist', 'safety', 100),
    ('Adaptive Cruise Control', 'safety', 100),
    ('Blind Spot Monitoring', 'safety', 100),
    ('360° Camera', 'safety', 100),
    ('Wireless Charging', 'technology', 100),
    ('Premium Sound System', 'entertainment', 100),
    ('Ventilated Seats', 'comfort', 100),
    ('Memory Seats', 'comfort', 100),
    ('Keyless Entry', 'technology', 100),
    ('Push Button Start', 'technology', 100),
    ('Heads-Up Display', 'technology', 100),
    ('Night Vision', 'safety', 100),
    ('Massage Seats', 'comfort', 100),
    ('Rear Entertainment', 'entertainment', 100),
    ('Panoramic Roof', 'comfort', 100),
    ('Air Suspension', 'performance', 100)
ON CONFLICT (feature_name) DO NOTHING;

-- Add comments
COMMENT ON TABLE public.car_features IS 'Stores car features that can be used when listing cars';
COMMENT ON COLUMN public.car_features.feature_name IS 'Name of the feature';
COMMENT ON COLUMN public.car_features.feature_category IS 'Category of the feature (technology, comfort, safety, etc.)';
COMMENT ON COLUMN public.car_features.usage_count IS 'Number of times this feature has been used';

-- Enable RLS
ALTER TABLE public.car_features ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read features
CREATE POLICY "Anyone can read car features" ON public.car_features
    FOR SELECT USING (true);

-- Policy: Authenticated users can insert new features
CREATE POLICY "Authenticated users can add features" ON public.car_features
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Authenticated users can update features
CREATE POLICY "Authenticated users can update features" ON public.car_features
    FOR UPDATE USING (auth.uid() IS NOT NULL);
