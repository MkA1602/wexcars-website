const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function cleanDemoCars() {
  try {
    console.log('🧹 Starting demo cars cleanup...')

    // Check if cars table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'cars')

    if (tablesError) {
      console.error('❌ Error checking for cars table:', tablesError.message)
      console.log('💡 This might mean the database schema has not been set up yet.')
      console.log('📋 Please run the database setup script first:')
      console.log('   1. Go to Supabase Dashboard > SQL Editor')
      console.log('   2. Run the complete supabase-setup.sql script')
      console.log('   3. Then run this cleanup script again')
      return
    }

    if (!tables || tables.length === 0) {
      console.log('✅ Cars table does not exist yet - database is clean')
      console.log('💡 To set up the database:')
      console.log('   1. Go to Supabase Dashboard > SQL Editor')
      console.log('   2. Run the complete supabase-setup.sql script')
      console.log('   3. Your database will be ready for real cars!')
      return
    }

    // Get all cars from database
    const { data: cars, error: fetchError } = await supabase
      .from('cars')
      .select('*')

    if (fetchError) {
      throw fetchError
    }

    if (!cars || cars.length === 0) {
      console.log('✅ Database is already clean - no cars found')
      console.log('🎉 Your car database is ready for real cars!')
      console.log('💡 You can now:')
      console.log('   - Go to /dashboard to add your first real car')
      console.log('   - Use the Add Car form with all the enhanced features')
      console.log('   - Upload real car images and set proper pricing')
      return
    }

    console.log(`📊 Found ${cars.length} cars in database`)
    console.log('🗑️ Removing all demo cars...')

    // Delete all cars from the database
    const { error: deleteError } = await supabase
      .from('cars')
      .delete()
      .neq('id', 'impossible-id') // This will delete all records

    if (deleteError) {
      throw deleteError
    }

    console.log(`✅ Successfully removed ${cars.length} demo cars from database`)
    console.log('\n🎉 Database cleanup completed!')
    console.log('💡 Your car database is now clean and ready for real cars:')
    console.log('   - Go to /dashboard to add your first real car')
    console.log('   - Use the Add Car form with all the enhanced features')
    console.log('   - Upload real car images and set proper pricing')
    console.log('   - Add actual car features and descriptions')
    console.log('   - All cars will appear in /collections automatically')

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message)
    process.exit(1)
  }
}

// Run the cleanup
cleanDemoCars() 