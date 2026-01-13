-- Update admin permissions to include ayat.ayk90@gmail.com
-- This script updates the database trigger and RLS policies
-- Run this in your Supabase SQL editor

-- 1. Update the handle_new_user function to include the new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    -- Extract the full name from user metadata or use email as fallback
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name',
        NEW.email
    );
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        CASE 
            WHEN NEW.email = 'mohammedlk27@gmail.com' THEN 'admin'
            WHEN NEW.email = 'ayat.ayk90@gmail.com' THEN 'admin'
            ELSE 'user'
        END,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        role = CASE 
            WHEN EXCLUDED.email = 'mohammedlk27@gmail.com' THEN 'admin'
            WHEN EXCLUDED.email = 'ayat.ayk90@gmail.com' THEN 'admin'
            ELSE users.role
        END,
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the auth insertion
        RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 2. Update existing user if they already exist
UPDATE public.users
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'ayat.ayk90@gmail.com';

-- 3. Drop and recreate RLS policies to include the new admin email

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin users can update any profile" ON public.users;
DROP POLICY IF EXISTS "Admin users can insert any car" ON public.cars;
DROP POLICY IF EXISTS "Admin users can update any car" ON public.cars;
DROP POLICY IF EXISTS "Admin users can delete any car" ON public.cars;

-- Recreate policies with both admin emails
CREATE POLICY "Admin users can view all profiles" ON public.users
    FOR SELECT USING (
        COALESCE(auth.jwt() ->> 'email', '') = 'mohammedlk27@gmail.com'
        OR COALESCE(auth.jwt() ->> 'email', '') = 'ayat.ayk90@gmail.com'
    );

CREATE POLICY "Admin users can update any profile" ON public.users
    FOR UPDATE USING (
        COALESCE(auth.jwt() ->> 'email', '') = 'mohammedlk27@gmail.com'
        OR COALESCE(auth.jwt() ->> 'email', '') = 'ayat.ayk90@gmail.com'
    );

CREATE POLICY "Admin users can insert any car" ON public.cars
    FOR INSERT WITH CHECK (
        COALESCE(auth.jwt() ->> 'email', '') = 'mohammedlk27@gmail.com'
        OR COALESCE(auth.jwt() ->> 'email', '') = 'ayat.ayk90@gmail.com'
        OR auth.uid() = user_id
    );

CREATE POLICY "Admin users can update any car" ON public.cars
    FOR UPDATE USING (
        COALESCE(auth.jwt() ->> 'email', '') = 'mohammedlk27@gmail.com'
        OR COALESCE(auth.jwt() ->> 'email', '') = 'ayat.ayk90@gmail.com'
        OR auth.uid() = user_id
    );

CREATE POLICY "Admin users can delete any car" ON public.cars
    FOR DELETE USING (
        COALESCE(auth.jwt() ->> 'email', '') = 'mohammedlk27@gmail.com'
        OR COALESCE(auth.jwt() ->> 'email', '') = 'ayat.ayk90@gmail.com'
        OR auth.uid() = user_id
    );

-- 4. Verify the update
SELECT 
    email,
    role,
    full_name,
    created_at,
    updated_at
FROM public.users
WHERE email IN ('mohammedlk27@gmail.com', 'ayat.ayk90@gmail.com')
ORDER BY email;

-- Expected output: Both users should have role = 'admin'
