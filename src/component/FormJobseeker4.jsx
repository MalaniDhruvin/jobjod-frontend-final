"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Dheader3 from "./Dheader3";

function FormJobseeker4() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const [skills, setSkills] = useState([
    "Adobe Photoshop",
    "Adobe Illustrator",
    "UI/UX Design",
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Common skills for the dropdown
  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "HTML/CSS",
    "SQL",
    "TypeScript",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "UI/UX Design",
    "Project Management",
    "Data Analysis",
    "Marketing",
    "Content Writing",
  ];

  // Filter options based on input
  const filteredOptions = skillOptions.filter(
    (skill) =>
      !skills.includes(skill) &&
      skill.toLowerCase().includes(newSkill.toLowerCase())
  );

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && newSkill.trim()) {
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
      e.preventDefault();
    }
  };

  const handleSelectSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setNewSkill("");
    setIsDropdownOpen(false);
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent in the request
    const data = {
      userId, // Add userId from state
      skills, // Add skills array
      // Add any additional form data you want to submit (like token if needed)
    };

    try {
      // Send POST request to your backend
      const response = await axios.post(
        "http://localhost:5000/api/skills/all",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if required
          },
        }
      );
      console.log("Skills submitted successfully:", response.data);
      // Optionally redirect or show a success message here
      navigate("/FormJobseeker5", {
        state: { token, userId },
      });
    } catch (error) {
      console.error("Error submitting skills:", error);
      // Handle error (e.g., show error message to the user)
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    location: "",
    gender: "",
    mobileNumber: "",
    dateOfBirth: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Dheader3 />

      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-100 via-white to-purple-50">
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

        {/* Content */}
        <div className="relative w-full container mx-auto px-6 py-20 text-center z-10">
          <div className="mx-auto w-full max-w-4xl">
            {/* Progress Steps */}
            <div className="flex justify-between mb-4 md:mb-6 px-2 md:px-8">
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%]"></div>
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            </div>

            {/* Form Container */}
            <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] overflow-y-auto">
              {/* Header with back button */}
              <div className="flex items-center mb-4 md:mb-8">
                <button
                  type="button"
                  className="mr-3 md:mr-4 rounded-full border border-black p-0.5 md:p-1"
                  aria-label="Go back"
                >
                  <Link to="/FormJobseeker7">
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </button>
                <h2 className="text-xl md:text-2xl font-bold">
                  Skill & Expertise
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] flex flex-col"
              >
                <div className="flex-1">
                  {/* Skills Input with Dropdown */}
                  <div className="relative mb-4 md:mb-6" ref={dropdownRef}>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Add skills (Get noticed for the right job by adding your skills)"
                      className="w-full border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none text-sm md:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="absolute right-2 bottom-3 h-4 w-4 text-gray-500"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((skill, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-purple-50 cursor-pointer flex items-center justify-between text-sm"
                              onClick={() => handleSelectSkill(skill)}
                            >
                              <span>{skill}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            {newSkill
                              ? "No matching skills found"
                              : "Type to search or select a skill"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 md:gap-2 bg-purple-100 text-black px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="hover:bg-purple-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save & Next Button */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-2 md:gap-4 mt-8 md:mt-12">
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

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />
      </section>
    </>
  );
}

export default FormJobseeker4;
