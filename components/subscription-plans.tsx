"use client"

import { useState } from "react"
import { Check, Crown, Zap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useStripe } from "@/contexts/stripe-context"
import { useAuth } from "@/contexts/auth-context"
import { PaymentForm } from "@/components/payment-form"
import type { Screen } from "@/app/page"

interface SubscriptionPlansProps {
  onNavigate: (screen: Screen) => void
  onBack?: () => void
}

export function SubscriptionPlans({ onNavigate, onBack }: SubscriptionPlansProps) {
  const { plans, currentSubscription, createSubscription, updateSubscription, isLoading } = useStripe()
  const { user } = useAuth()
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const filteredPlans = plans.filter((plan) => {
    if (plan.id === "free") return true
    return isYearly ? plan.interval === "year" : plan.interval === "month"
  })

  const handleSelectPlan = (planId: string) => {
    if (planId === "free") {
      // Handle free plan selection
      return
    }

    if (currentSubscription && currentSubscription.planId !== "free") {
      // Update existing subscription
      updateSubscription(planId)
    } else {
      // New subscription
      setSelectedPlan(planId)
      setShowPaymentForm(true)
    }
  }

  const handlePaymentSuccess = async (paymentMethodId: string) => {
    if (selectedPlan) {
      const success = await createSubscription(selectedPlan, paymentMethodId)
      if (success) {
        setShowPaymentForm(false)
        setSelectedPlan(null)
        onNavigate("home")
      }
    }
  }

  const getCurrentPlanId = () => {
    if (!currentSubscription) return "free"
    return currentSubscription.planId
  }

  const getYearlySavings = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 10 // 2 months free
    const monthlySavings = (monthlyPrice * 12 - yearlyPrice) / 12
    return monthlySavings.toFixed(2)
  }

  if (showPaymentForm && selectedPlan) {
    const plan = plans.find((p) => p.id === selectedPlan)
    return (
      <PaymentForm
        plan={plan!}
        onSuccess={handlePaymentSuccess}
        onCancel={() => {
          setShowPaymentForm(false)
          setSelectedPlan(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 pt-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Billing Toggle */}
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : ""}>
                Monthly
              </Label>
              <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
              <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : ""}>
                Yearly
              </Label>
              {isYearly && <Badge className="bg-green-100 text-green-800">Save 17%</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="space-y-4">
          {filteredPlans.map((plan, index) => {
            const isCurrentPlan = getCurrentPlanId() === plan.id
            const isPremium = plan.id.includes("premium")
            const isPro = plan.id.includes("pro")

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 animate-slide-up ${
                  plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                } ${isCurrentPlan ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isPro && <Crown className="h-5 w-5 text-yellow-500" />}
                      {isPremium && <Zap className="h-5 w-5 text-blue-500" />}
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                    </div>
                    {isCurrentPlan && <Badge variant="secondary">Current Plan</Badge>}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">
                        /{plan.interval === "year" ? "year" : "month"}
                      </span>
                    )}
                  </div>

                  {isYearly && plan.interval === "year" && plan.price > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Save ${getYearlySavings(plan.price / 10)}/month
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan || isLoading}
                    className={`w-full ${
                      plan.popular ? "bg-blue-600 hover:bg-blue-700" : isPro ? "bg-yellow-600 hover:bg-yellow-700" : ""
                    }`}
                    variant={plan.id === "free" ? "outline" : "default"}
                  >
                    {isLoading
                      ? "Processing..."
                      : isCurrentPlan
                        ? "Current Plan"
                        : currentSubscription && currentSubscription.planId !== "free"
                          ? "Switch Plan"
                          : plan.id === "free"
                            ? "Current Plan"
                            : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Current Subscription Info */}
        {currentSubscription && currentSubscription.planId !== "free" && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 animate-fade-in">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Current Subscription</h3>
              <div className="space-y-1 text-sm">
                <p>
                  Status:{" "}
                  <Badge
                    variant={
                      currentSubscription.status === "active"
                        ? "default"
                        : currentSubscription.status === "past_due"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {currentSubscription.status}
                  </Badge>
                </p>
                <p>Next billing: {currentSubscription.currentPeriodEnd.toLocaleDateString()}</p>
                {currentSubscription.cancelAtPeriodEnd && (
                  <p className="text-orange-600 dark:text-orange-400">
                    Your subscription will end on {currentSubscription.currentPeriodEnd.toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Comparison */}
        <Card className="animate-fade-in-delayed">
          <CardHeader>
            <CardTitle>Why Upgrade?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">More Alarms</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Set up to 10 or unlimited location alarms</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Priority Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get help when you need it most</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
