# Google Maps API Troubleshooting Guide

## Quick Fix for "ApiNotActivatedMapError"

### 🔴 Error: `ApiNotActivatedMapError`
**This means the Google Maps JavaScript API is not enabled in your project.**

### ✅ Solution (Step by Step):

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Select Your Project:**
   - Make sure you're in the correct project (the one with your API key)

3. **Enable Required APIs:**
   - Go to **"APIs & Services"** > **"Library"**
   - Search for and enable these APIs:
     - **"Maps JavaScript API"** ← This is the main one causing the error
     - **"Places API"** ← Required for location autocomplete
     - **"Geocoding API"** ← Optional but recommended

4. **Wait and Restart:**
   - Wait 2-3 minutes for changes to propagate
   - Restart your Next.js development server
   - Clear browser cache if needed

### 🔍 How to Check if APIs are Enabled:

1. Go to **"APIs & Services"** > **"Enabled APIs"**
2. You should see:
   - Maps JavaScript API
   - Places API
   - (Optional) Geocoding API

### 🚨 Common Issues:

#### **API Key Issues:**
- Make sure your API key is correct in `.env.local`
- Check that the API key is not restricted too heavily
- Ensure billing is enabled for your project

#### **Project Issues:**
- Make sure you're using the API key from the correct project
- Check that the project has billing enabled

#### **Browser Issues:**
- Clear browser cache and cookies
- Try in an incognito/private window
- Check browser console for additional errors

### 📞 Still Having Issues?

1. **Check the browser console** for detailed error messages
2. **Verify your API key** is correct and not restricted
3. **Ensure billing is enabled** for your Google Cloud project
4. **Wait longer** - API changes can take up to 10 minutes to propagate

### 🔗 Useful Links:
- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [API Error Messages](https://developers.google.com/maps/documentation/javascript/error-messages)
