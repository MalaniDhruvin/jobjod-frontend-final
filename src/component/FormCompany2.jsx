import { useState } from "react";
import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import Dheader3 from "./Dheader3";
import axios from "axios";
import { BASE_URL } from "../config";

export default function FormCompany2() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    userId: userId,
    companyIndustry: "",
    overview: "",
    vision: "",
    mission: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);

    // Include selected industries in form data
    const dataToSubmit = { ...formData, companyIndustry: selectedIndustries };
    console.log("Industries:", dataToSubmit);

    try {
      // Send data to backend
      const response = await axios.post(
        `${BASE_URL}/company-overview`,
        dataToSubmit, // Send form data including industries
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token if required
            "Content-Type": "application/json", // Specify the content type
          },
        }
      );

      if (response.status === 201) {
        // Handle successful response
        const result = await response.data;
        console.log("Form submitted successfully:", result);
        // You can redirect to another page or show a success message here
        navigate("/FormCompany3");
      } else {
        // Handle errors (e.g., API returned an error)
        const errorData = await response.data;
        console.error("Form submission failed:", errorData);
      }
    } catch (error) {
      // Handle any network or unexpected errors
      console.error("Error occurred during form submission:", error);
    }
  };

  const handleSkip = () => {
    console.log("Skipped to next step");
    // Handle skip logic here
  };

  const industries = [
    "Software Development",
    "Data Science",
    "Product Design",
    "Digital Marketing",
    "Customer Service",
    "Sales & Business",
    "Healthcare & Medical",
    "Finance & Accounting",
    "Education & Training",
    "Engineering",
  ];

  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter available industries based on search term
  const filteredIndustries = industries.filter(
    (industry) =>
      !selectedIndustries.includes(industry) &&
      industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add selected industry
  const handleAddIndustry = (industry) => {
    setSelectedIndustries([...selectedIndustries, industry]);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Remove selected industry
  const handleRemoveIndustry = (index) => {
    setSelectedIndustries(selectedIndustries.filter((_, i) => i !== index));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Dheader3 />
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-r from-purple-100 via-white to-purple-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group-y8VIQbQhSCi7xcFqUiFvxXXwZtkvps.svg"
            alt="Background Pattern"
            className="w-full h-full object-cover opacity-30"
            width={1440}
            height={1024}
            priority
          />
        </div>
        <div className="relative w-full max-w-4xl">
          {/* Progress Steps */}
          <div className="flex justify-between mb-4 md:mb-6 px-2 md:px-8">
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%]"></div>
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
          </div>

          {/* Form Container */}
          <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] md:overflow-y-auto">
            {/* Header with back button */}
            <div className="flex items-center mb-4 md:mb-8">
              <button
                type="button"
                className="mr-3 md:mr-4 rounded-full border border-gray-300 p-0.5 md:p-1"
                aria-label="Go back"
              >
                <Link to="/FormCompany">
                  <div>
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </Link>
              </button>
              <h2 className="text-xl md:text-2xl font-bold">Overview</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Industry Dropdown */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company industry
                </label>

                <div className="relative" ref={dropdownRef}>
                  <div className="flex items-center border-b border-gray-300">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full pb-2 focus:outline-none focus:border-purple-500"
                      placeholder="Type to add Company industry..."
                    />
                    <ChevronDown
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                  </div>

                  {/* Dropdown Suggestions */}
                  {isDropdownOpen && filteredIndustries.length > 0 && (
                    <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 z-50 overflow-auto">
                      {filteredIndustries.map((industry, index) => (
                        <li
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                          onClick={() => handleAddIndustry(industry)}
                        >
                          {industry}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Display Selected Industries */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedIndustries.map((industry, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center border border-purple-300"
                    >
                      {industry}
                      <X
                        className="h-4 w-4 text-purple-600 cursor-pointer ml-2"
                        onClick={() => handleRemoveIndustry(index)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="mb-6 md:mb-8">
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Overview
                </label>
                <input
                  type="text"
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-sm md:text-base"
                />
              </div>

              {/* Vision and Mission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6">
                <div>
                  <label
                    htmlFor="vision"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Vision
                  </label>
                  <textarea
                    id="vision"
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mission"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mission
                  </label>
                  <textarea
                    id="mission"
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex flex-col md:flex-row justify-end items-center gap-2 md:gap-4 mt-8 md:mt-12">
                <Link to="/FormCompany3">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-gray-600 text-sm md:text-base font-medium hover:text-gray-800"
                  >
                    Skip & Next
                  </button>
                </Link>
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium"
                >
                  Save & Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
