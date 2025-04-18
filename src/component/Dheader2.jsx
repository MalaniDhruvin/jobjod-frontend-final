import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBell,
  faEnvelope,
  faBars,
  faXmark,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import profile from "../image/dashboard.png";
import { Bell, Mail, Search, X } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import image2 from "../image/profile.jpg";
import { Link } from "react-router-dom";
// Remove the direct import of the image that's causing the error
// import profile from '../image/dashboard.png';

const Dheader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Use a placeholder or default avatar when the image isn't available
  const profileImageUrl = "/placeholder.svg?height=40&width=40";

  return (
    <header className="bg-white border-b-2 py-2 px-3 sm:px-4 flex flex-wrap items-center justify-between">
      {/* Mobile Menu Toggle */}
      <div className="block lg:hidden"></div>

      {/* Search Bar - Desktop */}
      <div className="hidden md:flex flex-grow mr-4"></div>

      {/* Icons and Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Search Toggle */}
        <div className="md:hidden flex items-center"></div>
        <div className="flex flex-1 justify-end md:hidden">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label={showMobileSearch ? "Close search" : "Open search"}
          >
            {showMobileSearch ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2  md:gap-4">
          <div className="relative pt-2">
            <button
              className="relative rounded-full  hover:bg-gray-100"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
            </button>

            <NotificationPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          <Link
            to="/Message"
            className="relative rounded-full p-2 hover:bg-gray-100"
          >
            <Mail className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
          </Link>

          <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-primary md:h-10 md:w-10">
            <img
              src={image2 || "/placeholder.svg"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Dheader;
