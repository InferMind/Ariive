"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface GPSContextType {
  currentLocation: GPSLocation | null
  isTracking: boolean
  hasPermission: boolean
  error: string | null
  startTracking: () => Promise<void>
  stopTracking: () => void
  requestPermission: () => Promise<boolean>
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
}

const GPSContext = createContext<GPSContextType | undefined>(undefined)

export function GPSProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)

  // Simulate GPS movement for demo
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setCurrentLocation((prev) => {
          if (!prev) {
            return {
              latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
              longitude: -74.006 + (Math.random() - 0.5) * 0.01,
              accuracy: 5,
              timestamp: Date.now(),
            }
          }
          return {
            ...prev,
            latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
            longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
            timestamp: Date.now(),
          }
        })
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isTracking])

  const requestPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return false
    }

    try {
      // Request permission
      const permission = await navigator.permissions.query({ name: "geolocation" })
      if (permission.state === "granted" || permission.state === "prompt") {
        setHasPermission(true)
        setError(null)
        return true
      } else {
        setError("Location permission denied")
        return false
      }
    } catch (err) {
      // Fallback for browsers that don't support permissions API
      setHasPermission(true)
      return true
    }
  }

  const startTracking = async () => {
    if (!hasPermission) {
      const granted = await requestPermission()
      if (!granted) return
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported")
      return
    }

    setIsTracking(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }

    const successCallback = (position: GeolocationPosition) => {
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now(),
      })
    }

    const errorCallback = (error: GeolocationPositionError) => {
      setError(`GPS Error: ${error.message}`)
      setIsTracking(false)
    }

    // Try to get current position first
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)

    // Then start watching position
    const id = navigator.geolocation.watchPosition(successCallback, errorCallback, options)
    setWatchId(id)
  }

  const stopTracking = () => {
    setIsTracking(false)
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <GPSContext.Provider
      value={{
        currentLocation,
        isTracking,
        hasPermission,
        error,
        startTracking,
        stopTracking,
        requestPermission,
        calculateDistance,
      }}
    >
      {children}
    </GPSContext.Provider>
  )
}

export function useGPS() {
  const context = useContext(GPSContext)
  if (context === undefined) {
    throw new Error("useGPS must be used within a GPSProvider")
  }
  return context
}
