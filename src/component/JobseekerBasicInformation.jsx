import { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import profile from "../image/profile.jpg";
import { USER_BASE_URL } from "../config";

export default function ProfileInfo() {
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: "anamoulrouf.bd@gmail.com",
    phone: "+919876543210",
    gender: "Male",
    birthDate: "2003-03-07", // Use YYYY-MM-DD format for date input
    location: "New York, USA",
    pincode: "123456",
  });

  const [formData, setFormData] = useState({ ...profileData });
  const [errors, setErrors] = useState({});

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{4,6})$/;
  const pincodeRegex = /^[0-9]{6}$/;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const apiData = response.data.data;

          // Extract only the required fields using destructuring
          const filteredData = {
            email: apiData.email || "",
            phone: apiData.phone || "",
            gender: apiData.gender || "",
            birthDate: apiData.birthDate || "",
            location: apiData.location || "",
            pincode: apiData.pincode || "",
          };

          setProfileData(filteredData);
          setFormData(filteredData);
        } else {
          alert("Failed to fetch profile data. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("Error fetching profile data. Please try again.");
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!phoneRegex.test(value)) {
        setErrors({
          ...errors,
          phone: "Invalid phone number format",
        });
      } else {
        setErrors({
          ...errors,
          phone: null,
        });
      }
    } else if (name === "pincode") {
      if (!pincodeRegex.test(value)) {
        setErrors({
          ...errors,
          pincode: "Invalid pincode. Please enter a 6-digit pincode.",
        });
      } else {
        setErrors({
          ...errors,
          pincode: null,
        });
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    // Check for validation errors
    if (errors.phone || errors.pincode) {
      alert("Please correct the errors");
      return;
    }

    try {
      // Call the API to save the profile data
      const response = await axios.put(
        `${USER_BASE_URL}/users/${userId}`, // Replace with your API endpoint for saving profile
        formData, // Send the updated form data
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Optional, if needed for authentication
          },
        }
      );

      if (response.status === 200) {
        // Update profile data with the response from the API (if needed)
        setProfileData(formData);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error saving your profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 p-4 border border-gray-200 rounded-xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b ">
              {/* <User  /> */}
              <img
                src={profile || "/placeholder.svg"}
                alt="Profile"
                className="rounded-full "
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Basic Information</h2>
              <p>Update profile information</p>
            </div>
          </div>
          {!isEditing && (
            <button
              className="py-2 px-4 border border-purple-500 text-purple-500 rounded-xl hover:bg-purple-50 md:hidden"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row mt-4 md:mt-0">
            <button
              className="py-2 px-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 w-full md:w-auto"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="py-2 px-4 border border-gray-200 rounded-xl hover:bg-gray-100 w-full md:w-auto"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="py-2 px-4 border border-purple-500 text-purple-500 rounded-xl hover:bg-purple-50 hidden md:block "
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Email Address</div>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          ) : (
            <div className="text-gray-500">{profileData.email}</div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Phone Number</div>
          {isEditing ? (
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.phone && (
                <div className="text-red-500 text-sm">{errors.phone}</div>
              )}
            </div>
          ) : (
            <div className="text-gray-700 font-medium">{profileData.phone}</div>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Gender</div>
          {isEditing ? (
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          ) : (
            <div className="text-gray-700 font-medium">
              {profileData.gender}
            </div>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Date of Birth</div>
          {isEditing ? (
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          ) : (
            <div className="text-gray-700 font-medium">
              {profileData.birthDate}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Location</div>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          ) : (
            <div className="text-gray-700 font-medium">
              {profileData.location}
            </div>
          )}
        </div>

        {/* Pincode */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500">Pincode</div>
          {isEditing ? (
            <div>
              <input
                type="number"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${
                  errors.pincode ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.pincode && (
                <div className="text-red-500 text-sm">{errors.pincode}</div>
              )}
            </div>
          ) : (
            <div className="text-gray-700 font-medium">
              {profileData.pincode}
            </div>
          )}
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .flex-col {
            flex-direction: column;
          }
          .w-full {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
