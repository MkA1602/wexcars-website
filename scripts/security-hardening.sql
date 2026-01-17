-- Security Hardening Script for WexCars Database
-- This script strengthens RLS policies and ensures proper authorization
-- Run this in your Supabase SQL editor

-- ============================================
-- 1. ENSURE RLS IS ENABLED ON ALL TABLES
-- ============================================

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.company_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. DROP AND RECREATE SECURE USER POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin users can update any profile" ON public.users;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT 
    USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Admin users can view all profiles (using role check, not email)
CREATE POLICY "Admin users can view all profiles" ON public.users
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Admin users can update any profile (using role check)
CREATE POLICY "Admin users can update any profile" ON public.users
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- ============================================
-- 3. DROP AND RECREATE SECURE CAR POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view cars" ON public.cars;
DROP POLICY IF EXISTS "Users can insert own cars" ON public.cars;
DROP POLICY IF EXISTS "Users can update own cars" ON public.cars;
DROP POLICY IF EXISTS "Users can delete own cars" ON public.cars;
DROP POLICY IF EXISTS "Admin users can insert any car" ON public.cars;
DROP POLICY IF EXISTS "Admin users can update any car" ON public.cars;
DROP POLICY IF EXISTS "Admin users can delete any car" ON public.cars;

-- Everyone can view non-sold cars (public listings)
CREATE POLICY "Anyone can view non-sold cars" ON public.cars
    FOR SELECT 
    USING (is_sold = false OR is_sold IS NULL);

-- Authenticated users can view their own sold cars
CREATE POLICY "Users can view own sold cars" ON public.cars
    FOR SELECT 
    USING (
        is_sold = true AND 
        auth.uid() = user_id
    );

-- Users can only insert cars with their own user_id
CREATE POLICY "Users can insert own cars" ON public.cars
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND
        auth.uid() IS NOT NULL
    );

-- Users can only update their own cars
CREATE POLICY "Users can update own cars" ON public.cars
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own cars
CREATE POLICY "Users can delete own cars" ON public.cars
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Admin users can insert any car (using role check)
CREATE POLICY "Admin users can insert any car" ON public.cars
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Admin users can update any car (using role check)
CREATE POLICY "Admin users can update any car" ON public.cars
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Admin users can delete any car (using role check)
CREATE POLICY "Admin users can delete any car" ON public.cars
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- ============================================
-- 4. SECURE COMPANY POLICIES
-- ============================================

-- Drop existing company policies if they exist
DROP POLICY IF EXISTS "Users can view own company" ON public.companies;
DROP POLICY IF EXISTS "Users can update own company" ON public.companies;
DROP POLICY IF EXISTS "Users can insert own company" ON public.companies;
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;

-- Users can only view their own company
CREATE POLICY "Users can view own company" ON public.companies
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can only update their own company
CREATE POLICY "Users can update own company" ON public.companies
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only insert their own company
CREATE POLICY "Users can insert own company" ON public.companies
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all companies
CREATE POLICY "Admins can view all companies" ON public.companies
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- ============================================
-- 5. SECURE SITE SETTINGS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;

-- Anyone can read site settings (needed for public pages like maintenance mode)
CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT 
    USING (true);

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings" ON public.site_settings
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Only admins can insert site settings
CREATE POLICY "Admins can insert site settings" ON public.site_settings
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- ============================================
-- 6. ADD SECURITY CONSTRAINTS
-- ============================================

-- Ensure role can only be set to valid values
ALTER TABLE public.users 
    DROP CONSTRAINT IF EXISTS users_role_check,
    ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'super_admin'));

-- Ensure email is not empty
ALTER TABLE public.users 
    DROP CONSTRAINT IF EXISTS users_email_not_empty,
    ADD CONSTRAINT users_email_not_empty CHECK (length(trim(email)) > 0);

-- Ensure full_name is not empty
ALTER TABLE public.users 
    DROP CONSTRAINT IF EXISTS users_full_name_not_empty,
    ADD CONSTRAINT users_full_name_not_empty CHECK (length(trim(full_name)) > 0);

-- Ensure price is positive
ALTER TABLE public.cars 
    DROP CONSTRAINT IF EXISTS cars_price_positive,
    ADD CONSTRAINT cars_price_positive CHECK (price > 0);

-- Ensure year is reasonable
ALTER TABLE public.cars 
    DROP CONSTRAINT IF EXISTS cars_year_valid,
    ADD CONSTRAINT cars_year_valid CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1);

-- ============================================
-- 7. CREATE SECURE FUNCTION FOR ROLE CHECK
-- ============================================

-- Function to safely check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_id 
        AND role IN ('admin', 'super_admin')
    );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- ============================================
-- 8. VERIFY POLICIES
-- ============================================

-- Check that RLS is enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'users'
        AND n.nspname = 'public'
        AND c.relkind = 'r'
        AND c.relrowsecurity = true
    ) THEN
        RAISE WARNING 'RLS may not be enabled on users table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'cars'
        AND n.nspname = 'public'
        AND c.relkind = 'r'
        AND c.relrowsecurity = true
    ) THEN
        RAISE WARNING 'RLS may not be enabled on cars table';
    END IF;
END $$;

-- ============================================
-- SECURITY NOTES:
-- ============================================
-- 1. All policies use auth.uid() which is secure and cannot be spoofed
-- 2. Admin checks use role-based verification, not email (more secure)
-- 3. All INSERT/UPDATE operations verify user_id matches auth.uid()
-- 4. Constraints prevent invalid data
-- 5. RLS is enforced at the database level, preventing unauthorized access
-- ============================================
