"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import {
  FileImage,
  Download,
  Share2,
  MoreHorizontal,
  Loader2,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/components/auth-provider"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for scan history
const generateMockScans = () => {
  const results = ["Benign", "Malignant", "Inconclusive"]
  const scans = []

  // Generate 20 mock scans with dates from the past 6 months
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 180)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const result = results[Math.floor(Math.random() * results.length)]
    const confidence = result === "Inconclusive" ? 0.5 + Math.random() * 0.2 : 0.7 + Math.random() * 0.25

    scans.push({
      id: `scan-${i + 1}`,
      patientName: `Patient ${i + 1}`,
      patientId: `P${10000 + i}`,
      date: date.toISOString(),
      result,
      confidence,
      reviewedBy:
        result === "Inconclusive"
          ? null
          : `Dr. ${["Smith", "Johnson", "Williams", "Brown", "Jones"][Math.floor(Math.random() * 5)]}`,
      notes:
        result === "Malignant"
          ? "Suspicious mass detected. Further examination recommended."
          : result === "Benign"
            ? "No suspicious findings. Regular screening recommended."
            : "Results unclear. Additional imaging recommended.",
      imageUrl: "/placeholder.svg?height=200&width=200",
    })
  }

  // Sort by date (newest first)
  return scans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function HistoryPage() {
  const { userData } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [scans, setScans] = useState<any[]>([])
  const [filteredScans, setFilteredScans] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [resultFilter, setResultFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const mockScans = generateMockScans()
      setScans(mockScans)
      setFilteredScans(mockScans)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...scans]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (scan) =>
          scan.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scan.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply result filter
    if (resultFilter !== "all") {
      filtered = filtered.filter((scan) => scan.result.toLowerCase() === resultFilter.toLowerCase())
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const cutoffDate = new Date()

      if (dateFilter === "week") {
        cutoffDate.setDate(now.getDate() - 7)
      } else if (dateFilter === "month") {
        cutoffDate.setMonth(now.getMonth() - 1)
      } else if (dateFilter === "quarter") {
        cutoffDate.setMonth(now.getMonth() - 3)
      }

      filtered = filtered.filter((scan) => new Date(scan.date) >= cutoffDate)
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "needsReview") {
        filtered = filtered.filter((scan) => scan.result === "Inconclusive" || !scan.reviewedBy)
      } else if (activeTab === "malignant") {
        filtered = filtered.filter((scan) => scan.result === "Malignant")
      } else if (activeTab === "benign") {
        filtered = filtered.filter((scan) => scan.result === "Benign")
      }
    }

    setFilteredScans(filtered)
  }, [scans, searchQuery, resultFilter, dateFilter, activeTab])

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case "Benign":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Malignant":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Inconclusive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detection History</h1>
              <p className="text-muted-foreground">View and manage your mammogram scan history</p>
            </div>
            <Link href="/detection">
              <Button className="transition-all hover:shadow-md">
                New Detection
                <FileImage className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
              <CardDescription>Refine your scan history results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by patient name or ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <Select value={resultFilter} onValueChange={setResultFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="benign">Benign</SelectItem>
                      <SelectItem value="malignant">Malignant</SelectItem>
                      <SelectItem value="inconclusive">Inconclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                      <SelectItem value="quarter">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setResultFilter("all")
                    setDateFilter("all")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="all">All Scans</TabsTrigger>
              <TabsTrigger value="needsReview">Needs Review</TabsTrigger>
              <TabsTrigger value="malignant">Malignant</TabsTrigger>
              <TabsTrigger value="benign">Benign</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading scan history...</p>
              </div>
            </div>
          ) : filteredScans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <FileImage className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No scans found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery || resultFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters to see more results"
                    : "Upload a mammogram to start building your history"}
                </p>
                {(searchQuery || resultFilter !== "all" || dateFilter !== "all") && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setResultFilter("all")
                      setDateFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredScans.map((scan) => (
                <Card key={scan.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{scan.patientName}</CardTitle>
                        <CardDescription>ID: {scan.patientId}</CardDescription>
                      </div>
                      <Badge className={getResultBadgeColor(scan.result)}>{scan.result}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-muted-foreground">{format(new Date(scan.date), "PPP")}</div>
                      <div className="text-sm font-medium">{(scan.confidence * 100).toFixed(1)}% confidence</div>
                    </div>

                    <div className="flex gap-4 mb-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                        <Image
                          src={scan.imageUrl || "/placeholder.svg"}
                          alt="Mammogram thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm line-clamp-3">{scan.notes}</p>
                        {scan.reviewedBy ? (
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            Reviewed by {scan.reviewedBy}
                          </div>
                        ) : (
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                            Pending review
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Add Notes</DropdownMenuItem>
                          <DropdownMenuItem>Request Second Opinion</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Record</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {filteredScans.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
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
