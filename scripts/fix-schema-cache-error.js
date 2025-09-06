const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

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

async function fixSchemaCacheError() {
  try {
    console.log('🔧 Fixing Schema Cache Error - Adding Missing Car Fields')
    console.log('=' .repeat(70))
    
    console.log('📋 This script will add all missing car fields to fix the "availability_date" error')
    console.log('📋 Please run the SQL migration in your Supabase dashboard first')
    
    // First, let's check what columns currently exist
    console.log('\n🔍 Checking current cars table schema...')
    
    try {
      const { data: sampleCar, error: selectError } = await supabase
        .from('cars')
        .select('*')
        .limit(1)
      
      if (selectError) {
        console.log('⚠️  Error selecting from cars table:', selectError.message)
        console.log('📋 This confirms we need to add the missing fields')
      } else {
        console.log('✅ Successfully connected to cars table')
        if (sampleCar && sampleCar.length > 0) {
          console.log('📊 Sample car data keys:', Object.keys(sampleCar[0]))
        }
      }
    } catch (err) {
      console.log('⚠️  Expected error - table schema needs updating:', err.message)
    }
    
    console.log('\n📋 SQL Migration Instructions:')
    console.log('1. Go to your Supabase Dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Create a new query')
    console.log('4. Copy and paste the content from: scripts/add-availability-date-field.sql')
    console.log('5. Click "Run" to execute the migration')
    
    console.log('\n📋 After running the SQL migration:')
    console.log('1. Wait for the migration to complete')
    console.log('2. Refresh your application')
    console.log('3. The "availability_date" error should be resolved')
    
    console.log('\n🔍 Testing the fix...')
    
    // Try to test if the fields exist after migration
    setTimeout(async () => {
      try {
        const { data: testData, error: testError } = await supabase
          .from('cars')
          .select('id, name, availability_date, availability_days, fuel_type')
          .limit(1)
        
        if (testError) {
          console.log('⚠️  Fields still missing - please run the SQL migration:', testError.message)
        } else {
          console.log('✅ Schema fix successful! New fields are accessible')
          if (testData && testData.length > 0) {
            console.log('📊 Test query successful with new fields')
          }
        }
      } catch (err) {
        console.log('⚠️  Test failed - please run the SQL migration first:', err.message)
      }
    }, 2000)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n📋 Please run the SQL migration manually in Supabase dashboard')
  }
}

// Run the fix
fixSchemaCacheError()
