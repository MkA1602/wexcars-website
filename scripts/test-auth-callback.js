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

async function testAuthCallback() {
  try {
    console.log('🔍 Testing Auth Callback Configuration')
    console.log('=' .repeat(70))
    
    // Check current auth settings
    console.log('\n📧 Current Auth Configuration:')
    console.log('✅ Supabase URL:', supabaseUrl)
    console.log('✅ Service Key:', supabaseServiceKey ? 'Found' : 'Missing')
    
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
        console.log('⚠️  Email test failed:', testError.message)
        if (testError.message.includes('rate limit')) {
          console.log('💡 This is a rate limit issue - not a configuration problem')
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
    
    console.log('\n🔧 Auth Callback Debugging:')
    console.log('1. Check your Supabase Dashboard → Authentication → URL Configuration')
    console.log('2. Verify Site URL is: https://wexcars.com')
    console.log('3. Verify Redirect URLs include: https://wexcars.com/auth/callback')
    console.log('4. Check that email confirmations are enabled')
    
    console.log('\n📧 Email Template Status:')
    console.log('❌ The email template still shows old format')
    console.log('📋 You need to manually update it in Supabase Dashboard')
    console.log('📋 Follow the guide in: scripts/update-supabase-email-template.md')
    
    console.log('\n🎯 Next Steps:')
    console.log('1. Update email template in Supabase Dashboard')
    console.log('2. Verify redirect URL configuration')
    console.log('3. Test registration with a new email')
    console.log('4. Check browser console for any errors')
    
    console.log('\n🚨 Common Issues:')
    console.log('• "requested path is invalid" = Wrong redirect URL')
    console.log('• Old email template = Not updated in Supabase')
    console.log('• Rate limit errors = SendGrid limits (temporary)')
    
  } catch (error) {
    console.error('❌ Error testing auth callback:', error.message)
  }
}

// Run the test
testAuthCallback()
