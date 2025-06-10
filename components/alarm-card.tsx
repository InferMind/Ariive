"use client"

import { useState } from "react"
import { MapPin, Clock, Trash2, Volume2, Edit, MoreVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAlarms, type Alarm } from "@/contexts/alarm-context"

interface AlarmCardProps {
  alarm: Alarm
  onEdit?: (alarmId: string) => void
}

export function AlarmCard({ alarm, onEdit }: AlarmCardProps) {
  const { toggleAlarm, deleteAlarm } = useAlarms()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      deleteAlarm(alarm.id)
    }, 300)
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(alarm.id)
    }
  }

  const isNearDestination = alarm.currentDistance && alarm.currentDistance <= alarm.proximityDistance

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg card-hover ${
        isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      } ${isNearDestination && alarm.isActive ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950 animate-pulse-glow" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{alarm.name}</h3>
              {isNearDestination && alarm.isActive && (
                <Badge variant="destructive" className="animate-pulse">
                  ALERT
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4" />
              <span>{alarm.destination.name}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{alarm.destination.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={alarm.isActive} onCheckedChange={() => toggleAlarm(alarm.id)} />

            {/* More Options Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Alarm
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Alarm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Distance</span>
            </div>
            <p
              className={`text-lg font-bold transition-colors ${
                isNearDestination && alarm.isActive ? "text-red-600 animate-pulse" : "text-gray-900 dark:text-white"
              }`}
            >
              {alarm.currentDistance?.toFixed(1)} km
            </p>
            <p className="text-xs text-gray-500">ETA: {alarm.eta}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Alert at</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{alarm.proximityDistance} km</p>
            <p className="text-xs text-gray-500">{alarm.alarmTone}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Current</span>
            <span>Alert Zone</span>
            <span>Destination</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isNearDestination && alarm.isActive ? "bg-red-500 animate-pulse" : "bg-blue-500"
              }`}
              style={{
                width: `${Math.max(10, Math.min(90, ((alarm.proximityDistance * 2 - (alarm.currentDistance || 0)) / (alarm.proximityDistance * 2)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Quick Edit Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>

          <div
            className={`text-xs px-2 py-1 rounded-full ${
              alarm.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {alarm.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
