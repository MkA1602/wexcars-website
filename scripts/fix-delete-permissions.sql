-- Fix delete permissions for cars table

-- Enable RLS on cars table (if not already enabled)
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Drop existing delete policies to recreate them
DROP POLICY IF EXISTS "Users can delete own cars" ON public.cars;
DROP POLICY IF EXISTS "Admin users can delete any car" ON public.cars;

-- Recreate delete policy for regular users
CREATE POLICY "Users can delete own cars" ON public.cars
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Recreate delete policy for admin users
CREATE POLICY "Admin users can delete any car" ON public.cars
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'cars';

-- Verify policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'cars' AND cmd = 'DELETE';


