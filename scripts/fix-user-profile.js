const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixUserProfile() {
  try {
    console.log('🔧 Fixing user profile issue...\n')

    // Get the admin user from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error getting auth users:', authError.message)
      return
    }

    console.log(`📊 Found ${authUsers.users.length} auth users`)

    // Find the admin user
    const adminUser = authUsers.users.find(user => user.email === 'mohammedlk27@gmail.com')
    
    if (!adminUser) {
      console.log('❌ Admin user not found in auth.users')
      console.log('💡 Please make sure you have signed up with mohammedlk27@gmail.com')
      return
    }

    console.log(`✅ Found admin user: ${adminUser.email}`)
    console.log(`📋 User ID: ${adminUser.id}`)

    // Check if user exists in public.users
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUser.id)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Error checking user profile:', userError.message)
      return
    }

    if (existingUser) {
      console.log('✅ User profile already exists')
      console.log(`📋 Role: ${existingUser.role}`)
      console.log(`📋 Name: ${existingUser.full_name}`)
    } else {
      console.log('🔧 Creating user profile...')
      
      // Create user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.user_metadata?.full_name || adminUser.email,
          role: 'admin'
        })

      if (insertError) {
        console.error('❌ Error creating user profile:', insertError.message)
        return
      }

      console.log('✅ User profile created successfully!')
    }

    // Test car insertion capability
    console.log('\n🚗 Testing car insertion...')
    
    const testCar = {
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
      user_id: adminUser.id
    }

    const { data: insertedCar, error: carError } = await supabase
      .from('cars')
      .insert(testCar)
      .select()
      .single()

    if (carError) {
      console.error('❌ Test car insertion failed:', carError.message)
      
      if (carError.message.includes('violates foreign key constraint')) {
        console.log('\n🚨 Foreign key constraint still exists!')
        console.log('💡 This means the users table setup is incomplete')
        console.log('📋 Please run the complete database setup script')
      }
      return
    }

    console.log('✅ Test car insertion successful!')
    console.log(`📋 Car ID: ${insertedCar.id}`)

    // Clean up test car
    await supabase.from('cars').delete().eq('id', insertedCar.id)
    console.log('🧹 Test car cleaned up')

    console.log('\n🎉 SUCCESS!')
    console.log('✅ User profile is properly set up')
    console.log('✅ You can now add cars through the dashboard')
    console.log(`✅ Visit http://localhost:3004/dashboard to add cars`)

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the fix
fixUserProfile() 