# دليل إعداد نظام الإدارة / Admin System Setup Guide 👑

هذا الدليل سيساعدك في إعداد نظام الإدارة الكامل لتطبيق WexCars مع المستخدم الإداري المطلوب.

This guide will help you set up the complete admin system for the WexCars application with the required admin user.

## 📋 المتطلبات الأساسية / Prerequisites

- ✅ حساب Supabase نشط / Active Supabase account
- ✅ تكوين متغيرات البيئة / Environment variables configured  
- ✅ قاعدة البيانات Supabase جاهزة / Supabase database ready
- ✅ Node.js مثبت / Node.js installed

## 🚀 خطوات الإعداد / Setup Steps

### 1. تشغيل سكريپت SQL / Run SQL Script

أولاً، قم بتشغيل سكريپت قاعدة البيانات المحدث في Supabase:

First, run the updated database script in Supabase:

```sql
-- انسخ والصق محتوى ملف supabase-setup.sql في SQL Editor
-- Copy and paste the contents of supabase-setup.sql into SQL Editor
```

هذا السكريپت سيقوم بـ:
- إضافة حقل `role` إلى جدول المستخدمين
- إنشاء سياسات الأمان للمدراء  
- إضافة فهارس لتحسين الأداء
- إنشاء دالة إعداد المستخدم الإداري تلقائياً

This script will:
- Add `role` field to users table
- Create security policies for admins
- Add indexes for better performance
- Create automatic admin user setup function

### 2. تثبيت التبعيات / Install Dependencies

```bash
npm install
# أو / or
yarn install
```

### 3. تكوين متغيرات البيئة / Configure Environment Variables

تأكد من أن ملف `.env.local` يحتوي على:

Make sure your `.env.local` file contains:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. تشغيل سكريپت إعداد المدير / Run Admin Setup Script

```bash
npm run setup-admin
```

هذا السكريپت سيقوم بـ:
- إنشاء حساب المستخدم الإداري
- تعيين الدور الإداري
- التحقق من الإعداد
- عرض معلومات تسجيل الدخول

This script will:
- Create the admin user account
- Assign admin role
- Verify the setup
- Display login information

## 👤 معلومات المستخدم الإداري / Admin User Information

بعد تشغيل السكريپت بنجاح، ستحصل على:

After running the script successfully, you'll get:

- **📧 البريد الإلكتروني / Email:** `mohammedlk27@gmail.com`
- **🔑 كلمة المرور / Password:** `Mkpa2024`
- **👑 الدور / Role:** `admin`

## 🌐 الروابط المهمة / Important URLs

- **🏠 الصفحة الرئيسية / Homepage:** `http://localhost:3000`
- **🔐 تسجيل الدخول / Login:** `http://localhost:3000/auth/login`
- **📊 لوحة التحكم العادية / Regular Dashboard:** `http://localhost:3000/dashboard`
- **⚡ لوحة تحكم الإدارة / Admin Dashboard:** `http://localhost:3000/admin/dashboard`

## 🎯 ميزات نظام الإدارة / Admin System Features

### لوحة تحكم الإدارة / Admin Dashboard

#### 1. نظرة عامة / Overview
- 📊 إحصائيات شاملة / Comprehensive statistics
- 📈 السيارات الحديثة / Recent cars
- 👥 المستخدمين الجدد / New users
- 💰 متوسط الأسعار / Average prices

#### 2. إدارة السيارات / Car Management
- 👀 عرض جميع السيارات / View all cars
- ✏️ تعديل أي سيارة / Edit any car
- 🗑️ حذف السيارات / Delete cars
- 🔍 البحث والتصفية / Search and filter
- ➕ إضافة سيارات جديدة / Add new cars

#### 3. إدارة المستخدمين / User Management  
- 👥 عرض جميع المستخدمين / View all users
- 🔄 تغيير أدوار المستخدمين / Change user roles
- 🔍 البحث في المستخدمين / Search users
- 📅 معلومات التسجيل / Registration info

#### 4. إعدادات النظام / System Settings
- ℹ️ معلومات النظام / System information
- 🔄 تحديث البيانات / Refresh data
- 📊 إحصائيات مفصلة / Detailed statistics

## 🔒 نظام الصلاحيات / Permission System

### أدوار المستخدمين / User Roles

1. **👤 مستخدم عادي / Regular User (`user`)**
   - عرض السيارات / View cars
   - إدارة سياراته الخاصة / Manage own cars
   - تحديث الملف الشخصي / Update profile

