"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface NotificationData {
  title: string
  body: string
  url?: string
}

interface NotificationContextType {
  notificationsEnabled: boolean
  requestNotificationPermission: () => Promise<boolean>
  sendNotification: (data: NotificationData) => void
}

const NotificationContext = createContext<NotificationContextType>({
  notificationsEnabled: false,
  requestNotificationPermission: async () => false,
  sendNotification: () => {},
})

export const useNotification = () => useContext(NotificationContext)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check if notifications are already permitted
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true)
      }
    }
  }, [])

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!isClient || typeof window === "undefined" || !("Notification" in window)) {
      return false
    }

    if (Notification.permission === "granted") {
      setNotificationsEnabled(true)
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      setNotificationsEnabled(granted)
      return granted
    }

    return false
  }

  const sendNotification = (data: NotificationData) => {
    if (!isClient || !notificationsEnabled || typeof window === "undefined" || !("Notification" in window)) {
      return
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: "/favicon.ico",
      })

      if (data.url) {
        notification.onclick = () => {
          window.focus()
          window.location.href = data.url || "/"
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        requestNotificationPermission,
        sendNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
