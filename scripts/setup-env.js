const fs = require('fs')
const path = require('path')

console.log('🔧 Setting up Environment Variables')
console.log('=' .repeat(50))

const envPath = path.join(process.cwd(), '.env.local')

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!')
  console.log('\n📋 Please create a .env.local file with the following content:')
  console.log('=' .repeat(50))
  console.log(`
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ocephfiwzejvmwfzvwas.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZXBoZml3emVqdm13Znp2d2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzA1ODksImV4cCI6MjA1MDc0NjU4OX0.P_iUHhRLFxcFZrBKWXGRdW_i48J8ksLYs8g5H02QL60
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZXBoZml3emVqdm13Znp2d2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTE3MDU4OSwiZXhwIjoyMDUwNzQ2NTg5fQ.Zz_5lZJHjJ4HLjrGgJ8KQBYhLxLZ6YXNr3j0jYQXqNE

# Google Maps Configuration (Optional - Comment out to disable Google Maps)
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`)
  console.log('=' .repeat(50))
  process.exit(1)
}

// Read current .env.local
let envContent = fs.readFileSync(envPath, 'utf8')
console.log('✅ .env.local file found')

// Check for Google Maps API key
const hasGoogleMapsKey = envContent.includes('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=') && 
                        !envContent.includes('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here') &&
                        !envContent.includes('#NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')

if (hasGoogleMapsKey) {
  console.log('✅ Google Maps API key is configured')
} else {
  console.log('⚠️  Google Maps API key not configured')
  console.log('\n🗺️  Google Maps Configuration:')
  console.log('   • Maps will show an error message instead of loading')
  console.log('   • To enable Google Maps:')
  console.log('     1. Get API key from: https://console.cloud.google.com/apis/credentials')
  console.log('     2. Add to .env.local: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key')
  console.log('     3. Enable "Maps JavaScript API" in Google Cloud Console')
}

// Check Supabase configuration
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://ocephfiwzejvmwfzvwas.supabase.co')
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')
const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')

console.log('\n📊 Configuration Status:')
console.log('   • Supabase URL:', hasSupabaseUrl ? '✅ Configured' : '❌ Missing')
console.log('   • Supabase Anon Key:', hasSupabaseKey ? '✅ Configured' : '❌ Missing')
console.log('   • Supabase Service Key:', hasServiceKey ? '✅ Configured' : '❌ Missing')
console.log('   • Google Maps API:', hasGoogleMapsKey ? '✅ Configured' : '⚠️  Optional (not configured)')

if (hasSupabaseUrl && hasSupabaseKey && hasServiceKey) {
  console.log('\n🎉 Core configuration is complete!')
  console.log('✅ Your application should work properly')
  
  if (!hasGoogleMapsKey) {
    console.log('\n💡 Note: Google Maps is disabled. Contact page will show placeholder instead of map.')
  }
} else {
  console.log('\n❌ Missing required configuration!')
  console.log('Please ensure all Supabase environment variables are set correctly.')
}

console.log('\n🚀 Next steps:')
console.log('   • Run: npm run dev')
console.log('   • Visit: http://localhost:3000')
console.log('   • Test: http://localhost:3000/collections') 