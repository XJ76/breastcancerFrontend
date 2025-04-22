"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, Menu, X } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export function MainNav() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
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
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
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
