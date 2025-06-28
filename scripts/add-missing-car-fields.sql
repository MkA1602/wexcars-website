-- Add missing car fields to the cars table
DO $$ 
BEGIN
    -- Add availability column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'availability') THEN
        ALTER TABLE public.cars ADD COLUMN availability TEXT DEFAULT 'Available';
        RAISE NOTICE 'Added availability column';
    ELSE
        RAISE NOTICE 'availability column already exists';
    END IF;
    
    -- Add fuel_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'fuel_type') THEN
        ALTER TABLE public.cars ADD COLUMN fuel_type TEXT;
        RAISE NOTICE 'Added fuel_type column';
    ELSE
        RAISE NOTICE 'fuel_type column already exists';
    END IF;
    
    -- Add seats column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'seats') THEN
        ALTER TABLE public.cars ADD COLUMN seats INTEGER;
        RAISE NOTICE 'Added seats column';
    ELSE
        RAISE NOTICE 'seats column already exists';
    END IF;

    -- Update existing cars to have default availability
    UPDATE public.cars 
    SET availability = 'Available' 
    WHERE availability IS NULL;
    
    RAISE NOTICE 'Database schema updated with missing car fields';
END $$; 