# Maintenance Mode / Coming Soon Page Setup Guide

This guide explains how to set up and use the maintenance mode feature that displays a professional "Coming Soon" page on the production domain.

## 🎯 Features

- **Animated Coming Soon Page**: Professional design with animated logo, gradient effects, and smooth transitions
- **Domain-Specific**: Only shows on `wexcars.com`, localhost always has full access
- **Admin Control**: Enable/disable from the admin dashboard
- **Development Friendly**: Localhost and admin routes bypass maintenance mode

## 📋 Setup Instructions

### Step 1: Create Database Table

Run the SQL script in your Supabase SQL Editor:

```bash
# The SQL file is located at:
scripts/maintenance-mode-schema.sql
```

Or copy and run this SQL in Supabase:

```sql
-- Create site_settings table for maintenance mode and other site-wide settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default maintenance mode setting (disabled)
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES (
    'maintenance_mode',
    '{"enabled": false, "message": "We are currently performing maintenance. Please check back soon."}'::jsonb,
    'Controls whether the site shows a maintenance/coming soon page on production domain'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read site settings (needed for public pages)
CREATE POLICY "Anyone can read site settings"
    ON public.site_settings
    FOR SELECT
    USING (true);

-- Policy: Only admins can update site settings
CREATE POLICY "Admins can update site settings"
    ON public.site_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Policy: Only admins can insert site settings
CREATE POLICY "Admins can insert site settings"
    ON public.site_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );
```

### Step 2: Verify Files Are in Place

The following files should already be created:

- ✅ `components/maintenance/coming-soon-page.tsx` - The animated coming soon page
- ✅ `app/maintenance/page.tsx` - Route for the maintenance page
- ✅ `components/admin/maintenance-mode-settings.tsx` - Admin control panel
- ✅ `lib/maintenance-mode.ts` - Utility functions
- ✅ `middleware.ts` - Updated to check maintenance mode

### Step 3: Access Admin Controls

1. Log in as an admin user
2. Navigate to `/admin/dashboard`
3. Click on the **Settings** tab
4. You'll see the **Maintenance Mode** section at the top
5. Toggle the switch to enable/disable maintenance mode

## 🎨 How It Works

### Domain Detection

- **Production Domain** (`wexcars.com` or `www.wexcars.com`): Shows coming soon page when enabled
- **Localhost** (`localhost`, `127.0.0.1`): Always has full access, maintenance mode is ignored
- **Admin Routes** (`/admin/*`): Always accessible, even when maintenance mode is enabled

### Maintenance Page Features

The coming soon page includes:

- ✨ Animated WexCars logo with floating effect
- 🎨 Gradient background with animated orbs
- 💫 Floating particle effects
- 📊 Progress bar animation
- 🎯 Feature cards (Premium Collection, Expert Service, Global Reach)
- 📧 Contact information
- 🌊 Animated wave effect at the bottom

### Admin Controls

The admin dashboard provides:

- Toggle switch to enable/disable maintenance mode
- Real-time status updates
- Success/error alerts
- Information about how maintenance mode works
- Refresh button to reload settings

## 🔒 Security & Access

### Who Can Access What

| User Type | Localhost | Production (Maintenance ON) | Production (Maintenance OFF) |
|-----------|-----------|----------------------------|------------------------------|
| Public Visitor | ✅ Full Access | ❌ Coming Soon Page | ✅ Full Access |
| Admin User | ✅ Full Access | ✅ Full Access (including `/admin`) | ✅ Full Access |
| Regular User | ✅ Full Access | ❌ Coming Soon Page | ✅ Full Access |

### Bypass Routes

These routes are always accessible, even when maintenance mode is enabled:

- `/admin/*` - Admin dashboard and routes
- `/api/*` - API endpoints
- `/maintenance` - The maintenance page itself

## 🚀 Usage Examples

### Enable Maintenance Mode

1. Go to Admin Dashboard → Settings
2. Find "Maintenance Mode" section
3. Toggle the switch to **ON**
4. Click "Enable Maintenance Mode" button
5. Visitors to `wexcars.com` will now see the coming soon page

### Disable Maintenance Mode

1. Go to Admin Dashboard → Settings
2. Find "Maintenance Mode" section
3. Toggle the switch to **OFF**
4. Click "Disable Maintenance Mode" button
5. The website is now fully accessible on `wexcars.com`

### Development Workflow

1. **Local Development**: Work normally on `localhost` - maintenance mode never affects you
2. **Testing**: Enable maintenance mode and test on production domain
3. **Launch**: Disable maintenance mode when ready to go live

## 🛠️ Troubleshooting

### Maintenance mode not working?

1. **Check Database**: Ensure `site_settings` table exists and has the `maintenance_mode` entry
2. **Check Domain**: Verify you're accessing `wexcars.com` (not localhost)
3. **Check Middleware**: Ensure `middleware.ts` is properly configured
4. **Check Admin Access**: Make sure you're logged in as admin to see controls

### Can't access admin dashboard?

- Admin routes (`/admin/*`) always bypass maintenance mode
- If you can't access, check your user role in the database
- Ensure you're logged in with an admin account

### Coming soon page not showing?

1. Verify maintenance mode is enabled in admin dashboard
2. Check that you're on the production domain (`wexcars.com`)
3. Clear browser cache and try again
4. Check browser console for any errors

## 📝 Notes

- Maintenance mode only affects the production domain
- Localhost development is never blocked
- Admin users can always access the site, even when maintenance mode is enabled
- The coming soon page is fully responsive and works on all devices
- Settings are stored in Supabase and persist across deployments

## 🎯 Next Steps

1. Run the SQL script to create the database table
2. Test the maintenance mode toggle in the admin dashboard
3. Verify it works on localhost (should not block)
4. Deploy to production and test on `wexcars.com`
5. Enable maintenance mode when needed

---

**Need Help?** Contact support or check the admin dashboard for system information.

