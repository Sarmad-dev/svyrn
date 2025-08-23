interface GoogleMapsAPI {
  maps: {
    places: {
      AutocompleteService: new () => GoogleAutocompleteService;
      PlacesService: new (div: HTMLDivElement) => GooglePlacesService;
      PlacesServiceStatus: {
        OK: string;
        ZERO_RESULTS: string;
        OVER_QUERY_LIMIT: string;
        REQUEST_DENIED: string;
        INVALID_REQUEST: string;
        NOT_FOUND: string;
        UNKNOWN_ERROR: string;
      };
    };
  };
}

interface GoogleAutocompleteService {
  getPlacePredictions(
    request: {
      input: string;
      types?: string[];
    },
    callback: (predictions: GooglePlacePrediction[], status: string) => void
  ): void;
}

interface GooglePlacesService {
  getDetails(
    request: {
      placeId: string;
      fields: string[];
    },
    callback: (place: GooglePlaceDetails, status: string) => void
  ): void;
}

interface GooglePlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlaceDetails {
  address_components: GoogleAddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
}

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

declare global {
  interface Window {
    google: GoogleMapsAPI;
    googleMapsLoaded: boolean;
    googleMapsPromise: Promise<void> | null;
  }
}

// Singleton pattern for loading Google Maps API
export const loadGoogleMapsAPI = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }

  // If already loading, return existing promise
  if (window.googleMapsPromise) {
    return window.googleMapsPromise;
  }

  // Create new loading promise
  window.googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for existing script to load
      existingScript.addEventListener('load', () => {
        window.googleMapsLoaded = true;
        resolve();
      });
      existingScript.addEventListener('error', reject);
      return;
    }

    // Create new script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.googleMapsLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      window.googleMapsPromise = null;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return window.googleMapsPromise;
};

// Check if Google Maps is loaded
export const isGoogleMapsLoaded = (): boolean => {
  return !!(window.google && window.google.maps);
};

// Get Google Maps services safely
export const getGoogleMapsServices = (): {
  AutocompleteService: new () => GoogleAutocompleteService;
  PlacesService: new (div: HTMLDivElement) => GooglePlacesService;
  PlacesServiceStatus: {
    OK: string;
    ZERO_RESULTS: string;
    OVER_QUERY_LIMIT: string;
    REQUEST_DENIED: string;
    INVALID_REQUEST: string;
    NOT_FOUND: string;
    UNKNOWN_ERROR: string;
  };
} => {
  if (!isGoogleMapsLoaded()) {
    throw new Error('Google Maps API is not loaded');
  }

  // Check if Places API is available
  if (!window.google.maps.places) {
    throw new Error('Google Places API is not enabled. Please enable Places API in Google Cloud Console.');
  }

  return {
    AutocompleteService: window.google.maps.places.AutocompleteService,
    PlacesService: window.google.maps.places.PlacesService,
    PlacesServiceStatus: window.google.maps.places.PlacesServiceStatus,
  };
};

// Check for specific Google Maps errors
export const checkGoogleMapsErrors = (): string | null => {
  if (!window.google) {
    return 'Google Maps API is not loaded. Check your API key and internet connection.';
  }

  if (!window.google.maps) {
    console.error('🔴 Google Maps JavaScript API is not enabled!');
    console.log('📋 To fix this:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Select your project');
    console.log('3. Go to "APIs & Services" > "Library"');
    console.log('4. Search for "Maps JavaScript API" and enable it');
    console.log('5. Also enable "Places API" for location autocomplete');
    return 'Google Maps JavaScript API is not enabled. Please enable Maps JavaScript API in Google Cloud Console.';
  }

  if (!window.google.maps.places) {
    console.error('🔴 Google Places API is not enabled!');
    console.log('📋 To fix this:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Select your project');
    console.log('3. Go to "APIs & Services" > "Library"');
    console.log('4. Search for "Places API" and enable it');
    return 'Google Places API is not enabled. Please enable Places API in Google Cloud Console.';
  }

  return null;
};
