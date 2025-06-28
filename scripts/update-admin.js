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
const ADMIN_PASSWORD = 'Mkpa2024'
const ADMIN_FULL_NAME = 'Mohammed Admin'

async function updateAdminUser() {
  try {
    console.log('🚀 بدء تحديث المستخدم الإداري... / Starting admin user update...')

    // 1. العثور على المستخدم الموجود / Find existing user
    console.log('🔍 البحث عن المستخدم الموجود... / Finding existing user...')
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers.users.find(u => u.email === ADMIN_EMAIL)
    
    if (!existingUser) {
      console.error('❌ المستخدم غير موجود / User not found')
      process.exit(1)
    }

    console.log('✅ تم العثور على المستخدم / User found:', existingUser.id)

    // 2. تحديث كلمة المرور / Update password
    console.log('🔑 تحديث كلمة المرور... / Updating password...')
    
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: ADMIN_FULL_NAME
        }
      }
    )

    if (updateAuthError) {
      throw updateAuthError
    }

    console.log('✅ تم تحديث كلمة المرور بنجاح / Password updated successfully')

    // 3. تحديث الملف الشخصي في public.users / Update profile in public.users
    console.log('👤 تحديث الملف الشخصي... / Updating user profile...')
    
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: existingUser.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        role: 'admin',
        created_at: existingUser.created_at,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      throw profileError
    }

    console.log('✅ تم تحديث الملف الشخصي بنجاح / User profile updated successfully')

    // 4. التحقق من التحديث / Verify update
    console.log('🔍 التحقق من التحديث... / Verifying update...')
    
    const { data: userProfile, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single()

    if (verifyError || !userProfile) {
      throw new Error('فشل في التحقق من تحديث المستخدم / Failed to verify user update')
    }

    console.log('✅ تم التحقق من التحديث بنجاح / Update verified successfully')

    // 5. عرض معلومات التسجيل / Display login information
    console.log('\n🎉 تم تحديث المستخدم الإداري بنجاح! / Admin user updated successfully!')
    console.log('='*60)
    console.log('📧 البريد الإلكتروني / Email:', ADMIN_EMAIL)
    console.log('🔑 كلمة المرور / Password:', ADMIN_PASSWORD)
    console.log('👑 الدور / Role:', userProfile.role)
    console.log('🌐 رابط تسجيل الدخول / Login URL: http://localhost:3000/auth/login')
    console.log('⚡ رابط لوحة الإدارة / Admin Dashboard: http://localhost:3000/admin/dashboard')
    console.log('='*60)
    console.log('\n📝 ملاحظات مهمة / Important Notes:')
    console.log('- يمكن للمستخدم الإداري الوصول إلى جميع الميزات / Admin user can access all features')
    console.log('- يمكن إدارة جميع السيارات والمستخدمين / Can manage all cars and users') 
    console.log('- تأكد من حفظ كلمة المرور في مكان آمن / Make sure to save password securely')
    console.log('- يمكنك الآن تسجيل الدخول مباشرة / You can now login directly')

  } catch (error) {
    console.error('❌ خطأ في تحديث المستخدم الإداري / Error updating admin user:', error.message)
    process.exit(1)
  }
}

// تشغيل السكريپت / Run the script
updateAdminUser()
  .then(() => {
    console.log('\n🏁 اكتمل السكريپت / Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error)
    process.exit(1)
  }) 