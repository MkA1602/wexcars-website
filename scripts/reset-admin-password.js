const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// تكوين Supabase / Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ متطلبات البيئة مفقودة / Missing environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// معلومات المستخدم الإداري / Admin user information
const ADMIN_EMAIL = 'mohammedlk27@gmail.com'
const NEW_PASSWORD = 'mkpa2026'

async function resetAdminPassword() {
  try {
    console.log('🚀 بدء إعادة تعيين كلمة مرور المدير... / Starting admin password reset...')
    console.log(`📧 البريد الإلكتروني / Email: ${ADMIN_EMAIL}`)

    // 1. البحث عن المستخدم الموجود / Find existing user
    console.log('🔍 البحث عن المستخدم الموجود... / Finding existing user...')
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers.users.find(u => u.email === ADMIN_EMAIL)
    
    if (!existingUser) {
      console.error('❌ المستخدم غير موجود / User not found')
      console.error(`   البريد الإلكتروني / Email: ${ADMIN_EMAIL}`)
      process.exit(1)
    }

    console.log('✅ تم العثور على المستخدم / User found:', existingUser.id)
    console.log('   الاسم / Name:', existingUser.user_metadata?.full_name || 'N/A')

    // 2. تحديث كلمة المرور / Update password
    console.log('🔑 تحديث كلمة المرور... / Updating password...')
    
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: NEW_PASSWORD,
        email_confirm: true, // Ensure email is confirmed
      }
    )

    if (updateError) {
      throw updateError
    }

    console.log('✅ تم تحديث كلمة المرور بنجاح / Password updated successfully')

    // 3. التحقق من التحديث / Verify update
    console.log('🔍 التحقق من التحديث... / Verifying update...')
    
    const { data: updatedUsers } = await supabase.auth.admin.listUsers()
    const updatedUser = updatedUsers.users.find(u => u.email === ADMIN_EMAIL)
    
    if (!updatedUser) {
      throw new Error('فشل في التحقق من التحديث / Failed to verify update')
    }

    // 4. عرض معلومات تسجيل الدخول / Display login information
    console.log('\n🎉 تم إعادة تعيين كلمة المرور بنجاح! / Password reset completed successfully!')
    console.log('='.repeat(60))
    console.log('📧 البريد الإلكتروني / Email:', ADMIN_EMAIL)
    console.log('🔑 كلمة المرور الجديدة / New Password:', NEW_PASSWORD)
    console.log('👑 الدور / Role: admin')
    console.log('🆔 معرف المستخدم / User ID:', updatedUser.id)
    console.log('🌐 رابط تسجيل الدخول / Login URL: http://localhost:3000/sign-in')
    console.log('⚡ رابط لوحة الإدارة / Admin Dashboard: http://localhost:3000/admin/dashboard')
    console.log('='.repeat(60))
    console.log('\n📝 ملاحظات مهمة / Important Notes:')
    console.log('- يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة / You can now log in with the new password')
    console.log('- تأكد من حفظ كلمة المرور في مكان آمن / Make sure to save the password securely')
    console.log('- كلمة المرور: mkpa2026')

  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين كلمة المرور / Error resetting password:', error.message)
    console.error('   التفاصيل / Details:', error)
    process.exit(1)
  }
}

// تشغيل السكريبت / Run the script
resetAdminPassword()
  .then(() => {
    console.log('\n🏁 اكتمل السكريبت / Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error)
    process.exit(1)
  })
