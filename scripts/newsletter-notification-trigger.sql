-- Simple Newsletter Notification Trigger
-- This creates a table to log new subscriptions so you can see them
-- Run this in Supabase SQL Editor

-- Create notification log table
CREATE TABLE IF NOT EXISTS newsletter_subscription_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  subscriber_email VARCHAR(255) NOT NULL,
  notification_type VARCHAR(50) DEFAULT 'new_subscriber',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'skipped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create index for pending notifications
CREATE INDEX IF NOT EXISTS idx_subscription_notifications_pending 
ON newsletter_subscription_notifications(status, created_at)
WHERE status = 'pending';

-- Function to log new subscriptions
CREATE OR REPLACE FUNCTION log_new_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log active subscriptions
  IF NEW.status = 'active' THEN
    INSERT INTO newsletter_subscription_notifications (
      subscriber_id,
      subscriber_email,
      notification_type,
      status
    ) VALUES (
      NEW.id,
      NEW.email,
      'new_subscriber',
      'pending'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists (to avoid errors on re-run)
DROP TRIGGER IF EXISTS trigger_log_new_subscription ON newsletter_subscribers;

-- Create trigger
CREATE TRIGGER trigger_log_new_subscription
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION log_new_subscription();

-- Create view to see pending notifications
CREATE OR REPLACE VIEW pending_subscription_notifications AS
SELECT 
  n.id,
  n.subscriber_email,
  n.created_at as subscription_time,
  n.status,
  s.source,
  s.subscribed_at
FROM newsletter_subscription_notifications n
JOIN newsletter_subscribers s ON n.subscriber_id = s.id
WHERE n.status = 'pending'
ORDER BY n.created_at DESC;

-- Grant permissions
GRANT SELECT ON pending_subscription_notifications TO authenticated;
GRANT SELECT, UPDATE ON newsletter_subscription_notifications TO authenticated;

-- Success message
SELECT 'Newsletter notification trigger created successfully!' as status;
SELECT 'You can now query: SELECT * FROM pending_subscription_notifications;' as note;

