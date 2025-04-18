"use client"

import { useState } from "react"
import JobseekerBasicInformation from "./JobseekerBasicInformation";
// Sample profile data matching the image
const sampleProfile = {
  email: "john.doe@example.com",
  gender: "Male",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "www.johndoe.dev"
}

export function ProfileInfo({ profile = sampleProfile, onEdit = () => {} }) {
  const fields = [
    { label: "Email Address", value: sampleProfile.email },
    { label: "Gender", value: sampleProfile.gender },
    { label: "Phone Number", value: sampleProfile.phone },
    { label: "Location", value: sampleProfile.location },
    { label: "Website", value: sampleProfile.website }
  ]

  return (
    // <div className="flex-1">
    //   <div className="p-2 flex justify-between items-start mb-6">
    //     <div>
    //       <h1 className="text-2xl font-semibold">Basic Information</h1>
    //       <p className="text-gray-500">Update profile information</p>
    //     </div>
    //     <button
    //       className="px-6 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 border-0 rounded-lg"
    //       onClick={onEdit}
    //     >
    //       Edit
    //     </button>
    //   </div>
    //   <div className="bg-white rounded-2xl shadow-sm border p-6 w-85  overflow-hidden">
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //       {fields.map(field => (
    //         <div key={field.label} className="break-words">
    //           <label className="block text-sm text-gray-500 mb-1">
    //             {field.label}
    //           </label>
    //           <p className="font-medium text-lg">{field.value}</p>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <JobseekerBasicInformation/>
  )
}

// Demo component to show the ProfileInfo in action
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    // In a real app, this would open an edit form
    setTimeout(() => setIsEditing(false), 1000)
  }

  return (
    <div className="p-6  min-h-screen">
      <ProfileInfo onEdit={handleEdit} />
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p>Edit form would appear here</p>
            <button
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
              onClick={() => setIsEditing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
