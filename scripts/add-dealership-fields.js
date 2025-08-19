const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addDealershipFields() {
  try {
    console.log('Starting migration to add dealership fields...')

    // Add seller_type column if it doesn't exist
    const { error: sellerTypeError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'cars' AND column_name = 'seller_type') THEN
            ALTER TABLE public.cars ADD COLUMN seller_type TEXT DEFAULT 'individual' CHECK (seller_type IN ('individual', 'dealership'));
          END IF;
        END $$;
      `
    })

    if (sellerTypeError) {
      console.error('Error adding seller_type column:', sellerTypeError)
    } else {
      console.log('✅ seller_type column added successfully')
    }

    // Add dealership_name column if it doesn't exist
    const { error: dealershipNameError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'cars' AND column_name = 'dealership_name') THEN
            ALTER TABLE public.cars ADD COLUMN dealership_name TEXT;
          END IF;
        END $$;
      `
    })

    if (dealershipNameError) {
      console.error('Error adding dealership_name column:', dealershipNameError)
    } else {
      console.log('✅ dealership_name column added successfully')
    }

    // Update existing cars to have default seller_type
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.cars 
        SET seller_type = 'individual' 
        WHERE seller_type IS NULL;
      `
    })

    if (updateError) {
      console.error('Error updating existing cars:', updateError)
    } else {
      console.log('✅ Existing cars updated with default seller_type')
    }

    console.log('🎉 Migration completed successfully!')
    
    // Verify the new columns exist
    const { data: columns, error: columnsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'cars' 
        AND column_name IN ('seller_type', 'dealership_name')
        ORDER BY column_name;
      `
    })

    if (columnsError) {
      console.error('Error checking columns:', columnsError)
    } else {
      console.log('📋 New columns in cars table:')
      console.table(columns)
    }

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
addDealershipFields()
