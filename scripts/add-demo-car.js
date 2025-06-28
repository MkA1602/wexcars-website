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

async function addDemoCar() {
  console.log('🚗 Adding Demo Car for Testing')
  console.log('=' .repeat(40))

  try {
    // Get admin user ID
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const adminUser = authUsers.users.find(u => u.email === 'mohammedlk27@gmail.com')
    
    if (!adminUser) {
      throw new Error('Admin user not found')
    }

    console.log('✅ Admin user found:', adminUser.id)

    // Check if demo car already exists
    const { data: existingCars, error: checkError } = await supabase
      .from('cars')
      .select('id, name')
      .eq('name', 'Mercedes-Benz S-Class 2024')

    if (checkError) {
      throw checkError
    }

    if (existingCars && existingCars.length > 0) {
      console.log('✅ Demo car already exists:', existingCars[0].id)
      console.log('📋 You can now visit /collections to see it!')
      return
    }

    // Demo car data
    const demoCar = {
      name: 'Mercedes-Benz S-Class 2024',
      brand: 'Mercedes-Benz',
      category: 'Luxury',
      year: 2024,
      price: 525000,
      price_excl_vat: 500000,
      vat_rate: 5.00,
      vat_amount: 25000,
      currency: 'AED',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
      description: 'Experience the pinnacle of luxury and technology with the Mercedes-Benz S-Class 2024. This flagship sedan combines exceptional comfort, cutting-edge technology, and superior performance. Features include massage seats, premium sound system, advanced driver assistance, and more.',
      features: JSON.stringify([
        'GPS Navigation', 'Bluetooth', 'Heated Seats', 'Sunroof', 'Leather Seats',
        'Parking Sensors', 'Backup Camera', 'Apple CarPlay', 'Android Auto', 'Cruise Control',
        'Lane Assist', 'Adaptive Cruise Control', 'Blind Spot Monitoring', '360° Camera',
        'Wireless Charging', 'Premium Sound System', 'Ventilated Seats', 'Memory Seats',
        'Keyless Entry', 'Push Button Start', 'Heads-Up Display', 'Massage Seats'
      ]),
      user_id: adminUser.id,
      transmission: 'Automatic',
      color: 'Black'
    }

    console.log('📋 Inserting demo car...')

    const { data: insertedCar, error: insertError } = await supabase
      .from('cars')
      .insert(demoCar)
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert failed:', insertError)
      throw insertError
    }

    console.log('✅ Demo car added successfully!')
    console.log('🆔 Car ID:', insertedCar.id)
    console.log('🚗 Car Name:', insertedCar.name)
    console.log('💰 Price:', `${insertedCar.currency} ${insertedCar.price}`)

    console.log('\n🎉 SUCCESS!')
    console.log('📋 Visit the following URLs to test:')
    console.log(`   • Collections page: http://localhost:3000/collections`)
    console.log(`   • Car detail page: http://localhost:3000/collections/${insertedCar.id}`)

  } catch (error) {
    console.error('❌ Failed to add demo car:', error.message)
    console.error('Full error:', error)
  }
}

addDemoCar() 