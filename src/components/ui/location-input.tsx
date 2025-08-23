"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { MapPin, Loader2 } from "lucide-react";
import { loadGoogleMapsAPI, getGoogleMapsServices, checkGoogleMapsErrors } from "@/lib/google-maps";

interface LocationInputProps {
  value?: string;
  onChange: (location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { latitude: number; longitude: number };
  }) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

interface PlaceResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleMapsServices {
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
}

interface GoogleAutocompleteService {
  getPlacePredictions(
    request: {
      input: string;
      types?: string[];
    },
    callback: (predictions: PlaceResult[], status: string) => void
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

export const LocationInput: React.FC<LocationInputProps> = ({
  value = "",
  onChange,
  placeholder = "Search for a location...",
  label = "Location",
  error,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const autocompleteService = useRef<GoogleAutocompleteService | null>(null);
  const placesService = useRef<GooglePlacesService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load Google Places API
  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        
        // Check for specific errors
        const error = checkGoogleMapsErrors();
        if (error) {
          setGoogleError(error);
          return;
        }

        const services = getGoogleMapsServices() as GoogleMapsServices;
        setIsGoogleLoaded(true);
        autocompleteService.current = new services.AutocompleteService();
        placesService.current = new services.PlacesService(
          document.createElement('div')
        );
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
        setGoogleError(error instanceof Error ? error.message : 'Failed to load Google Maps API');
      }
    };

    initializeGoogleMaps();

    // Cleanup function
    return () => {
      // Clear predictions when component unmounts
      setPredictions([]);
      setShowDropdown(false);
    };
  }, []);

  // Debounced search function
  useEffect(() => {
    if (!isGoogleLoaded || !inputValue.trim()) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchPlaces(inputValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue, isGoogleLoaded]);

  const searchPlaces = async (query: string) => {
    if (!autocompleteService.current || !query.trim()) return;

    setIsLoading(true);
    try {
      const services = getGoogleMapsServices() as GoogleMapsServices;
      autocompleteService.current.getPlacePredictions(
        {
          input: query,
          types: ['geocode', 'establishment'],
        },
        (predictions: PlaceResult[], status: string) => {
          setIsLoading(false);
          if (status === services.PlacesServiceStatus.OK) {
            setPredictions(predictions);
            setShowDropdown(true);
          } else {
            setPredictions([]);
            setShowDropdown(false);
          }
        }
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Error searching places:', error);
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handlePlaceSelect = (prediction: PlaceResult) => {
    if (!placesService.current) return;

    try {
      const services = getGoogleMapsServices() as GoogleMapsServices;
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['address_components', 'formatted_address', 'geometry'],
        },
        (place: GooglePlaceDetails, status: string) => {
          if (status === services.PlacesServiceStatus.OK) {
            const locationData = parsePlaceDetails(place);
            setInputValue(locationData.address);
            onChange(locationData);
            setShowDropdown(false);
            setPredictions([]);
          } else {
            console.error('Failed to get place details:', status);
          }
        }
      );
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  };

  const parsePlaceDetails = (place: GooglePlaceDetails) => {
    const addressComponents = place.address_components || [];
    let city = '';
    let state = '';
    let country = '';

    addressComponents.forEach((component: GoogleAddressComponent) => {
      const types = component.types;
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
    });

    return {
      address: place.formatted_address || '',
      city,
      state,
      country,
      coordinates: place.geometry?.location ? {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      } : undefined,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If user clears the input, clear the location data
    if (!value.trim()) {
      onChange({
        address: '',
        city: '',
        state: '',
        country: '',
      });
    }
  };

  const handleInputFocus = () => {
    if (predictions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  return (
    <div className="relative">
      <Label htmlFor="location">{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="location"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="pl-10"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {/* Predictions Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => handlePlaceSelect(prediction)}
            >
              <div className="font-medium text-gray-900">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Google Maps API Error */}
      {googleError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700 font-medium">Google Maps API Error:</p>
          <p className="text-sm text-red-600 mt-1">{googleError}</p>
          <p className="text-xs text-red-500 mt-2">
            Please check the setup guide in GOOGLE_MAPS_SETUP.md
          </p>
        </div>
      )}

      {/* Fallback message if Google Maps API is not available */}
      {!isGoogleLoaded && !googleError && inputValue && (
        <p className="text-sm text-gray-500 mt-1">
          Location autocomplete is loading...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
