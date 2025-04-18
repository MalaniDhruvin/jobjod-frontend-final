import React from 'react'
import { useState } from "react"
import { Bell, Mail, Menu, Search, X } from "lucide-react"
import { RxDashboard } from "react-icons/rx"
import { Link, useLocation } from "react-router-dom"
import NotificationPanel from "../component/NotificationPanel"
import image from "../image/logo2.png"
import image2 from "../image/profile.jpg"
import t4 from "../image/t4.png"

const Jobseekersidebar = ({ substrLocation }) => {
  const cn = (...classes) => classes.filter(Boolean).join(" ")

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",

        )}
      >
        <div className="p-6">
          <div className="flex items-center mb-4 ">
            <Link to="/">
              <img src={image || "/placeholder.svg"} alt="JobJod" className="text-center items-center mx-10" />
            </Link>
          </div>

          {/* Profile Section */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2 overflow-hidden">
              <img src={image2 || "/placeholder.svg"} alt="profile" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-black font-bold ">Hello, Anamoul</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link to="/Jobseeker" className={`${substrLocation === 'Jobseeker' ? 'bg-gray-900 text-white hover:bg-gray-900 hover:text-white' : 'text-black bg-white'} flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
                >

                  <RxDashboard />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>

              <li>
                <Link to="/Job" className={`${substrLocation === 'Job' ? 'bg-gray-900 text-white hover:bg-gray-900 hover:text-white' : 'text-black bg-white'} flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="ml-3">Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/Profile" className={`${substrLocation === 'Profile' ? 'bg-gray-900 text-white hover:bg-gray-900 hover:text-white' : 'text-black bg-white'} flex items-center p-2 rounded-xl text-sm font-medium hover:text-black  bg-gray-800 hover:bg-gray-100 `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="ml-3">Profile</span>
                </Link>
              </li>
              <li>
                <Link to="##" className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="ml-3">Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Jobseekersidebar