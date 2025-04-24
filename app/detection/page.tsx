"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FileImage, Upload, AlertCircle, CheckCircle2, Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { useToast } from "@/components/ui/use-toast"
import useBreastCancerStore from "@/lib/stores/breast-cancer-store"

// Sample heatmap overlay for demonstration
const SAMPLE_HEATMAP = "/placeholder.svg?height=400&width=400"

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [activeTab, setActiveTab] = useState("original")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { detectBreastCancer, result, loading, error, resetState } = useBreastCancerStore()

  // Simulate progress during analysis
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAnalyzing && analysisProgress < 100) {
      interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const increment = Math.random() * 15
          const newProgress = Math.min(prev + increment, 100)

          // When progress reaches 100%, complete the analysis
          if (newProgress === 100) {
            setTimeout(() => {
              setIsAnalyzing(false)
              simulateDetectionResult()
            }, 500)
          }

          return newProgress
        })
      }, 500)
    }

    return () => clearInterval(interval)
  }, [isAnalyzing, analysisProgress])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetState()
    setShowHeatmap(false)
    setZoomLevel(1)
    setRotation(0)
    setActiveTab("original")

    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-primary")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-primary")
    resetState()
    setShowHeatmap(false)
    setZoomLevel(1)
    setRotation(0)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const simulateDetectionResult = () => {
    // Simulate a random result (for demo purposes)
    const isMalignant = Math.random() > 0.5
    const confidence = 0.7 + Math.random() * 0.25

    const mockResult = {
      prediction: isMalignant ? "Malignant" : "Benign",
      confidence: confidence,
      features: isMalignant
        ? ["Irregular mass detected", "Suspicious calcifications present", "Architectural distortion observed"]
        : ["No suspicious masses detected", "Normal tissue patterns observed", "No architectural distortion"],
      timestamp: new Date().toISOString(),
    }

    // Update the store with mock result
    useBreastCancerStore.setState({ result: mockResult, loading: false })

    toast({
      title: "Analysis complete",
      description: "Mammogram analysis has been completed successfully",
    })
  }

  const handleDetection = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a mammogram image to analyze",
        variant: "destructive",
      })
      return
    }

    // Reset states
    resetState()
    setAnalysisProgress(0)
    setIsAnalyzing(true)

    // For a real implementation, we would call the actual API
    // await detectBreastCancer(selectedFile)

    // For demo purposes, we're simulating the analysis with progress
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setShowHeatmap(false)
    setZoomLevel(1)
    setRotation(0)
    setActiveTab("original")
    resetState()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const toggleHeatmap = () => {
    if (result) {
      setShowHeatmap((prev) => !prev)
      setActiveTab(showHeatmap ? "original" : "heatmap")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Breast Cancer Detection</h1>
            <p className="text-muted-foreground">Upload a mammogram image for analysis by our CNN model</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Mammogram</CardTitle>
                <CardDescription>Upload a mammogram image for breast cancer detection</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="original">Original</TabsTrigger>
                    <TabsTrigger value="heatmap" disabled={!result}>
                      Heatmap Analysis
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="original" className="mt-4">
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center h-64 transition-colors ${
                        preview ? "border-primary" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {preview ? (
                        <div className="relative w-full h-full overflow-hidden">
                          <div
                            className="w-full h-full transition-all duration-300 ease-in-out"
                            style={{
                              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                              transformOrigin: "center",
                            }}
                          >
                            <Image
                              src={preview || "/placeholder.svg"}
                              alt="Mammogram preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <FileImage className="h-10 w-10 text-muted-foreground mb-4" />
                          <h3 className="font-medium text-lg mb-1">Drag and drop your image here</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            or click to browse files (PNG, JPG, JPEG)
                          </p>
                          <Button onClick={handleUploadClick} variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            Select File
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="heatmap" className="mt-4">
                    <div className="border-2 rounded-lg p-6 flex flex-col items-center justify-center text-center h-64 border-primary">
                      {result && (
                        <div className="relative w-full h-full overflow-hidden">
                          <div
                            className="w-full h-full transition-all duration-300 ease-in-out"
                            style={{
                              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                              transformOrigin: "center",
                            }}
                          >
                            <Image
                              src={preview || "/placeholder.svg"}
                              alt="Mammogram preview"
                              fill
                              className="object-contain"
                              style={{ opacity: 0.7 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-red-500/50 mix-blend-overlay" />
                            {result.prediction === "Malignant" && (
                              <div className="absolute top-1/3 left-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full border-4 border-red-500 animate-pulse" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {preview && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[(zoomLevel * 100) / 3]}
                        max={100}
                        step={1}
                        className="w-24"
                        onValueChange={(value) => setZoomLevel((value[0] * 3) / 100)}
                      />
                      <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleRotate}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    {result && (
                      <Button variant={showHeatmap ? "default" : "outline"} size="sm" onClick={toggleHeatmap}>
                        {showHeatmap ? "Hide Analysis" : "Show Analysis"}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset} disabled={isAnalyzing}>
                  Reset
                </Button>
                <Button
                  onClick={handleDetection}
                  disabled={!selectedFile || isAnalyzing || loading}
                  className="relative"
                >
                  {isAnalyzing || loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Mammogram"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>Analysis results from our CNN model</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px] flex flex-col justify-center">
                {(isAnalyzing || loading) && (
                  <div className="space-y-4 text-center">
                    <p className="text-muted-foreground">Analyzing mammogram...</p>
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-xs text-muted-foreground">
                      {analysisProgress < 30 && "Preprocessing image..."}
                      {analysisProgress >= 30 && analysisProgress < 60 && "Applying CNN model..."}
                      {analysisProgress >= 60 && analysisProgress < 90 && "Detecting features..."}
                      {analysisProgress >= 90 && "Finalizing results..."}
                    </p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!isAnalyzing && !loading && !error && !result && (
                  <div className="text-center text-muted-foreground">
                    <p>No results yet. Upload and analyze a mammogram to see results.</p>
                  </div>
                )}

                {result && (
                  <div className="space-y-6">
                    <Alert
                      variant={result.prediction === "Malignant" ? "destructive" : "default"}
                      className={result.prediction === "Benign" ? "bg-green-50 dark:bg-green-950/20" : ""}
                    >
                      {result.prediction === "Malignant" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      <AlertTitle>
                        {result.prediction === "Malignant" ? "Potential Malignancy Detected" : "Benign Result"}
                      </AlertTitle>
                      <AlertDescription>
                        {result.prediction === "Malignant"
                          ? "The model has detected potential signs of malignancy. Please consult with a healthcare professional for further evaluation."
                          : "The model indicates a benign result. Regular screenings are still recommended."}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <h3 className="font-medium">Confidence Score</h3>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={result.confidence * 100}
                          className="w-full"
                          indicatorClassName={result.prediction === "Malignant" ? "bg-red-500" : "bg-green-500"}
                        />
                        <span className="text-sm font-medium">{(result.confidence * 100).toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Key Findings</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {result.features?.map((feature, index) => (
                          <li key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 200}ms` }}>
                            {feature}
                          </li>
                        )) || (
                          <>
                            <li>Analysis based on CNN model detection</li>
                            <li>Result confidence: {(result.confidence * 100).toFixed(2)}%</li>
                            <li>Classification: {result.prediction}</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Important Note:</p>
                      <p>
                        This is an AI-assisted analysis and should not replace professional medical advice. Please
                        consult with a healthcare provider for proper diagnosis.
                      </p>
                    </div>

                    <div className="text-sm">
                      <p className="text-muted-foreground">Analysis completed on: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              {result && (
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Save Results
                  </Button>
                  <Button className="flex-1">Generate Report</Button>
                </CardFooter>
              )}
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Understanding our breast cancer detection process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2 p-4 rounded-lg transition-colors hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileImage className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">1. Upload Mammogram</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a mammogram image in JPG, PNG, or JPEG format for analysis.
                  </p>
                </div>
                <div className="space-y-2 p-4 rounded-lg transition-colors hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M9 15v-6" />
                      <path d="M12 12v3" />
                      <path d="M15 9v6" />
                    </svg>
                  </div>
                  <h3 className="font-medium">2. CNN Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our CNN model analyzes the image to detect early signs of breast cancer.
                  </p>
                </div>
                <div className="space-y-2 p-4 rounded-lg transition-colors hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="font-medium">3. View Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Review the detection results, including classification and confidence score.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
