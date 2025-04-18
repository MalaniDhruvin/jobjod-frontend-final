"use client";

import {
  Share2,
  MoreHorizontal,
  MessageSquare,
  Briefcase,
  Camera,
  SquarePen,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls

export function ProfileHeader({ name, role, avatarUrl }) {
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");
  
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [profileData, setProfileData] = useState({ name: "", role: "" });

  // Fetch user data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const { fullName } = response.data.data;
          setProfileData({ name: fullName });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clean up object URL when component unmounts or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Here you would typically upload the image to your server
      console.log("File selected:", file.name);
      // uploadProfileImage(file); // This would be your API call to upload the image
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div
          className="relative order-1 sm:order-none cursor-pointer group"
          onClick={handleProfileClick}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={`${profileData.name}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={avatarUrl || "/placeholder.svg?height=96&width=96"}
                alt={`${profileData.name}'s profile`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Edit overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <SquarePen className="w-5 h-5" />
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left order-last">
          <h1 className="text-2xl font-semibold">{profileData.name}</h1>
          <p className="text-gray-600">{profileData.role}</p>
        </div>
      </div>

      <div className="flex items-center justify-center sm:justify-start gap-2">
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <Link to="/Message">
                  <button
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      console.log("Message clicked");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Message
                  </button>
                </Link>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    console.log("Offer Job clicked");
                    setIsDropdownOpen(false);
                  }}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Offer Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
