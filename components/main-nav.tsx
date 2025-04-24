"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, Menu, X, User, Settings, Bell, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function MainNav() {
  const pathname = usePathname()
  const { logout, userData } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // Simulate loading notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotificationCount(3)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Define routes based on user role
  const getRoutes = () => {
    const commonRoutes = [
      {
        href: "/dashboard",
        label: "Dashboard",
        active: pathname === "/dashboard",
      },
      {
        href: "/detection",
        label: "Detection",
        active: pathname === "/detection",
      },
      {
        href: "/metrics",
        label: "Metrics",
        active: pathname === "/metrics",
      },
      {
        href: "/history",
        label: "History",
        active: pathname === "/history",
      },
    ]

    // Add role-specific routes
    if (userData?.role === "admin") {
      return [
        ...commonRoutes,
        {
          href: "/admin/users",
          label: "Users",
          active: pathname === "/admin/users",
        },
        {
          href: "/admin/settings",
          label: "Settings",
          active: pathname === "/admin/settings",
        },
      ]
    }

    if (userData?.role === "doctor" || userData?.role === "nurse") {
      return [
        ...commonRoutes,
        {
          href: "/appointments",
          label: "Appointments",
          active: pathname === "/appointments",
        },
        {
          href: "/patients",
          label: "Patients",
          active: pathname === "/patients",
        },
      ]
    }

    return commonRoutes
  }

  const routes = getRoutes()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container">
        <div className="flex items-center gap-2 mr-4">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden md:inline-block">MammoScan</span>
        </div>

        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                route.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden md:flex items-center space-x-4">
          {(userData?.role === "doctor" || userData?.role === "nurse" || userData?.role === "admin") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New scan results available</DropdownMenuItem>
                <DropdownMenuItem>Dr. Johnson requested a second opinion</DropdownMenuItem>
                <DropdownMenuItem>System maintenance scheduled</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View all notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {userData?.firstName?.[0]}
                    {userData?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {userData?.firstName} {userData?.lastName}
                <p className="text-xs font-normal text-muted-foreground capitalize">{userData?.role}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              {(userData?.role === "doctor" || userData?.role === "nurse") && (
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b z-50 md:hidden">
            <div className="flex flex-col space-y-4 p-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    route.active ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
