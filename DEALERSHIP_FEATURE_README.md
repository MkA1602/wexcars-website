# Dealership Feature Implementation

## Overview
This update adds the ability for users to specify whether they're adding cars as individual users or as dealerships, with support for dealership names.

## New Features

### 1. Seller Type Selection
- Users can now choose between "Individual User" and "Dealership" when adding cars
- Default selection is "Individual User"
- Selection affects the required fields and display

### 2. Dealership Name Field
- When "Dealership" is selected, a dealership name field becomes required
- Dealership names are stored and displayed throughout the system
- Individual sellers don't need to provide a dealership name

### 3. Enhanced Car Display
- Car listings now show seller type (Individual/Dealership)
- Dealership names are prominently displayed for dealership cars
- Car detail pages include seller information

## Database Changes

### New Columns Added to `cars` Table
```sql
-- Seller type (individual or dealership)
seller_type TEXT DEFAULT 'individual' CHECK (seller_type IN ('individual', 'dealership'))

-- Dealership name (nullable)
dealership_name TEXT
```

### Migration Script
A migration script has been created at `scripts/add-dealership-fields.js` to add these fields to existing databases.

## Form Updates

### Add Car Form (`components/dashboard/add-car-form.tsx`)
- Added seller type radio buttons
- Conditional dealership name input field
- Validation for dealership name when dealership is selected
- Updated form submission to include seller information

### Edit Car Form (`components/dashboard/edit-car-form.tsx`)
- Same seller type and dealership name functionality
- Pre-populates existing seller information
- Validation and update logic included

## Display Updates

### Car Grid (`components/car-listing/car-grid.tsx`)
- Shows seller type badge on each car card
- Dealership cars display with 🏢 icon and dealership name
- Individual cars show 👤 icon with "Individual Seller" text

### Car Detail Page (`components/car-detail/car-detail-page.tsx`)
- Added seller information section in vehicle details
- Shows "Dealership: [Name]" or "Individual Seller"

## Validation Rules

### Required Fields
- **Individual User**: No additional fields required
- **Dealership**: Dealership name is mandatory

### Form Validation
```typescript
// Validate dealership name if seller type is dealership
if (formData.seller_type === 'dealership' && !formData.dealership_name.trim()) {
  newErrors.dealership_name = "Dealership name is required when selling as a dealership"
}
```

## Usage Examples

### Adding a Car as Individual
1. Select "Individual User" radio button
2. Fill in car details
3. Submit form (no dealership name needed)

### Adding a Car as Dealership
1. Select "Dealership" radio button
2. Enter dealership name in the new field
3. Fill in car details
4. Submit form

## Migration Instructions

### For Existing Databases
1. Run the migration script:
   ```bash
   node scripts/add-dealership-fields.js
   ```

2. The script will:
   - Add `seller_type` column with default value 'individual'
   - Add `dealership_name` column (nullable)
   - Update existing cars to have seller_type = 'individual'

### For New Deployments
The updated `supabase-setup-clean.sql` includes the new columns by default.

## Benefits

1. **User Experience**: Clear distinction between individual and dealership sellers
2. **Trust Building**: Dealership names provide credibility and transparency
3. **Flexibility**: Supports both individual and business users
4. **Professional Appearance**: Dealership cars look more professional with business branding

## Future Enhancements

Potential future improvements could include:
- Dealership profile pages
- Dealership-specific branding options
- Bulk car upload for dealerships
- Dealership verification system
- Analytics for dealership performance

## Technical Notes

- All existing functionality remains unchanged
- Backward compatible with existing car data
- New fields are optional for individual users
- Validation ensures data integrity
- UI components gracefully handle missing seller information
