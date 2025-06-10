"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import type { Screen } from "@/app/page"

interface SignupScreenProps {
  onNavigate: (screen: Screen) => void
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const success = await signup(email, password, name)
    if (success) {
      onNavigate("home")
    } else {
      setError("Failed to create account")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-6 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("login")}
            className="text-white hover:bg-white/10 mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-white mr-2" />
            <h1 className="text-xl font-bold text-white">Create Account</h1>
          </div>
        </div>

        {/* Signup Form */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Join LocationAlarm</CardTitle>
            <p className="text-center text-white/80">Start your journey with smart location alerts</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/90">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white/80"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              {error && <div className="text-red-300 text-sm text-center animate-shake">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-3 transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/80">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="text-white font-semibold p-0 h-auto hover:text-white/80"
                  onClick={() => onNavigate("login")}
                >
                  Sign In
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tiers Preview */}
        <div className="mt-6 text-center animate-fade-in-delayed">
          <p className="text-white/60 text-sm mb-3">Choose your plan after signup</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white/10 rounded-lg p-2 text-white/80">
              <p className="font-semibold">Free</p>
              <p>3 Alarms</p>
            </div>
            <div className="bg-white/20 rounded-lg p-2 text-white border border-white/30">
              <p className="font-semibold">Premium</p>
              <p>10 Alarms</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-white/80">
              <p className="font-semibold">Pro</p>
              <p>Unlimited</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
