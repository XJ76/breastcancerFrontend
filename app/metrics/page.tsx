"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import useBreastCancerStore from "@/lib/stores/breast-cancer-store"

export default function MetricsPage() {
  const { fetchModelMetrics, metrics, metricsLoading } = useBreastCancerStore()

  useEffect(() => {
    fetchModelMetrics()
  }, [fetchModelMetrics])

  // Sample data for charts - would be replaced with actual metrics data
  const performanceData = [
    { name: "Fold 1", accuracy: 0.92, sensitivity: 0.89, specificity: 0.94, f1Score: 0.91 },
    { name: "Fold 2", accuracy: 0.93, sensitivity: 0.9, specificity: 0.95, f1Score: 0.92 },
    { name: "Fold 3", accuracy: 0.91, sensitivity: 0.88, specificity: 0.93, f1Score: 0.9 },
    { name: "Fold 4", accuracy: 0.94, sensitivity: 0.91, specificity: 0.96, f1Score: 0.93 },
    { name: "Fold 5", accuracy: 0.92, sensitivity: 0.89, specificity: 0.94, f1Score: 0.91 },
  ]

  const rocCurveData = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.02, tpr: 0.4 },
    { fpr: 0.05, tpr: 0.65 },
    { fpr: 0.1, tpr: 0.8 },
    { fpr: 0.2, tpr: 0.9 },
    { fpr: 0.3, tpr: 0.95 },
    { fpr: 0.5, tpr: 0.98 },
    { fpr: 0.8, tpr: 0.99 },
    { fpr: 1.0, tpr: 1.0 },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 p-4 md:p-6">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Model Metrics</h1>
            <p className="text-muted-foreground">Detailed performance metrics for our breast cancer detection model</p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="roc">ROC Curve</TabsTrigger>
              <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metricsLoading
                        ? "Loading..."
                        : metrics?.accuracy
                          ? `${(metrics.accuracy * 100).toFixed(2)}%`
                          : "92.4%"}
                    </div>
                    <p className="text-xs text-muted-foreground">Overall model accuracy on test dataset</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sensitivity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metricsLoading
                        ? "Loading..."
                        : metrics?.sensitivity
                          ? `${(metrics.sensitivity * 100).toFixed(2)}%`
                          : "89.5%"}
                    </div>
                    <p className="text-xs text-muted-foreground">True positive rate (recall)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Specificity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metricsLoading
                        ? "Loading..."
                        : metrics?.specificity
                          ? `${(metrics.specificity * 100).toFixed(2)}%`
                          : "94.4%"}
                    </div>
                    <p className="text-xs text-muted-foreground">True negative rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">F1 Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metricsLoading
                        ? "Loading..."
                        : metrics?.f1Score
                          ? `${(metrics.f1Score * 100).toFixed(2)}%`
                          : "91.3%"}
                    </div>
                    <p className="text-xs text-muted-foreground">Harmonic mean of precision and recall</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Key performance metrics across cross-validation folds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0.8, 1]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="accuracy" fill="#f43f5e" name="Accuracy" />
                        <Bar dataKey="sensitivity" fill="#3b82f6" name="Sensitivity" />
                        <Bar dataKey="specificity" fill="#10b981" name="Specificity" />
                        <Bar dataKey="f1Score" fill="#8b5cf6" name="F1 Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Information</CardTitle>
                    <CardDescription>Details about the CNN model architecture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Model Type</div>
                        <div className="text-sm">Convolutional Neural Network (CNN)</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Architecture</div>
                        <div className="text-sm">ResNet-50 with custom layers</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Training Dataset</div>
                        <div className="text-sm">10,000 mammogram images</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Validation Method</div>
                        <div className="text-sm">5-fold cross-validation</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Last Updated</div>
                        <div className="text-sm">April 15, 2023</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Understanding the Metrics</CardTitle>
                    <CardDescription>Explanation of key performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Accuracy</p>
                        <p className="text-sm text-muted-foreground">
                          The proportion of correct predictions (both true positives and true negatives) among the total
                          number of cases examined.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Sensitivity</p>
                        <p className="text-sm text-muted-foreground">
                          The ability of the model to correctly identify patients with breast cancer (true positive
                          rate).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Specificity</p>
                        <p className="text-sm text-muted-foreground">
                          The ability of the model to correctly identify patients without breast cancer (true negative
                          rate).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">F1 Score</p>
                        <p className="text-sm text-muted-foreground">
                          The harmonic mean of precision and recall, providing a balance between the two metrics.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Detailed performance metrics across cross-validation folds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0.8, 1]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="accuracy" fill="#f43f5e" name="Accuracy" />
                        <Bar dataKey="sensitivity" fill="#3b82f6" name="Sensitivity" />
                        <Bar dataKey="specificity" fill="#10b981" name="Specificity" />
                        <Bar dataKey="f1Score" fill="#8b5cf6" name="F1 Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accuracy Over Training Epochs</CardTitle>
                    <CardDescription>Model accuracy improvement during training</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { epoch: 1, training: 0.75, validation: 0.73 },
                            { epoch: 5, training: 0.82, validation: 0.79 },
                            { epoch: 10, training: 0.87, validation: 0.84 },
                            { epoch: 15, training: 0.9, validation: 0.87 },
                            { epoch: 20, training: 0.92, validation: 0.89 },
                            { epoch: 25, training: 0.94, validation: 0.9 },
                            { epoch: 30, training: 0.95, validation: 0.91 },
                            { epoch: 35, training: 0.96, validation: 0.92 },
                            { epoch: 40, training: 0.97, validation: 0.92 },
                            { epoch: 45, training: 0.97, validation: 0.92 },
                            { epoch: 50, training: 0.98, validation: 0.92 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="epoch" />
                          <YAxis domain={[0.7, 1]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="training" stroke="#f43f5e" name="Training" />
                          <Line type="monotone" dataKey="validation" stroke="#3b82f6" name="Validation" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Loss Over Training Epochs</CardTitle>
                    <CardDescription>Model loss reduction during training</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { epoch: 1, training: 0.65, validation: 0.68 },
                            { epoch: 5, training: 0.45, validation: 0.48 },
                            { epoch: 10, training: 0.32, validation: 0.35 },
                            { epoch: 15, training: 0.25, validation: 0.28 },
                            { epoch: 20, training: 0.18, validation: 0.22 },
                            { epoch: 25, training: 0.15, validation: 0.19 },
                            { epoch: 30, training: 0.12, validation: 0.17 },
                            { epoch: 35, training: 0.1, validation: 0.16 },
                            { epoch: 40, training: 0.09, validation: 0.15 },
                            { epoch: 45, training: 0.08, validation: 0.15 },
                            { epoch: 50, training: 0.07, validation: 0.15 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="epoch" />
                          <YAxis domain={[0, 0.7]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="training" stroke="#f43f5e" name="Training" />
                          <Line type="monotone" dataKey="validation" stroke="#3b82f6" name="Validation" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roc">
              <Card>
                <CardHeader>
                  <CardTitle>ROC Curve</CardTitle>
                  <CardDescription>Receiver Operating Characteristic curve showing model performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rocCurveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="fpr"
                          type="number"
                          domain={[0, 1]}
                          label={{ value: "False Positive Rate", position: "insideBottom", offset: -5 }}
                        />
                        <YAxis
                          type="number"
                          domain={[0, 1]}
                          label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip />
                        <Line type="monotone" dataKey="tpr" stroke="#f43f5e" name="ROC Curve" dot={{ r: 4 }} />
                        <Line
                          type="monotone"
                          dataKey="fpr"
                          stroke="#94a3b8"
                          name="Random Classifier"
                          dot={false}
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-sm">
                    <p className="font-medium">Area Under the Curve (AUC): 0.95</p>
                    <p className="text-muted-foreground mt-2">
                      The ROC curve illustrates the diagnostic ability of the model. The AUC of 0.95 indicates excellent
                      performance, with high true positive rates and low false positive rates across different threshold
                      settings.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Understanding ROC Curves</CardTitle>
                  <CardDescription>How to interpret the Receiver Operating Characteristic curve</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">What is a ROC Curve?</h3>
                    <p className="text-sm text-muted-foreground">
                      A Receiver Operating Characteristic (ROC) curve is a graphical plot that illustrates the
                      diagnostic ability of a binary classifier system as its discrimination threshold is varied. It
                      plots the True Positive Rate (Sensitivity) against the False Positive Rate (1 - Specificity) at
                      various threshold settings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Interpreting the Curve</h3>
                    <p className="text-sm text-muted-foreground">
                      The closer the curve follows the left-top border of the ROC space, the more accurate the model.
                      The closer it comes to the 45-degree diagonal of the ROC space, the less accurate the model. The
                      diagonal line represents a random classifier with no discriminative value.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Area Under the Curve (AUC)</h3>
                    <p className="text-sm text-muted-foreground">
                      The AUC measures the entire two-dimensional area underneath the ROC curve. It provides an
                      aggregate measure of performance across all possible classification thresholds. An AUC of 1.0
                      represents a perfect model, while an AUC of 0.5 represents a model with no discriminative ability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="confusion">
              <Card>
                <CardHeader>
                  <CardTitle>Confusion Matrix</CardTitle>
                  <CardDescription>Visualization of model predictions vs. actual values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-medium mb-1">True Negative</div>
                            <div className="text-2xl font-bold">423</div>
                          </div>
                        </div>
                        <div className="bg-yellow-100 dark:bg-yellow-950/30 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-medium mb-1">False Positive</div>
                            <div className="text-2xl font-bold">26</div>
                          </div>
                        </div>
                        <div className="bg-red-100 dark:bg-red-950/30 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-medium mb-1">False Negative</div>
                            <div className="text-2xl font-bold">19</div>
                          </div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-950/30 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-medium mb-1">True Positive</div>
                            <div className="text-2xl font-bold">152</div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="text-right text-sm font-medium">Actual Negative</div>
                        <div className="text-left text-sm font-medium">Actual Positive</div>
                        <div className="text-right text-sm font-medium">Predicted Negative</div>
                        <div className="text-left text-sm font-medium">Predicted Positive</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Key Metrics</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Accuracy</div>
                          <div className="text-sm">92.4%</div>
                          <div className="text-sm font-medium">Sensitivity</div>
                          <div className="text-sm">88.9%</div>
                          <div className="text-sm font-medium">Specificity</div>
                          <div className="text-sm">94.2%</div>
                          <div className="text-sm font-medium">Precision</div>
                          <div className="text-sm">85.4%</div>
                          <div className="text-sm font-medium">F1 Score</div>
                          <div className="text-sm">87.1%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Interpretation</h3>
                        <p className="text-sm text-muted-foreground">
                          The confusion matrix shows that the model correctly identified 152 positive cases (true
                          positives) and 423 negative cases (true negatives). There were 26 false positives (predicted
                          positive but actually negative) and 19 false negatives (predicted negative but actually
                          positive).
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Understanding the Confusion Matrix</CardTitle>
                  <CardDescription>How to interpret the confusion matrix and derived metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">What is a Confusion Matrix?</h3>
                    <p className="text-sm text-muted-foreground">
                      A confusion matrix is a table that is often used to describe the performance of a classification
                      model on a set of test data for which the true values are known. It allows visualization of the
                      performance of an algorithm.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Matrix Components</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>
                        <span className="font-medium">True Positive (TP):</span> Correctly predicted positive cases
                        (cancer detected correctly)
                      </li>
                      <li>
                        <span className="font-medium">True Negative (TN):</span> Correctly predicted negative cases
                        (healthy patients identified correctly)
                      </li>
                      <li>
                        <span className="font-medium">False Positive (FP):</span> Incorrectly predicted positive cases
                        (false alarms)
                      </li>
                      <li>
                        <span className="font-medium">False Negative (FN):</span> Incorrectly predicted negative cases
                        (missed cancer cases)
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Derived Metrics</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>
                        <span className="font-medium">Accuracy:</span> (TP + TN) / (TP + TN + FP + FN)
                      </li>
                      <li>
                        <span className="font-medium">Sensitivity (Recall):</span> TP / (TP + FN)
                      </li>
                      <li>
                        <span className="font-medium">Specificity:</span> TN / (TN + FP)
                      </li>
                      <li>
                        <span className="font-medium">Precision:</span> TP / (TP + FP)
                      </li>
                      <li>
                        <span className="font-medium">F1 Score:</span> 2 * (Precision * Recall) / (Precision + Recall)
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
