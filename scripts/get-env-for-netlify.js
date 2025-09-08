require('dotenv').config({ path: '.env.local' })

console.log('🔑 Environment Variables for Netlify Deployment')
console.log('=' .repeat(60))
console.log('Copy these values to your Netlify Environment Variables:')
console.log('Site Settings > Environment Variables > Add new variable')
console.log('=' .repeat(60))

// Required environment variables for Netlify
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY'
]

const optionalVars = [
  'NEXT_PUBLIC_SENTRY_DSN'
]

console.log('\n📋 REQUIRED VARIABLES:')
console.log('-'.repeat(40))

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}`)
    console.log(`   Value: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`)
  } else {
    console.log(`❌ ${varName} - MISSING`)
  }
  console.log()
})

console.log('\n📋 OPTIONAL VARIABLES:')
console.log('-'.repeat(40))

optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}`)
    console.log(`   Value: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`)
  } else {
    console.log(`⚠️  ${varName} - Not set (optional)`)
  }
  console.log()
})

console.log('\n🚀 DEPLOYMENT STEPS:')
console.log('-'.repeat(40))
console.log('1. Go to: https://app.netlify.com/sites/[your-site-name]/settings/env')
console.log('2. Add each variable above with its exact value')
console.log('3. Save changes')
console.log('4. Redeploy your site')
console.log()

console.log('📝 Additional variables to add:')
console.log('NODE_ENV=production')
console.log()

// Check for missing critical variables
const missingVars = requiredVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.log('🚨 CRITICAL: Missing required variables!')
  console.log('   You need to set these in your .env.local first:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  console.log('   Then run this script again.')
} else {
  console.log('✅ All required variables found!')
  console.log('   You can proceed with Netlify deployment.')
} 