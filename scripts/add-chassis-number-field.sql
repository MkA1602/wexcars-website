-- Add chassis_number field to the cars table
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Add chassis_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'chassis_number') THEN
        ALTER TABLE public.cars ADD COLUMN chassis_number TEXT;
        RAISE NOTICE 'Added chassis_number column';
    ELSE
        RAISE NOTICE 'chassis_number column already exists';
    END IF;
    
    RAISE NOTICE 'Database schema updated with chassis_number field';
END $$;
