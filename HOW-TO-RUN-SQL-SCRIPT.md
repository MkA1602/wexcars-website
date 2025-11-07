# How to Run SQL Script in Supabase

## Step-by-Step Instructions

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project

### Step 2: Open SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Copy the SQL Script
1. Open the file: `scripts/newsletter-notification-trigger.sql`
2. **Copy ONLY the SQL code** (lines starting with `--` are comments, these are fine)
3. **DO NOT copy** any TypeScript/React code (`"use client"`, `import`, etc.)

### Step 4: Paste and Run
1. Paste the SQL code into the SQL Editor
2. Click **Run** button (or press Ctrl+Enter / Cmd+Enter)
3. Wait for success message

## What to Copy

✅ **GOOD - Copy This:**
```sql
-- Create notification log table
CREATE TABLE IF NOT EXISTS newsletter_subscription_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ...
);
```

❌ **BAD - DON'T Copy This:**
```typescript
"use client"
import { useState } from "react"
```

## Quick Check

Before pasting, make sure:
- ✅ First line starts with `--` (comment) or `CREATE`
- ✅ No `"use client"` anywhere
- ✅ No `import` statements
- ✅ No `export` statements
- ✅ All text is SQL syntax

## If You Still Get Errors

1. **Clear the SQL Editor completely**
2. **Copy the ENTIRE content** from `scripts/newsletter-notification-trigger.sql`
3. Make sure you're copying from the `.sql` file, NOT from a `.tsx` or `.ts` file
4. Paste and run again

## Files to Use

- ✅ `scripts/newsletter-notification-trigger.sql` - Use this one (simplest)
- ✅ `scripts/simple-email-notification.sql` - Alternative
- ❌ `scripts/newsletter-email-triggers.sql` - More complex (use later)

## After Running

To check if it worked:
```sql
SELECT * FROM pending_subscription_notifications;
```

This should show empty results initially, but will populate when new subscribers sign up.

