"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/home-screen"
import { AddAlarmScreen } from "@/components/add-alarm-screen"
import { EditAlarmScreen } from "@/components/edit-alarm-screen"
import { SettingsScreen } from "@/components/settings-screen"
import { HistoryScreen } from "@/components/history-screen"
import { ProfileEditScreen } from "@/components/profile-edit-screen"
import { LoginScreen } from "@/components/login-screen"
import { SignupScreen } from "@/components/signup-screen"
import { AlarmProvider } from "@/contexts/alarm-context"
import { AuthProvider } from "@/contexts/auth-context"
import { GPSProvider } from "@/contexts/gps-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { HistoryProvider } from "@/contexts/history-context"
import { ThemeProvider } from "@/components/theme-provider"
import { StripeProvider } from "@/contexts/stripe-context"
import { SubscriptionPlans } from "@/components/subscription-plans"

export type Screen = "home" | "add" | "edit" | "settings" | "history" | "profile" | "login" | "signup" | "subscription"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null)

  const handleNavigate = (screen: Screen, alarmId?: string) => {
    if (screen === "edit" && alarmId) {
      setEditingAlarmId(alarmId)
    }
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={handleNavigate} />
      case "add":
        return <AddAlarmScreen onNavigate={setCurrentScreen} />
      case "edit":
        return editingAlarmId ? (
          <EditAlarmScreen onNavigate={setCurrentScreen} alarmId={editingAlarmId} />
        ) : (
          <HomeScreen onNavigate={handleNavigate} />
        )
      case "settings":
        return <SettingsScreen onNavigate={setCurrentScreen} />
      case "history":
        return <HistoryScreen onNavigate={setCurrentScreen} />
      case "profile":
        return <ProfileEditScreen onNavigate={setCurrentScreen} />
      case "login":
        return <LoginScreen onNavigate={setCurrentScreen} />
      case "signup":
        return <SignupScreen onNavigate={setCurrentScreen} />
      case "subscription":
        return <SubscriptionPlans onNavigate={setCurrentScreen} onBack={() => setCurrentScreen("settings")} />
      default:
        return <LoginScreen onNavigate={setCurrentScreen} />
    }
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="arriive-theme">
      <AuthProvider>
        <StripeProvider>
          <GPSProvider>
            <NotificationProvider>
              <HistoryProvider>
                <AlarmProvider>
                  <div className="min-h-screen bg-background overflow-hidden">
                    <div className="transition-all duration-500 ease-in-out">{renderScreen()}</div>
                  </div>
                </AlarmProvider>
              </HistoryProvider>
            </NotificationProvider>
          </GPSProvider>
        </StripeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
