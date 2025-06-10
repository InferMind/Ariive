"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Search, Volume2, Target } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useAlarms } from "@/contexts/alarm-context"
import { CustomRingtonePicker } from "@/components/custom-ringtone-picker"

interface AddAlarmScreenProps {
  onNavigate: (screen: "home" | "add" | "settings") => void
}

export function AddAlarmScreen({ onNavigate }: AddAlarmScreenProps) {
  const { addAlarm } = useAlarms()
  const [alarmName, setAlarmName] = useState("")
  const [destination, setDestination] = useState("")
  const [proximityDistance, setProximityDistance] = useState([5])
  const [alarmTone, setAlarmTone] = useState("Default")

  const handleSave = () => {
    if (alarmName && destination) {
      addAlarm({
        name: alarmName,
        destination: {
          name: destination,
          address: `${destination}, City`,
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.006 + (Math.random() - 0.5) * 0.1,
        },
        proximityDistance: proximityDistance[0],
        isActive: true,
        alarmTone,
      })
      onNavigate("home")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("home")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">New Alarm</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Alarm Name */}
        <Card>
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
        <Card>
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

            {/* Mock Map */}
            <div className="mt-4 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Map will show selected destination</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proximity Settings */}
        <Card>
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
                  <span>20 km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alarm Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-purple-600" />
              Alarm Sound
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomRingtonePicker
              selectedRingtone={alarmTone}
              onRingtoneSelect={setAlarmTone}
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Button
          onClick={handleSave}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700"
          disabled={!alarmName || !destination}
        >
          Create Alarm
        </Button>
      </div>
    </div>
  )
}
