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

async function fixUserRegistration() {
  try {
    console.log('🔧 إصلاح مشكلة تسجيل المستخدمين / Fixing User Registration Issue')
    console.log('='*70)

    // 1. Check existing triggers
    console.log('\n1️⃣ فحص الـ triggers الموجودة / Checking existing triggers...')
    
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name, event_manipulation, event_object_table, action_timing')
      .eq('trigger_name', 'on_auth_user_created')

    if (triggerError) {
      console.log('⚠️ لا يمكن فحص الـ triggers / Cannot check triggers:', triggerError.message)
    } else {
      console.log(`📊 عدد الـ triggers الموجودة / Found triggers: ${triggers?.length || 0}`)
      if (triggers && triggers.length > 0) {
        triggers.forEach(t => {
          console.log(`   - ${t.trigger_name} on ${t.event_object_table} (${t.action_timing} ${t.event_manipulation})`)
        })
      } else {
        console.log('❌ لا توجد triggers! هذا سبب المشكلة / No triggers found! This is the problem')
      }
    }

    // 2. Check users without profiles
    console.log('\n2️⃣ فحص المستخدمين بدون ملفات شخصية / Checking users without profiles...')
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ خطأ في الحصول على المستخدمين / Error getting auth users:', authError.message)
      return
    }

    console.log(`📊 إجمالي المستخدمين في auth.users / Total auth users: ${authUsers.users.length}`)

    // Check which users have profiles
    const usersWithoutProfiles = []
    
    for (const authUser of authUsers.users) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // User doesn't have a profile
        usersWithoutProfiles.push(authUser)
      }
    }

    console.log(`❌ مستخدمون بدون ملفات شخصية / Users without profiles: ${usersWithoutProfiles.length}`)

    if (usersWithoutProfiles.length > 0) {
      console.log('\n📋 المستخدمون المتأثرون / Affected users:')
      usersWithoutProfiles.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)`)
      })

      // 3. Create missing profiles
      console.log('\n3️⃣ إنشاء الملفات الشخصية المفقودة / Creating missing profiles...')
      
      for (const authUser of usersWithoutProfiles) {
        const fullName = authUser.user_metadata?.full_name || 
                        (authUser.user_metadata?.first_name && authUser.user_metadata?.last_name ? 
                         `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name}` : 
                         authUser.email)

        const role = (authUser.email === 'mohammedlk27@gmail.com' || authUser.email === 'ayat.ayk90@gmail.com') ? 'admin' : 'user'

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            full_name: fullName,
            role: role,
            created_at: authUser.created_at,
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error(`❌ خطأ في إنشاء ملف ${authUser.email} / Error creating profile for ${authUser.email}:`, insertError.message)
        } else {
          console.log(`✅ تم إنشاء ملف ${authUser.email} / Created profile for ${authUser.email}`)
        }
      }
    }

    // 4. Test user registration flow
    console.log('\n4️⃣ اختبار عملية التسجيل / Testing registration flow...')
    
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'
    
    console.log(`📧 إنشاء مستخدم تجريبي / Creating test user: ${testEmail}`)
    
    const { data: testUser, error: signUpError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User'
      }
    })

    if (signUpError) {
      console.error('❌ خطأ في إنشاء المستخدم التجريبي / Error creating test user:', signUpError.message)
    } else {
      console.log('✅ تم إنشاء المستخدم التجريبي / Test user created')
      
      // Wait a moment for trigger to execute
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if profile was created
      const { data: testProfile, error: profileCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUser.user.id)
        .single()

      if (profileCheckError) {
        console.error('❌ لم يتم إنشاء الملف الشخصي تلقائياً / Profile was not created automatically')
        console.log('💡 يجب تشغيل سكريبت SQL لإصلاح الـ trigger / Need to run SQL script to fix trigger')
      } else {
        console.log('✅ تم إنشاء الملف الشخصي تلقائياً / Profile created automatically!')
        console.log(`📋 الاسم: ${testProfile.full_name} / Name: ${testProfile.full_name}`)
        console.log(`📋 الدور: ${testProfile.role} / Role: ${testProfile.role}`)
      }

      // Clean up test user
      console.log('🧹 حذف المستخدم التجريبي / Cleaning up test user...')
      await supabase.auth.admin.deleteUser(testUser.user.id)
      await supabase.from('users').delete().eq('id', testUser.user.id)
    }

    // 5. Final verification
    console.log('\n5️⃣ التحقق النهائي / Final verification...')
    
    const { data: finalAuthUsers } = await supabase.auth.admin.listUsers()
    const { data: finalProfiles } = await supabase.from('users').select('id')

    console.log(`📊 المستخدمون النهائيون / Final auth users: ${finalAuthUsers.users.length}`)
    console.log(`📊 الملفات الشخصية النهائية / Final profiles: ${finalProfiles?.length || 0}`)

    if (finalAuthUsers.users.length === finalProfiles?.length) {
      console.log('\n🎉 تم إصلاح المشكلة بنجاح! / Problem fixed successfully!')
      console.log('✅ جميع المستخدمين لديهم ملفات شخصية / All users have profiles')
      console.log('✅ التسجيلات الجديدة ستعمل بشكل صحيح / New registrations should work correctly')
    } else {
      console.log('\n⚠️ لا تزال هناك مشكلة / There are still issues')
      console.log('📋 يرجى تشغيل سكريبت SQL المرفق / Please run the attached SQL script')
      console.log('📋 الملف: supabase-fix-user-trigger.sql / File: supabase-fix-user-trigger.sql')
    }

    console.log('\n' + '='*70)
    console.log('📋 الخطوات التالية / Next Steps:')
    console.log('1. قم بتشغيل supabase-fix-user-trigger.sql في Supabase SQL Editor')
    console.log('   Run supabase-fix-user-trigger.sql in Supabase SQL Editor')
    console.log('2. اختبر التسجيل مرة أخرى / Test registration again')
    console.log('3. إذا استمرت المشكلة، تحقق من الأذونات / If issues persist, check permissions')

  } catch (error) {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the fix
fixUserRegistration().catch(console.error) 