2. **👑 مدير / Admin (`admin`)**
   - جميع صلاحيات المستخدم العادي / All regular user permissions
   - إدارة جميع السيارات / Manage all cars
   - عرض جميع المستخدمين / View all users
   - الوصول للوحة الإدارة / Access admin dashboard

3. **🔱 مدير عام / Super Admin (`super_admin`)**
   - جميع صلاحيات المدير / All admin permissions
   - تغيير أدوار المستخدمين / Change user roles
   - إدارة المدراء الآخرين / Manage other admins

## 🛡️ نظام الحماية / Security System

### حماية المسارات / Route Protection

- ✅ المسارات العامة متاحة للجميع / Public routes available to everyone
- 🔐 المسارات المحمية تتطلب تسجيل الدخول / Protected routes require login
- 👑 مسارات الإدارة تتطلب دور المدير / Admin routes require admin role
- 🚫 إعادة توجيه المستخدمين غير المصرحين / Redirect unauthorized users

### سياسات الأمان في قاعدة البيانات / Database Security Policies

- **Row Level Security (RLS)** مفعلة على جميع الجداول / enabled on all tables
- المستخدمون يمكنهم رؤية سياراتهم فقط / Users can only see their own cars
- المدراء يمكنهم الوصول لجميع البيانات / Admins can access all data
- التحقق من الصلاحيات على مستوى قاعدة البيانات / Permission verification at database level

## 🧪 اختبار النظام / Testing the System

### 1. اختبار تسجيل الدخول / Test Login

```bash
# تشغيل الخادم المحلي / Start local server
npm run dev

# انتقل إلى / Navigate to
http://localhost:3000/auth/login

# استخدم بيانات المدير / Use admin credentials
Email: mohammedlk27@gmail.com
Password: Mkpa2024
```

### 2. اختبار لوحة الإدارة / Test Admin Dashboard

بعد تسجيل الدخول، يجب أن يتم توجيهك تلقائياً إلى:

After login, you should be automatically redirected to:
`http://localhost:3000/admin/dashboard`

### 3. اختبار الصلاحيات / Test Permissions

- جرب الوصول للوحة الإدارة بدون تسجيل دخول / Try accessing admin dashboard without login
- جرب تسجيل الدخول بحساب مستخدم عادي / Try logging in with regular user account
- اختبر إدارة السيارات والمستخدمين / Test car and user management

## 🔧 استكشاف الأخطاء / Troubleshooting

### المشاكل الشائعة / Common Issues

#### 1. "لا يمكن الوصول للوحة الإدارة" / "Cannot access admin dashboard"

**الحل / Solution:**
```bash
# تحقق من دور المستخدم في قاعدة البيانات
# Check user role in database
SELECT email, role FROM users WHERE email = 'mohammedlk27@gmail.com';

# إذا لم يكن الدور admin، قم بتحديثه
# If role is not admin, update it
UPDATE users SET role = 'admin' WHERE email = 'mohammedlk27@gmail.com';
```

#### 2. "سكريپت إعداد المدير لا يعمل" / "Admin setup script not working"

**الحل / Solution:**
```bash
# تحقق من متغيرات البيئة
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# تأكد من تثبيت التبعيات
# Make sure dependencies are installed
npm install dotenv
```

#### 3. "خطأ في الصلاحيات" / "Permission Error"

**الحل / Solution:**
```sql
-- تحقق من سياسات RLS
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';
SELECT * FROM pg_policies WHERE tablename = 'cars';

-- أعد تشغيل سكريپت قاعدة البيانات
-- Re-run database script
```

## 📚 المراجع الإضافية / Additional References

### الملفات المهمة / Important Files

- `supabase-setup.sql` - سكريپت قاعدة البيانات / Database script
- `scripts/setup-admin.js` - سكريپت إعداد المدير / Admin setup script  
- `hooks/use-auth-role.ts` - هوك إدارة الأدوار / Role management hook
- `components/admin/admin-dashboard.tsx` - مكون لوحة الإدارة / Admin dashboard component
- `middleware.ts` - حماية المسارات / Route protection

### الروابط المفيدة / Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)

## 🎉 تهانينا! / Congratulations!

تم إعداد نظام الإدارة بنجاح! يمكنك الآن:

Admin system setup completed successfully! You can now:

- ✅ تسجيل الدخول كمدير / Login as admin
- ✅ الوصول للوحة تحكم الإدارة / Access admin dashboard  
- ✅ إدارة جميع السيارات / Manage all cars
- ✅ إدارة المستخدمين / Manage users
- ✅ مراقبة إحصائيات النظام / Monitor system statistics

🚗 استمتع بإدارة WexCars! / Enjoy managing WexCars! 