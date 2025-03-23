"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"

export default function WindAlertCard() {
  const [minWindSpeed, setMinWindSpeed] = useState(15)
  const [maxWindSpeed, setMaxWindSpeed] = useState(25)
  const [email, setEmail] = useState("")
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Wind Alerts
        </CardTitle>
        <CardDescription>Get notified when wind conditions are perfect for kitesurfing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Wind Speed Range</Label>
            <div className="flex items-center justify-between text-sm">
              <span>{minWindSpeed} knots</span>
              <span>{maxWindSpeed} knots</span>
            </div>
            <div className="pt-2">
              <Slider
                value={[minWindSpeed, maxWindSpeed]}
                min={5}
                max={40}
                step={1}
                onValueChange={(value) => {
                  setMinWindSpeed(value[0])
                  setMaxWindSpeed(value[1])
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="sms-alerts" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            <Label htmlFor="sms-alerts">Enable SMS alerts</Label>
          </div>

          {smsAlerts && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required={smsAlerts}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Setting up alerts..." : "Set Up Alerts"}
          </Button>

          {isSuccess && (
            <div className="text-center text-sm text-green-600 dark:text-green-400">
              Wind alerts set up successfully!
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

