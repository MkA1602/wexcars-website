"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    google: any
    googleMapsLoading?: boolean
    googleMapsLoaded?: boolean
  }
}

interface GoogleMapProps {
  className?: string
  height?: string
}

export default function GoogleMap({ className = "", height = "400px" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return

      try {
        // WexCars location in Malmö, Sweden
        const wexCarsLocation = {
          lat: 55.5893, // Malmö latitude
          lng: 13.0004, // Malmö longitude
        }

        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: wexCarsLocation,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.arterial",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#dadada" }],
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#757575" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }],
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "off" }],
            },
          ],
        })

        // Add custom marker
        const marker = new window.google.maps.Marker({
          position: wexCarsLocation,
          map: map,
          title: "WexCars - Luxury Car Experience",
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#1a365d" stroke="#ffffff" stroke-width="4"/>
                <path d="M12 18L20 12L28 18V28C28 28.5523 27.5523 29 27 29H13C12.4477 29 12 28.5523 12 28V18Z" fill="white"/>
                <path d="M18 29V22H22V29" fill="#1a365d"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 40),
          },
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 10px 0; color: #1a365d; font-size: 16px;">WexCars</h3>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
                <strong>Address:</strong><br>
                Docentgatan 2E<br>
                21552 Malmö, Sweden
              </p>
              <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">
                <strong>Phone:</strong> +46 737 200588
              </p>
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Email:</strong> info@wexcars.com
              </p>
            </div>
          `,
        })

        // Open info window when marker is clicked
        marker.addListener("click", () => {
          infoWindow.open(map, marker)
        })

        // Auto-open info window after 1 second
        setTimeout(() => {
          infoWindow.open(map, marker)
        }, 1000)

        setIsLoading(false)
        setMapError(null)
      } catch (error) {
        console.error("Error initializing Google Maps:", error)
        setMapError("Failed to initialize map")
        setIsLoading(false)
      }
    }

    // Load Google Maps script with proper duplicate prevention
    const loadGoogleMaps = () => {
      // If Google Maps is already loaded, initialize immediately
      if (window.google && window.google.maps) {
        console.log("Google Maps already loaded, initializing...")
        initMap()
        return
      }

      // If script is currently loading, wait for it
      if (window.googleMapsLoading) {
        console.log("Google Maps script is already loading, waiting...")
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval)
            initMap()
          } else if (!window.googleMapsLoading) {
            // Loading failed
            clearInterval(checkInterval)
            setMapError("Failed to load Google Maps")
            setIsLoading(false)
          }
        }, 100)
        return
      }

      // Check if script already exists in the DOM
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        console.log("Google Maps script already exists in DOM, waiting for load...")
        window.googleMapsLoading = true
        existingScript.addEventListener('load', () => {
          window.googleMapsLoading = false
          window.googleMapsLoaded = true
          initMap()
        })
        existingScript.addEventListener('error', () => {
          window.googleMapsLoading = false
          setMapError("Failed to load Google Maps script")
          setIsLoading(false)
        })
        return
      }

      // Load the script for the first time
      console.log("Loading Google Maps script for the first time...")
      window.googleMapsLoading = true

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn("Google Maps API key not configured")
        setMapError("Google Maps API key not configured")
        setIsLoading(false)
        window.googleMapsLoading = false
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log("Google Maps script loaded successfully")
        window.googleMapsLoading = false
        window.googleMapsLoaded = true
        initMap()
      }
      script.onerror = () => {
        console.error("Failed to load Google Maps script")
        window.googleMapsLoading = false
        setMapError("Failed to load Google Maps")
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  if (isLoading) {
    return (
      <div 
        className={`w-full bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div 
        className={`w-full bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-600">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm">{mapError}</p>
          <p className="text-xs mt-1">Please check your internet connection</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      className={`w-full bg-gray-200 rounded-xl overflow-hidden shadow-lg ${className}`}
      style={{ height }}
    />
  )
} 