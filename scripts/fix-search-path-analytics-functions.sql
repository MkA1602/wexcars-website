-- Fix search_path for analytics functions to include pg_temp
-- This resolves the linter warning about mutable search_path
-- Run this script to update the functions in your database

-- 1. Update create_daily_analytics() function
CREATE OR REPLACE FUNCTION create_daily_analytics()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.company_analytics (
        company_id,
        date,
        total_listings,
        active_listings,
        sold_cars,
        total_views,
        total_inquiries,
        revenue,
        fees_paid
    )
    SELECT 
        NEW.company_id,
        CURRENT_DATE,
        COUNT(*),
        COUNT(*) FILTER (WHERE is_published = true AND is_sold = false),
        COUNT(*) FILTER (WHERE is_sold = true),
        0, -- total_views (would need separate tracking)
        0, -- total_inquiries (would need separate tracking)
        COALESCE(SUM(price) FILTER (WHERE is_sold = true), 0),
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)
    FROM public.cars c
    LEFT JOIN public.company_fees cf ON c.id = cf.car_id
    WHERE c.company_id = NEW.company_id
    ON CONFLICT (company_id, date) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the insert
        RAISE LOG 'Error in create_daily_analytics trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Update update_company_analytics() function
CREATE OR REPLACE FUNCTION update_company_analytics()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Update today's analytics for the company
    INSERT INTO public.company_analytics (
        company_id,
        date,
        total_listings,
        active_listings,
        sold_cars,
        total_views,
        total_inquiries,
        revenue,
        fees_paid
    )
    SELECT 
        COALESCE(NEW.company_id, OLD.company_id),
        CURRENT_DATE,
        COUNT(*),
        COUNT(*) FILTER (WHERE is_published = true AND is_sold = false),
        COUNT(*) FILTER (WHERE is_sold = true),
        0,
        0,
        COALESCE(SUM(price) FILTER (WHERE is_sold = true), 0),
        COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)
    FROM public.cars c
    LEFT JOIN public.company_fees cf ON c.id = cf.car_id
    WHERE c.company_id = COALESCE(NEW.company_id, OLD.company_id)
    ON CONFLICT (company_id, date) DO UPDATE SET
        total_listings = EXCLUDED.total_listings,
        active_listings = EXCLUDED.active_listings,
        sold_cars = EXCLUDED.sold_cars,
        revenue = EXCLUDED.revenue,
        fees_paid = EXCLUDED.fees_paid;
    
    RETURN COALESCE(NEW, OLD);
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the update
        RAISE LOG 'Error in update_company_analytics trigger: %', SQLERRM;
        RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 3. Verify the functions were updated correctly
SELECT 
    proname AS function_name,
    prosecdef AS is_security_definer,
    proconfig AS search_path_config
FROM pg_proc
WHERE proname IN ('update_company_analytics', 'create_daily_analytics')
ORDER BY proname;

-- Expected output should show:
-- function_name: create_daily_analytics, is_security_definer: true, search_path_config: {search_path=public,pg_temp}
-- function_name: update_company_analytics, is_security_definer: true, search_path_config: {search_path=public,pg_temp}
