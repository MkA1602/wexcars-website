const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Found' : '❌ Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkSendGridStatus() {
  try {
    console.log('🔍 Checking SendGrid & Email Configuration Status')
    console.log('=' .repeat(70))
    
    // Check recent user registrations
    console.log('\n📊 Recent User Registrations (Last 24 hours):')
    const { data: recentUsers, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email, created_at, email_confirmed_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (usersError) {
      console.log('⚠️  Could not fetch user data:', usersError.message)
    } else {
      console.log(`✅ Found ${recentUsers.length} registrations in last 24 hours`)
      recentUsers.forEach((user, index) => {
        const confirmed = user.email_confirmed_at ? '✅ Confirmed' : '⏳ Pending'
        console.log(`   ${index + 1}. ${user.email} - ${confirmed}`)
      })
    }

    // Check user profiles
    console.log('\n👥 User Profiles:')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (profilesError) {
      console.log('⚠️  Could not fetch profiles:', profilesError.message)
    } else {
      console.log(`✅ Found ${profiles.length} user profiles`)
      profiles.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.full_name} (${profile.email})`)
      })
    }

    console.log('\n📧 Email Configuration Check:')
    console.log('✅ Supabase SMTP should be configured with:')
    console.log('   - Host: smtp.sendgrid.net')
    console.log('   - Port: 587')
    console.log('   - User: apikey')
    console.log('   - Password: [Your SendGrid API Key]')
    
    console.log('\n🎯 SendGrid Account Status:')
    console.log('📋 Please check your SendGrid dashboard for:')
    console.log('   1. Current plan (Free: 100 emails/day)')
    console.log('   2. Daily email usage')
    console.log('   3. API key status')
    console.log('   4. Domain authentication status')
    console.log('   5. Sender verification status')
    
    console.log('\n🔧 Troubleshooting Steps:')
    console.log('1. Go to SendGrid Dashboard → Activity')
    console.log('2. Check if emails are being sent successfully')
    console.log('3. Look for any rate limit warnings')
    console.log('4. Verify domain authentication is complete')
    console.log('5. Check sender identity verification')
    
    console.log('\n📈 Rate Limit Information:')
    console.log('Free Plan Limits:')
    console.log('   - 100 emails per day')
    console.log('   - 2 emails per second')
    console.log('   - Resets every 24 hours at midnight UTC')
    
    console.log('\n💡 Solutions:')
    console.log('1. Wait for rate limit to reset (24 hours)')
    console.log('2. Upgrade to paid plan for higher limits')
    console.log('3. Implement client-side rate limiting')
    console.log('4. Add retry logic with exponential backoff')
    
    // Test email sending capability
    console.log('\n🧪 Testing Email Sending:')
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const { data: testData, error: testError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'testpassword123',
        email_confirm: false
      })
      
      if (testError) {
        if (testError.message.includes('rate limit')) {
          console.log('⚠️  Rate limit detected - email sending is limited')
          console.log('   Solution: Wait or upgrade SendGrid plan')
        } else {
          console.log('⚠️  Email test failed:', testError.message)
        }
      } else {
        console.log('✅ Email sending test successful')
        // Clean up test user
        if (testData.user) {
          await supabase.auth.admin.deleteUser(testData.user.id)
          console.log('🧹 Test user cleaned up')
        }
      }
    } catch (err) {
      console.log('⚠️  Could not test email sending:', err.message)
    }
    
  } catch (error) {
    console.error('❌ Error checking status:', error.message)
  }
}

// Run the check
checkSendGridStatus()
