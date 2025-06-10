"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useGPS } from "@/contexts/gps-context"
import { useNotifications } from "@/contexts/notification-context"
import { useHistory } from "@/contexts/history-context"

export interface Alarm {
  id: string
  name: string
  destination: {
    name: string
    address: string
    lat: number
    lng: number
  }
  proximityDistance: number
  isActive: boolean
  alarmTone: string
  currentDistance?: number
  eta?: string
}

interface AlarmContextType {
  alarms: Alarm[]
  addAlarm: (alarm: Omit<Alarm, "id">) => void
  updateAlarm: (id: string, updates: Partial<Alarm>) => void
  toggleAlarm: (id: string) => void
  deleteAlarm: (id: string) => void
  updateAlarmDistance: (id: string, distance: number) => void
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined)

export function AlarmProvider({ children }: { children: ReactNode }) {
  const { currentLocation, calculateDistance } = useGPS()
  const { sendNotification, hasPermission } = useNotifications()
  const { addHistoryEntry } = useHistory()

  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "1",
      name: "Home Arrival",
      destination: {
        name: "Home",
        address: "123 Main St, City",
        lat: 40.7128,
        lng: -74.006,
      },
      proximityDistance: 5,
      isActive: true,
      alarmTone: "Default",
      currentDistance: 12.5,
      eta: "25 min",
    },
    {
      id: "2",
      name: "Office Stop",
      destination: {
        name: "Downtown Office",
        address: "456 Business Ave, City",
        lat: 40.7589,
        lng: -73.9851,
      },
      proximityDistance: 3,
      isActive: false,
      alarmTone: "Gentle Bell",
      currentDistance: 8.2,
      eta: "18 min",
    },
  ])

  // Real GPS tracking and alarm triggering
  useEffect(() => {
    if (currentLocation) {
      setAlarms((prev) =>
        prev.map((alarm) => {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            alarm.destination.lat,
            alarm.destination.lng,
          )

          const eta = `${Math.ceil(distance * 2)} min`

          // Check if alarm should trigger
          if (
            alarm.isActive &&
            distance <= alarm.proximityDistance &&
            alarm.currentDistance &&
            alarm.currentDistance > alarm.proximityDistance
          ) {
            // Trigger alarm
            if (hasPermission) {
              sendNotification(
                `🚨 ${alarm.name}`,
                `You're ${distance.toFixed(1)}km away from ${alarm.destination.name}`,
                {
                  tag: `alarm-${alarm.id}`,
                  requireInteraction: true,
                },
              )
            }

            // Add to history
            addHistoryEntry({
              alarmId: alarm.id,
              alarmName: alarm.name,
              destination: alarm.destination.address,
              triggeredAt: new Date(),
              actualDistance: distance,
              targetDistance: alarm.proximityDistance,
              status: "triggered",
            })
          }

          return {
            ...alarm,
            currentDistance: distance,
            eta,
          }
        }),
      )
    }
  }, [currentLocation, calculateDistance, sendNotification, hasPermission, addHistoryEntry])

  const addAlarm = (alarm: Omit<Alarm, "id">) => {
    const newAlarm = {
      ...alarm,
      id: Date.now().toString(),
      currentDistance: Math.random() * 20 + 5,
      eta: `${Math.ceil((Math.random() * 20 + 5) * 2)} min`,
    }
    setAlarms((prev) => [...prev, newAlarm])
  }

  const updateAlarm = (id: string, updates: Partial<Alarm>) => {
    setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, ...updates } : alarm)))
  }

  const toggleAlarm = (id: string) => {
    setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm)))
  }

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
  }

  const updateAlarmDistance = (id: string, distance: number) => {
    setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, currentDistance: distance } : alarm)))
  }

  return (
    <AlarmContext.Provider
      value={{
        alarms,
        addAlarm,
        updateAlarm,
        toggleAlarm,
        deleteAlarm,
        updateAlarmDistance,
      }}
    >
      {children}
    </AlarmContext.Provider>
  )
}

export function useAlarms() {
  const context = useContext(AlarmContext)
  if (context === undefined) {
    throw new Error("useAlarms must be used within an AlarmProvider")
  }
  return context
}
