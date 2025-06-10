"use client"

import { useState } from "react"
import { CreditCard, Download, Plus, Trash2, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStripe } from "@/contexts/stripe-context"
import { AddPaymentMethodDialog } from "@/components/add-payment-method-dialog"

export function BillingManagement() {
  const {
    paymentMethods,
    invoices,
    currentSubscription,
    plans,
    removePaymentMethod,
    setDefaultPaymentMethod,
    cancelSubscription,
    resumeSubscription,
    isLoading,
  } = useStripe()

  const [showAddPayment, setShowAddPayment] = useState(false)

  const currentPlan = plans.find((p) => p.id === currentSubscription?.planId)

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      await cancelSubscription()
    }
  }

  const handleResumeSubscription = async () => {
    await resumeSubscription()
  }

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1)
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {currentSubscription && currentPlan && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  ${currentPlan.price}/{currentPlan.interval}
                </p>
              </div>
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
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Next billing date</p>
                <p className="font-medium">{currentSubscription.currentPeriodEnd.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium">{currentSubscription.cancelAtPeriodEnd ? "Ending soon" : "Active"}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {currentSubscription.cancelAtPeriodEnd ? (
                <Button onClick={handleResumeSubscription} disabled={isLoading} size="sm">
                  Resume Subscription
                </Button>
              ) : (
                <Button onClick={handleCancelSubscription} variant="outline" disabled={isLoading} size="sm">
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card className="animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <Button onClick={() => setShowAddPayment(true)} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Card
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No payment methods added</p>
              <Button onClick={() => setShowAddPayment(true)} className="mt-4" size="sm">
                Add Your First Card
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs font-bold">{formatCardBrand(method.card.brand).substring(0, 4)}</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• {method.card.last4}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expires {method.card.expMonth.toString().padStart(2, "0")}/{method.card.expYear}
                      </p>
                    </div>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      onClick={() => removePaymentMethod(method.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="animate-fade-in-delayed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No billing history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <p className="font-medium">{invoice.planName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.date.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount}</p>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "default"
                            : invoice.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                    {invoice.downloadUrl && (
                      <Button variant="ghost" size="icon" className="text-blue-600">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodDialog open={showAddPayment} onOpenChange={setShowAddPayment} />
    </div>
  )
}
