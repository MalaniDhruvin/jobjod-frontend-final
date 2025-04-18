import React, { useState } from "react";
import { Bell, Mail, Menu, Search, X } from "lucide-react";
import { RxDashboard } from "react-icons/rx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationPanel from "../component/NotificationPanel";
import image from "../image/logo2.png";
import image2 from "../image/profile.jpg";
import t4 from "../image/t4.png";
import { HiX } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

export const DashboardSidebar = () => {
  const location = useLocation();
  const substrLocation = location.pathname.substring(1);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const cn = (...classes) => classes.filter(Boolean).join(" ");

  const getHeaderStyle = (header) =>
    `${
      substrLocation.toLowerCase() === header.toLowerCase()
        ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white"
        : "text-black bg-white"
    } flex items-center p-2 rounded-xl text-sm font-medium hover:text-black bg-gray-800 hover:bg-gray-100 `;

  // Logout function: remove userId and authToken from localStorage and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <>
      {/* Hamburger button for opening sidebar on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 fixed top-4 left-4 z-50"
      >
        <GiHamburgerMenu size={24} />
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="flex items-center justify-center h-20">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-black lg:hidden"
              aria-label="Close sidebar"
            >
              <AiOutlineClose size={24} />
            </button>

            <div className="flex items-center">
              <Link to="/">
                <img
                  src={image || "/placeholder.svg"}
                  alt="JobJod"
                  className="text-center items-center md:mx-auto"
                />
              </Link>
            </div>
          </div>

          {/* Profile Section */}
          <div className="flex items-center p-4 space-x-4 m-auto">
            <div className="relative">
              <img
                src={image2 || "/placeholder.svg"}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <p className="text-sm text-black font-bold">Hello, Anamoul</p>
          </div>
        </div>

        <nav className="flex-1 p-4 mt-6">
          <ul className="space-y-2">
            <li>
              <Link to="/Jobseeker" className={getHeaderStyle("jobseeker")}>
                <RxDashboard />
                <span className="mx-auto">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link to="/Job" className={getHeaderStyle("job")}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="mx-auto">Jobs</span>
              </Link>
            </li>

            <li>
              <Link to="/Profile" className={getHeaderStyle("profile")}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="mx-auto">Profile</span>
              </Link>
            </li>

            <li>
              <Link to="##" className={getHeaderStyle("##")}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="mx-auto">Settings</span>
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex text-[14px] items-center text-black font-medium p-2 rounded-lg hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-11V4"
                  />
                </svg>
                <span className="mx-auto">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;
