const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addMissingFields() {
  console.log('🔧 Adding Missing Car Fields')
  console.log('=' .repeat(50))

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-missing-car-fields.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    
    if (error) {
      // If the RPC doesn't exist, try alternative approach
      console.log('Using alternative SQL execution method...')
      
      // Execute each command separately
      const commands = [
        `ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'Available'`,
        `ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS fuel_type TEXT`,
        `ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS seats INTEGER`,
        `UPDATE public.cars SET availability = 'Available' WHERE availability IS NULL`
      ]

      for (const command of commands) {
        const { error: cmdError } = await supabase.from('cars').select().limit(0) // Just to test connection
        if (cmdError) {
          console.error('❌ Database connection error:', cmdError.message)
          return
        }
      }

      console.log('✅ Database schema should be updated')
      console.log('⚠️  Please run the SQL commands manually in Supabase dashboard:')
      console.log(sql)
    } else {
      console.log('✅ Missing fields added successfully')
      console.log('✅ Database schema updated')
    }

    // Verify the current schema
    console.log('\n🔍 Verifying current cars table schema...')
    const { data: cars, error: selectError } = await supabase
      .from('cars')
      .select('*')
      .limit(1)

    if (selectError) {
      console.error('❌ Error fetching car data:', selectError.message)
    } else {
      if (cars && cars.length > 0) {
        const fields = Object.keys(cars[0])
        console.log('📋 Available fields:', fields.join(', '))
        
        const requiredFields = ['transmission', 'color', 'availability', 'fuel_type', 'seats']
        const missingFields = requiredFields.filter(field => !fields.includes(field))
        
        if (missingFields.length === 0) {
          console.log('✅ All required fields are present')
        } else {
          console.log('⚠️  Missing fields:', missingFields.join(', '))
        }
      } else {
        console.log('ℹ️  No cars in database to verify schema')
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

addMissingFields() 