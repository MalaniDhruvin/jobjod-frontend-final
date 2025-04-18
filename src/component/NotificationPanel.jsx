"use client"

import { useEffect, useRef } from "react"
import t4 from "../image/t4.png"

const NotificationPanel = ({ isOpen, onClose }) => {
  const panelRef = useRef(null)

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: "profileView",
      user: "Hamish Marsh",
      message: "viewed your profile",
      avatar: t4, // Placeholder image
      isNew: true,
    },
    {
      id: 2,
      type: "jobPosting",
      company: "Grameenphone",
      message: "is hiring Product Designer",
      logo: t4, // Placeholder image
    },
    {
      id: 3,
      type: "profileView",
      user: "Hamish Marsh",
      message: "viewed your profile",
      avatar: t4, // Placeholder image
      isNew: true,
    },
    {
      id: 4,
      type: "profileView",
      user: "Hamish Marsh",
      message: "viewed your profile",
      avatar: t4, // Placeholder image
    },
    {
      id: 5,
      type: "jobPosting",
      company: "Grameenphone",
      message: "is hiring Product Designer",
      logo: t4, // Placeholder image
    },
  ]

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
        className={`
          fixed md:absolute 
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
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-semibold text-black mb-4 text-center md:text-left">Notifications</h2>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center p-3 rounded-lg ${
                  notification.type === "profileView" ? "bg-purple-50" : "bg-white"
                }`}
              >
                {notification.type === "profileView" ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={notification.avatar || "/placeholder.svg"}
                      alt={notification.user || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 overflow-hidden flex-shrink-0">
                    <img
                      src={notification.logo || "/placeholder.svg"}
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
                {notification.isNew && <span className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationPanel










// "use client"

// import { useEffect, useRef } from "react"
// import t4 from "../image/t4.png"

// const NotificationPanel = ({ isOpen, onClose }) => {
//   const panelRef = useRef(null)

//   // Sample notifications data
//   const notifications = [
//     {
//       id: 1,
//       type: "profileView",
//       user: "Hamish Marsh",
//       message: "viewed your profile",
//       avatar: t4, // Placeholder image
//       isNew: true
//     },
//     {
//       id: 2,
//       type: "jobPosting",
//       company: "Grameenphone",
//       message: "is hiring Product Designer",
//       logo: t4 // Placeholder image
//     },
//     {
//       id: 3,
//       type: "profileView",
//       user: "Hamish Marsh",
//       message: "viewed your profile",
//       avatar: t4, // Placeholder image
//       isNew: true
//     },
//     {
//       id: 4,
//       type: "profileView",
//       user: "Hamish Marsh",
//       message: "viewed your profile",
//       avatar: t4 // Placeholder image
//     },
//     {
//       id: 5,
//       type: "jobPosting",
//       company: "Grameenphone",
//       message: "is hiring Product Designer",
//       logo: t4 // Placeholder image
//     }
//   ]

//   // Close panel when clicking outside (only on desktop)
//   useEffect(() => {
//     const handleClickOutside = event => {
//       if (panelRef.current && !panelRef.current.contains(event.target)) {
//         onClose()
//       }
//     }

//     // Only add the event listener on desktop
//     const isMobile = window.innerWidth < 768
//     if (isOpen && !isMobile) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen, onClose])

//   // Handle body scroll lock when panel is open on mobile
//   useEffect(() => {
//     const isMobile = window.innerWidth < 768
//     if (isMobile && isOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = ""
//     }

//     return () => {
//       document.body.style.overflow = ""
//     }
//   }, [isOpen])

//   if (!isOpen) return null

//   return (
//     <>
//       {/* Notification panel */}
//       <div
//         ref={panelRef}
//         className={`
//         fixed md:absolute 
//         inset-0 md:inset-auto
//         top-0 md:top-full md:right-0 
//         z-50 md:z-20
//         md:mt-2
//         md:w-96 lg:w-[420px]
//         h-full md:h-auto
//         md:max-h-[500px]
//         overflow-y-auto
//         bg-white 
//         md:rounded-2xl 
//         shadow-lg
//         transition-all
//         duration-200
//         ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
//       `}
//       >
//         <div className="flex flex-col h-full md:h-auto">
//           {/* Header with close button on mobile */}
//           <div className="sticky top-0 bg-white p-4 border-b md:border-b-0 flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-black">Notifications</h2>
//             <button
//               onClick={onClose}
//               className="md:hidden p-2 text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//             </button>
//           </div>

//           {/* Notifications list */}
//           <div className="flex-1 p-4 md:p-6 pt-2 md:pt-4">
//             <div className="space-y-2">
//               {notifications.map(notification => (
//                 <div
//                   key={notification.id}
//                   className={`flex items-center p-3 rounded-lg ${
//                     notification.type === "profileView"
//                       ? "bg-purple-50"
//                       : "bg-white"
//                   }`}
//                 >
//                   {notification.type === "profileView" ? (
//                     <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
//                       <img
//                         src={notification.avatar || "/placeholder.svg"}
//                         alt={notification.user || ""}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-12 h-12 overflow-hidden flex-shrink-0">
//                       <img
//                         src={notification.logo || "/placeholder.svg"}
//                         alt={notification.company || ""}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className="ml-4 flex-1">
//                     {notification.type === "profileView" ? (
//                       <p className="text-sm text-gray-900">
//                         <span className="font-semibold">
//                           {notification.user}
//                         </span>{" "}
//                         {notification.message}
//                       </p>
//                     ) : (
//                       <p className="text-sm text-gray-900">
//                         <span className="font-semibold">
//                           {notification.company}
//                         </span>{" "}
//                         {notification.message}
//                       </p>
//                     )}
//                   </div>
//                   {notification.isNew && (
//                     <span className="w-3 h-3 bg-pink-500 rounded-full flex-shrink-0"></span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default NotificationPanel
