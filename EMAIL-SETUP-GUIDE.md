# Newsletter Email Setup Guide

This guide will help you set up automatic email sending for newsletter subscriptions.

## Problem
- Users subscribe but don't receive welcome emails
- Admin/owner doesn't get notified about new subscribers

## Solution Options

### Option 1: Deploy Supabase Edge Functions (Recommended)

Edge Functions provide the most reliable way to send emails automatically.

#### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Or download from: https://github.com/supabase/cli/releases

#### Step 2: Login to Supabase

```bash
supabase login
```

#### Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

#### Step 4: Deploy Edge Functions

```bash
# Deploy welcome email function
supabase functions deploy send-welcome-email

# Deploy admin notification function
supabase functions deploy send-admin-notification
```

#### Step 5: Set Environment Variables

In Supabase Dashboard:
1. Go to **Edge Functions** > **Settings**
2. Add these secrets:

```
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your-admin-email@example.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Step 6: Get Resend API Key

1. Sign up at https://resend.com
2. Create an API key
3. Verify your domain (or use Resend's test domain)
4. Add the API key to Supabase Edge Function secrets

### Option 2: Use Database Triggers (Alternative)

If Edge Functions are not available, you can use database triggers to queue emails.

#### Step 1: Run SQL Script

In Supabase SQL Editor, run:
```sql
-- Run scripts/newsletter-email-triggers.sql
```

#### Step 2: Set Database Settings

```sql
-- Set Supabase URL (replace with your actual URL)
ALTER DATABASE postgres SET app.supabase_url = 'https://your-project.supabase.co';

-- Set service role key (replace with your actual key)
ALTER DATABASE postgres SET app.service_role_key = 'your_service_role_key';
```

### Option 3: Manual Email Queue Processing

Create a scheduled job to process the email queue:

```sql
-- View pending emails
SELECT * FROM newsletter_email_queue WHERE status = 'pending' ORDER BY created_at;

-- Mark as sent (after manually sending)
UPDATE newsletter_email_queue 
SET status = 'sent', processed_at = NOW() 
WHERE id = 'email-id-here';
```

## Testing

### Test Welcome Email

1. Subscribe to newsletter with a test email
2. Check browser console for logs:
   - `Attempting to send welcome email to: test@example.com`
   - `Welcome email sent successfully` or error messages

3. Check email inbox (including spam folder)

### Test Admin Notification

1. Subscribe to newsletter
2. Check admin email inbox
3. Check browser console for logs:
   - `Attempting to send admin notification for: test@example.com`
   - `Admin notification sent successfully` or error messages

## Troubleshooting

### Problem: Emails not sending

**Check 1: Edge Functions Deployed?**
```bash
supabase functions list
```

**Check 2: Environment Variables Set?**
- Go to Supabase Dashboard > Edge Functions > Settings
- Verify all required secrets are present

**Check 3: Resend API Key Valid?**
- Check Resend dashboard for API key status
- Verify domain is verified (if using custom domain)

**Check 4: Database Triggers Active?**
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%newsletter%';
```

### Problem: Edge Function Returns 404

- Verify the function is deployed: `supabase functions list`
- Check function name matches exactly (case-sensitive)
- Verify project is linked: `supabase projects list`

### Problem: Permission Denied

- Check RLS policies on `newsletter_subscribers` table
- Verify service role key has correct permissions
- Check Edge Function secrets are accessible

## Configuration Checklist

- [ ] Supabase CLI installed
- [ ] Project linked to Supabase
- [ ] Edge Functions deployed
- [ ] Resend API key configured
- [ ] ADMIN_EMAIL environment variable set
- [ ] Test subscription completed
- [ ] Welcome email received
- [ ] Admin notification received

## Next Steps

After setup:
1. Monitor email delivery in Resend dashboard
2. Check error logs in Supabase Edge Function logs
3. Set up email queue monitoring (if using queue approach)
4. Configure email templates customization

## Support

If you encounter issues:
1. Check browser console for detailed error messages
2. Check Supabase Edge Function logs
3. Verify all environment variables are set
4. Test with a simple Edge Function first to verify setup
