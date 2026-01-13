-- Add admin permissions for ayat.ayk90@gmail.com
-- Run this script in your Supabase SQL editor to grant admin role to the user

-- First, check if the user exists in auth.users
DO $$
DECLARE
    user_id UUID;
    user_email TEXT := 'ayat.ayk90@gmail.com';
BEGIN
    -- Find the user in auth.users
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        RAISE NOTICE 'User % not found in auth.users. Please make sure the user has registered first.', user_email;
        RETURN;
    END IF;
    
    -- Update or insert the user profile with admin role
    INSERT INTO public.users (id, email, full_name, role, updated_at)
    VALUES (
        user_id,
        user_email,
        'Ayat Admin',
        'admin',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        role = 'admin',
        updated_at = NOW();
    
    RAISE NOTICE 'Admin permissions granted to % (User ID: %)', user_email, user_id;
END $$;

-- Verify the update
SELECT 
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
FROM public.users
WHERE email = 'ayat.ayk90@gmail.com';

-- Also verify both admin users
SELECT 
    email,
    role,
    created_at
FROM public.users
WHERE role = 'admin'
ORDER BY created_at;
