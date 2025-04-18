import React, { useState } from 'react';
import dashboard from "../image/dashboard.png";
import { RxDashboard } from "react-icons/rx";
import { PiBagSimpleFill } from "react-icons/pi";
import { PiMonitorFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import logo2 from "../image/logo2.png";
import Dheader from "./Dheader";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import CompanyProfile from './CompanyApp';
import { Link, useLocation } from 'react-router-dom';
import DashSidebar from './DashSidebar';


function CompanyApplications() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation()
  const substrLocation=location.pathname.substring(1);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Menu Button */}
     <DashSidebar substrLocation={substrLocation}></DashSidebar>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Dheader />

        {/* Content Area */}
          <CompanyProfile />
        
      </div>
    </div>
  );
}

export default CompanyApplications;
