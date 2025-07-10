# إصلاح مشكلة تسجيل المستخدمين / User Registration Fix

## المشكلة / Problem

عندما يحاول المستخدمون التسجيل كمستخدمين جدد، يواجهون الخطأ التالي:
When users try to register as new users, they encounter the following error:

```
insert or update on table "users" violates foreign key constraint "users_id_fkey"
```

## سبب المشكلة / Root Cause

**العربية:** هذا الخطأ يحدث لأن:
1. المستخدم الجديد يتم إنشاؤه في جدول `auth.users` بواسطة Supabase Auth
2. لكن الـ trigger الذي يُفترض أن ينشئ ملف المستخدم في جدول `public.users` إما مفقود أو لا يعمل
3. عندما يحاول التطبيق إدراج بيانات في جدول `cars` أو أي جدول آخر يشير إلى `public.users`، يفشل لأن المستخدم غير موجود في `public.users`

**English:** This error occurs because:
1. New user is created in `auth.users` table by Supabase Auth
2. But the trigger that should create the user profile in `public.users` is either missing or not working
3. When the app tries to insert data into `cars` or any other table referencing `public.users`, it fails because the user doesn't exist in `public.users`

## الحل / Solution

### الخطوة 1: تشغيل سكريبت التشخيص / Step 1: Run Diagnostic Script

```bash
node scripts/fix-user-registration.js
```

هذا السكريبت سيقوم بـ:
This script will:
- فحص الـ triggers الموجودة / Check existing triggers
- العثور على المستخدمين بدون ملفات شخصية / Find users without profiles
- إنشاء الملفات الشخصية المفقودة / Create missing profiles
- اختبار عملية التسجيل / Test registration flow

### الخطوة 2: تشغيل سكريبت SQL / Step 2: Run SQL Script

في Supabase Dashboard:
In Supabase Dashboard:
1. اذهب إلى SQL Editor / Go to SQL Editor
2. انسخ والصق محتوى ملف `supabase-fix-user-trigger.sql` / Copy and paste the content of `supabase-fix-user-trigger.sql`
3. اضغط Run / Click Run

هذا السكريبت سيقوم بـ:
This script will:
- إعادة إنشاء دالة `handle_new_user()` / Recreate the `handle_new_user()` function
- إنشاء الـ trigger `on_auth_user_created` / Create the `on_auth_user_created` trigger
- إصلاح المستخدمين الموجودين بدون ملفات شخصية / Fix existing users without profiles
- التحقق من نجاح العملية / Verify successful operation

### الخطوة 3: التحقق من الإصلاح / Step 3: Verify Fix

```bash
node scripts/fix-user-registration.js
```

تشغيل السكريبت مرة أخرى للتأكد من نجاح الإصلاح
Run the script again to ensure the fix was successful

## كيفية عمل الإصلاح / How the Fix Works

### الـ Trigger الجديد / New Trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    -- Extract full name from metadata or use email
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name',
        NEW.email
    );
    
    -- Insert into public.users table
    INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        user_name,
        CASE 
            WHEN NEW.email = 'mohammedlk27@gmail.com' THEN 'admin'
            ELSE 'user'
        END,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        role = CASE 
            WHEN EXCLUDED.email = 'mohammedlk27@gmail.com' THEN 'admin'
            ELSE users.role
        END,
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail auth insertion
        RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

### الميزات الجديدة / New Features

1. **معالجة الأخطاء / Error Handling**: إذا فشل إنشاء الملف الشخصي، لن يفشل التسجيل
2. **ON CONFLICT**: يتعامل مع المستخدمين الموجودين بالفعل
3. **استخراج الاسم / Name Extraction**: يستخرج الاسم من metadata أو يستخدم الإيميل
4. **تحديد الدور / Role Assignment**: يعطي دور admin للإيميل المحدد

## اختبار الإصلاح / Testing the Fix

### اختبار يدوي / Manual Testing

1. اذهب إلى صفحة التسجيل في التطبيق / Go to the registration page in the app
2. سجل بإيميل جديد / Register with a new email
3. تحقق من عدم ظهور خطأ / Verify no error appears
4. تحقق من إنشاء الملف الشخصي في قاعدة البيانات / Check that profile is created in database

### اختبار آلي / Automated Testing

```bash
# Run the diagnostic script
node scripts/fix-user-registration.js

# Test database connection
node scripts/test-database.js

# Test adding a car (should work after user registration)
node scripts/test-add-car.js
```

## استكشاف الأخطاء / Troubleshooting

### إذا استمرت المشكلة / If the problem persists

1. **تحقق من الأذونات / Check Permissions**:
   ```sql
   GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;
   ```

2. **تحقق من وجود الـ trigger / Check if trigger exists**:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```

3. **تحقق من RLS policies / Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'users';
   ```

### أخطاء شائعة / Common Errors

1. **"permission denied for schema auth"**
   - تأكد من استخدام service role key
   - Make sure to use service role key

2. **"function does not exist"**
   - تشغيل SQL script مرة أخرى
   - Run SQL script again

3. **"trigger already exists"**
   - السكريبت يحذف الموجود أولاً، هذا طبيعي
   - Script drops existing first, this is normal

## الملفات المتعلقة / Related Files

- `supabase-fix-user-trigger.sql` - سكريبت SQL للإصلاح
- `scripts/fix-user-registration.js` - سكريبت التشخيص والإصلاح
- `contexts/auth-context.tsx` - كود التسجيل في التطبيق
- `app/auth/callback/route.ts` - معالج callback للمصادقة

## التواصل للمساعدة / Contact for Help

إذا واجهت مشاكل في التطبيق، يرجى:
If you encounter issues with the application, please:

1. تشغيل سكريبت التشخيص أولاً / Run diagnostic script first
2. نسخ output الكامل / Copy full output
3. إرسال screenshot من Supabase logs إذا أمكن / Send screenshot of Supabase logs if possible 