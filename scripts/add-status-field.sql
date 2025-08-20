-- Add status field to the cars table
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'status') THEN
        ALTER TABLE public.cars ADD COLUMN status TEXT DEFAULT 'available';
        RAISE NOTICE 'Added status column';
    ELSE
        RAISE NOTICE 'status column already exists';
    END IF;
    
    -- Add check constraint for valid status values
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE table_name = 'cars' AND constraint_name = 'cars_status_check') THEN
        ALTER TABLE public.cars ADD CONSTRAINT cars_status_check 
        CHECK (status IN ('available', 'sold', 'reserved'));
        RAISE NOTICE 'Added status check constraint';
    ELSE
        RAISE NOTICE 'status check constraint already exists';
    END IF;
    
    -- Update existing cars to have 'available' status if NULL
    UPDATE public.cars SET status = 'available' WHERE status IS NULL;
    
    RAISE NOTICE 'Database schema updated with status field';
END $$;
