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

// Sample features for different car categories
const FEATURES_BY_CATEGORY = {
  'Sedan': ['GPS Navigation', 'Bluetooth', 'Heated Seats', 'Cruise Control', 'Parking Sensors'],
  'SUV': ['GPS Navigation', 'Bluetooth', '360° Camera', 'Parking Sensors', 'Third Row Seating'],
  'Coupe': ['GPS Navigation', 'Bluetooth', 'Sport Seats', 'Performance Package', 'Premium Sound System'],
  'Sports Car': ['GPS Navigation', 'Bluetooth', 'Sport Mode', 'Performance Brakes', 'Racing Seats'],
  'Supercar': ['GPS Navigation', 'Bluetooth', 'Carbon Fiber Interior', 'Track Mode', 'Launch Control'],
  'Luxury': ['GPS Navigation', 'Bluetooth', 'Massage Seats', 'Premium Sound System', 'Ventilated Seats'],
  'Convertible': ['GPS Navigation', 'Bluetooth', 'Wind Deflector', 'Heated Seats', 'Premium Sound System'],
  'Electric': ['GPS Navigation', 'Bluetooth', 'Regenerative Braking', 'Eco Mode', 'Wireless Charging'],
  'Hypercar': ['GPS Navigation', 'Bluetooth', 'Carbon Fiber Body', 'Active Aero', 'Track Telemetry']
}

async function migrateCarsData() {
  try {
    console.log('🚀 Starting cars data migration...')

    // Get all cars from database
    const { data: cars, error: fetchError } = await supabase
      .from('cars')
      .select('*')

    if (fetchError) {
      throw fetchError
    }

    if (!cars || cars.length === 0) {
      console.log('ℹ️ No cars found in database')
      return
    }

    console.log(`📊 Found ${cars.length} cars`)

    let updatedCount = 0
    let errorCount = 0

    for (const car of cars) {
      try {
        // Calculate VAT information if missing
        let priceExclVat = car.price_excl_vat
        let vatRate = car.vat_rate || 5.00
        let vatAmount = car.vat_amount

        if (!priceExclVat && car.price) {
          priceExclVat = Number((car.price / (1 + vatRate / 100)).toFixed(2))
          vatAmount = Number((car.price - priceExclVat).toFixed(2))
        }

        // Add features if missing
        let features = car.features
        if (!features) {
          const categoryFeatures = FEATURES_BY_CATEGORY[car.category] || FEATURES_BY_CATEGORY['Sedan']
          // Add 2-3 random additional features
          const additionalFeatures = ['Apple CarPlay', 'Android Auto', 'Keyless Entry', 'Push Button Start', 'LED Headlights']
          const randomFeatures = additionalFeatures.slice(0, Math.floor(Math.random() * 3) + 1)
          const allFeatures = [...categoryFeatures, ...randomFeatures]
          features = JSON.stringify([...new Set(allFeatures)]) // Remove duplicates
        }

        // Update the car
        const { error: updateError } = await supabase
          .from('cars')
          .update({
            price_excl_vat: priceExclVat,
            vat_rate: vatRate,
            vat_amount: vatAmount,
            features: features,
            currency: car.currency || 'AED',
            updated_at: new Date().toISOString()
          })
          .eq('id', car.id)

        if (updateError) {
          console.error(`❌ Error updating car ${car.id}:`, updateError.message)
          errorCount++
        } else {
          console.log(`✅ Updated ${car.brand} ${car.name}`)
          updatedCount++
        }

      } catch (carError) {
        console.error(`❌ Error processing car ${car.id}:`, carError.message)
        errorCount++
      }
    }

    console.log('\n📊 Migration Summary:')
    console.log(`✅ Successfully updated: ${updatedCount}`)
    console.log(`❌ Failed to update: ${errorCount}`)
    console.log(`📊 Total: ${cars.length}`)

    if (updatedCount > 0) {
      console.log('\n🎉 Cars data migration completed successfully!')
      console.log('💡 You can now use the new features:')
      console.log('   - Prices with and without VAT')
      console.log('   - Car features')
      console.log('   - Enhanced price display')
    }

  } catch (error) {
    console.error('❌ General migration error:', error.message)
    process.exit(1)
  }
}

// Run the migration
migrateCarsData() 