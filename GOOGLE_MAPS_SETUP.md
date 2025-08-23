# Google Maps API Setup

To enable location search functionality in the marketplace, you need to set up Google Maps API.

## Setup Steps:

1. **Get Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - **Enable the following APIs** (this is crucial!):
     - **Places API** - Required for location autocomplete
     - **Maps JavaScript API** - Required for the base Maps functionality
     - **Geocoding API** - Optional but recommended for better address parsing
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add Environment Variable:**
   Create a `.env.local` file in the frontend directory and add:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server:**
   After adding the environment variable, restart your Next.js development server.

## Features Enabled:
- Location autocomplete in create product form
- Location-based product search
- Address parsing and coordinates storage
- **Fixed**: Singleton pattern prevents multiple API loads
- **Fixed**: Proper error handling and cleanup

## Technical Implementation:
- **Singleton Pattern**: Prevents multiple Google Maps API script loads
- **Error Handling**: Graceful fallback when API fails to load
- **Memory Management**: Proper cleanup of services and predictions
- **Type Safety**: Full TypeScript support with proper interfaces

## Security Notes:
- The API key is exposed to the client (NEXT_PUBLIC_)
- Make sure to restrict the API key to your domain
- Consider implementing rate limiting on the backend

## Troubleshooting:

### **ApiNotActivatedMapError**
**Error**: `ApiNotActivatedMapError`
**Cause**: Google Maps JavaScript API is not enabled in your Google Cloud Console project
**Solution**: 
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Library"
4. Search for and enable:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API** (optional)
5. Wait a few minutes for the changes to propagate
6. Restart your development server

### **Other Common Issues:**
- **Multiple API loads**: Fixed with singleton pattern
- **"DI" and "oI" errors**: Fixed with proper service initialization
- **Memory leaks**: Fixed with cleanup functions
- **Invalid API Key**: Make sure your API key is correct and not restricted too heavily
- **Quota Exceeded**: Check your Google Cloud Console billing and quotas

## API Requirements:
- **Maps JavaScript API**: Base functionality (required)
- **Places API**: Location autocomplete and place details (required)
- **Geocoding API**: Address parsing (recommended)
