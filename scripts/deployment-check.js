const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 WexCar Deployment Checklist\n')

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

async function checkDeployment() {
  console.log('📋 DEPLOYMENT CHECKLIST:')
  console.log('='.repeat(50))

  let allGood = true

  try {
    // 1. Check environment variables
    console.log('1️⃣ Environment Variables:')
    console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL found')
    console.log('   ✅ SUPABASE_SERVICE_ROLE_KEY found')

    // 2. Check database connection
    console.log('\n2️⃣ Database Connection:')
    try {
      const { data, error } = await supabase.from('cars').select('count', { count: 'exact', head: true })
      if (error) throw error
      console.log('   ✅ Database connection successful')
    } catch (err) {
      console.log('   ❌ Database connection failed:', err.message)
      allGood = false
    }

    // 3. Check tables exist
    console.log('\n3️⃣ Database Tables:')
    try {
      // Check users table
      const { error: usersError } = await supabase.from('users').select('count', { count: 'exact', head: true })
      if (usersError) throw new Error('Users table missing')
      console.log('   ✅ Users table exists')

      // Check cars table
      const { error: carsError } = await supabase.from('cars').select('count', { count: 'exact', head: true })
      if (carsError) throw new Error('Cars table missing')
      console.log('   ✅ Cars table exists')
    } catch (err) {
      console.log('   ❌ Tables missing:', err.message)
      console.log('   💡 Please run the database setup script in Supabase')
      allGood = false
    }

    // 4. Check user profile
    console.log('\n4️⃣ User Profile:')
    try {
      const { data: users, error } = await supabase.from('users').select('*').eq('email', 'mohammedlk27@gmail.com')
      if (error) throw error
      
      if (users && users.length > 0) {
        console.log('   ✅ Admin user profile exists')
        console.log(`   📋 Role: ${users[0].role}`)
        console.log(`   📋 Name: ${users[0].full_name}`)
      } else {
        console.log('   ❌ Admin user profile missing')
        console.log('   💡 Run: npm run fix-user')
        allGood = false
      }
    } catch (err) {
      console.log('   ❌ User profile check failed:', err.message)
      allGood = false
    }

    // 5. Test car operations
    console.log('\n5️⃣ Car Operations:')
    try {
      // Get admin user
      const { data: authUsers } = await supabase.auth.admin.listUsers()
      const adminUser = authUsers.users.find(u => u.email === 'mohammedlk27@gmail.com')
      
      if (!adminUser) {
        throw new Error('Admin user not found in auth')
      }

      // Test car insertion
      const testCar = {
        name: 'Test Car - Deployment Check',
        brand: 'Test Brand',
        category: 'Sedan',
        year: 2023,
        price: 100000,
        price_excl_vat: 95238.10,
        vat_rate: 5.00,
        vat_amount: 4761.90,
        currency: 'AED',
        image: 'https://example.com/test.jpg',
        description: 'Test car for deployment verification',
        user_id: adminUser.id
      }

      const { data: insertedCar, error: insertError } = await supabase.from('cars').insert(testCar).select().single()
      if (insertError) throw insertError

      console.log('   ✅ Car insertion successful')

      // Test car retrieval
      const { data: retrievedCar, error: selectError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', insertedCar.id)
        .single()

      if (selectError) throw selectError
      console.log('   ✅ Car retrieval successful')

      // Clean up test car
      await supabase.from('cars').delete().eq('id', insertedCar.id)
      console.log('   ✅ Car deletion successful')
      console.log('   🧹 Test car cleaned up')

    } catch (err) {
      console.log('   ❌ Car operations failed:', err.message)
      if (err.message.includes('violates foreign key constraint')) {
        console.log('   💡 Run: npm run fix-user')
      } else if (err.message.includes('does not exist')) {
        console.log('   💡 Run database setup script in Supabase')
      }
      allGood = false
    }

    // 6. Check current cars count
    console.log('\n6️⃣ Current Data:')
    try {
      const { count, error } = await supabase.from('cars').select('count', { count: 'exact', head: true })
      if (error) throw error
      console.log(`   📊 Cars in database: ${count || 0}`)
    } catch (err) {
      console.log('   ❌ Could not count cars:', err.message)
    }

    // Final status
    console.log('\n' + '='.repeat(50))
    if (allGood) {
      console.log('🎉 DEPLOYMENT READY!')
      console.log('✅ All systems operational')
      console.log('✅ You can now add cars through the dashboard')
      console.log('✅ Visit your application and start adding cars!')
    } else {
      console.log('🚨 DEPLOYMENT ISSUES FOUND!')
      console.log('❌ Please fix the issues above before deploying')
      console.log('\n📋 Quick Fix Commands:')
      console.log('   npm run fix-user     # Fix user profile issues')
      console.log('   npm run test-db      # Test database connection')
    }

  } catch (error) {
    console.error('❌ Deployment check failed:', error.message)
  }
}

// Run deployment check
checkDeployment() 