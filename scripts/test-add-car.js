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

async function testAddCar() {
  console.log('🧪 Testing Car Addition')
  console.log('=' .repeat(50))

  try {
    // Test car data
    const testCarData = {
      name: "Test Car",
      brand: "Test Brand",
      category: "Sedan", 
      year: 2024,
      price: 105000.00,
      price_excl_vat: 100000.00,
      vat_rate: 5.00,
      vat_amount: 5000.00,
      currency: "AED",
      image: "https://via.placeholder.com/600x400/007bff/ffffff?text=Test+Car",
      images: JSON.stringify([
        "https://via.placeholder.com/600x400/007bff/ffffff?text=Test+Car+1",
        "https://via.placeholder.com/600x400/28a745/ffffff?text=Test+Car+2"
      ]),
      description: "This is a test car to verify that the form and database integration works correctly.",
      features: JSON.stringify(["GPS Navigation", "Bluetooth", "Heated Seats"]),
      transmission: "Automatic",
      color: "Blue",
      user_id: "test-user-id", // Using a test user ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('📤 Attempting to insert test car...')
    console.log('Car data:', JSON.stringify(testCarData, null, 2))

    const { data, error } = await supabase
      .from('cars')
      .insert(testCarData)
      .select()

    if (error) {
      console.error('❌ Insert failed:', error.message)
      console.error('Error details:', error)
      
      // Check if it's a foreign key constraint error
      if (error.message.includes('foreign key constraint')) {
        console.log('\n📝 This is expected - test user doesn\'t exist.')
        console.log('In real usage, the user ID comes from authenticated user.')
      }
    } else {
      console.log('✅ Test car inserted successfully!')
      console.log('Inserted data:', JSON.stringify(data, null, 2))
      
      // Clean up - remove the test car
      if (data && data[0]?.id) {
        console.log('\n🧹 Cleaning up test car...')
        const { error: deleteError } = await supabase
          .from('cars')
          .delete()
          .eq('id', data[0].id)
        
        if (deleteError) {
          console.error('❌ Cleanup failed:', deleteError.message)
        } else {
          console.log('✅ Test car cleaned up successfully')
        }
      }
    }

    // Test fetching cars to see current data
    console.log('\n🔍 Current cars in database:')
    const { data: cars, error: fetchError } = await supabase
      .from('cars')
      .select('id, name, brand, transmission, color, features, images')
      .order('created_at', { ascending: false })
      .limit(3)

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError.message)
    } else {
      console.log('📋 Cars found:', cars?.length || 0)
      cars?.forEach((car, index) => {
        console.log(`\n${index + 1}. ${car.brand} ${car.name}`)
        console.log(`   - Transmission: ${car.transmission || 'Not set'}`)
        console.log(`   - Color: ${car.color || 'Not set'}`)
        console.log(`   - Features: ${car.features ? 'Set' : 'Not set'}`)
        console.log(`   - Images: ${car.images ? 'Set' : 'Single image only'}`)
      })
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAddCar() 