-- Add sold status feature to cars table

-- 1. Add is_sold column to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT FALSE;

-- 2. Add sold_at timestamp column to track when car was marked as sold
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 3. Create index for better performance on sold status queries
CREATE INDEX IF NOT EXISTS idx_cars_is_sold ON cars(is_sold);
CREATE INDEX IF NOT EXISTS idx_cars_sold_at ON cars(sold_at);

-- 4. Update existing cars to have is_sold = false
UPDATE cars SET is_sold = FALSE WHERE is_sold IS NULL;

-- 5. Add comments to document the new fields
COMMENT ON COLUMN cars.is_sold IS 'Indicates if the car has been sold and should not appear in public listings';
COMMENT ON COLUMN cars.sold_at IS 'Timestamp when the car was marked as sold';

-- 6. Create a view for active (non-sold) cars for easier querying
CREATE OR REPLACE VIEW active_cars AS
SELECT * FROM cars 
WHERE is_sold = FALSE;

-- 7. Create a view for sold cars for easier querying
CREATE OR REPLACE VIEW sold_cars AS
SELECT * FROM cars 
WHERE is_sold = TRUE;
