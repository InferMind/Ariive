"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface AlarmHistoryEntry {
  id: string
  alarmId: string
  alarmName: string
  destination: string
  triggeredAt: Date
  actualDistance: number
  targetDistance: number
  responseTime?: number // Time taken to dismiss alarm
  status: "triggered" | "dismissed" | "missed"
}

interface HistoryContextType {
  history: AlarmHistoryEntry[]
  addHistoryEntry: (entry: Omit<AlarmHistoryEntry, "id">) => void
  clearHistory: () => void
  getHistoryStats: () => {
    totalTriggered: number
    averageResponseTime: number
    mostUsedDestination: string
    thisWeekCount: number
  }
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<AlarmHistoryEntry[]>([])

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = localStorage.getItem("location-alarm-history")
    if (storedHistory) {
      const parsed = JSON.parse(storedHistory)
      setHistory(
        parsed.map((entry: any) => ({
          ...entry,
          triggeredAt: new Date(entry.triggeredAt),
        })),
      )
    } else {
      // Add some mock history data
      const mockHistory: AlarmHistoryEntry[] = [
        {
          id: "1",
          alarmId: "alarm_1",
          alarmName: "Home Arrival",
          destination: "123 Main St",
          triggeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          actualDistance: 4.8,
          targetDistance: 5,
          responseTime: 3000,
          status: "dismissed",
        },
        {
          id: "2",
          alarmId: "alarm_2",
          alarmName: "Office Stop",
          destination: "456 Business Ave",
          triggeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          actualDistance: 2.9,
          targetDistance: 3,
          responseTime: 1500,
          status: "dismissed",
        },
        {
          id: "3",
          alarmId: "alarm_1",
          alarmName: "Home Arrival",
          destination: "123 Main St",
          triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          actualDistance: 5.2,
          targetDistance: 5,
          status: "missed",
        },
      ]
      setHistory(mockHistory)
    }
  }, [])

  useEffect(() => {
    // Save history to localStorage whenever it changes
    localStorage.setItem("location-alarm-history", JSON.stringify(history))
  }, [history])

  const addHistoryEntry = (entry: Omit<AlarmHistoryEntry, "id">) => {
    const newEntry: AlarmHistoryEntry = {
      ...entry,
      id: Date.now().toString(),
    }
    setHistory((prev) => [newEntry, ...prev])
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("location-alarm-history")
  }

  const getHistoryStats = () => {
    const totalTriggered = history.length
    const dismissedEntries = history.filter((entry) => entry.status === "dismissed" && entry.responseTime)
    const averageResponseTime =
      dismissedEntries.length > 0
        ? dismissedEntries.reduce((sum, entry) => sum + (entry.responseTime || 0), 0) / dismissedEntries.length
        : 0

    const destinationCounts = history.reduce(
      (acc, entry) => {
        acc[entry.destination] = (acc[entry.destination] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mostUsedDestination = Object.entries(destinationCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const thisWeekCount = history.filter((entry) => entry.triggeredAt > oneWeekAgo).length

    return {
      totalTriggered,
      averageResponseTime,
      mostUsedDestination,
      thisWeekCount,
    }
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistoryEntry,
        clearHistory,
        getHistoryStats,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
