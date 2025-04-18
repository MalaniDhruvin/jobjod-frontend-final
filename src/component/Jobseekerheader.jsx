import React, { useEffect, useState } from "react";
import { DashboardSidebar } from "./Siderbar";
import { Bell, Mail, Menu, Search, X, MapPin } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { Link } from "react-router-dom";
import image2 from "../image/profile.jpg";

const Jobseekerheader = ({ isSidebarVisible }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(isSidebarVisible);
  }, [isSidebarVisible]);

  return (
    <>
      <DashboardSidebar isOpen={isSidebarOpen} />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <header className="lg:w-[calc(100%-16rem)] left-[16rem] sticky top-0 z-40 w-full border-b bg-white">
        <div className="flex h-16 items-center px-4">
          {/* Mobile sidebar toggle */}
          {/* <button
            className="mr-2 rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{isSidebarOpen ? "Close sidebar" : "Open sidebar"}</span>
          </button> */}

          {/* Desktop search */}
          <div className="hidden flex-1 md:block">
            <div className="flex max-w-md gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search job title or skill"
                  className="h-9 w-full rounded-full border border-gray-200 bg-white pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search location"
                  className="h-9 w-full rounded-full border border-gray-200 bg-white pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile search toggle */}
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

        {/* Mobile search expanded */}
        {showMobileSearch && (
          <div className="px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search job title or skill"
                  className="h-9 w-full rounded-full border border-gray-200 bg-white pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search location"
                  className="h-9 w-full rounded-full border border-gray-200 bg-white pl-8 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Jobseekerheader;
