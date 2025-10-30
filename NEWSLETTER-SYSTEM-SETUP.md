# Newsletter System Setup Guide

## Overview
This guide will help you set up a complete newsletter subscription system for WexCars that includes:
- ✅ Proper email storage in database
- ✅ Welcome emails to subscribers
- ✅ Admin notifications for new subscriptions
- ✅ Unsubscribe functionality
- ✅ Admin management dashboard
- ✅ Email analytics and tracking

## 🚀 Quick Setup

### 1. Database Setup
Run the SQL script to create the newsletter tables:

```bash
# In your Supabase dashboard, go to SQL Editor and run:
scripts/newsletter-system-schema.sql
```

This creates:
- `newsletter_subscribers` - Stores subscriber emails and status
- `newsletter_campaigns` - Manages email campaigns
- `newsletter_analytics` - Tracks email events
- `email_templates` - Stores email templates

### 2. Environment Variables
Add these to your `.env.local` file:

```env
# Email Service (Resend - recommended)
RESEND_API_KEY=your_resend_api_key_here

# Admin Email for notifications
ADMIN_EMAIL=admin@wexcars.com

# Site URL for unsubscribe links
SITE_URL=https://your-domain.com
```

### 3. Email Service Setup (Resend)
1. Go to [Resend.com](https://resend.com) and create an account
2. Verify your domain (wexcars.com)
3. Get your API key from the dashboard
4. Add the API key to your environment variables

### 4. Deploy Edge Functions
Deploy the Supabase Edge Functions:

```bash
# Deploy welcome email function
supabase functions deploy send-welcome-email

# Deploy admin notification function
supabase functions deploy send-admin-notification
```

## 📧 How It Works

### Newsletter Subscription Flow
1. **User subscribes** via footer form
2. **Email is saved** to `newsletter_subscribers` table
3. **Welcome email** is sent automatically
4. **Admin notification** is sent to you
5. **Success message** is shown to user

### Admin Notifications
You'll receive an email every time someone subscribes with:
- Subscriber's email address
- Subscription timestamp
- Source (website_footer, etc.)

### Unsubscribe Process
1. Users can unsubscribe via `/unsubscribe` page
2. Status is updated to 'unsubscribed'
3. Analytics event is logged
4. Users can resubscribe if needed

## 🎛️ Admin Management

### Access Newsletter Dashboard
Navigate to: `/admin/newsletter-management`

Features:
- **View all subscribers** with status and subscription date
- **Export subscriber list** as CSV
- **Manage campaigns** (create, schedule, send)
- **View analytics** (opens, clicks, bounces)
- **Test subscription form**

### Subscriber Management
- ✅ View active subscribers
- ✅ See unsubscribed users
- ✅ Export subscriber data
- ✅ Manual unsubscribe/delete
- ✅ Resubscribe users

## 📊 Analytics & Tracking

### Available Metrics
- **Total subscribers** - All-time subscriber count
- **Active subscribers** - Currently subscribed users
- **Campaign performance** - Opens, clicks, bounces
- **Subscription sources** - Where users subscribed from
- **Unsubscribe rates** - Track retention

### Event Tracking
All events are logged in `newsletter_analytics`:
- `sent` - Email was sent
- `delivered` - Email was delivered
- `opened` - Email was opened
- `clicked` - Link was clicked
- `bounced` - Email bounced
- `unsubscribed` - User unsubscribed

## 🔧 Customization

### Email Templates
Edit templates in the database:

```sql
-- Update welcome email template
UPDATE email_templates 
SET html_content = 'Your new HTML content here'
WHERE name = 'welcome';

-- Update admin notification template
UPDATE email_templates 
SET html_content = 'Your new HTML content here'
WHERE name = 'admin_notification';
```

### Template Variables
Available variables in templates:
- `{{subscriber_email}}` - Subscriber's email
- `{{subscription_time}}` - When they subscribed
- `{{source}}` - Where they subscribed from
- `{{company_name}}` - Your company name
- `{{unsubscribe_link}}` - Unsubscribe URL

### Custom Email Service
To use a different email service, modify the Edge Functions:

```typescript
// In supabase/functions/send-welcome-email/index.ts
// Replace the Resend API call with your service
const emailResponse = await fetch('https://api.your-service.com/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('YOUR_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // Your service's email format
  }),
})
```

## 🧪 Testing

### Test Newsletter Subscription
1. Go to `/admin/newsletter-management`
2. Click "Subscription Form" tab
3. Enter a test email
4. Check that:
   - Email is saved to database
   - Welcome email is sent
   - Admin notification is received

### Test Unsubscribe
1. Go to `/unsubscribe?email=test@example.com`
2. Enter the email address
3. Verify unsubscribe works
4. Test resubscribe functionality

## 🚨 Troubleshooting

### Common Issues

**❌ Emails not sending**
- Check `RESEND_API_KEY` is correct
- Verify domain is verified in Resend
- Check Supabase Edge Function logs

**❌ Database errors**
- Ensure RLS policies are set correctly
- Check table permissions
- Verify foreign key constraints

**❌ Admin notifications not working**
- Check `ADMIN_EMAIL` environment variable
- Verify admin notification template exists
- Check Edge Function deployment

### Debug Steps
1. **Check Supabase logs** in the dashboard
2. **Test Edge Functions** individually
3. **Verify environment variables** are loaded
4. **Check email service** API limits/quota

## 📈 Next Steps

### Advanced Features
- **Email campaigns** - Send newsletters to all subscribers
- **Segmentation** - Target specific subscriber groups
- **A/B testing** - Test different email templates
- **Automation** - Automated email sequences
- **Integration** - Connect with CRM systems

### Performance Optimization
- **Batch processing** for large subscriber lists
- **Rate limiting** to prevent spam
- **Caching** for frequently accessed data
- **Monitoring** for email delivery rates

## 📞 Support

If you need help with the newsletter system:

1. **Check the logs** in Supabase dashboard
2. **Test each component** individually
3. **Verify environment variables**
4. **Check email service status**

The system is designed to be robust and handle errors gracefully. Most issues are related to configuration or email service setup.

---

## ✅ Checklist

- [ ] Database tables created
- [ ] Environment variables set
- [ ] Email service configured
- [ ] Edge Functions deployed
- [ ] Newsletter subscription tested
- [ ] Admin notifications working
- [ ] Unsubscribe page functional
- [ ] Admin dashboard accessible

Once all items are checked, your newsletter system is fully operational! 🎉
