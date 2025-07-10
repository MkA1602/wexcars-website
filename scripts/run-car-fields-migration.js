const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Found' : '❌ Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runCarFieldsMigration() {
  try {
    console.log('🚀 Running Car Fields Migration')
    console.log('='*50)

    // Test database connection
    console.log('🔗 Testing database connection...')
    const { data: testData, error: testError } = await supabase
      .from('cars')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('❌ Database connection failed:', testError.message)
      return
    }

    console.log('✅ Database connection successful')

    // Check current schema
    console.log('\n🔍 Checking current cars table schema...')
    const { data: cars, error: schemaError } = await supabase
      .from('cars')
      .select('*')
      .limit(1)

    if (schemaError) {
      console.error('❌ Error checking schema:', schemaError.message)
      return
    }

    if (cars && cars.length > 0) {
      const currentFields = Object.keys(cars[0])
      console.log('📋 Current fields:', currentFields.join(', '))
      
      const newFields = ['fuel_type', 'gearbox', 'mileage', 'car_type', 'horsepower', 'equipment', 'engine_size', 'drivetrain', 'availability']
      const missingFields = newFields.filter(field => !currentFields.includes(field))
      
      if (missingFields.length === 0) {
        console.log('✅ All new fields are already present in the database!')
        return
      }
      
      console.log('⚠️  Missing fields:', missingFields.join(', '))
    }

    console.log('\n📋 Please run the following SQL in your Supabase SQL Editor:')
    console.log('='*50)
    
    // Read and display the SQL migration
    const sqlPath = path.join(__dirname, 'add-new-car-fields.sql')
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, 'utf8')
      console.log(sql)
    } else {
      console.log(`
-- Add new car fields to support enhanced car listings
-- Run this in your Supabase SQL editor

DO $$ 
BEGIN
    -- Add fuel_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'fuel_type') THEN
        ALTER TABLE public.cars ADD COLUMN fuel_type TEXT;
        RAISE NOTICE 'Added fuel_type column';
    END IF;
    
    -- Add gearbox column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'gearbox') THEN
        ALTER TABLE public.cars ADD COLUMN gearbox TEXT;
        RAISE NOTICE 'Added gearbox column';
    END IF;
    
    -- Add mileage column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'mileage') THEN
        ALTER TABLE public.cars ADD COLUMN mileage INTEGER;
        RAISE NOTICE 'Added mileage column';
    END IF;
    
    -- Add car_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'car_type') THEN
        ALTER TABLE public.cars ADD COLUMN car_type TEXT;
        RAISE NOTICE 'Added car_type column';
    END IF;
    
    -- Add horsepower column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'horsepower') THEN
        ALTER TABLE public.cars ADD COLUMN horsepower INTEGER;
        RAISE NOTICE 'Added horsepower column';
    END IF;
    
    -- Add equipment column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'equipment') THEN
        ALTER TABLE public.cars ADD COLUMN equipment TEXT;
        RAISE NOTICE 'Added equipment column';
    END IF;
    
    -- Add engine_size column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'engine_size') THEN
        ALTER TABLE public.cars ADD COLUMN engine_size TEXT;
        RAISE NOTICE 'Added engine_size column';
    END IF;
    
    -- Add drivetrain column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'drivetrain') THEN
        ALTER TABLE public.cars ADD COLUMN drivetrain TEXT;
        RAISE NOTICE 'Added drivetrain column';
    END IF;
    
    -- Add availability column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'cars' AND column_name = 'availability') THEN
        ALTER TABLE public.cars ADD COLUMN availability TEXT DEFAULT 'Available';
        RAISE NOTICE 'Added availability column';
    END IF;

    RAISE NOTICE 'Database schema updated with new car fields';
END $$;
      `)
    }

    console.log('\n📋 After running the SQL, you can test the new fields by adding a car through the dashboard.')
    console.log('✅ Migration script completed!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the migration
runCarFieldsMigration().catch(console.error) 