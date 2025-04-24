"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FileImage, BarChart3, History, ArrowRight, Loader2, Users, Calendar, ClipboardList, Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/components/auth-provider"
import useBreastCancerStore from "@/lib/stores/breast-cancer-store"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample recent detection data
const recentDetections = [
  { id: 1, date: "2025-04-22", result: "Benign", confidence: 0.92, patientName: "Sarah Johnson" },
  { id: 2, date: "2025-04-15", result: "Malignant", confidence: 0.87, patientName: "Michael Chen" },
  { id: 3, date: "2025-04-03", result: "Benign", confidence: 0.95, patientName: "Emily Rodriguez" },
]

// Sample upcoming appointments for doctors and nurses
const upcomingAppointments = [
  { id: 1, date: "2025-04-25 09:30", patientName: "Robert Wilson", type: "Follow-up", status: "confirmed" },
  { id: 2, date: "2025-04-25 11:15", patientName: "Lisa Thompson", type: "Initial Screening", status: "confirmed" },
  { id: 3, date: "2025-04-26 14:00", patientName: "David Martinez", type: "Results Review", status: "pending" },
]

// Sample notifications
const notifications = [
  { id: 1, message: "New scan results available for review", time: "2 hours ago", read: false },
  { id: 2, message: "Dr. Johnson requested a second opinion on scan #4872", time: "Yesterday", read: false },
  { id: 3, message: "System maintenance scheduled for April 30, 2025", time: "3 days ago", read: true },
]

// Sample staff members for admin view
const staffMembers = [
  { id: 1, name: "Dr. Sarah Johnson", role: "doctor", specialty: "Radiology", status: "active" },
  { id: 2, name: "Dr. Michael Chen", role: "doctor", specialty: "Oncology", status: "active" },
  { id: 3, name: "Nurse Emily Rodriguez", role: "nurse", specialty: "", status: "away" },
]

