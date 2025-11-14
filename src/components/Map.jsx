import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Loader from './Loader';

// You'll need to set your Mapbox token here or via environment variable
// For demo purposes, using a placeholder. Replace with your actual token.
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const Map = ({ latitude, longitude, fullAddress, className = '' }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Validate coordinates first
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (!mapContainer.current) {
      return;
    }

    if (!latitude || !longitude || isNaN(lat) || isNaN(lng)) {
      setError('Invalid coordinates');
      setLoading(false);
      return;
    }

    // Only initialize once
    if (initialized.current && map.current) {
      // Update marker position if coordinates changed
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
        map.current.setCenter([lng, lat]);
      }
      return;
    }

    // Initialize map only once
    if (!map.current && !initialized.current) {
      initialized.current = true;
      
      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [lng, lat],
          zoom: 13,
          attributionControl: false,
        });

        // Add navigation controls
        const nav = new mapboxgl.NavigationControl();
        map.current.addControl(nav, 'top-right');

        map.current.on('load', () => {
          setLoading(false);
          
          // Add marker after map loads
          if (!marker.current) {
            marker.current = new mapboxgl.Marker({
              color: '#3B82F6',
              scale: 1.2,
            })
              .setLngLat([lng, lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25, closeOnClick: false })
                  .setHTML(
                    `<div class="p-3"><strong class="text-gray-900">${fullAddress || 'Location'}</strong></div>`
                  )
              )
              .addTo(map.current);
            
            // Open popup by default
            setTimeout(() => {
              if (marker.current) {
                marker.current.togglePopup();
              }
            }, 500);
          }
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
          setError('Unable to load map. Please check your Mapbox token.');
          setLoading(false);
        });

        // Timeout fallback
        const timeout = setTimeout(() => {
          setError('Map is taking longer than expected to load.');
          setLoading(false);
        }, 10000);

        return () => {
          clearTimeout(timeout);
        };
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Unable to initialize map. Please check your Mapbox configuration.');
        setLoading(false);
        initialized.current = false;
      }
    }

    // Cleanup on unmount
    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
        initialized.current = false;
      }
    };
  }, [latitude, longitude, fullAddress]);

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 text-center ${className}`} style={{ minHeight: '300px' }}>
        <div className="flex flex-col items-center justify-center h-full">
          <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-700 font-semibold">{error}</p>
          <p className="text-red-600 text-sm mt-2">Please check your internet connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ minHeight: '300px' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl z-10">
          <div className="text-center">
            <Loader size="lg" />
            <p className="mt-4 text-gray-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default Map;

