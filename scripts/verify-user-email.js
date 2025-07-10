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

async function verifyUserEmails() {
  try {
    console.log('📧 تفعيل المستخدمين بدون تحقق البريد / Activating Users Without Email Verification')
    console.log('='*70)

    // Get all users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ خطأ في الحصول على المستخدمين / Error getting users:', authError.message)
      return
    }

    console.log(`📊 إجمالي المستخدمين / Total users: ${authUsers.users.length}`)

    // Check which users are not verified
    const unverifiedUsers = authUsers.users.filter(user => !user.email_confirmed_at)
    
    console.log(`❌ مستخدمون غير مفعلين / Unverified users: ${unverifiedUsers.length}`)

    if (unverifiedUsers.length === 0) {
      console.log('✅ جميع المستخدمين مفعلين بالفعل / All users are already verified!')
      return
    }

    console.log('\n📋 المستخدمون غير المفعلين / Unverified users:')
    unverifiedUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (Created: ${new Date(user.created_at).toLocaleDateString()})`)
    })

    // Verify all unverified users
    console.log('\n✅ تفعيل جميع المستخدمين / Verifying all users...')
    
    for (const user of unverifiedUsers) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { 
          email_confirm: true 
        }
      )

      if (updateError) {
        console.error(`❌ خطأ في تفعيل ${user.email} / Error verifying ${user.email}:`, updateError.message)
      } else {
        console.log(`✅ تم تفعيل ${user.email} / Verified ${user.email}`)
      }
    }

    // Final check
    console.log('\n🔍 التحقق النهائي / Final verification...')
    
    const { data: finalUsers } = await supabase.auth.admin.listUsers()
    const stillUnverified = finalUsers.users.filter(user => !user.email_confirmed_at)
    
    console.log(`📊 مستخدمون غير مفعلين متبقين / Remaining unverified users: ${stillUnverified.length}`)

    if (stillUnverified.length === 0) {
      console.log('\n🎉 تم تفعيل جميع المستخدمين بنجاح! / All users verified successfully!')
      console.log('✅ يمكن للمستخدمين الآن تسجيل الدخول / Users can now sign in')
    } else {
      console.log('\n⚠️ لا تزال هناك مستخدمون غير مفعلين / Some users are still unverified')
      stillUnverified.forEach(user => {
        console.log(`   - ${user.email}`)
      })
    }

    console.log('\n' + '='*70)
    console.log('📋 ملاحظات مهمة / Important Notes:')
    console.log('1. الآن يمكن للمستخدمين تسجيل الدخول بدون تحقق البريد')
    console.log('   Now users can sign in without email verification')
    console.log('2. لتفعيل إرسال الإيميلات، اذهب إلى Supabase Dashboard → Auth → Settings → SMTP')
    console.log('   To enable email sending, go to Supabase Dashboard → Auth → Settings → SMTP')
    console.log('3. أو أطفئ "Enable email confirmations" في Auth Settings')
    console.log('   Or turn off "Enable email confirmations" in Auth Settings')

  } catch (error) {
    console.error('❌ خطأ غير متوقع / Unexpected error:', error.message)
  }
}

// معلومات إضافية / Additional info
console.log('🔧 أدوات مساعدة إضافية / Additional Helper Tools:')
console.log('')
console.log('لتفعيل مستخدم محدد / To verify specific user:')
console.log('node -e "')
console.log('const { createClient } = require(\'@supabase/supabase-js\')')
console.log('require(\'dotenv\').config({ path: \'.env.local\' })')
console.log('const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)')
console.log('supabase.auth.admin.updateUserById(\'USER_ID\', { email_confirm: true }).then(console.log)')
console.log('"')
console.log('')

// Run the verification
verifyUserEmails().catch(console.error) 