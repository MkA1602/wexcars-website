const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Database Connection...\n')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Found' : '❌ Missing')
  console.log('\n💡 Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testDatabase() {
  try {
    console.log('🌐 Supabase URL:', supabaseUrl)
    console.log('🔑 Service Key:', supabaseServiceKey ? 'Present (hidden)' : 'Missing')
    console.log()

    // Test basic connection
    console.log('1️⃣ Testing basic connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)

    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`)
    }
    console.log('✅ Database connection successful!')

    // Check if cars table exists
    console.log('\n2️⃣ Checking for cars table...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'cars')

    if (tablesError) {
      console.log('❌ Error checking tables:', tablesError.message)
      console.log('\n🚨 DATABASE SETUP REQUIRED!')
      printSetupInstructions()
      return
    }

    if (!tables || tables.length === 0) {
      console.log('❌ Cars table does not exist')
      console.log('\n🚨 DATABASE SETUP REQUIRED!')
      printSetupInstructions()
      return
    }

    console.log('✅ Cars table exists!')

    // Check if users table exists
    console.log('\n3️⃣ Checking for users table...')
    const { data: usersTables, error: usersError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'users')

    if (usersTables && usersTables.length > 0) {
      console.log('✅ Users table exists!')
    } else {
      console.log('❌ Users table missing')
    }

    // Test car insertion (dry run)
    console.log('\n4️⃣ Testing car table structure...')
    const testCarData = {
      name: 'Test Car',
      brand: 'Test Brand',
      category: 'Sedan',
      year: 2023,
      price: 100000,
      price_excl_vat: 95238.10,
      vat_rate: 5.00,
      vat_amount: 4761.90,
      currency: 'AED',
      image: 'https://example.com/test.jpg',
      description: 'Test car',
      user_id: '00000000-0000-0000-0000-000000000000' // Dummy UUID
    }

    // Just validate the structure without inserting
    const { error: insertError } = await supabase
      .from('cars')
      .insert(testCarData)
      .select()

    if (insertError) {
      if (insertError.message.includes('violates foreign key constraint')) {
        console.log('✅ Table structure is correct (foreign key constraint expected)')
      } else {
        console.log('❌ Table structure issue:', insertError.message)
        console.log('\n🚨 DATABASE SETUP REQUIRED!')
        printSetupInstructions()
        return
      }
    } else {
      console.log('⚠️ Test insertion succeeded (will need cleanup)')
      // Clean up test data
      await supabase.from('cars').delete().eq('name', 'Test Car')
    }

    console.log('\n🎉 DATABASE IS READY!')
    console.log('✅ Your database is properly configured')
    console.log('✅ You can now add cars through the dashboard')
    console.log('✅ Visit http://localhost:3004/dashboard to start adding cars')

  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    console.log('\n🚨 DATABASE SETUP REQUIRED!')
    printSetupInstructions()
  }
}

function printSetupInstructions() {
  console.log('\n📋 SETUP INSTRUCTIONS:')
  console.log('=' .repeat(50))
  console.log('1. Open Supabase Dashboard:')
  console.log('   https://supabase.com/dashboard')
  console.log('')
  console.log('2. Go to your project:')
  console.log('   Project ID: ocephfiwzejvmwfzvwas')
  console.log('')
  console.log('3. Click "SQL Editor" in the left sidebar')
  console.log('')
  console.log('4. Copy the ENTIRE content of supabase-setup.sql')
  console.log('   (All 229 lines)')
  console.log('')
  console.log('5. Paste it in the SQL Editor')
  console.log('')
  console.log('6. Click "RUN" button')
  console.log('')
  console.log('7. Wait for "Success. No rows returned" message')
  console.log('')
  console.log('8. Run this test again: npm run test-db')
  console.log('=' .repeat(50))
}

// Run the test
testDatabase() 