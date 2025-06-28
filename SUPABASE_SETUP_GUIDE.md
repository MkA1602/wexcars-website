# WexCars Supabase Setup Guide 🚗

This guide will help you set up authentication and database functionality for your WexCars application.

## 📋 Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js installed on your machine
- Your WexCars project code

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `wexcars` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## 🔑 Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Project API Keys**:
     - `anon/public key` (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
     - `service_role/secret key` (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 📝 Step 3: Configure Environment Variables

1. In your project root, create a file called `.env.local`
2. Add the following content (replace with your actual values):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**⚠️ Important**: 
- Replace `your-project-id`, `your_anon_key_here`, and `your_service_role_key_here` with your actual values
- Never commit `.env.local` to version control
- For production, set these as environment variables in your hosting platform

## 🗄️ Step 4: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the content from `supabase-setup.sql` file in your project
4. Paste it into the SQL editor
5. Click **Run** to execute the script

This will create:
- `users` table for user profiles
- `cars` table for car listings
- Row Level Security (RLS) policies
- Proper indexes for performance
- Triggers for automatic timestamp updates

## 🔐 Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure **Site URL**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`

3. Configure **Redirect URLs**:
   - Add: `http://localhost:3000/auth/callback` (development)
   - Add: `https://yourdomain.com/auth/callback` (production)

4. **Email Templates** (Optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation and password reset emails
   - Update redirect URLs to match your domain

## 🧪 Step 6: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Visit `http://localhost:3000/auth/register`
3. Try registering a new account
4. Check your email for confirmation
5. Try logging in at `http://localhost:3000/auth/login`

## 🔍 Step 7: Verify Database

1. In Supabase dashboard, go to **Table Editor**
2. You should see `users` and `cars` tables
3. After registering, check the `users` table for your profile

## 🌐 Step 8: Production Deployment

When deploying to production:

1. **Update Environment Variables**:
   - Set the same environment variables in your hosting platform
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

2. **Update Supabase Settings**:
   - Add your production domain to **Site URL**
   - Add your production callback URL to **Redirect URLs**

3. **Security Checklist**:
   - ✅ RLS is enabled on all tables
   - ✅ Policies are properly configured
   - ✅ Service role key is kept secret
   - ✅ CORS is configured for your domain

## 🗺️ Step 9: Configure Google Maps API (Optional)

To display interactive maps on your contact page:

1. **Get Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the "Maps JavaScript API"
   - Go to **Credentials** → **Create Credentials** → **API Key**
   - Copy your API key

2. **Secure Your API Key**:
   - Click on your API key to edit it
   - Under **Application restrictions**, select "HTTP referrers"
   - Add your domains:
     - `localhost:3000/*` (for development)
     - `yourdomain.com/*` (for production)
   - Under **API restrictions**, select "Restrict key" and choose "Maps JavaScript API"

3. **Add to Environment Variables**:
   - Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here` to your `.env.local` file
   - Replace `your_api_key_here` with your actual API key

4. **Test the Map**:
   - Visit `/contact` page
   - You should see an interactive map showing WexCars location in Malmö, Sweden

**Note**: Google Maps API has a free tier with generous limits. You'll only be charged if you exceed the free usage limits.

## 🛠️ Troubleshooting

### "Supabase not configured" message
- Check that all environment variables are set correctly
- Restart your development server after adding `.env.local`
- Verify the Supabase URL and keys are correct

### Registration not working
- Check the browser console for errors
- Verify email confirmation is enabled in Supabase
- Check spam folder for confirmation emails
- Ensure redirect URLs are configured correctly

### Login redirects to home instead of dashboard
- Check that the auth callback route exists at `/app/auth/callback/route.ts`
- Verify the callback URL is added to Supabase redirect URLs
- Check browser network tab for auth errors

### Database errors
- Verify the SQL setup script ran successfully
- Check that RLS policies are enabled
- Ensure user has proper permissions

### Google Maps not loading
- Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Verify the API key has proper restrictions configured
- Ensure "Maps JavaScript API" is enabled in Google Cloud Console
- Check browser console for API key errors
- Verify your domain is added to the API key restrictions

## 📞 Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure your Supabase project is active and not paused

## 🎉 Success!

Once everything is working:
- ✅ Users can register new accounts
- ✅ Email confirmation works
- ✅ Users can log in and access dashboard
- ✅ User profiles are created automatically
- ✅ Authentication state persists across page refreshes
- ✅ Protected routes redirect unauthenticated users
- ✅ Google Maps displays WexCars location on contact page

Your WexCars application is now fully functional with Supabase authentication and Google Maps integration! 🚗✨ 