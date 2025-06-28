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

async function removeDemoCars() {
  console.log('🗑️  Removing Demo Cars')
  console.log('=' .repeat(40))

  try {
    // First, list all cars
    const { data: cars, error: listError } = await supabase
      .from('cars')
      .select('id, name, brand, created_at')
      .order('created_at', { ascending: false })

    if (listError) {
      throw listError
    }

    if (!cars || cars.length === 0) {
      console.log('✅ No cars found in database')
      return
    }

    console.log('📋 Current cars in database:')
    cars.forEach((car, index) => {
      console.log(`   ${index + 1}. ${car.brand} ${car.name} (ID: ${car.id})`)
    })

    // Remove demo/test cars by name patterns
    const demoPatterns = [
      'Mercedes-Benz S-Class 2024',
      'Browser Test Car',
      'Test Car',
      'Demo Car'
    ]

    let removedCount = 0

    for (const pattern of demoPatterns) {
      const { data: demoCars, error: findError } = await supabase
        .from('cars')
        .select('id, name, brand')
        .ilike('name', `%${pattern}%`)

      if (findError) {
        console.error(`❌ Error finding cars with pattern "${pattern}":`, findError)
        continue
      }

      if (demoCars && demoCars.length > 0) {
        console.log(`\n🎯 Found ${demoCars.length} car(s) matching "${pattern}":`)
        
        for (const car of demoCars) {
          console.log(`   • ${car.brand} ${car.name} (ID: ${car.id})`)
          
          const { error: deleteError } = await supabase
            .from('cars')
            .delete()
            .eq('id', car.id)

          if (deleteError) {
            console.error(`   ❌ Failed to delete: ${deleteError.message}`)
          } else {
            console.log(`   ✅ Deleted successfully`)
            removedCount++
          }
        }
      }
    }

    // Also remove cars with exact name "Mercedes-Benz S-Class 2024"
    const { data: mbCars, error: mbError } = await supabase
      .from('cars')
      .select('id, name, brand')
      .eq('name', 'Mercedes-Benz S-Class 2024')

    if (!mbError && mbCars && mbCars.length > 0) {
      console.log(`\n🎯 Found unauthorized Mercedes-Benz S-Class 2024:`)
      
      for (const car of mbCars) {
        console.log(`   • ${car.brand} ${car.name} (ID: ${car.id})`)
        
        const { error: deleteError } = await supabase
          .from('cars')
          .delete()
          .eq('id', car.id)

        if (deleteError) {
          console.error(`   ❌ Failed to delete: ${deleteError.message}`)
        } else {
          console.log(`   ✅ Deleted successfully`)
          removedCount++
        }
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   • Total cars removed: ${removedCount}`)

    // Show remaining cars
    const { data: remainingCars, error: remainingError } = await supabase
      .from('cars')
      .select('id, name, brand, created_at')
      .order('created_at', { ascending: false })

    if (!remainingError && remainingCars) {
      console.log(`   • Remaining cars: ${remainingCars.length}`)
      
      if (remainingCars.length > 0) {
        console.log('\n📋 Remaining cars:')
        remainingCars.forEach((car, index) => {
          console.log(`   ${index + 1}. ${car.brand} ${car.name}`)
        })
      } else {
        console.log('\n✅ Database is now clean - no cars remaining')
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

removeDemoCars() 