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

# Maps Configuration (OpenStreetMap - No API key required)
# OpenStreetMap is used for maps functionality - no configuration needed

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
`)
  console.log('=' .repeat(50))
  process.exit(1)
}

// Read current .env.local
let envContent = fs.readFileSync(envPath, 'utf8')
console.log('✅ .env.local file found')

// OpenStreetMap configuration (no API key needed)
console.log('✅ OpenStreetMap is configured (no API key required)')

// Check Supabase configuration
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://ocephfiwzejvmwfzvwas.supabase.co')
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')
const hasServiceKey = envContent.includes('SUPABASE_SERVICE_ROLE_KEY=')

console.log('\n📊 Configuration Status:')
console.log('   • Supabase URL:', hasSupabaseUrl ? '✅ Configured' : '❌ Missing')
console.log('   • Supabase Anon Key:', hasSupabaseKey ? '✅ Configured' : '❌ Missing')
console.log('   • Supabase Service Key:', hasServiceKey ? '✅ Configured' : '❌ Missing')
console.log('   • OpenStreetMap:', '✅ Configured (no API key needed)')

if (hasSupabaseUrl && hasSupabaseKey && hasServiceKey) {
  console.log('\n🎉 Core configuration is complete!')
  console.log('✅ Your application should work properly')
  
  console.log('\n💡 Note: OpenStreetMap is enabled. Contact page will show interactive map.')
} else {
  console.log('\n❌ Missing required configuration!')
  console.log('Please ensure all Supabase environment variables are set correctly.')
}

console.log('\n🚀 Next steps:')
console.log('   • Run: npm run dev')
console.log('   • Visit: http://localhost:3000')
console.log('   • Test: http://localhost:3000/collections') 