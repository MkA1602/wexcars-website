-- Newsletter Email Automation Triggers
-- This script creates database triggers that automatically send emails when subscribers are added
-- Run this AFTER running newsletter-quick-setup.sql

-- ============================================================
-- Option 1: HTTP Request Trigger (Requires pg_net extension)
-- ============================================================

-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to send welcome email via HTTP request to Edge Function
CREATE OR REPLACE FUNCTION send_welcome_email_trigger()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  supabase_url TEXT;
BEGIN
  -- Get Supabase URL from environment (you need to set this)
  supabase_url := COALESCE(
    current_setting('app.supabase_url', true),
    'https://your-project-ref.supabase.co'
  );
  
  edge_function_url := supabase_url || '/functions/v1/send-welcome-email';
  
  -- Call Edge Function via HTTP
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'email', NEW.email,
      'template', 'welcome'
    )
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send welcome email to %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send admin notification via HTTP request
CREATE OR REPLACE FUNCTION send_admin_notification_trigger()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  supabase_url TEXT;
BEGIN
  -- Get Supabase URL from environment
  supabase_url := COALESCE(
    current_setting('app.supabase_url', true),
    'https://your-project-ref.supabase.co'
  );
  
  edge_function_url := supabase_url || '/functions/v1/send-admin-notification';
  
  -- Call Edge Function via HTTP
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'new_subscriber',
      'email', NEW.email,
      'timestamp', NEW.subscribed_at::text
    )
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the insert
    RAISE WARNING 'Failed to send admin notification for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON newsletter_subscribers;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION send_welcome_email_trigger();

DROP TRIGGER IF EXISTS trigger_send_admin_notification ON newsletter_subscribers;
CREATE TRIGGER trigger_send_admin_notification
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION send_admin_notification_trigger();

-- ============================================================
-- Option 2: Simple Database Queue (Alternative approach)
-- ============================================================

-- Create email queue table
CREATE TABLE IF NOT EXISTS newsletter_email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL CHECK (email_type IN ('welcome', 'admin_notification')),
  email_address VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for pending emails
CREATE INDEX IF NOT EXISTS idx_email_queue_pending ON newsletter_email_queue(status, created_at)
WHERE status = 'pending';

-- Function to add emails to queue
CREATE OR REPLACE FUNCTION queue_newsletter_emails()
RETURNS TRIGGER AS $$
BEGIN
  -- Queue welcome email
  INSERT INTO newsletter_email_queue (subscriber_id, email_type, email_address)
  VALUES (NEW.id, 'welcome', NEW.email);
  
  -- Queue admin notification
  INSERT INTO newsletter_email_queue (subscriber_id, email_type, email_address)
  VALUES (NEW.id, 'admin_notification', NEW.email);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create queue trigger (alternative to HTTP triggers)
-- Uncomment this if you want to use the queue approach instead:
/*
DROP TRIGGER IF EXISTS trigger_queue_newsletter_emails ON newsletter_subscribers;
CREATE TRIGGER trigger_queue_newsletter_emails
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION queue_newsletter_emails();
*/

-- ============================================================
-- Grant necessary permissions
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON newsletter_email_queue TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Newsletter email triggers setup completed!' as status;
SELECT 'IMPORTANT: Make sure to configure Supabase URL and service role key in database settings' as note;

