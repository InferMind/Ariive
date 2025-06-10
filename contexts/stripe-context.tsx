"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  maxAlarms: number
  stripePriceId: string
  popular?: boolean
}

export interface PaymentMethod {
  id: string
  type: "card"
  card: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  isDefault: boolean
}

export interface Invoice {
  id: string
  amount: number
  status: "paid" | "pending" | "failed"
  date: Date
  planName: string
  downloadUrl?: string
}

interface StripeContextType {
  plans: SubscriptionPlan[]
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
  currentSubscription: {
    planId: string
    status: "active" | "canceled" | "past_due"
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
  } | null
  isLoading: boolean
  createSubscription: (planId: string, paymentMethodId: string) => Promise<boolean>
  cancelSubscription: () => Promise<boolean>
  resumeSubscription: () => Promise<boolean>
  addPaymentMethod: (cardDetails: any) => Promise<boolean>
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>
  updateSubscription: (planId: string) => Promise<boolean>
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export function StripeProvider({ children }: { children: ReactNode }) {
  const { user, updateSubscription: updateUserSubscription } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      interval: "month",
      features: ["3 Location Alarms", "Basic GPS Tracking", "Standard Notifications"],
      maxAlarms: 3,
      stripePriceId: "",
    },
    {
      id: "premium",
      name: "Premium",
      price: 4.99,
      interval: "month",
      features: [
        "10 Location Alarms",
        "High-Accuracy GPS",
        "Priority Notifications",
        "Alarm History",
        "Custom Alarm Tones",
      ],
      maxAlarms: 10,
      stripePriceId: "price_premium_monthly",
      popular: true,
    },
    {
      id: "premium_yearly",
      name: "Premium",
      price: 49.99,
      interval: "year",
      features: [
        "10 Location Alarms",
        "High-Accuracy GPS",
        "Priority Notifications",
        "Alarm History",
        "Custom Alarm Tones",
        "2 Months Free",
      ],
      maxAlarms: 10,
      stripePriceId: "price_premium_yearly",
    },
    {
      id: "pro",
      name: "Pro",
      price: 9.99,
      interval: "month",
      features: [
        "Unlimited Alarms",
        "Ultra-High Accuracy GPS",
        "Instant Notifications",
        "Advanced Analytics",
        "Team Sharing",
        "Priority Support",
      ],
      maxAlarms: 999,
      stripePriceId: "price_pro_monthly",
    },
    {
      id: "pro_yearly",
      name: "Pro",
      price: 99.99,
      interval: "year",
      features: [
        "Unlimited Alarms",
        "Ultra-High Accuracy GPS",
        "Instant Notifications",
        "Advanced Analytics",
        "Team Sharing",
        "Priority Support",
        "2 Months Free",
      ],
      maxAlarms: 999,
      stripePriceId: "price_pro_yearly",
    },
  ]

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      card: {
        brand: "visa",
        last4: "4242",
        expMonth: 12,
        expYear: 2025,
      },
      isDefault: true,
    },
  ])

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv_1",
      amount: 4.99,
      status: "paid",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      planName: "Premium Monthly",
      downloadUrl: "#",
    },
    {
      id: "inv_2",
      amount: 4.99,
      status: "paid",
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      planName: "Premium Monthly",
      downloadUrl: "#",
    },
  ])

  const [currentSubscription, setCurrentSubscription] = useState<{
    planId: string
    status: "active" | "canceled" | "past_due"
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
  } | null>({
    planId: "premium",
    status: "active",
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
  })

  const createSubscription = async (planId: string, paymentMethodId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate Stripe API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, you would:
      // const stripe = await stripePromise
      // const { error } = await stripe.confirmCardPayment(clientSecret)

      const plan = plans.find((p) => p.id === planId)
      if (plan) {
        setCurrentSubscription({
          planId,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + (plan.interval === "year" ? 365 : 30) * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
        })

        // Update user subscription tier
        const tier = planId.includes("pro") ? "pro" : planId.includes("premium") ? "premium" : "free"
        updateUserSubscription(tier as "free" | "premium" | "pro")

        // Add invoice
        setInvoices((prev) => [
          {
            id: `inv_${Date.now()}`,
            amount: plan.price,
            status: "paid",
            date: new Date(),
            planName: `${plan.name} ${plan.interval === "year" ? "Yearly" : "Monthly"}`,
            downloadUrl: "#",
          },
          ...prev,
        ])
      }

      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const cancelSubscription = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentSubscription((prev) =>
        prev
          ? {
              ...prev,
              cancelAtPeriodEnd: true,
            }
          : null,
      )

      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const resumeSubscription = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentSubscription((prev) =>
        prev
          ? {
              ...prev,
              cancelAtPeriodEnd: false,
            }
          : null,
      )

      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const addPaymentMethod = async (cardDetails: any): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newPaymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        card: {
          brand: cardDetails.brand || "visa",
          last4: cardDetails.last4 || "0000",
          expMonth: cardDetails.expMonth || 12,
          expYear: cardDetails.expYear || 2025,
        },
        isDefault: paymentMethods.length === 0,
      }

      setPaymentMethods((prev) => [...prev, newPaymentMethod])
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const removePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== paymentMethodId))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPaymentMethods((prev) =>
        prev.map((pm) => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        })),
      )
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const updateSubscription = async (planId: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const plan = plans.find((p) => p.id === planId)
      if (plan && currentSubscription) {
        setCurrentSubscription({
          ...currentSubscription,
          planId,
        })

        const tier = planId.includes("pro") ? "pro" : planId.includes("premium") ? "premium" : "free"
        updateUserSubscription(tier as "free" | "premium" | "pro")
      }

      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  return (
    <StripeContext.Provider
      value={{
        plans,
        paymentMethods,
        invoices,
        currentSubscription,
        isLoading,
        createSubscription,
        cancelSubscription,
        resumeSubscription,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPaymentMethod,
        updateSubscription,
      }}
    >
      {children}
    </StripeContext.Provider>
  )
}

export function useStripe() {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error("useStripe must be used within a StripeProvider")
  }
  return context
}
