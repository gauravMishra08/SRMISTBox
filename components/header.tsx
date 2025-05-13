"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAdmin } from "@/context/admin-context"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ShieldCheck, Bell, BellOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNotification } from "@/context/notification-context"
import Logo from "./logo"

export default function Header() {
  const { isAdmin, toggleAdmin, adminKey, setAdminKey, adminPassword } = useAdmin()
  const { notificationsEnabled, requestNotificationPermission } = useNotification()
  const [adminKeyInput, setAdminKeyInput] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAdminLogin = () => {
    if (adminKeyInput === adminPassword) {
      setAdminKey(adminKeyInput)
      toggleAdmin(true)
    }
  }

  const handleAdminLogout = () => {
    toggleAdmin(false)
  }

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      await requestNotificationPermission()
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleNotifications}
            className="relative"
            title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
          >
            {notificationsEnabled ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4" />}
          </Button>

          <ModeToggle />

          {isAdmin ? (
            <Button variant="destructive" size="sm" onClick={handleAdminLogout} className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Exit Admin</span>
            </Button>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admin Access</DialogTitle>
                  <DialogDescription>Enter the admin password to access moderation tools.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="adminKey">Admin Password</Label>
                  <Input
                    id="adminKey"
                    type="password"
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handleAdminLogin}>Login</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  )
}
