-- Quick Newsletter Setup Script
-- Run this in your Supabase SQL Editor to set up the newsletter system

-- 1. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(50) DEFAULT 'website_footer',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_type VARCHAR(50) DEFAULT 'newsletter',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert Default Templates
INSERT INTO email_templates (name, subject, html_content, text_content, template_type) VALUES
(
  'welcome',
  'Welcome to WexCars Newsletter!',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333;">Welcome to WexCars!</h1>
        <p style="color: #666; font-size: 16px;">Thank you for subscribing to our newsletter</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">What to Expect:</h2>
        <ul style="color: #666;">
          <li>Latest luxury car arrivals</li>
          <li>Exclusive offers and promotions</li>
          <li>Industry news and updates</li>
          <li>Special events and showcases</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666;">Best regards,<br>The WexCars Team</p>
      </div>
    </body>
  </html>',
  'Welcome to WexCars!\n\nThank you for subscribing to our newsletter.\n\nWhat to Expect:\n- Latest luxury car arrivals\n- Exclusive offers and promotions\n- Industry news and updates\n- Special events and showcases\n\nBest regards,\nThe WexCars Team',
  'welcome'
),
(
  'admin_notification',
  'New Newsletter Subscriber - WexCars',
  '<html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333;">New Newsletter Subscriber</h1>
        <p style="color: #666; font-size: 16px;">Someone has subscribed to your newsletter</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Subscriber Details:</h2>
        <p><strong>Email:</strong> {{subscriber_email}}</p>
        <p><strong>Subscription Time:</strong> {{subscription_time}}</p>
        <p><strong>Source:</strong> {{source}}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666;">This is an automated notification from WexCars</p>
      </div>
    </body>
  </html>',
  'New Newsletter Subscriber\n\nEmail: {{subscriber_email}}\nSubscription Time: {{subscription_time}}\nSource: {{source}}\n\nThis is an automated notification from WexCars',
  'admin_notification'
) ON CONFLICT (name) DO NOTHING;

-- 3.5. Add UNIQUE constraint to name column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'email_templates_name_key' 
    AND conrelid = 'email_templates'::regclass
  ) THEN
    ALTER TABLE email_templates ADD CONSTRAINT email_templates_name_key UNIQUE (name);
  END IF;
END $$;

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- 5. Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- 6. Create Policies
-- Note: Service role (used by admin/server) bypasses RLS automatically

-- Allow public to subscribe (from website footer)
CREATE POLICY "Allow public newsletter subscription" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow all users (including anon) to read for admin dashboard
-- For production, you may want to restrict this to authenticated users only
CREATE POLICY "Allow read newsletter data" ON newsletter_subscribers
    FOR SELECT USING (true);

-- Allow users to update newsletter data
CREATE POLICY "Allow update newsletter data" ON newsletter_subscribers
    FOR UPDATE USING (true);

-- Allow users to delete newsletter data
CREATE POLICY "Allow delete newsletter data" ON newsletter_subscribers
    FOR DELETE USING (true);

-- Allow read access to templates
CREATE POLICY "Allow read templates" ON email_templates
    FOR SELECT USING (true);

-- Allow authenticated users to manage templates
CREATE POLICY "Allow manage templates" ON email_templates
    FOR ALL USING (true);

-- 7. Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON newsletter_subscribers TO anon, authenticated;
GRANT ALL ON email_templates TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 8. Create Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Newsletter system setup completed successfully!' as status;
