import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Plant from "./pages/RawImage";
import MainLayout from "./components/layout/MainLayout";
import UploadImage from "./pages/UploadImage";
import ChatBotComponent from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ModelMetricsPage from "./pages/ModelMetricsPage";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Plant />} />
            <Route path="UploadImage" element={<UploadImage />} />
            <Route path="chatbot" element={<ChatBotComponent />} />
            <Route path="model-metrics" element={<ModelMetricsPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}