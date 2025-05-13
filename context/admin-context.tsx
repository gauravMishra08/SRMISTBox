"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  adminKey: string
  adminPassword: string
  toggleAdmin: (value?: boolean) => void
  setAdminKey: (key: string) => void
  setAdminPassword: (password: string) => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminKey: "",
  adminPassword: "admin123", // Default password
  toggleAdmin: () => {},
  setAdminKey: () => {},
  setAdminPassword: () => {},
})

export const useAdmin = () => useContext(AdminContext)

interface AdminProviderProps {
  children: ReactNode
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminKey, setAdminKey] = useState("")
  const [adminPassword, setAdminPassword] = useState("admin123") // Default password

  // Load admin settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdminKey = localStorage.getItem("campusqa_admin_key")
      const storedAdminPassword = localStorage.getItem("campusqa_admin_password")

      if (storedAdminKey) {
        setAdminKey(storedAdminKey)
      }

      if (storedAdminPassword) {
        setAdminPassword(storedAdminPassword)
      }

      // Check URL for admin mode
      const urlParams = new URLSearchParams(window.location.search)
      const adminParam = urlParams.get("admin")
      if (adminParam && storedAdminPassword && adminParam === storedAdminPassword) {
        setIsAdmin(true)
      }
    }
  }, [])

  // Save admin settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined" && adminKey) {
      localStorage.setItem("campusqa_admin_key", adminKey)
    }
  }, [adminKey])

  useEffect(() => {
    if (typeof window !== "undefined" && adminPassword) {
      localStorage.setItem("campusqa_admin_password", adminPassword)
    }
  }, [adminPassword])

  const toggleAdmin = (value?: boolean) => {
    setIsAdmin((prev) => (value !== undefined ? value : !prev))
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminKey,
        adminPassword,
        toggleAdmin,
        setAdminKey,
        setAdminPassword,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}
