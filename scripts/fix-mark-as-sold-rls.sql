-- Fix RLS policy issue for mark as sold functionality
-- This script fixes the "new row violates row-level security policy for table company_fees" error

-- 1. Update the create_success_fee function to use SECURITY DEFINER and check for company_id
CREATE OR REPLACE FUNCTION create_success_fee()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    company_uuid UUID;
    success_fee DECIMAL;
BEGIN
    -- Only create fee when car is marked as sold
    IF NEW.is_sold = true AND OLD.is_sold = false THEN
        -- Get company_id from car
        company_uuid := NEW.company_id;
        
        -- Only create fee if car belongs to a company (not individual seller)
        IF company_uuid IS NOT NULL THEN
            -- Check if a success fee already exists for this car to prevent duplicates
            IF NOT EXISTS (
                SELECT 1 FROM public.company_fees 
                WHERE car_id = NEW.id 
                AND fee_type = 'success'
            ) THEN
                -- Calculate success fee
                success_fee := calculate_success_fee(NEW.price, NEW.currency);
                
                -- Insert fee record (SECURITY DEFINER allows bypassing RLS)
                INSERT INTO public.company_fees (
                    company_id,
                    car_id,
                    amount,
                    currency,
                    fee_type,
                    status,
                    due_date,
                    breakdown
                ) VALUES (
                    company_uuid,
                    NEW.id,
                    success_fee,
                    NEW.currency,
                    'success',
                    'pending',
                    NOW() + INTERVAL '7 days',
                    jsonb_build_object(
                        'success_fee', success_fee,
                        'car_price', NEW.price,
                        'sold_at', NEW.sold_at
                    )
                );
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the update
        RAISE LOG 'Error in create_success_fee trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Note: SECURITY DEFINER functions bypass RLS, so no additional policy needed
-- The function will run with the privileges of the function owner (postgres/supabase_admin)

-- 3. Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS trigger_create_success_fee ON public.cars;
CREATE TRIGGER trigger_create_success_fee
    AFTER UPDATE ON public.cars
    FOR EACH ROW
    WHEN (NEW.is_sold IS DISTINCT FROM OLD.is_sold)
    EXECUTE FUNCTION create_success_fee();

-- 4. Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_success_fee() TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_success_fee(DECIMAL, TEXT) TO authenticated;

-- Note: The function now:
-- 1. Uses SECURITY DEFINER to bypass RLS when inserting
-- 2. Only creates fees for cars that belong to companies (company_id IS NOT NULL)
-- 3. Handles errors gracefully without failing the car update
-- 4. Prevents duplicate entries by checking if a success fee already exists for the car

