# 📧 Update Supabase Email Template - Step by Step Guide

## 🎯 **The Problem:**
Your email template is still showing the old format:
```
Confirm your signup
Follow this link to confirm your user:

Confirm your mail
```

## ✅ **The Solution:**
Update the email template in your Supabase dashboard with our professional template.

---

## 📋 **Step-by-Step Instructions:**

### **Step 1: Access Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your WexCars project

### **Step 2: Navigate to Email Templates**
1. In the left sidebar, click **"Authentication"**
2. Click **"Email Templates"**
3. You'll see a list of email templates

### **Step 3: Update Confirm Signup Template**
1. Find **"Confirm signup"** in the list
2. Click on it to open the template editor
3. You'll see two tabs: **"HTML"** and **"Plain text"**

### **Step 4: Update HTML Template**
1. Click the **"HTML"** tab
2. **Delete all existing content**
3. **Copy the entire content** from: `email-templates/confirm-signup.html`
4. **Paste it** into the HTML editor
5. Click **"Save"**

### **Step 5: Update Plain Text Template**
1. Click the **"Plain text"** tab
2. **Delete all existing content**
3. **Copy the entire content** from: `email-templates/confirm-signup.txt`
4. **Paste it** into the Plain text editor
5. Click **"Save"**

### **Step 6: Verify Settings**
1. Make sure **"Enable email confirmations"** is turned ON
2. Check that **"Redirect URL"** is set to: `https://wexcars.com/auth/callback`
3. Save any changes

---

## 🧪 **Test the New Template:**

### **Test Registration:**
1. Go to your live website
2. Try registering with a test email
3. Check the received email - it should now show:
   - ✅ WexCars logo and branding
   - ✅ Professional design
   - ✅ "Confirm Your Account" button
   - ✅ Support team information

### **Test Confirmation:**
1. Click the "Confirm Your Account" button
2. You should be redirected to a success page
3. No more "requested path is invalid" error

---

## 🔧 **If You Still See Issues:**

### **Check Redirect URL:**
Make sure your Supabase redirect URL is exactly:
```
https://wexcars.com/auth/callback
```

### **Check Domain Settings:**
1. Go to **Authentication → URL Configuration**
2. **Site URL:** `https://wexcars.com`
3. **Redirect URLs:** `https://wexcars.com/auth/callback`

### **Check Email Settings:**
1. Go to **Authentication → Settings**
2. Make sure **"Enable email confirmations"** is ON
3. Check your SMTP settings are correct

---

## 📞 **Need Help?**

If you're still having issues:
1. Check the browser console for error messages
2. Verify the redirect URL is correct
3. Make sure the email template was saved properly
4. Test with a fresh email address

---

## 🎉 **Expected Result:**

After updating the template, users will receive:
- ✅ Professional WexCars-branded email
- ✅ Clear "Confirm Your Account" button
- ✅ Support team contact information
- ✅ Mobile-responsive design
- ✅ Smooth confirmation flow

**Your email system will look and work like a professional luxury platform!** 🚗✨
