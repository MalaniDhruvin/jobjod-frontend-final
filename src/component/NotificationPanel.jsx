"use client"

import { useEffect, useRef, useState } from "react"
import t4 from "../image/t4.png"
import axios from "axios"
import { USER_BASE_URL } from "../config"

const NotificationPanel = ({ isOpen, onClose }) => {
  const panelRef = useRef(null)
  const [notifications, setNotifications] = useState([])

  // Fetch notifications on open
  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId")
      const authToken = localStorage.getItem("authToken")

      if (!userId || !authToken) return

      try {
        const res = await axios.get(`${USER_BASE_URL}/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        setNotifications(res.data.notifications)
      } catch (err) {
        console.error("Failed to fetch notifications:", err)
      }
    }

    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Mobile overlay */}
      <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Notification panel */}
      <div
        ref={panelRef}
        className={`fixed md:absolute 
          top-16 md:top-full md:right-0 
          inset-x-0 md:inset-auto
          z-50 md:z-20
          md:mt-2
          md:w-96 lg:w-[420px]
          max-h-[80vh] md:max-h-[500px]
          overflow-y-auto
          bg-white 
          md:rounded-2xl 
          shadow-lg
          transition-all
          duration-200
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-black mb-4 text-center md:text-left">Notifications</h2>
          <div className="space-y-2">
            {notifications.length > 0 ? notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-center p-3 rounded-lg ${
                  notification.type === "profileView" ? "bg-purple-50" : "bg-white"
                }`}
              >
                {notification.type === "profileView" ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={notification.avatar || t4}
                      alt={notification.user || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 overflow-hidden flex-shrink-0">
                    <img
                      src={notification.logo || t4}
                      alt={notification.company || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="ml-4 flex-1">
                  {notification.type === "profileView" ? (
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{notification.user}</span> {notification.message}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{notification.company}</span> {notification.message}
                    </p>
                  )}
                </div>
                {/* Replace isNew with !isRead */}
                {!notification.isRead && (
                  <span className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></span>
                )}
              </div>
            )): (
              <div className="flex items-center justify-center p-4 text-gray-500">
                No notifications available.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationPanel
