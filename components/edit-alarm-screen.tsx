"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Search, Volume2, Target, Save, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useAlarms, type Alarm } from "@/contexts/alarm-context"
import type { Screen } from "@/app/page"
import { CustomRingtonePicker } from "@/components/custom-ringtone-picker"

interface EditAlarmScreenProps {
  onNavigate: (screen: Screen) => void
  alarmId: string
}

export function EditAlarmScreen({ onNavigate, alarmId }: EditAlarmScreenProps) {
  const { alarms, updateAlarm, deleteAlarm } = useAlarms()
  const [alarmName, setAlarmName] = useState("")
  const [destination, setDestination] = useState("")
  const [proximityDistance, setProximityDistance] = useState([5])
  const [alarmTone, setAlarmTone] = useState("Default")
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const currentAlarm = alarms.find((alarm) => alarm.id === alarmId)

  useEffect(() => {
    if (currentAlarm) {
      setAlarmName(currentAlarm.name)
      setDestination(currentAlarm.destination.name)
      setProximityDistance([currentAlarm.proximityDistance])
      setAlarmTone(currentAlarm.alarmTone)
      setIsActive(currentAlarm.isActive)
    }
  }, [currentAlarm])

  if (!currentAlarm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Alarm Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The alarm you're trying to edit doesn't exist.</p>
          <Button onClick={() => onNavigate("home")}>Go Back Home</Button>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    if (alarmName && destination) {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedAlarm: Partial<Alarm> = {
        name: alarmName,
        destination: {
          name: destination,
          address: `${destination}, City`,
          lat: currentAlarm.destination.lat + (Math.random() - 0.5) * 0.001,
          lng: currentAlarm.destination.lng + (Math.random() - 0.5) * 0.001,
        },
        proximityDistance: proximityDistance[0],
        alarmTone,
        isActive,
      }

      updateAlarm(alarmId, updatedAlarm)
      setIsLoading(false)
      onNavigate("home")
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    deleteAlarm(alarmId)
    setIsLoading(false)
    onNavigate("home")
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true)
    setTimeout(() => {
      if (showDeleteConfirm) {
        handleDelete()
      }
    }, 3000) // Auto-cancel after 3 seconds
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-down">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("home")} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Alarm</h1>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteConfirm}
          className={`rounded-full transition-all duration-300 ${
            showDeleteConfirm
              ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse"
              : "text-red-600 hover:bg-red-50"
          }`}
          disabled={isLoading}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mx-4 mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slide-down">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">Delete this alarm?</p>
              <p className="text-sm text-red-600 dark:text-red-300">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Alarm Status */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              Alarm Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{isActive ? "Active" : "Inactive"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isActive
                    ? "This alarm will trigger when you approach the destination"
                    : "This alarm is currently disabled"}
                </p>
              </div>
              <Button
                onClick={() => setIsActive(!isActive)}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`transition-all duration-300 ${
                  isActive ? "bg-green-600 hover:bg-green-700" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {isActive ? "Disable" : "Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alarm Details */}
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Alarm Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="alarm-name">Alarm Name</Label>
              <Input
                id="alarm-name"
                placeholder="e.g., Home Arrival, Office Stop"
                value={alarmName}
                onChange={(e) => setAlarmName(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for a place or address"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Current Location Display */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Location</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{currentAlarm.destination.address}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Coordinates: {currentAlarm.destination.lat.toFixed(4)}, {currentAlarm.destination.lng.toFixed(4)}
              </div>
            </div>

            {/* Mock Map */}
            <div className="mt-4 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20" />
              <div className="text-center z-10">
                <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2 animate-bounce" />
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {destination || "Current Destination"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Map preview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proximity Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Alert Distance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Alert me when I'm {proximityDistance[0]} km away</Label>
              <div className="mt-3">
                <Slider
                  value={proximityDistance}
                  onValueChange={setProximityDistance}
                  max={20}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km</span>
                  <span className="font-medium text-orange-600">{proximityDistance[0]} km</span>
                  <span>20 km</span>
                </div>
              </div>
            </div>

            {/* Distance Visualization */}
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Alert Zone</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                You'll be notified when you're within {proximityDistance[0]} km of your destination.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alarm Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-purple-600" />
              Alarm Sound
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CustomRingtonePicker
              selectedRingtone={alarmTone}
              onRingtoneSelect={setAlarmTone}
            />

            {/* Sound Preview */}
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Preview Sound</span>
              </div>
              <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                Play
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Distance Info */}
        {currentAlarm.currentDistance && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 animate-fade-in-delayed">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Current Status</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    You are currently {currentAlarm.currentDistance.toFixed(1)} km away
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">ETA: {currentAlarm.eta}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${
                      currentAlarm.currentDistance <= proximityDistance[0]
                        ? "text-red-600 animate-pulse"
                        : "text-blue-600"
                    }`}
                  >
                    {currentAlarm.currentDistance.toFixed(1)}km
                  </div>
                  {currentAlarm.currentDistance <= proximityDistance[0] && (
                    <div className="text-xs text-red-600 font-medium">IN RANGE!</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Save Button */}
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Button
          onClick={handleSave}
          className="w-full h-12 bg-amber-600 hover:bg-amber-700 transition-all duration-200 transform hover:scale-105"
          disabled={!alarmName || !destination || isLoading}
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Changes...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save Changes
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
