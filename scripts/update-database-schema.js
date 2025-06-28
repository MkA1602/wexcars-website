const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateDatabaseSchema() {
  console.log('🔧 Updating Database Schema')
  console.log('=' .repeat(50))

  try {
    // Add missing columns one by one
    const alterCommands = [
      {
        name: 'availability',
        sql: `ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'Available';`
      },
      {
        name: 'fuel_type', 
        sql: `ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS fuel_type TEXT;`
      },
      {
        name: 'seats',
        sql: `ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS seats INTEGER;`
      }
    ]

    for (const command of alterCommands) {
      console.log(`🔧 Adding ${command.name} column...`)
      try {
        // Use the sql function to execute raw SQL
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: command.sql 
        })
        
        if (error) {
          // Try alternative method - just skip and continue
          console.log(`⚠️  Could not add ${command.name} via RPC, but that's okay`)
        } else {
          console.log(`✅ ${command.name} column added successfully`)
        }
      } catch (err) {
        console.log(`⚠️  ${command.name}: ${err.message}`)
      }
    }

    // Update existing cars to have default availability
    console.log('\n🔄 Updating existing cars with default values...')
    const { data: updateResult, error: updateError } = await supabase
      .from('cars')
      .update({ 
        availability: 'Available'
      })
      .is('availability', null)

    if (updateError) {
      console.log('⚠️  Update error (expected if column doesn\'t exist yet):', updateError.message)
    } else {
      console.log('✅ Updated existing cars with default availability')
    }

    // Test the schema by checking if we can select with the new fields
    console.log('\n🔍 Testing new schema...')
    const { data: testData, error: testError } = await supabase
      .from('cars')
      .select('id, name, availability, fuel_type, seats, transmission, color')
      .limit(1)

    if (testError) {
      console.log('⚠️  Some fields may not exist yet:', testError.message)
      console.log('\n📋 Please run this SQL manually in your Supabase dashboard:')
      console.log(`
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'Available';
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS seats INTEGER;
UPDATE public.cars SET availability = 'Available' WHERE availability IS NULL;
      `)
    } else {
      console.log('✅ Schema test successful!')
      if (testData && testData.length > 0) {
        console.log('📊 Sample data:', JSON.stringify(testData[0], null, 2))
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📋 Please run this SQL manually in your Supabase dashboard:')
    console.log(`
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'Available';
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS fuel_type TEXT;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS seats INTEGER;
UPDATE public.cars SET availability = 'Available' WHERE availability IS NULL;
    `)
  }
}

updateDatabaseSchema() 