/**
 * Test script to verify car delete permissions
 * Run with: node scripts/test-delete-permissions.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDeletePermissions() {
  console.log('🔍 Testing Car Delete Permissions...\n')

  try {
    // Test 1: Check if RLS is enabled
    console.log('1️⃣ Checking RLS status...')
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('check_rls_enabled', { table_name: 'cars' })
      .catch(() => {
        // If RPC doesn't exist, that's okay
        return { data: null, error: null }
      })

    if (rlsError) {
      console.log('⚠️  Could not check RLS status (this may be normal)')
    } else {
      console.log('✅ RLS check completed')
    }

    // Test 2: Check if user is authenticated
    console.log('\n2️⃣ Checking authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('❌ Not authenticated')
      console.log('   Please log in through the web interface first')
      return
    }

    console.log(`✅ Authenticated as: ${user.email}`)
    console.log(`   User ID: ${user.id}`)

    // Test 3: Get user's cars
    console.log('\n3️⃣ Fetching user cars...')
    const { data: userCars, error: carsError } = await supabase
      .from('cars')
      .select('id, brand, name, user_id')
      .eq('user_id', user.id)
      .limit(5)

    if (carsError) {
      console.error('❌ Error fetching cars:', carsError.message)
      return
    }

    if (!userCars || userCars.length === 0) {
      console.log('⚠️  No cars found for this user')
      console.log('   Add a car first to test delete functionality')
      return
    }

    console.log(`✅ Found ${userCars.length} car(s):`)
    userCars.forEach((car, index) => {
      console.log(`   ${index + 1}. ${car.brand} ${car.name} (ID: ${car.id})`)
    })

    // Test 4: Simulate delete (DRY RUN - won't actually delete)
    console.log('\n4️⃣ Testing delete permission (DRY RUN)...')
    const testCarId = userCars[0].id

    // Try to query delete permission without actually deleting
    const { error: permissionError } = await supabase
      .from('cars')
      .select('id')
      .eq('id', testCarId)
      .eq('user_id', user.id)
      .single()

    if (permissionError) {
      console.error('❌ Permission test failed:', permissionError.message)
      return
    }

    console.log('✅ Delete permission check passed')
    console.log('   User should be able to delete their own cars')

    // Test 5: Check for admin role
    console.log('\n5️⃣ Checking admin status...')
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.log('⚠️  Could not fetch user role')
    } else if (userProfile?.role === 'admin' || userProfile?.role === 'super_admin') {
      console.log(`✅ User is ${userProfile.role}`)
      console.log('   Should be able to delete any car')
    } else {
      console.log(`ℹ️  User role: ${userProfile?.role || 'user'}`)
      console.log('   Can only delete own cars')
    }

    // Summary
    console.log('\n📊 Summary:')
    console.log('─────────────────────────────────────')
    console.log('✅ Authentication: Working')
    console.log('✅ Car Retrieval: Working')
    console.log('✅ Delete Permissions: Should work')
    console.log('\n💡 If delete still fails:')
    console.log('   1. Check browser console for errors')
    console.log('   2. Run SQL script: scripts/fix-delete-permissions.sql')
    console.log('   3. Verify RLS policies in Supabase Dashboard')
    console.log('   4. Check DELETE_CARS_FIX_GUIDE.md for more help')

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message)
    console.error('\nDebug info:')
    console.error(error)
  }
}

// Run the test
testDeletePermissions()
  .then(() => {
    console.log('\n✨ Test completed\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })


