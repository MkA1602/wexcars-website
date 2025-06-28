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

async function inspectCarData() {
  console.log('🔍 Inspecting Car Data')
  console.log('=' .repeat(50))

  try {
    // Get all cars with all fields
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    if (!cars || cars.length === 0) {
      console.log('❌ No cars found in database')
      return
    }

    console.log(`📊 Found ${cars.length} car(s) in database:\n`)

    cars.forEach((car, index) => {
      console.log(`🚗 Car #${index + 1}: ${car.brand} ${car.name}`)
      console.log(`   ID: ${car.id}`)
      console.log(`   Year: ${car.year}`)
      console.log(`   Category: ${car.category}`)
      console.log(`   Price: ${car.currency || 'AED'} ${car.price}`)
      console.log(`   Price (excl VAT): ${car.currency || 'AED'} ${car.price_excl_vat}`)
      console.log(`   VAT Rate: ${car.vat_rate}%`)
      console.log(`   
   🖼️  Images:`)
      console.log(`     Primary Image: ${car.image ? '✅ Present' : '❌ Missing'}`)
      console.log(`     Image URL: ${car.image || 'N/A'}`)
      console.log(`     Additional Images: ${car.images ? '✅ Present' : '❌ Missing'}`)
      if (car.images) {
        try {
          const additionalImages = JSON.parse(car.images)
          console.log(`     Additional Count: ${additionalImages.length}`)
        } catch {
          console.log(`     Additional Images: Invalid JSON`)
        }
      }
      
      console.log(`   
   🔧 Technical Details:`)
      console.log(`     Transmission: ${car.transmission || '❌ Missing'}`)
      console.log(`     Color: ${car.color || '❌ Missing'}`)
      console.log(`     Engine: ${car.engine || '❌ Missing'}`)
      console.log(`     Fuel Type: ${car.fuel_type || '❌ Missing'}`)
      console.log(`     Mileage: ${car.mileage || '❌ Missing'}`)
      console.log(`     Seats: ${car.seats || '❌ Missing'}`)
      
      console.log(`   
   ⭐ Features:`)
      if (car.features) {
        try {
          const features = JSON.parse(car.features)
          console.log(`     Count: ${features.length}`)
          console.log(`     List: ${features.slice(0, 5).join(', ')}${features.length > 5 ? '...' : ''}`)
        } catch {
          console.log(`     Features: Invalid JSON`)
        }
      } else {
        console.log(`     Features: ❌ Missing`)
      }
      
      console.log(`   
   📝 Description:`)
      console.log(`     Length: ${car.description ? car.description.length : 0} characters`)
      console.log(`     Present: ${car.description ? '✅ Yes' : '❌ No'}`)
      
      console.log(`   
   🏗️  Specifications:`)
      if (car.specifications) {
        try {
          const specs = JSON.parse(car.specifications)
          console.log(`     Engine: ${specs.engine || '❌ Missing'}`)
          console.log(`     Power: ${specs.power || '❌ Missing'}`)
          console.log(`     Transmission: ${specs.transmission || '❌ Missing'}`)
          console.log(`     Seating: ${specs.seating || '❌ Missing'}`)
        } catch {
          console.log(`     Specifications: Invalid JSON`)
        }
      } else {
        console.log(`     Specifications: ❌ Missing`)
      }
      
      console.log(`   
   📅 Timestamps:`)
      console.log(`     Created: ${car.created_at}`)
      console.log(`     Updated: ${car.updated_at}`)
      
      console.log('\n' + '-'.repeat(50) + '\n')
    })

    // Summary of missing data
    console.log('📋 DATA COMPLETENESS SUMMARY:')
    console.log('=' .repeat(50))
    
    const missingTransmission = cars.filter(car => !car.transmission).length
    const missingColor = cars.filter(car => !car.color).length
    const missingFeatures = cars.filter(car => !car.features).length
    const missingImages = cars.filter(car => !car.image).length
    
    console.log(`🔧 Technical Details:`)
    console.log(`   Cars missing Transmission: ${missingTransmission}/${cars.length}`)
    console.log(`   Cars missing Color: ${missingColor}/${cars.length}`)
    console.log(`   Cars missing Features: ${missingFeatures}/${cars.length}`)
    console.log(`   Cars missing Primary Image: ${missingImages}/${cars.length}`)
    
    if (missingTransmission > 0 || missingColor > 0 || missingFeatures > 0 || missingImages > 0) {
      console.log('\n⚠️  ISSUES DETECTED:')
      if (missingTransmission > 0) console.log('   • Some cars are missing transmission data')
      if (missingColor > 0) console.log('   • Some cars are missing color data')  
      if (missingFeatures > 0) console.log('   • Some cars are missing features data')
      if (missingImages > 0) console.log('   • Some cars are missing primary images')
      
      console.log('\n💡 RECOMMENDATIONS:')
      console.log('   1. Check Add Car form - ensure all fields are being saved')
      console.log('   2. Update car data transformation in car-listing-page.tsx')
      console.log('   3. Add proper default values for missing fields')
    } else {
      console.log('\n✅ All cars have complete data!')
    }

  } catch (error) {
    console.error('❌ Error inspecting car data:', error.message)
  }
}

inspectCarData() 