export default function DashboardPage() {
  const { userData } = useAuth()
  const { fetchModelMetrics, metrics, metricsLoading } = useBreastCancerStore()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalScans: 0,
    weeklyScans: 0,
    detectionRate: 0,
    pendingReviews: 0,
    completedReviews: 0,
  })

  useEffect(() => {
    fetchModelMetrics()

    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        totalScans: 1243,
        weeklyScans: 87,
        detectionRate: 12.4,
        pendingReviews: 14,
        completedReviews: 73,
      })
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [fetchModelMetrics])

  // Current date for the dashboard
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                {getGreeting()}, {userData?.firstName || "User"}. Welcome to MammoScan.
              </p>
              <p className="text-sm text-muted-foreground mt-1">{currentDate}</p>
            </div>
            <Link href="/detection">
              <Button className="transition-all hover:shadow-md">
                New Detection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Role-specific stats */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                {userData?.role === "admin" && (
                  <>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">487</div>
                        <p className="text-xs text-muted-foreground">Active system users</p>
                        <div className="mt-2">
                          <Progress value={75} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">99.8%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                        <div className="mt-2">
                          <Progress value={99.8} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">Doctors and nurses</p>
                        <div className="mt-2">
                          <Progress value={84} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {(userData?.role === "doctor" || userData?.role === "nurse") && (
                  <>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingReviews}</div>
                        <p className="text-xs text-muted-foreground">Scans awaiting review</p>
                        <div className="mt-2">
                          <Progress
                            value={(stats.pendingReviews / (stats.pendingReviews + stats.completedReviews)) * 100}
                            className="h-1"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Scheduled for today</p>
                        <div className="mt-2">
                          <Progress value={50} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.completedReviews}</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                        <div className="mt-2">
                          <Progress value={75} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {userData?.role === "patient" && (
                  <>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.totalScans.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime scans processed</p>
                        <div className="mt-2">
                          <Progress value={75} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Scans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.weeklyScans}</div>
                        <p className="text-xs text-muted-foreground">Last 7 days</p>
                        <div className="mt-2">
                          <Progress value={45} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Detection Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.detectionRate}%</div>
                        <p className="text-xs text-muted-foreground">Positive detection rate</p>
                        <div className="mt-2">
                          <Progress value={stats.detectionRate} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Role-specific content */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                {/* Admin-specific content */}
                {userData?.role === "admin" && (
                  <>
                    <Card className="md:col-span-2 transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>Staff Overview</CardTitle>
                        <CardDescription>Current staff members and status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {staffMembers.map((staff) => (
                            <div key={staff.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {staff.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{staff.name}</p>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {staff.role} {staff.specialty && `• ${staff.specialty}`}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={staff.status === "active" ? "default" : "outline"}>
                                {staff.status === "active" ? "Online" : "Away"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Staff
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>System Notifications</CardTitle>
                        <CardDescription>Recent alerts and messages</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="flex items-start gap-3">
                              <Bell
                                className={`h-5 w-5 mt-0.5 ${notification.read ? "text-muted-foreground" : "text-primary"}`}
                              />
                              <div>
                                <p className={`text-sm ${notification.read ? "" : "font-medium"}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Notifications
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                )}

                {/* Doctor/Nurse-specific content */}
                {(userData?.role === "doctor" || userData?.role === "nurse") && (
                  <>
                    <Card className="md:col-span-2 transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <CardDescription>Your scheduled appointments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingAppointments.map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{appointment.patientName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(appointment.date).toLocaleString()} • {appointment.type}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                                {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" />
                          View Full Schedule
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>Pending Reviews</CardTitle>
                        <CardDescription>Scans awaiting your review</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentDetections.map((detection) => (
                            <div key={detection.id} className="flex items-start gap-3">
                              <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                                <Image
                                  src="/placeholder.svg?height=48&width=48"
                                  alt="Mammogram thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{detection.patientName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(detection.date).toLocaleDateString()}
                                </p>
                                <Badge
                                  className="mt-1"
                                  variant={detection.result === "Malignant" ? "destructive" : "outline"}
                                >
                                  {detection.result}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          View All Pending
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                )}

                {/* Patient-specific content */}
                {userData?.role === "patient" && (
                  <>
                    <Card className="md:col-span-2 transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>Model Performance</CardTitle>
                        <CardDescription>Key metrics for our breast cancer detection model</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Accuracy</p>
                            <p className="text-2xl font-bold">
                              {metricsLoading
                                ? "..."
                                : metrics?.accuracy
                                  ? `${(metrics.accuracy * 100).toFixed(2)}%`
                                  : "92.4%"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Sensitivity</p>
                            <p className="text-2xl font-bold">
                              {metricsLoading
                                ? "..."
                                : metrics?.sensitivity
                                  ? `${(metrics.sensitivity * 100).toFixed(2)}%`
                                  : "89.5%"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Specificity</p>
                            <p className="text-2xl font-bold">
                              {metricsLoading
                                ? "..."
                                : metrics?.specificity
                                  ? `${(metrics.specificity * 100).toFixed(2)}%`
                                  : "94.4%"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">F1 Score</p>
                            <p className="text-2xl font-bold">
                              {metricsLoading
                                ? "..."
                                : metrics?.f1Score
                                  ? `${(metrics.f1Score * 100).toFixed(2)}%`
                                  : "91.3%"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href="/metrics">
                          <Button variant="outline" size="sm">
                            View Detailed Metrics
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>

                    <Card className="transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle>Recent Detections</CardTitle>
                        <CardDescription>Your latest mammogram analyses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentDetections.map((detection) => (
                            <div key={detection.id} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{new Date(detection.date).toLocaleDateString()}</p>
                                <div className="flex items-center">
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                      detection.result === "Malignant" ? "bg-red-500" : "bg-green-500"
                                    }`}
                                  />
                                  <p className="text-sm text-muted-foreground">{detection.result}</p>
                                </div>
                              </div>
                              <div className="text-sm font-medium">{(detection.confidence * 100).toFixed(0)}%</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href="/history">
                          <Button variant="outline" size="sm" className="w-full">
                            View All
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card className="transition-all hover:shadow-md">
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
                        <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
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
                        <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
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
                        <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
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

              {userData?.role === "admin" && (
                <Card className="mt-6 transition-all hover:shadow-md">
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
            </>
          )}
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 MammoScan. Developed by Emmah.</p>
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
