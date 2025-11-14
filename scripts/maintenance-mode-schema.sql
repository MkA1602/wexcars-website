-- Maintenance Mode Settings Table
-- Run this in your Supabase SQL editor

-- Create site_settings table for maintenance mode and other site-wide settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default maintenance mode setting (disabled)
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES (
    'maintenance_mode',
    '{"enabled": false, "message": "We are currently performing maintenance. Please check back soon."}'::jsonb,
    'Controls whether the site shows a maintenance/coming soon page on production domain'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read site settings (needed for public pages)
CREATE POLICY "Anyone can read site settings"
    ON public.site_settings
    FOR SELECT
    USING (true);

-- Policy: Only admins can update site settings
CREATE POLICY "Admins can update site settings"
    ON public.site_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Policy: Only admins can insert site settings
CREATE POLICY "Admins can insert site settings"
    ON public.site_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

