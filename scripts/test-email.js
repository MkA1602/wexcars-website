const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Supabase configuration
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

async function testEmailSending() {
  try {
    console.log('📧 اختبار إرسال البريد الإلكتروني / Testing Email Sending')
    console.log('='*70)

    // Generate a unique test email
    const timestamp = Date.now()
    const testEmail = `test.wexcars.${timestamp}@gmail.com`  // Valid email format
    const testPassword = 'TestPassword123!'

    console.log(`📨 إرسال بريد تفعيل إلى / Sending activation email to: ${testEmail}`)

    // Try to sign up a test user (this should trigger email sending)
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    })

    if (error) {
      console.error('❌ خطأ في التسجيل / Registration error:', error.message)
      
      // Check specific error types
      if (error.message.includes('SMTP')) {
        console.log('\n🔧 نصائح لحل مشاكل SMTP / SMTP Troubleshooting Tips:')
        console.log('1. تحقق من إعدادات SMTP في Supabase Dashboard')
        console.log('   Check SMTP settings in Supabase Dashboard')
        console.log('2. تأكد من أن App Password صحيح (للـ Gmail)')
        console.log('   Ensure App Password is correct (for Gmail)')
        console.log('3. تحقق من Port و Host')
        console.log('   Verify Port and Host settings')
      }
      
      return
    }

    if (data.user) {
      console.log('✅ تم إنشاء المستخدم بنجاح / User created successfully!')
      console.log(`📋 معرف المستخدم / User ID: ${data.user.id}`)
      console.log(`📧 البريد الإلكتروني / Email: ${data.user.email}`)
      console.log(`❓ حالة التفعيل / Confirmation status: ${data.user.email_confirmed_at ? 'مفعل / Confirmed' : 'في انتظار التفعيل / Pending confirmation'}`)

      if (data.user.email_confirmed_at) {
        console.log('✅ المستخدم مفعل تلقائياً (Email confirmation disabled)')
        console.log('   User auto-confirmed (Email confirmation disabled)')
      } else {
        console.log('📤 تم إرسال بريد التفعيل بنجاح!')
        console.log('   Activation email sent successfully!')
        console.log('📱 تحقق من صندوق الواردات / Check your inbox')
      }

      // Clean up: Delete the test user
      console.log('\n🧹 حذف المستخدم التجريبي / Cleaning up test user...')
      
      const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id)
      
      if (deleteError) {
        console.log(`⚠️ تعذر حذف المستخدم التجريبي / Could not delete test user: ${deleteError.message}`)
        console.log(`🗑️ احذفه يدوياً من Supabase Dashboard / Manually delete from Supabase Dashboard`)
      } else {
        console.log('✅ تم حذف المستخدم التجريبي / Test user deleted successfully')
      }
    }

    console.log('\n' + '='*70)
    console.log('📊 ملخص الاختبار / Test Summary:')
    
    if (data.user && !error) {
      console.log('✅ SMTP يعمل بشكل صحيح / SMTP is working correctly')
      console.log('✅ يمكن إرسال رسائل التفعيل / Activation emails can be sent')
      console.log('🎉 إعداد البريد الإلكتروني مكتمل / Email setup complete!')
    } else {
      console.log('❌ هناك مشكلة في إعداد SMTP / There is an issue with SMTP setup')
      console.log('🔧 راجع الدليل لحل المشكلة / Check the guide to fix the issue')
    }

  } catch (error) {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error.message)
    console.log('\n🔧 خطوات لحل المشكلة / Troubleshooting steps:')
    console.log('1. تحقق من متغيرات البيئة / Check environment variables')
    console.log('2. تحقق من اتصال الإنترنت / Check internet connection')
    console.log('3. تحقق من إعدادات Supabase / Check Supabase settings')
  }
}

// معلومات إضافية / Additional information
console.log('🔧 اختبار إعداد البريد الإلكتروني / Email Setup Testing')
console.log('='*70)
console.log('هذا السكريبت سيختبر إرسال بريد التفعيل')
console.log('This script will test activation email sending')
console.log('تأكد من إعداد SMTP في Supabase أولاً')
console.log('Make sure to setup SMTP in Supabase first')
console.log('')

// Run the test
testEmailSending().catch(console.error) 