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

async function setupAdminUser() {
  try {
    console.log('🚀 بدء إعداد المستخدم الإداري... / Starting admin user setup...')

    // 1. إنشاء المستخدم في auth.users / Create user in auth.users
    console.log('📝 إنشاء حساب المصادقة... / Creating auth account...')
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // تأكيد البريد الإلكتروني مباشرة / Confirm email directly
      user_metadata: {
        full_name: ADMIN_FULL_NAME
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  المستخدم موجود بالفعل، يتم تحديث المعلومات... / User already exists, updating info...')
        
        // الحصول على المستخدم الموجود / Get existing user
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === ADMIN_EMAIL)
        
        if (existingUser) {
          // تحديث المستخدم الموجود / Update existing user
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            {
              password: ADMIN_PASSWORD,
              email_confirm: true,
              user_metadata: {
                full_name: ADMIN_FULL_NAME
              }
            }
          )
          
          if (updateError) {
            throw updateError
          }
          
          // استخدام المستخدم الموجود / Use existing user
          authData.user = existingUser
        }
      } else {
        throw authError
      }
    }

    if (!authData.user) {
      throw new Error('فشل في إنشاء أو العثور على المستخدم / Failed to create or find user')
    }

    console.log('✅ تم إنشاء حساب المصادقة بنجاح / Auth account created successfully')

    // 2. إنشاء أو تحديث الملف الشخصي في public.users / Create or update profile in public.users
    console.log('👤 إنشاء الملف الشخصي... / Creating user profile...')
    
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email: ADMIN_EMAIL,
        full_name: ADMIN_FULL_NAME,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      throw profileError
    }

    console.log('✅ تم إنشاء الملف الشخصي بنجاح / User profile created successfully')

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

    // 4. عرض معلومات التسجيل / Display login information
    console.log('\n🎉 تم إعداد المستخدم الإداري بنجاح! / Admin user setup completed successfully!')
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

  } catch (error) {
    console.error('❌ خطأ في إعداد المستخدم الإداري / Error setting up admin user:', error.message)
    process.exit(1)
  }
}

// تشغيل السكريبت / Run the script
setupAdminUser()
  .then(() => {
    console.log('\n🏁 اكتمل السكريبت / Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error)
    process.exit(1)
  }) 