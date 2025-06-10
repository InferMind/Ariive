"use client"

import { useState } from "react"
import { ArrowLeft, User, Camera, Save, MapPin, Phone, Mail, Globe, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import type { Screen } from "@/app/page"

interface ProfileEditScreenProps {
  onNavigate: (screen: Screen) => void
}

export function ProfileEditScreen({ onNavigate }: ProfileEditScreenProps) {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [location, setLocation] = useState(user?.location || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [timezone, setTimezone] = useState(user?.timezone || "UTC-5")
  const [language, setLanguage] = useState(user?.language || "en")

  const handleSave = async () => {
    setIsLoading(true)

    try {
      await updateProfile({
        name,
        email,
        phone,
        location,
        bio,
        timezone,
        language,
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onNavigate("settings")
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker
    console.log("Avatar upload clicked")
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-slide-down">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("settings")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Avatar Section */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={handleAvatarUpload}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tap the camera icon to change your photo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city, country"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  className="mt-1 min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timezone
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC-12">UTC-12 (Baker Island)</SelectItem>
                  <SelectItem value="UTC-11">UTC-11 (American Samoa)</SelectItem>
                  <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                  <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                  <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                  <SelectItem value="UTC-7">UTC-7 (Mountain Time)</SelectItem>
                  <SelectItem value="UTC-6">UTC-6 (Central Time)</SelectItem>
                  <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                  <SelectItem value="UTC-4">UTC-4 (Atlantic Time)</SelectItem>
                  <SelectItem value="UTC-3">UTC-3 (Argentina)</SelectItem>
                  <SelectItem value="UTC-2">UTC-2 (South Georgia)</SelectItem>
                  <SelectItem value="UTC-1">UTC-1 (Azores)</SelectItem>
                  <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                  <SelectItem value="UTC+1">UTC+1 (Central Europe)</SelectItem>
                  <SelectItem value="UTC+2">UTC+2 (Eastern Europe)</SelectItem>
                  <SelectItem value="UTC+3">UTC+3 (Moscow)</SelectItem>
                  <SelectItem value="UTC+4">UTC+4 (Dubai)</SelectItem>
                  <SelectItem value="UTC+5">UTC+5 (Pakistan)</SelectItem>
                  <SelectItem value="UTC+6">UTC+6 (Bangladesh)</SelectItem>
                  <SelectItem value="UTC+7">UTC+7 (Thailand)</SelectItem>
                  <SelectItem value="UTC+8">UTC+8 (China)</SelectItem>
                  <SelectItem value="UTC+9">UTC+9 (Japan)</SelectItem>
                  <SelectItem value="UTC+10">UTC+10 (Australia East)</SelectItem>
                  <SelectItem value="UTC+11">UTC+11 (Solomon Islands)</SelectItem>
                  <SelectItem value="UTC+12">UTC+12 (New Zealand)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Subscription</span>
              <span className="font-medium capitalize">{user?.subscriptionTier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Max Alarms</span>
              <span className="font-medium">{user?.maxAlarms}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
              <span className="font-medium">December 2024</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Button
          onClick={handleSave}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
          disabled={isLoading}
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
