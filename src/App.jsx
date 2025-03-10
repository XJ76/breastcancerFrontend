import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Plant from "./pages/RawImage";
import MainLayout from "./components/layout/MainLayout";
import UploadImage from "./pages/UploadImage";
import ChatBotComponent from "./pages/Chatbot";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Plant />} />
            <Route path="/UploadImage" element={<UploadImage />} />
            <Route path="/chatbot" element={<ChatBotComponent />} /> {/* Add route to the ChatBot component */}
          </Route>
        </Routes>
      </Router>
    </>
  );
}