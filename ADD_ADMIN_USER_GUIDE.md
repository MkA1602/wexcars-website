# Adding Admin User: ayat.ayk90@gmail.com

This guide explains how to grant full admin permissions to `ayat.ayk90@gmail.com` (same as `mohammedlk27@gmail.com`).

## What Was Updated

### 1. SQL Files Updated
- ✅ `supabase-fix-user-trigger.sql` - Updated trigger function to assign admin role
- ✅ `supabase-setup-clean.sql` - Updated user creation function
- ✅ `supabase-setup-fixed.sql` - Updated trigger function and RLS policies

### 2. Code Files Updated
- ✅ `contexts/auth-context.tsx` - Updated admin email check for signup
- ✅ `app/dashboard/edit-car/[id]/page.tsx` - Updated admin permission check
- ✅ `components/dashboard/add-car-form.tsx` - Updated admin fee waiver check
- ✅ `scripts/fix-user-registration.js` - Updated role assignment

### 3. New Scripts Created
- ✅ `scripts/add-admin-user.js` - Node.js script to add admin user
- ✅ `scripts/add-admin-user.sql` - SQL script to add admin user
- ✅ `scripts/update-admin-permissions.sql` - Complete SQL script to update all permissions

## How to Apply the Changes

### Option 1: Using SQL Script (Recommended)

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Run the Update Script**
   ```sql
   -- Copy and paste the contents of scripts/update-admin-permissions.sql
   -- This will update the trigger function and RLS policies
   ```

3. **Verify the User Exists**
   - Make sure `ayat.ayk90@gmail.com` has registered an account
   - If not, ask them to sign up first

4. **Grant Admin Role (if user already exists)**
   ```sql
   -- Run scripts/add-admin-user.sql to grant admin role to existing user
   ```

### Option 2: Using Node.js Script

1. **Make sure the user has registered**
   - The user `ayat.ayk90@gmail.com` must have signed up first

2. **Run the script**
   ```bash
   node scripts/add-admin-user.js
   ```

   This script will:
   - Find the user in `auth.users`
   - Update their role to `admin` in `public.users`
   - Verify the changes

## Verification

After running the scripts, verify the admin permissions:

```sql
-- Check if user has admin role
SELECT email, role, full_name 
FROM public.users 
WHERE email = 'ayat.ayk90@gmail.com';

-- Should show: role = 'admin'
```

## Admin Permissions

Both admin users (`mohammedlk27@gmail.com` and `ayat.ayk90@gmail.com`) now have:

- ✅ **Full access to admin dashboard** (`/admin/dashboard`)
- ✅ **Can view all users** and their profiles
- ✅ **Can edit/delete any car** (not just their own)
- ✅ **Can publish cars without paying service fees**
- ✅ **Can manage all listings** in the system
- ✅ **Can update user roles** (if super_admin)

## Important Notes

1. **User Must Exist First**: The user `ayat.ayk90@gmail.com` must have registered an account before you can grant admin permissions.

2. **Automatic Assignment**: If the user signs up after running the SQL script, they will automatically get the `admin` role due to the updated trigger function.

3. **Code Changes**: The code changes ensure that the new admin email is recognized throughout the application, including:
   - Signup process (no email verification needed)
   - Car editing permissions
   - Service fee waivers

4. **RLS Policies**: The Row Level Security policies have been updated to allow both admin emails to access all resources.

## Troubleshooting

### User Not Found Error
If you get "User not found", make sure:
- The user has signed up at least once
- Check `auth.users` table: `SELECT * FROM auth.users WHERE email = 'ayat.ayk90@gmail.com';`

### Role Not Updating
If the role doesn't update:
- Run the SQL script directly in Supabase SQL Editor
- Check for any errors in the SQL execution
- Verify the trigger function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`

### Still Can't Access Admin Features
- Clear browser cache and cookies
- Log out and log back in
- Check that the user's role in `public.users` is actually `admin`

## Files Modified Summary

| File | Change |
|------|--------|
| `supabase-fix-user-trigger.sql` | Added new admin email to CASE statement |
| `supabase-setup-clean.sql` | Added new admin email to CASE statement |
| `supabase-setup-fixed.sql` | Added new admin email to trigger and RLS policies |
| `contexts/auth-context.tsx` | Added new admin email check |
| `app/dashboard/edit-car/[id]/page.tsx` | Added new admin email check |
| `components/dashboard/add-car-form.tsx` | Added new admin email check |
| `scripts/fix-user-registration.js` | Added new admin email check |

## Next Steps

1. ✅ Run `scripts/update-admin-permissions.sql` in Supabase SQL Editor
2. ✅ If user already exists, run `scripts/add-admin-user.sql` or `scripts/add-admin-user.js`
3. ✅ Ask the user to log in and verify they can access admin features
4. ✅ Test admin functionality (edit cars, view users, etc.)

---

**Created**: $(date)
**Admin Emails**: 
- mohammedlk27@gmail.com (existing)
- ayat.ayk90@gmail.com (new)
