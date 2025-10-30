#!/bin/bash

# React Import Check Script
echo "🔍 Checking for common React import issues..."

# Check for missing useEffect imports
echo "Checking for useEffect usage without import..."
grep -r "useEffect" --include="*.tsx" --include="*.ts" . | grep -v "import.*useEffect" | head -5

# Check for missing useState imports
echo "Checking for useState usage without import..."
grep -r "useState" --include="*.tsx" --include="*.ts" . | grep -v "import.*useState" | head -5

# Check for missing React imports
echo "Checking for React usage without import..."
grep -r "React\." --include="*.tsx" --include="*.ts" . | grep -v "import.*React" | head -5

echo "✅ Import check complete!"
