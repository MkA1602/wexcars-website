# دليل إعداد البريد الإلكتروني لموقع WexCars / WexCars Email Setup Guide

## الخيار 1: Gmail Business (الأسهل / Easiest)

### إنشاء حساب Gmail جديد / Create New Gmail Account:

1. **اذهب إلى:** https://accounts.google.com/signup
2. **أنشئ حساب باسم:** 
   - `info.wexcars@gmail.com`
   - `wexcarsinfo@gmail.com`
   - `support.wexcars@gmail.com`

### إعداد App Password للـ SMTP:

1. **فعل التحقق بخطوتين:**
   - Google Account → Security → 2-Step Verification → Turn On

2. **إنشاء App Password:**
   - Security → App passwords → Select app: Mail → Generate
   - **احفظ هذا الباسورد** - ستحتاجه في SMTP

### إعدادات SMTP في Supabase:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Pass: [App Password من الخطوة السابقة]
SMTP Admin Email: your-email@gmail.com
SMTP Sender Name: WexCars
```

---

## الخيار 2: بريد مهني مع الدومين / Professional Domain Email

### إذا كان لديك دومين wexcars.com:

#### A. مع Hostinger:
1. **Dashboard → Email → Create Email Account**
2. **أنشئ:** `info@wexcars.com`
3. **إعدادات SMTP:**
   ```
   SMTP Host: smtp.hostinger.com
   SMTP Port: 587
   SMTP User: info@wexcars.com
   SMTP Pass: [كلمة مرور البريد]
   ```

#### B. مع Namecheap:
1. **Dashboard → Domain List → Manage → Email Forwarding**
2. **أنشئ:** `info@wexcars.com`
3. **إعدادات SMTP:**
   ```
   SMTP Host: mail.privateemail.com
   SMTP Port: 587
   SMTP User: info@wexcars.com
   SMTP Pass: [كلمة مرور البريد]
   ```

#### C. مع GoDaddy:
1. **My Products → Email → Manage**
2. **أنشئ:** `info@wexcars.com`
3. **إعدادات SMTP:**
   ```
   SMTP Host: smtpout.secureserver.net
   SMTP Port: 80 or 3535
   SMTP User: info@wexcars.com
   SMTP Pass: [كلمة مرور البريد]
   ```

---

## الخيار 3: SendGrid (للمواقع الكبيرة / For High Volume)

### إنشاء حساب SendGrid:

1. **اذهب إلى:** https://sendgrid.com/free/
2. **أنشئ حساب مجاني** (100 بريد/يوم)
3. **تحقق من البريد الإلكتروني**

### الحصول على API Key:

1. **Dashboard → Settings → API Keys**
2. **Create API Key → Full Access → Create**
3. **احفظ API Key** (لن تراه مرة أخرى!)

### إعدادات SMTP في Supabase:

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: [SendGrid API Key]
SMTP Admin Email: any-email@gmail.com
SMTP Sender Name: WexCars
```

---

## إعداد Supabase SMTP

### في Supabase Dashboard:

1. **اذهب إلى:** Authentication → Settings → SMTP Settings
2. **فعل Custom SMTP:** Enable custom SMTP
3. **أدخل المعلومات حسب الخيار المختار:**

#### للـ Gmail:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-gmail@gmail.com
SMTP Pass: [App Password]
SMTP Admin Email: your-gmail@gmail.com
SMTP Sender Name: WexCars
```

#### للبريد المهني:
```
SMTP Host: [حسب مزود الخدمة]
SMTP Port: 587
SMTP User: info@wexcars.com
SMTP Pass: [كلمة مرور البريد]
SMTP Admin Email: info@wexcars.com
SMTP Sender Name: WexCars
```

### تخصيص قوالب البريد الإلكتروني:

في **Auth → Email Templates**:

#### Confirm Signup:
```html
<h2>مرحباً بك في WexCars! / Welcome to WexCars!</h2>
<p>اضغط على الرابط لتفعيل حسابك / Click the link to activate your account:</p>
<a href="{{ .ConfirmationURL }}">تفعيل الحساب / Activate Account</a>
```

#### Magic Link:
```html
<h2>تسجيل دخول سريع / Quick Sign In</h2>
<p>اضغط هنا لتسجيل الدخول / Click here to sign in:</p>
<a href="{{ .Token }}">دخول / Sign In</a>
```

#### Reset Password:
```html
<h2>إعادة تعيين كلمة المرور / Reset Password</h2>
<p>اضغط على الرابط لإعادة تعيين كلمة المرور / Click to reset your password:</p>
<a href="{{ .Token }}">إعادة تعيين / Reset Password</a>
```

---

## اختبار الإعداد / Testing Setup

### سكريبت اختبار البريد الإلكتروني:

أنشئ ملف `test-email.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testEmail() {
  // اختبار إرسال بريد تفعيل
  const { error } = await supabase.auth.signUp({
    email: 'test-email@example.com',
    password: 'testpassword123'
  })
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('تم إرسال بريد التفعيل بنجاح!')
  }
}

testEmail()
```

---

## الأخطاء الشائعة وحلولها / Common Errors & Solutions

### 1. "Invalid login credentials"
- **المشكلة:** كلمة مرور خاطئة
- **الحل:** تأكد من استخدام App Password للـ Gmail

### 2. "Connection refused"
- **المشكلة:** Port أو Host خاطئ
- **الحل:** تحقق من إعدادات مزود الخدمة

### 3. "Authentication failed"
- **المشكلة:** اسم المستخدم خاطئ
- **الحل:** استخدم البريد الإلكتروني الكامل

### 4. "TLS/SSL Error"
- **المشكلة:** مشكلة في التشفير
- **الحل:** جرب Port 465 بدلاً من 587

---

## توصياتي / My Recommendations:

### للبداية (Quick Start):
✅ **استخدم Gmail** - أسرع وأسهل حل

### للاحترافية (Professional):
✅ **احصل على دومين + بريد مهني** - يبدو أكثر احترافية

### للنمو (Scaling):
✅ **SendGrid** - عندما تحتاج أكثر من 100 بريد يومياً

---

## خطوات سريعة للبدء / Quick Start Steps:

1. **أنشئ حساب Gmail:** `info.wexcars@gmail.com`
2. **فعل 2-Step Verification**
3. **أنشئ App Password**
4. **أدخل الإعدادات في Supabase SMTP**
5. **اختبر التسجيل في الموقع**

🎉 **جاهز للاستخدام!** / **Ready to use!** 