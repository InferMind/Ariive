"use client"

import { ArrowLeft, Clock, MapPin, Target, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useHistory } from "@/contexts/history-context"
import type { Screen } from "@/app/page"

interface HistoryScreenProps {
  onNavigate: (screen: Screen) => void
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const { history, getHistoryStats, clearHistory } = useHistory()
  const stats = getHistoryStats()

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const formatResponseTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-down">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("home")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Alarm History</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5" />
                <span className="text-sm font-medium">Total Triggered</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalTriggered}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Avg Response</span>
              </div>
              <p className="text-2xl font-bold">
                {stats.averageResponseTime > 0 ? formatResponseTime(stats.averageResponseTime) : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Top Destination</span>
              </div>
              <p className="text-sm font-bold truncate">{stats.mostUsedDestination}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-medium">This Week</span>
              </div>
              <p className="text-2xl font-bold">{stats.thisWeekCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card className="animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            {history.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearHistory} className="text-red-600 hover:text-red-700">
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No alarm history yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Your triggered alarms will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-md animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{entry.alarmName}</h3>
                        <Badge
                          variant={
                            entry.status === "dismissed"
                              ? "default"
                              : entry.status === "triggered"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{entry.destination}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(entry.triggeredAt)}</span>
                        <span>Distance: {entry.actualDistance.toFixed(1)}km</span>
                        {entry.responseTime && <span>Response: {formatResponseTime(entry.responseTime)}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.actualDistance.toFixed(1)}km
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Target: {entry.targetDistance}km</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
