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

async function findConfirmationUrl() {
  try {
    console.log('🔍 Finding Confirmation URL Information')
    console.log('=' .repeat(70))
    
    console.log('\n📧 About {{ .ConfirmationURL }}:')
    console.log('• This is a Supabase template variable')
    console.log('• It gets automatically replaced with the actual confirmation link')
    console.log('• You don\'t need to find it manually - Supabase handles it')
    
    console.log('\n🔗 Where to Find the Actual Confirmation URL:')
    console.log('1. Check your email inbox for the confirmation email')
    console.log('2. Look for the "Confirm Your Account" button')
    console.log('3. Right-click the button and "Copy link address"')
    console.log('4. Or look for the alternative text link at the bottom')
    
    console.log('\n🧪 How to Test the Confirmation URL:')
    console.log('1. Register a new account with a test email')
    console.log('2. Check your email for the confirmation message')
    console.log('3. The URL will look like:')
    console.log('   https://wexcars.com/auth/callback?code=ABC123&type=signup')
    
    console.log('\n📋 Current Supabase Configuration:')
    console.log('✅ Supabase URL:', supabaseUrl)
    console.log('✅ Service Key: Found')
    
    // Test creating a user to see what the confirmation URL looks like
    console.log('\n🧪 Testing User Creation (to see confirmation URL format):')
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const { data: testData, error: testError } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'testpassword123',
        email_confirm: false
      })
      
      if (testError) {
        console.log('⚠️  Could not create test user:', testError.message)
      } else {
        console.log('✅ Test user created successfully')
        console.log('📧 Email:', testEmail)
        console.log('🔗 Confirmation URL format:')
        console.log(`   ${supabaseUrl}/auth/v1/verify?token=...&type=signup&redirect_to=https://wexcars.com/auth/callback`)
        
        // Clean up test user
        if (testData.user) {
          await supabase.auth.admin.deleteUser(testData.user.id)
          console.log('🧹 Test user cleaned up')
        }
      }
    } catch (err) {
      console.log('⚠️  Could not test user creation:', err.message)
    }
    
    console.log('\n🎯 How to Get the Actual Confirmation URL:')
    console.log('1. Go to your website: https://wexcars.com')
    console.log('2. Click "Sign Up" or "Register"')
    console.log('3. Enter a test email address')
    console.log('4. Complete the registration form')
    console.log('5. Check your email inbox')
    console.log('6. Look for the email from WexCars')
    console.log('7. The confirmation URL will be in the email')
    
    console.log('\n📧 Email Template Variables:')
    console.log('• {{ .ConfirmationURL }} - The actual confirmation link')
    console.log('• {{ .Email }} - User\'s email address')
    console.log('• {{ .SiteURL }} - Your website URL')
    console.log('• {{ .Token }} - The confirmation token')
    
    console.log('\n🔧 If You Need to Debug:')
    console.log('1. Check browser developer tools (F12)')
    console.log('2. Look at the Network tab when clicking confirmation')
    console.log('3. Check the Console tab for any errors')
    console.log('4. Verify the redirect URL in Supabase settings')
    
    console.log('\n📞 Need Help?')
    console.log('• Check Supabase Dashboard → Authentication → URL Configuration')
    console.log('• Verify redirect URL is: https://wexcars.com/auth/callback')
    console.log('• Make sure email confirmations are enabled')
    
  } catch (error) {
    console.error('❌ Error finding confirmation URL:', error.message)
  }
}

// Run the search
findConfirmationUrl()
