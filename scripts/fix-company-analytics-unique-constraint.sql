-- Fix ON CONFLICT error for company_analytics table
-- This script adds the missing unique constraint that's required for ON CONFLICT clause

-- Add unique constraint on (company_id, date) to company_analytics table
-- This allows the ON CONFLICT clause in update_company_analytics() function to work properly
DO $$ 
BEGIN
    -- Check if the unique constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'company_analytics_company_id_date_key'
        AND conrelid = 'public.company_analytics'::regclass
    ) THEN
        -- Add unique constraint
        ALTER TABLE public.company_analytics 
        ADD CONSTRAINT company_analytics_company_id_date_key 
        UNIQUE (company_id, date);
        
        RAISE NOTICE 'Unique constraint added to company_analytics table';
    ELSE
        RAISE NOTICE 'Unique constraint already exists on company_analytics table';
    END IF;
END $$;

-- Verify the constraint was created
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'public.company_analytics'::regclass
AND conname = 'company_analytics_company_id_date_key';



