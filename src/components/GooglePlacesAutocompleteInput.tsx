import React, { useState, useEffect, useRef } from 'react';

// Static fallbacks for popular localities in target cities
const LOCALITY_FALLBACKS: Record<string, string[]> = {
  'Bengaluru': [
    'HSR Layout, Bengaluru',
    'Indiranagar, Bengaluru',
    'Koramangala, Bengaluru',
    'Whitefield, Bengaluru',
    'Jayanagar, Bengaluru',
    'Bellandur, Bengaluru',
    'Electronic City, Bengaluru',
    'Marathahalli, Bengaluru'
  ],
  'Mumbai': [
    'Andheri West, Mumbai',
    'Bandra West, Mumbai',
    'Powai, Mumbai',
    'Juhu, Mumbai',
    'Worli, Mumbai',
    'Goregaon, Mumbai',
    'Khar West, Mumbai'
  ],
  'Delhi NCR': [
    'Saket, New Delhi',
    'Hauz Khas, New Delhi',
    'Greater Kailash, New Delhi',
    'Vasant Kunj, New Delhi',
    'Gurugram Sector 45, NCR',
    'Noida Sector 62, NCR'
  ],
  'Pune': [
    'Koregaon Park, Pune',
    'Kalyani Nagar, Pune',
    'Viman Nagar, Pune',
    'Baner, Pune',
    'Kothrud, Pune',
    'Hinjewadi, Pune'
  ],
  'Hyderabad': [
    'Gachibowli, Hyderabad',
    'Jubilee Hills, Hyderabad',
    'Madhapur, Hyderabad',
    'Banjara Hills, Hyderabad',
    'Kondapur, Hyderabad'
  ],
  'Chennai': [
    'Adyar, Chennai',
    'Velachery, Chennai',
    'T. Nagar, Chennai',
    'Nungambakkam, Chennai',
    'Mylapore, Chennai',
    'Anna Nagar, Chennai'
  ],
  'Kolkata': [
    'Salt Lake, Kolkata',
    'New Town, Kolkata',
    'Park Street, Kolkata',
    'Ballygunge, Kolkata',
    'Jadavpur, Kolkata'
  ]
};

// Coordinate database for fallbacks to allow map updates when Google Maps is not loaded
const FALLBACK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'HSR Layout, Bengaluru': { lat: 12.9116, lng: 77.6389 },
  'Indiranagar, Bengaluru': { lat: 12.9718, lng: 77.6411 },
  'Koramangala, Bengaluru': { lat: 12.9352, lng: 77.6244 },
  'Whitefield, Bengaluru': { lat: 12.9698, lng: 77.7499 },
  'Jayanagar, Bengaluru': { lat: 12.9299, lng: 77.5824 },
  'Bellandur, Bengaluru': { lat: 12.9304, lng: 77.6784 },
  'Electronic City, Bengaluru': { lat: 12.8452, lng: 77.6744 },
  'Marathahalli, Bengaluru': { lat: 12.9569, lng: 77.7011 },
  'Andheri West, Mumbai': { lat: 19.1363, lng: 72.8273 },
  'Bandra West, Mumbai': { lat: 19.0544, lng: 72.8294 },
  'Powai, Mumbai': { lat: 19.1176, lng: 72.9060 },
  'Juhu, Mumbai': { lat: 19.1012, lng: 72.8258 },
  'Worli, Mumbai': { lat: 19.0176, lng: 72.8164 },
  'Goregaon, Mumbai': { lat: 19.1645, lng: 72.8494 },
  'Khar West, Mumbai': { lat: 19.0683, lng: 72.8346 },
  'Saket, New Delhi': { lat: 28.5244, lng: 77.2172 },
  'Hauz Khas, New Delhi': { lat: 28.5494, lng: 77.2001 },
  'Greater Kailash, New Delhi': { lat: 28.5482, lng: 77.2347 },
  'Vasant Kunj, New Delhi': { lat: 28.5293, lng: 77.1435 },
  'Gurugram Sector 45, NCR': { lat: 28.4419, lng: 77.0620 },
  'Noida Sector 62, NCR': { lat: 28.6253, lng: 77.3732 },
  'Koregaon Park, Pune': { lat: 18.5362, lng: 73.8930 },
  'Kalyani Nagar, Pune': { lat: 18.5463, lng: 73.9033 },
  'Viman Nagar, Pune': { lat: 18.5679, lng: 73.9143 },
  'Baner, Pune': { lat: 18.5597, lng: 73.7799 },
  'Kothrud, Pune': { lat: 18.5074, lng: 73.8077 },
  'Hinjewadi, Pune': { lat: 18.5913, lng: 73.7389 },
  'Gachibowli, Hyderabad': { lat: 17.4401, lng: 78.3489 },
  'Jubilee Hills, Hyderabad': { lat: 17.4325, lng: 78.4071 },
  'Madhapur, Hyderabad': { lat: 17.4483, lng: 78.3915 },
  'Banjara Hills, Hyderabad': { lat: 17.4172, lng: 78.4354 },
  'Kondapur, Hyderabad': { lat: 17.4622, lng: 78.3568 },
  'Adyar, Chennai': { lat: 13.0012, lng: 80.2565 },
  'Velachery, Chennai': { lat: 12.9801, lng: 80.2228 },
  'T. Nagar, Chennai': { lat: 13.0418, lng: 80.2341 },
  'Nungambakkam, Chennai': { lat: 13.0583, lng: 80.2453 },
  'Mylapore, Chennai': { lat: 13.0330, lng: 80.2690 },
  'Anna Nagar, Chennai': { lat: 13.0850, lng: 80.2101 },
  'Salt Lake, Kolkata': { lat: 22.5850, lng: 88.4236 },
  'New Town, Kolkata': { lat: 22.5801, lng: 88.4718 },
  'Park Street, Kolkata': { lat: 22.5529, lng: 88.3533 },
  'Ballygunge, Kolkata': { lat: 22.5273, lng: 88.3694 },
  'Jadavpur, Kolkata': { lat: 22.4955, lng: 88.3709 }
};

interface GooglePlacesAutocompleteInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string, coords?: { lat: number; lng: number }) => void;
  icon?: React.ReactNode;
  cityContext?: string; // Target City context (e.g. 'Bengaluru', 'Mumbai') to narrow down or sort
  type?: 'locality' | 'address' | 'landmark';
}

export const GooglePlacesAutocompleteInput: React.FC<GooglePlacesAutocompleteInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon,
  cityContext = 'Bengaluru',
  type = 'locality'
}) => {
  const [predictions, setPredictions] = useState<{ description: string; placeId?: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);

  const GOOGLE_MAPS_API_KEY = 
    (process.env as any).GOOGLE_MAPS_PLATFORM_KEY || 
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || 
    '';

  // Initialize Autocomplete Service
  useEffect(() => {
    if (typeof window !== 'undefined' && GOOGLE_MAPS_API_KEY) {
      const checkGoogleAndInit = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          if (!autocompleteServiceRef.current) {
            autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          }
          if (!geocoderRef.current) {
            geocoderRef.current = new window.google.maps.Geocoder();
          }
        }
      };

      checkGoogleAndInit();
      // Also register an interval just in case script loads asynchronously
      const interval = setInterval(checkGoogleAndInit, 1000);
      return () => clearInterval(interval);
    }
  }, [GOOGLE_MAPS_API_KEY]);

  // Handle predictions fetch
  useEffect(() => {
    if (!value || value.trim() === '') {
      setPredictions([]);
      return;
    }

    const query = value.toLowerCase().trim();

    // Use Google Places Autocomplete if available
    if (autocompleteServiceRef.current) {
      const searchOptions: any = {
        input: value,
        componentRestrictions: { country: 'in' }
      };

      // Add type bias if desired
      if (type === 'locality') {
        searchOptions.types = ['(regions)'];
      } else if (type === 'landmark') {
        searchOptions.types = ['establishment'];
      }

      autocompleteServiceRef.current.getPlacePredictions(
        searchOptions,
        (results: any, status: any) => {
          if (status === 'OK' && results) {
            setPredictions(
              results.map((r: any) => ({
                description: r.description,
                placeId: r.place_id
              }))
            );
          } else {
            getStaticFallbackPredictions(query);
          }
        }
      );
    } else {
      // Use Static Fallbacks
      getStaticFallbackPredictions(query);
    }
  }, [value, cityContext, type]);

  const getStaticFallbackPredictions = (query: string) => {
    // Collect all relevant fallback localities
    let allLocalities: string[] = [];
    if (cityContext && LOCALITY_FALLBACKS[cityContext]) {
      allLocalities = [...LOCALITY_FALLBACKS[cityContext]];
    } else {
      Object.values(LOCALITY_FALLBACKS).forEach((list) => {
        allLocalities.push(...list);
      });
    }

    const matched = allLocalities
      .filter((loc) => loc.toLowerCase().includes(query))
      .map((loc) => ({ description: loc }));

    setPredictions(matched.slice(0, 6));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (pred: { description: string; placeId?: string }) => {
    setIsOpen(false);

    if (pred.placeId && geocoderRef.current) {
      geocoderRef.current.geocode({ placeId: pred.placeId }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const coords = { lat: location.lat(), lng: location.lng() };
          onChange(pred.description, coords);
        } else {
          // Fallback to static coordinates if geocoder fails
          const coords = FALLBACK_COORDINATES[pred.description];
          onChange(pred.description, coords);
        }
      });
    } else {
      // Offline fallback coordinates lookup
      const coords = FALLBACK_COORDINATES[pred.description];
      onChange(pred.description, coords);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full h-14 bg-white border border-[#E5E7EB] rounded-xl text-base px-4 ${
            icon ? 'pl-11' : ''
          } focus:outline-none focus:border-[#128A4E] focus:ring-2 focus:ring-[#128A4E]/20 transition-all duration-200 text-[#0F172A] placeholder-[#9CA3AF] font-semibold`}
        />

        {isOpen && predictions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
            {predictions.map((pred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(pred)}
                className="w-full text-left px-4 py-3 text-sm text-[#0F172A] hover:bg-slate-50 border-b border-gray-50 last:border-0 font-medium transition-colors flex items-center gap-2"
              >
                <span className="text-xs">📍</span>
                <span className="font-semibold">{pred.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
