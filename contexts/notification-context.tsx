"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface NotificationContextType {
  hasPermission: boolean
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, body: string, options?: NotificationOptions) => void
  isSupported: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [hasPermission, setHasPermission] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported("Notification" in window)
    if ("Notification" in window) {
      setHasPermission(Notification.permission === "granted")
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn("Notifications are not supported in this browser")
      return false
    }

    if (Notification.permission === "granted") {
      setHasPermission(true)
      return true
    }

    if (Notification.permission === "denied") {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      setHasPermission(granted)
      return granted
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  const sendNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (!hasPermission || !isSupported) {
      console.warn("Cannot send notification: permission not granted or not supported")
      return
    }

    const defaultOptions: NotificationOptions = {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "location-alarm",
      requireInteraction: true,
      ...options,
    }

    try {
      const notification = new Notification(title, defaultOptions)

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close()
      }, 10000)
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        hasPermission,
        requestPermission,
        sendNotification,
        isSupported,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
