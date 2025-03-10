import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBrain } from "react-icons/fa";

const MainLayout = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showSplash ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-pink-700 to-pink-900 text-white text-5xl font-extrabold z-50">
          <div className="text-center">
            <FaBrain className="inline-block mr-4 animate-pulse text-pink-200" />
            <h1 className="animate-pulse inline-block">Breast Cancer AI</h1>
            <p className="mt-4 text-lg font-medium text-pink-100">AI-Powered Breast Cancer Detection</p>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Sidebar />
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default MainLayout;