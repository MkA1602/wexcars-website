-- Add missing car fields including availability_date to fix schema cache error
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Add availability_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'availability_date') THEN
        ALTER TABLE public.cars ADD COLUMN availability_date DATE;
        RAISE NOTICE 'Added availability_date column';
    ELSE
        RAISE NOTICE 'availability_date column already exists';
    END IF;
    
    -- Add availability_days column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'availability_days') THEN
        ALTER TABLE public.cars ADD COLUMN availability_days INTEGER;
        RAISE NOTICE 'Added availability_days column';
    ELSE
        RAISE NOTICE 'availability_days column already exists';
    END IF;
    
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
    
    -- Add gearbox column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'gearbox') THEN
        ALTER TABLE public.cars ADD COLUMN gearbox TEXT;
        RAISE NOTICE 'Added gearbox column';
    ELSE
        RAISE NOTICE 'gearbox column already exists';
    END IF;
    
    -- Add mileage column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'mileage') THEN
        ALTER TABLE public.cars ADD COLUMN mileage INTEGER;
        RAISE NOTICE 'Added mileage column';
    ELSE
        RAISE NOTICE 'mileage column already exists';
    END IF;
    
    -- Add car_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'car_type') THEN
        ALTER TABLE public.cars ADD COLUMN car_type TEXT;
        RAISE NOTICE 'Added car_type column';
    ELSE
        RAISE NOTICE 'car_type column already exists';
    END IF;
    
    -- Add horsepower column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'horsepower') THEN
        ALTER TABLE public.cars ADD COLUMN horsepower INTEGER;
        RAISE NOTICE 'Added horsepower column';
    ELSE
        RAISE NOTICE 'horsepower column already exists';
    END IF;
    
    -- Add engine_size column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'engine_size') THEN
        ALTER TABLE public.cars ADD COLUMN engine_size TEXT;
        RAISE NOTICE 'Added engine_size column';
    ELSE
        RAISE NOTICE 'engine_size column already exists';
    END IF;
    
    -- Add drivetrain column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'drivetrain') THEN
        ALTER TABLE public.cars ADD COLUMN drivetrain TEXT;
        RAISE NOTICE 'Added drivetrain column';
    ELSE
        RAISE NOTICE 'drivetrain column already exists';
    END IF;
    
    -- Add seats column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'seats') THEN
        ALTER TABLE public.cars ADD COLUMN seats INTEGER;
        RAISE NOTICE 'Added seats column';
    ELSE
        RAISE NOTICE 'seats column already exists';
    END IF;
    
    -- Add chassis_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'chassis_number') THEN
        ALTER TABLE public.cars ADD COLUMN chassis_number TEXT;
        RAISE NOTICE 'Added chassis_number column';
    ELSE
        RAISE NOTICE 'chassis_number column already exists';
    END IF;
    
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'location') THEN
        ALTER TABLE public.cars ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column';
    ELSE
        RAISE NOTICE 'location column already exists';
    END IF;
    
    -- Add certificate_of_conformity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'certificate_of_conformity') THEN
        ALTER TABLE public.cars ADD COLUMN certificate_of_conformity TEXT;
        RAISE NOTICE 'Added certificate_of_conformity column';
    ELSE
        RAISE NOTICE 'certificate_of_conformity column already exists';
    END IF;
    
    -- Add service_book column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'service_book') THEN
        ALTER TABLE public.cars ADD COLUMN service_book TEXT;
        RAISE NOTICE 'Added service_book column';
    ELSE
        RAISE NOTICE 'service_book column already exists';
    END IF;
    
    -- Add ref_no column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'ref_no') THEN
        ALTER TABLE public.cars ADD COLUMN ref_no TEXT;
        RAISE NOTICE 'Added ref_no column';
    ELSE
        RAISE NOTICE 'ref_no column already exists';
    END IF;
    
    -- Add emission_class column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'emission_class') THEN
        ALTER TABLE public.cars ADD COLUMN emission_class TEXT;
        RAISE NOTICE 'Added emission_class column';
    ELSE
        RAISE NOTICE 'emission_class column already exists';
    END IF;
    
    -- Add first_registration column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'first_registration') THEN
        ALTER TABLE public.cars ADD COLUMN first_registration TEXT;
        RAISE NOTICE 'Added first_registration column';
    ELSE
        RAISE NOTICE 'first_registration column already exists';
    END IF;
    
    -- Add crash_history column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'crash_history') THEN
        ALTER TABLE public.cars ADD COLUMN crash_history TEXT;
        RAISE NOTICE 'Added crash_history column';
    ELSE
        RAISE NOTICE 'crash_history column already exists';
    END IF;
    
    -- Add seller_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'seller_type') THEN
        ALTER TABLE public.cars ADD COLUMN seller_type TEXT DEFAULT 'individual' CHECK (seller_type IN ('individual', 'dealership'));
        RAISE NOTICE 'Added seller_type column';
    ELSE
        RAISE NOTICE 'seller_type column already exists';
    END IF;
    
    -- Add dealership_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'dealership_name') THEN
        ALTER TABLE public.cars ADD COLUMN dealership_name TEXT;
        RAISE NOTICE 'Added dealership_name column';
    ELSE
        RAISE NOTICE 'dealership_name column already exists';
    END IF;
    
    -- Update existing cars to have default availability
    UPDATE public.cars 
    SET availability = 'Available' 
    WHERE availability IS NULL;
    
    RAISE NOTICE 'Database schema updated with all missing car fields';
END $$;
