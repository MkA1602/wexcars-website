-- Add new car fields to support enhanced car listings
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Add fuel_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'fuel_type') THEN
        ALTER TABLE public.cars ADD COLUMN fuel_type TEXT;
        RAISE NOTICE 'Added fuel_type column';
    ELSE
        RAISE NOTICE 'fuel_type column already exists';
    END IF;
    
    -- Add gearbox column (same as transmission but more specific)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'gearbox') THEN
        ALTER TABLE public.cars ADD COLUMN gearbox TEXT;
        RAISE NOTICE 'Added gearbox column';
    ELSE
        RAISE NOTICE 'gearbox column already exists';
    END IF;
    
    -- Add mileage column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'mileage') THEN
        ALTER TABLE public.cars ADD COLUMN mileage INTEGER;
        RAISE NOTICE 'Added mileage column';
    ELSE
        RAISE NOTICE 'mileage column already exists';
    END IF;
    
    -- Add car_type column (different from category - more specific)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'car_type') THEN
        ALTER TABLE public.cars ADD COLUMN car_type TEXT;
        RAISE NOTICE 'Added car_type column';
    ELSE
        RAISE NOTICE 'car_type column already exists';
    END IF;
    
    -- Add horsepower column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'horsepower') THEN
        ALTER TABLE public.cars ADD COLUMN horsepower INTEGER;
        RAISE NOTICE 'Added horsepower column';
    ELSE
        RAISE NOTICE 'horsepower column already exists';
    END IF;
    
    -- Add equipment column (JSON array of equipment/features)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'equipment') THEN
        ALTER TABLE public.cars ADD COLUMN equipment TEXT;
        RAISE NOTICE 'Added equipment column';
    ELSE
        RAISE NOTICE 'equipment column already exists';
    END IF;
    
    -- Add engine_size column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'engine_size') THEN
        ALTER TABLE public.cars ADD COLUMN engine_size TEXT;
        RAISE NOTICE 'Added engine_size column';
    ELSE
        RAISE NOTICE 'engine_size column already exists';
    END IF;
    
    -- Add drivetrain column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'drivetrain') THEN
        ALTER TABLE public.cars ADD COLUMN drivetrain TEXT;
        RAISE NOTICE 'Added drivetrain column';
    ELSE
        RAISE NOTICE 'drivetrain column already exists';
    END IF;
    
    -- Add availability column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'availability') THEN
        ALTER TABLE public.cars ADD COLUMN availability TEXT DEFAULT 'Available';
        RAISE NOTICE 'Added availability column';
    ELSE
        RAISE NOTICE 'availability column already exists';
    END IF;

    -- Update existing cars to have default availability
    UPDATE public.cars 
    SET availability = 'Available' 
    WHERE availability IS NULL;
    
    RAISE NOTICE 'Database schema updated with new car fields';
END $$; 