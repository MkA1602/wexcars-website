const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testCarInsert() {
  console.log('🧪 Testing Car Insert Directly')
  console.log('=' .repeat(40))

  try {
    // Get admin user ID
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const adminUser = authUsers.users.find(u => u.email === 'mohammedlk27@gmail.com')
    
    if (!adminUser) {
      throw new Error('Admin user not found')
    }

    console.log('✅ Admin user found:', adminUser.id)

    // Test car data
    const testCar = {
      name: 'Browser Test Car',
      brand: 'Test Brand',
      category: 'Sedan',
      year: 2024,
      price: 105000,
      price_excl_vat: 100000,
      vat_rate: 5.00,
      vat_amount: 5000,
      currency: 'AED',
      image: 'https://via.placeholder.com/800x600/4F46E5/white?text=Test+Car',
      description: 'This is a test car to verify browser functionality',
      features: JSON.stringify(['Air Conditioning', 'Bluetooth', 'GPS Navigation']),
      user_id: adminUser.id
    }

    console.log('📋 Inserting test car data...')
    console.log('Car data:', testCar)

    const { data: insertedCar, error: insertError } = await supabase
      .from('cars')
      .insert(testCar)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert failed:', insertError)
      throw insertError
    }

    console.log('✅ Car inserted successfully!')
    console.log('Inserted car ID:', insertedCar.id)

    // Verify the car can be retrieved
    const { data: retrievedCar, error: selectError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', insertedCar.id)
      .single()

    if (selectError) {
      console.error('❌ Retrieval failed:', selectError)
      throw selectError
    }

    console.log('✅ Car retrieved successfully!')
    console.log('Retrieved car:', {
      id: retrievedCar.id,
      name: retrievedCar.name,
      brand: retrievedCar.brand,
      price: retrievedCar.price
    })

    console.log('\n🎉 SUCCESS: Database insertion is working perfectly!')
    console.log('💡 The issue is likely in the browser form submission.')
    console.log('📋 Check browser console for detailed error logs.')

    // Clean up test car
    await supabase.from('cars').delete().eq('id', insertedCar.id)
    console.log('🧹 Test car cleaned up')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Full error:', error)
  }
}

testCarInsert() 