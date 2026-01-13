-- WexCars - Fix User Registration Trigger
-- This script fixes the users_id_fkey foreign key constraint error
-- Run this in your Supabase SQL editor

-- First, let's check if the trigger exists and drop it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create or update the function to handle new user registration
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable the trigger
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Grant necessary permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;

-- Test the trigger by checking if it exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check existing auth users without profiles
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    pu.id as profile_exists
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- Fix existing users without profiles
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(
        au.raw_user_meta_data->>'full_name',
        au.raw_user_meta_data->>'first_name' || ' ' || au.raw_user_meta_data->>'last_name',
        au.email
    ),
    CASE 
        WHEN au.email = 'mohammedlk27@gmail.com' THEN 'admin'
        WHEN au.email = 'ayat.ayk90@gmail.com' THEN 'admin'
        ELSE 'user'
    END,
    au.created_at,
    NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify the fix
SELECT 
    COUNT(*) as total_auth_users,
    COUNT(pu.id) as users_with_profiles,
    COUNT(*) - COUNT(pu.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

RAISE NOTICE 'User registration trigger has been fixed and existing users have been migrated.';
RAISE NOTICE 'New user registrations should now automatically create profiles in public.users table.'; 