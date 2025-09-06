const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
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

async function updateEmailTemplates() {
  try {
    console.log('📧 Updating WexCars Email Templates')
    console.log('=' .repeat(70))
    
    // Read the email templates
    const htmlTemplate = fs.readFileSync(path.join(__dirname, '../email-templates/confirm-signup.html'), 'utf8')
    const textTemplate = fs.readFileSync(path.join(__dirname, '../email-templates/confirm-signup.txt'), 'utf8')
    
    console.log('✅ Email templates loaded successfully')
    console.log('📋 HTML template size:', htmlTemplate.length, 'characters')
    console.log('📋 Text template size:', textTemplate.length, 'characters')
    
    console.log('\n📋 Manual Steps Required:')
    console.log('Since Supabase Admin API doesn\'t support updating email templates directly,')
    console.log('please follow these steps in your Supabase Dashboard:')
    
    console.log('\n1. Go to your Supabase Dashboard')
    console.log('2. Navigate to: Authentication → Email Templates')
    console.log('3. Select "Confirm signup" template')
    console.log('4. Replace the HTML content with the content from: email-templates/confirm-signup.html')
    console.log('5. Replace the plain text content with the content from: email-templates/confirm-signup.txt')
    console.log('6. Save the changes')
    
    console.log('\n📧 Email Template Features:')
    console.log('✅ Professional WexCars branding with logo')
    console.log('✅ Responsive design for all devices')
    console.log('✅ Clear call-to-action button')
    console.log('✅ Security notice and expiration info')
    console.log('✅ Features list showcasing benefits')
    console.log('✅ Support contact information')
    console.log('✅ Alternative link for compatibility')
    console.log('✅ Professional footer with social links')
    
    console.log('\n🔧 Additional Configuration:')
    console.log('Make sure your email redirect URL is set to:')
    console.log(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wexcars.com'}/auth/callback`)
    
    console.log('\n📋 Template Variables Used:')
    console.log('- {{ .ConfirmationURL }} - The confirmation link')
    console.log('- {{ .Email }} - User\'s email address')
    
    console.log('\n🎯 Testing Instructions:')
    console.log('1. Update the email template in Supabase Dashboard')
    console.log('2. Try registering a new account')
    console.log('3. Check the received email for proper formatting')
    console.log('4. Click the confirmation button to test the flow')
    
    console.log('\n🚀 Your new email template includes:')
    console.log('• WexCars logo and branding')
    console.log('• Professional design and layout')
    console.log('• Clear confirmation instructions')
    console.log('• Support team contact information')
    console.log('• Security notices and expiration warnings')
    console.log('• Mobile-responsive design')
    console.log('• Fallback text link for compatibility')
    
  } catch (error) {
    console.error('❌ Error updating email templates:', error.message)
    console.log('\n📋 Manual Template Update Required:')
    console.log('Please manually copy the template content from:')
    console.log('- email-templates/confirm-signup.html')
    console.log('- email-templates/confirm-signup.txt')
    console.log('And update them in your Supabase Dashboard → Authentication → Email Templates')
  }
}

// Run the update
updateEmailTemplates()
