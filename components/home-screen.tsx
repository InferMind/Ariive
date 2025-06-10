"use client"

import { Plus, Settings, MapPin, Clock, Crown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AlarmCard } from "@/components/alarm-card"
import { useAlarms } from "@/contexts/alarm-context"
import { useGPS } from "@/contexts/gps-context"
import { useNotifications } from "@/contexts/notification-context"
import { useAuth } from "@/contexts/auth-context"
import { useStripe } from "@/contexts/stripe-context"
import { useEffect } from "react"

interface HomeScreenProps {
  onNavigate: (screen: "home" | "add" | "edit" | "settings" | "history" | "subscription", alarmId?: string) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { alarms } = useAlarms()
  const { user, logout } = useAuth()
  const { startTracking, stopTracking, isTracking, requestPermission } = useGPS()
  const { requestPermission: requestNotificationPermission } = useNotifications()
  const { currentSubscription, plans } = useStripe()
  const currentPlan = plans.find((p) => p.id === currentSubscription?.planId)
  const isFreePlan = !currentSubscription || currentSubscription.planId === "free"

  useEffect(() => {
    // Request permissions and start tracking when component mounts
    const initializeServices = async () => {
      await requestPermission()
      await requestNotificationPermission()
      await startTracking()
    }

    initializeServices()

    return () => {
      stopTracking()
    }
  }, [])

  const handleEditAlarm = (alarmId: string) => {
    onNavigate("edit", alarmId)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Arriive</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Welcome, {user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("history")} className="rounded-full">
            <Clock className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onNavigate("settings")} className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* GPS Status */}
      {!isTracking && (
        <div className="mx-4 mb-4 p-3 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg animate-pulse">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            GPS tracking is disabled. Enable location services for accurate alerts.
          </p>
        </div>
      )}

      {/* Upgrade Prompt for Free Users */}
      {isFreePlan && alarms.length >= (user?.maxAlarms || 3) && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg animate-pulse">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-purple-600" />
            <div className="flex-1">
              <p className="font-semibold text-purple-800 dark:text-purple-200">Upgrade to Premium</p>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                You've reached your alarm limit. Upgrade for more alarms and features.
              </p>
            </div>
            <Button onClick={() => onNavigate("subscription")} size="sm" className="bg-purple-600 hover:bg-purple-700">
              Upgrade
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MapPin className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No Alarms Set</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Create your first location-based alarm to get notified when you're near your destination.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Active Alarms ({alarms.filter((a) => a.isActive).length})
            </h2>
            {alarms.map((alarm) => (
              <AlarmCard key={alarm.id} alarm={alarm} onEdit={handleEditAlarm} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6">
        <Button
          onClick={() => onNavigate("add")}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
