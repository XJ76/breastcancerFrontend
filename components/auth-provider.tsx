"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import useAuthStore, { type UserRole } from "@/lib/stores/auth-store"

type AuthContextType = {
  isAuthenticated: boolean
  userData: {
    email: string
    firstName: string
    lastName: string
    role: UserRole
    specialty?: string
  } | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
    specialty?: string
  }) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [initialized, setInitialized] = useState(false)

  const { isAuthenticated, userData, login, register, logout, loading, error } = useAuthStore()

  useEffect(() => {
    // Only run on client-side
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return

    const publicPaths = ["/", "/login", "/register"]

    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push("/login")
    }

    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, pathname, router, initialized])

  const value = {
    isAuthenticated,
    userData,
    login,
    register,
    logout,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
