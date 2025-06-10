"use client"

import { ArrowLeft, User, Bell, MapPin, Moon, Shield, Info, CreditCard, Edit, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { BillingManagement } from "@/components/billing-management"
import { useStripe } from "@/contexts/stripe-context"
import { useAuth } from "@/contexts/auth-context"
import type { Screen } from "@/app/page"

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { theme, setTheme } = useTheme()
  const { currentSubscription, plans } = useStripe()
  const { user, logout } = useAuth()
  const currentPlan = plans.find((p) => p.id === currentSubscription?.planId)

  const handleLogout = () => {
    logout()
    onNavigate("login")
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("home")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Profile */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name || "User"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  {user?.location && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("profile")}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alarm Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Alarm Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Silent Mode Override</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ring even when phone is silent</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Vibration</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vibrate when alarm triggers</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Default Distance Unit</p>
              <Select defaultValue="km">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="miles">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Current Plan: {currentPlan?.name || "Free"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentPlan?.price ? `$${currentPlan.price}/${currentPlan.interval}` : "No subscription"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("subscription")}>
                Manage
              </Button>
            </div>
            <BillingManagement />
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Location Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">High Accuracy Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use GPS for precise tracking</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Background Tracking</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track location when app is closed</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-2">Theme</p>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="animate-slide-up" style={{ animationDelay: "500ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Location History</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Save location data for analytics</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">
              Clear Location Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="animate-slide-up" style={{ animationDelay: "600ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-600" />
              About Arriive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Build</span>
              <span className="font-medium">2024.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Platform</span>
              <span className="font-medium">React Native</span>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="animate-slide-up" style={{ animationDelay: "700ms" }}>
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
