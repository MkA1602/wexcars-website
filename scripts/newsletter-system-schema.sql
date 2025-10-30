-- Newsletter Subscribers Table
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

-- Newsletter Campaigns Table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Analytics Table
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  event_type VARCHAR(20) CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  template_type VARCHAR(50) DEFAULT 'newsletter',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default email templates
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
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled_at ON newsletter_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_campaign_id ON newsletter_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_subscriber_id ON newsletter_analytics(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_event_type ON newsletter_analytics(event_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_campaigns_updated_at 
    BEFORE UPDATE ON newsletter_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Allow public to insert newsletter subscriptions
CREATE POLICY "Allow public newsletter subscription" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read newsletter data
CREATE POLICY "Allow authenticated users to read newsletter data" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read campaigns" ON newsletter_campaigns
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read analytics" ON newsletter_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read templates" ON email_templates
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to manage newsletter data
CREATE POLICY "Allow authenticated users to manage newsletter data" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage campaigns" ON newsletter_campaigns
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage analytics" ON newsletter_analytics
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage templates" ON email_templates
    FOR ALL USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON newsletter_subscribers TO anon, authenticated;
GRANT ALL ON newsletter_campaigns TO authenticated;
GRANT ALL ON newsletter_analytics TO authenticated;
GRANT ALL ON email_templates TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
