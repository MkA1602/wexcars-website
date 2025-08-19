-- Add location field to the cars table
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'location') THEN
        ALTER TABLE public.cars ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column';
    ELSE
        RAISE NOTICE 'location column already exists';
    END IF;
    
    RAISE NOTICE 'Database schema updated with location field';
END $$;
