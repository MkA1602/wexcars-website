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

// معلومات المستخدم الإداري الجديد / New admin user information
const ADMIN_EMAIL = 'ayat.ayk90@gmail.com'
const ADMIN_FULL_NAME = 'Ayat Admin'

async function addAdminUser() {
  try {
    console.log('🚀 بدء إضافة المستخدم الإداري... / Starting admin user addition...')
    console.log(`📧 البريد الإلكتروني / Email: ${ADMIN_EMAIL}`)

    // 1. البحث عن المستخدم الموجود في auth.users / Find existing user in auth.users
    console.log('🔍 البحث عن المستخدم الموجود... / Finding existing user...')
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers.users.find(u => u.email === ADMIN_EMAIL)
    
    if (!existingUser) {
      console.log('⚠️  المستخدم غير موجود في auth.users / User not found in auth.users')
      console.log('💡 يرجى التأكد من أن المستخدم قد سجل حساباً أولاً / Please make sure the user has registered an account first')
      console.log('💡 أو قم بتشغيل scripts/setup-admin.js لإنشاء حساب جديد / Or run scripts/setup-admin.js to create a new account')
      process.exit(1)
    }

    console.log('✅ تم العثور على المستخدم / User found:', existingUser.id)

    // 2. تحديث الملف الشخصي في public.users ليكون admin / Update profile in public.users to be admin
    console.log('👤 تحديث الملف الشخصي إلى admin... / Updating user profile to admin...')
    
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: existingUser.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        role: 'admin',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      throw profileError
    }

    console.log('✅ تم تحديث الملف الشخصي بنجاح / User profile updated successfully')

    // 3. التحقق من إعداد المستخدم / Verify user setup
    console.log('🔍 التحقق من إعداد المستخدم... / Verifying user setup...')
    
    const { data: userProfile, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .single()

    if (verifyError || !userProfile) {
      throw new Error('فشل في التحقق من إعداد المستخدم / Failed to verify user setup')
    }

    console.log('✅ تم التحقق من إعداد المستخدم بنجاح / User setup verified successfully')

    // 4. عرض معلومات المستخدم / Display user information
    console.log('\n🎉 تم إضافة المستخدم الإداري بنجاح! / Admin user added successfully!')
    console.log('='.repeat(60))
    console.log('📧 البريد الإلكتروني / Email:', ADMIN_EMAIL)
    console.log('👑 الدور / Role:', userProfile.role)
    console.log('🆔 معرف المستخدم / User ID:', userProfile.id)
    console.log('🌐 رابط تسجيل الدخول / Login URL: http://localhost:3000/auth/login')
    console.log('⚡ رابط لوحة الإدارة / Admin Dashboard: http://localhost:3000/admin/dashboard')
    console.log('='.repeat(60))
    console.log('\n📝 ملاحظات مهمة / Important Notes:')
    console.log('- يمكن للمستخدم الإداري الوصول إلى جميع الميزات / Admin user can access all features')
    console.log('- يمكن إدارة جميع السيارات والمستخدمين / Can manage all cars and users')
    console.log('- تأكد من أن المستخدم قد سجل حساباً في النظام / Make sure the user has registered an account')

  } catch (error) {
    console.error('❌ خطأ في إضافة المستخدم الإداري / Error adding admin user:', error.message)
    process.exit(1)
  }
}

// تشغيل السكريبت / Run the script
addAdminUser()
  .then(() => {
    console.log('\n🏁 اكتمل السكريبت / Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error)
    process.exit(1)
  })
