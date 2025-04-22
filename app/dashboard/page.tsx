"use client"

import { useEffect } from "react"
import Link from "next/link"
import { FileImage, BarChart3, History, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/components/auth-provider"
import useBreastCancerStore from "@/lib/stores/breast-cancer-store"

export default function DashboardPage() {
  const { userRole } = useAuth()
  const { fetchModelMetrics, metrics, metricsLoading } = useBreastCancerStore()

  useEffect(() => {
    fetchModelMetrics()
  }, [fetchModelMetrics])

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome to MammoScan, your breast cancer detection tool.</p>
            </div>
            <Link href="/detection">
              <Button>
                New Detection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricsLoading
                    ? "Loading..."
                    : metrics?.accuracy
                      ? `${(metrics.accuracy * 100).toFixed(2)}%`
                      : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Overall model accuracy on test dataset</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sensitivity</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricsLoading
                    ? "Loading..."
                    : metrics?.sensitivity
                      ? `${(metrics.sensitivity * 100).toFixed(2)}%`
                      : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">True positive rate (recall)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Specificity</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metricsLoading
                    ? "Loading..."
                    : metrics?.specificity
                      ? `${(metrics.specificity * 100).toFixed(2)}%`
                      : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">True negative rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key features of the application</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileImage className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Upload Mammogram</p>
                    <p className="text-sm text-muted-foreground">Upload a mammogram image for analysis</p>
                  </div>
                  <Link href="/detection" className="ml-auto">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">View Metrics</p>
                    <p className="text-sm text-muted-foreground">View detailed model performance metrics</p>
                  </div>
                  <Link href="/metrics" className="ml-auto">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Detection History</p>
                    <p className="text-sm text-muted-foreground">View your previous detection results</p>
                  </div>
                  <Link href="/history" className="ml-auto">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About the Model</CardTitle>
                <CardDescription>Information about our CNN model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Our Convolutional Neural Network (CNN) model is designed to identify early-stage breast cancer
                  features in mammogram images with high accuracy.
                </p>
                <p className="text-sm">
                  The model has been trained on a diverse dataset of mammogram images to detect small lesions and
                  microcalcifications that may indicate early signs of breast cancer.
                </p>
                <p className="text-sm">
                  Performance metrics such as sensitivity, specificity, and F1 score are continuously monitored to
                  ensure reliable detection.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/metrics">
                  <Button variant="outline">View Detailed Metrics</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {userRole === "admin" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Admin Controls</CardTitle>
                <CardDescription>Administrative functions for system management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Manage Users</Button>
                  <Button variant="outline">System Settings</Button>
                  <Button variant="outline">Model Training</Button>
                  <Button variant="outline">View Logs</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2023 MammoScan. Developed by Emmah.</p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
