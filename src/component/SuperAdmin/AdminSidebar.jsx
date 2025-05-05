import React, { useState } from "react";
import dashboard from "../../image/dashboard.png";
import { RxDashboard } from "react-icons/rx";
import { PiBagSimpleFill } from "react-icons/pi";
import { PiMonitorFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import logo2 from "../../image/logo2.png";
import Dheader from "../Dheader";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { Link,useNavigate } from "react-router-dom";

const AdminSidebar = ({ substrLocation }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    
    // any other clean-up...
    navigate("/"); // adjust this to your login route
  };
  
  return (
    <div>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 text-gray-700 hover:text-gray-900"
      >
        {isMobileMenuOpen ? (
          <AiOutlineClose size={24} />
        ) : (
          <GiHamburgerMenu size={24} />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
  w-64 flex-shrink-0 bg-white shadow-lg fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out
  ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 lg:static lg:block
`}
      >
        {/* Sidebar Content */}
        <div className="flex items-center justify-center h-20">
          <Link to="/">
            <img src={logo2} alt="JOBJOD" className="h-9" />
          </Link>
        </div>

        {/* Profile */}
        <div className="flex items-center p-4 space-x-4 m-auto">
          <div className="relative">
            <img
              src={dashboard}
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <span className="absolute bottom-0 right-0 inline-block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <p className="text-gray-700 font-bold">Hello, Company</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 mt-6">
          <ul>
            <li className="mb-2">
              <Link
                to="/AdminDashboard"
                className={`${
                  substrLocation === "AdminDashboard"
                    ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white"
                    : "text-black bg-white"
                } flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
              >
                <RxDashboard className="mr-2" />{" "}
                <span className="m-auto">Dashboard</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/Jobs"
                className={`${
                  substrLocation === "Jobs"
                    ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white"
                    : "text-black bg-white"
                } flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
              >
                <PiBagSimpleFill className="mr-2" />{" "}
                <span className="m-auto">Jobs</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/AdminJobseeker"
                className={`${
                  substrLocation === "AdminJobseeker"
                    ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white"
                    : "text-black bg-white"
                } flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
              >
                <FaUser className="mr-2" />{" "}
                <span className="m-auto">Jobseekers</span>
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/AdminCompanies"
                className={`${
                  substrLocation === "AdminCompanies"
                    ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white"
                    : "text-black bg-white"
                } flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
              >
                <PiMonitorFill className="mr-2" />{" "}
                <span className="m-auto">Companies</span>
              </Link>
            </li>
            <li>
              <Link
                to="##"
                className="flex items-center p-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <FaUser className="mr-2" />{" "}
                <span className="m-auto">Enquiries</span>
              </Link>
            </li>
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
    </div>
  );
};

export default AdminSidebar;
