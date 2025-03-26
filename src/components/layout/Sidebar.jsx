import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegHospital } from "react-icons/fa";
import { AiOutlineFileImage } from "react-icons/ai";
import { AiOutlineRobot } from "react-icons/ai";
import { FaBrain } from "react-icons/fa";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const Menus = [
    { title: "Symptom Analysis", to: "/dashboard", icon: <AiOutlineFileImage className={location.pathname === "/dashboard" ? "text-pink-600" : "text-gray-500"} /> },
    { title: "Analyze Monogram", to: "/dashboard/UploadImage", icon: <FaRegHospital className={location.pathname === "/dashboard/UploadImage" ? "text-pink-600" : "text-gray-500"} /> },
    { title: "AI Assistant", to: "/dashboard/chatbot", icon: <AiOutlineRobot className={location.pathname === "/dashboard/chatbot" ? "text-pink-600" : "text-gray-500"} /> },
    { title: "Model Metrics", to: "/dashboard/model-metrics", icon: <FaBrain className={location.pathname === "/dashboard/model-metrics" ? "text-pink-600" : "text-gray-500"} /> },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-64" : "w-16"
        } bg-gradient-to-r from-pink-950 to-pink-900 h-screen fixed top-0 left-0 p-5 pt-8 z-50 transition-all duration-300 border-r border-pink-800 shadow-2xl`}
      >
        <button
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-pink-800 border-2 rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-pink-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
            />
          </svg>
        </button>

        <div className="flex items-center justify-center mb-8">
          {open ? (
            <h1 className="text-2xl font-bold text-pink-200">Breast Cancer AI</h1>
          ) : (
            <FaBrain className="text-3xl text-pink-300" />
          )}
        </div>

        <ul className="mt-20">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex items-center p-4 rounded-lg cursor-pointer hover:bg-pink-900 hover:text-pink-300 text-sm gap-x-4 ${
                Menu.gap ? "mt-9" : "mt-4"
              } ${
                location.pathname === Menu.to ? "bg-pink-900 text-pink-300" : "text-pink-200"
              } group relative`}
            >
              <Link
                to={Menu.to}
                className={`flex items-center gap-x-4 w-full ${
                  !open && "justify-center"
                }`}
              >
                <span className="text-2xl">{Menu.icon}</span>
                <span
                  className={`${
                    !open ? "hidden" : "origin-left duration-200 text-xl font-semibold"
                  }`}
                >
                  {Menu.title}
                </span>
              </Link>
              {!open && (
                <span className="absolute left-14 whitespace-nowrap bg-pink-900 text-pink-300 p-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {Menu.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
