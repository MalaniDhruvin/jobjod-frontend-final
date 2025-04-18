import React, { useState } from "react";
import dashboard from "../../image/dashboard.png";
import { RxDashboard } from "react-icons/rx";
import { PiBagSimpleFill } from "react-icons/pi";
import { PiMonitorFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import logo2 from "../../image/logo2.png";
import Dheader2 from "../Dheader2";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import Temp from "../../component/SuperAdmin/Temp";
import AdminSidebar from "./AdminSidebar";

function Jobs() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location=useLocation()
  const substrLocation=location.pathname.substring(1)
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <AdminSidebar substrLocation={substrLocation} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Dheader2 />

        {/* Content Area */}
        <main className="flex-1 p-3 overflow-y-auto">
          <Temp />
        </main>
      </div>
    </div>
  );
}

export default Jobs;
