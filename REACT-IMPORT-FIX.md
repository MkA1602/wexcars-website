# React Import Issues Fix Guide

## 🚨 Error: ReferenceError: useEffect is not defined

This error occurs when React hooks are used without being imported. Here's how to fix it:

## ✅ **Quick Fix**

### **Missing useEffect Import**
```typescript
// ❌ Wrong - Missing import
import { useState } from "react"

// ✅ Correct - Include useEffect
import { useState, useEffect } from "react"
```

### **Missing useState Import**
```typescript
// ❌ Wrong - Missing import
import { useEffect } from "react"

// ✅ Correct - Include useState
import { useState, useEffect } from "react"
```

## 🔧 **Common React Hook Imports**

### **Basic Hooks**
```typescript
import { useState, useEffect, useContext } from "react"
```

### **Additional Hooks**
```typescript
import { 
  useState, 
  useEffect, 
  useContext, 
  useReducer, 
  useCallback, 
  useMemo, 
  useRef 
} from "react"
```

### **Custom Hooks**
```typescript
import { useState, useEffect } from "react"
import { useAuthRole } from "@/hooks/use-auth-role"
```

## 🛠️ **Step-by-Step Fix**

### **Step 1: Identify Missing Import**
Look at the error message:
```
ReferenceError: useEffect is not defined
at NewsletterManagement (component.tsx:49:5)
```

### **Step 2: Check Import Statement**
Find the import statement at the top of the file:
```typescript
import { useState } from "react" // ❌ Missing useEffect
```

### **Step 3: Add Missing Hook**
```typescript
import { useState, useEffect } from "react" // ✅ Fixed
```

### **Step 4: Verify Usage**
Make sure the hook is used correctly:
```typescript
useEffect(() => {
  // Your effect code here
}, [])
```

## 📋 **Common Import Patterns**

### **Component with State and Effects**
```typescript
import { useState, useEffect } from "react"
```

### **Component with Multiple Hooks**
```typescript
import { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo 
} from "react"
```

### **Component with Context**
```typescript
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/contexts/auth-context"
```

## 🔍 **Diagnostic Commands**

### **Check for Missing Imports**
```bash
# Run the import check script:
npm run check-imports
```

### **Manual Check**
```bash
# Search for useEffect usage:
grep -r "useEffect" --include="*.tsx" .

# Search for useState usage:
grep -r "useState" --include="*.tsx" .
```

## 🚨 **Common Scenarios**

### **Scenario 1: New Component**
```typescript
// ❌ Common mistake
"use client"
import { useState } from "react"

export default function MyComponent() {
  const [data, setData] = useState([])
  
  useEffect(() => { // ❌ Error: useEffect not imported
    fetchData()
  }, [])
  
  return <div>Content</div>
}
```

**Fix:**
```typescript
// ✅ Correct
"use client"
import { useState, useEffect } from "react"

export default function MyComponent() {
  const [data, setData] = useState([])
  
  useEffect(() => { // ✅ Works
    fetchData()
  }, [])
  
  return <div>Content</div>
}
```

### **Scenario 2: Copying Code**
When copying code from another component, make sure to copy the imports too.

### **Scenario 3: Refactoring**
When moving hooks between components, update imports accordingly.

## 🎯 **Prevention Tips**

### **1. Use Import Templates**
Create a template with common imports:
```typescript
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
// ... other imports
```

### **2. Check Imports First**
Before using any React hook, verify it's imported.

### **3. Use IDE Features**
- **Auto-import**: Most IDEs can auto-import missing hooks
- **Import suggestions**: IDE will suggest missing imports
- **Error highlighting**: IDE will highlight missing imports

### **4. Run Import Check**
```bash
npm run check-imports
```

## 🚀 **Quick Fixes**

### **Fix 1: Add Missing Hook**
```typescript
// Add to existing import
import { useState, useEffect } from "react"
```

### **Fix 2: Restart Dev Server**
```bash
# Sometimes needed after import changes
npm run dev
```

### **Fix 3: Clear Cache**
```bash
# If imports still not working
npm run fix-dev
```

## 📊 **Error Types**

### **useEffect not defined**
- **Cause**: Missing `useEffect` in import
- **Fix**: Add `useEffect` to import statement

### **useState not defined**
- **Cause**: Missing `useState` in import
- **Fix**: Add `useState` to import statement

### **useContext not defined**
- **Cause**: Missing `useContext` in import
- **Fix**: Add `useContext` to import statement

## 🎉 **Success Indicators**

You'll know it's fixed when:
- ✅ **No ReferenceError** in console
- ✅ **Component renders** properly
- ✅ **Hooks work** as expected
- ✅ **No import warnings** in IDE

## 🆘 **If Nothing Works**

### **Nuclear Option:**
1. **Copy component code** to a new file
2. **Add all necessary imports**
3. **Test the component**
4. **Replace the old file**

### **Alternative:**
1. **Use IDE auto-import** features
2. **Check for typos** in import statements
3. **Verify file extensions** (.tsx for React components)

---

## 🎯 **Quick Reference**

### **Essential Imports for React Components:**
```typescript
import { useState, useEffect } from "react"
```

### **Common UI Imports:**
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

### **Icon Imports:**
```typescript
import { Mail, Users, Settings } from "lucide-react"
```

**The useEffect import issue should now be resolved!** 🎉

Always remember to import React hooks before using them in your components.
