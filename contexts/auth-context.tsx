"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  bio?: string
  timezone?: string
  language?: string
  avatar?: string
  subscriptionTier: "free" | "premium" | "pro"
  subscriptionExpiry?: Date
  maxAlarms: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  updateSubscription: (tier: "free" | "premium" | "pro") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("arriive-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication
    if (email && password) {
      const newUser: User = {
        id: "user_" + Date.now(),
        email,
        name: email.split("@")[0],
        subscriptionTier: "free",
        maxAlarms: 3,
        timezone: "UTC-5",
        language: "en",
      }
      setUser(newUser)
      localStorage.setItem("arriive-user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password && name) {
      const newUser: User = {
        id: "user_" + Date.now(),
        email,
        name,
        subscriptionTier: "free",
        maxAlarms: 3,
        timezone: "UTC-5",
        language: "en",
      }
      setUser(newUser)
      localStorage.setItem("arriive-user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("arriive-user")
  }

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("arriive-user", JSON.stringify(updatedUser))
    }
  }

  const updateSubscription = (tier: "free" | "premium" | "pro") => {
    if (user) {
      const maxAlarms = tier === "free" ? 3 : tier === "premium" ? 10 : 50
      const updatedUser = { ...user, subscriptionTier: tier, maxAlarms }
      setUser(updatedUser)
      localStorage.setItem("arriive-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        updateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
