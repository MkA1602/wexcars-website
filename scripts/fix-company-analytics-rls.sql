-- Fix RLS policy issue for company_analytics table
-- This script updates the update_company_analytics() and create_daily_analytics() functions
-- to use SECURITY DEFINER so they can bypass RLS when inserting/updating analytics records

-- 1. Update the update_company_analytics() function to use SECURITY DEFINER (bypasses RLS)
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

-- 2. Update the create_daily_analytics() function to use SECURITY DEFINER (bypasses RLS)
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

-- 3. Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_company_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION create_daily_analytics() TO authenticated;

-- 4. Verify the functions were updated
SELECT 
    proname AS function_name,
    prosecdef AS is_security_definer
FROM pg_proc
WHERE proname IN ('update_company_analytics', 'create_daily_analytics')
ORDER BY proname;

