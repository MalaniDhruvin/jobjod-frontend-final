"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import Dheader3 from "./Dheader3";

function FormJobseeker2() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const [educationEntries, setEducationEntries] = useState([
    {
      userId,
      highestEducation: "",
      degree: "",
      specialization: "",
      collegeName: "",
      completionYear: "",
    },
  ]);

  if (!token || !userId) {
    alert("User is not authenticated. Please log in.");
    navigate("/login");
    return null;
  }

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setEducationEntries((prevEntries) =>
      prevEntries.map((entry, i) =>
        i === index
          ? { ...entry, [name]: type === "checkbox" ? checked : value }
          : entry
      )
    );
  };

  const handleEducationTypeSelect = (index, type) => {
    setEducationEntries((prevEntries) =>
      prevEntries.map((entry, i) =>
        i === index ? { ...entry, highestEducation: type } : entry
      )
    );
  };

  const handleAddMore = () => {
    setEducationEntries([
      ...educationEntries,
      {
        userId,
        highestEducation: "",
        degree: "",
        specialization: "",
        collegeName: "",
        completionYear: "",
      },
    ]);
  };

  const handleRemoveEducation = (id) => {
    if (educationEntries.length > 1) {
      setEducationEntries(educationEntries.filter((entry) => entry.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    for (let entry of educationEntries) {
      if (
        !entry.highestEducation ||
        !entry.degree ||
        !entry.specialization ||
        !entry.collegeName ||
        !entry.completionYear
      ) {
        alert("Please fill in all required fields.");
        return; // Stop submission if any required field is empty
      }
    }

    console.log(educationEntries);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/education", // Adjust the API endpoint
        { educationEntries },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Data submitted successfully!");
        console.log("Server Response:", response.data);
        // Navigate to next form or page
        navigate("/FormJobseeker3", {
          state: { token, userId },
        });
      }
    } catch (error) {
      console.error(
        "Error submitting data:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "An error occurred while submitting data."
      );
    }
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
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            </div>

            {/* Form Container - Fixed height to match other forms */}
            <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] overflow-y-auto">
              {/* Header with back button */}
              <div className="flex items-center mb-4 md:mb-8">
                <button
                  type="button"
                  className="mr-3 md:mr-4 rounded-full border border-black p-0.5 md:p-1"
                  aria-label="Go back"
                >
                  <Link to="/FormJobseeker">
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </button>
                <h2 className="text-xl md:text-2xl font-bold">Education</h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] flex flex-col"
              >
                <div className="flex-1">
                  <div className="space-y-8">
                    {educationEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="border-b pb-6 mb-6 last:border-0"
                      >
                        {index > 0 && (
                          <div className="flex justify-between mb-4">
                            <h3 className="font-medium">
                              Education #{index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                setEducationEntries((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-6">
                          {/* Highest Education */}
                          <div className="col-span-1 md:col-span-2">
                            <label
                              htmlFor={`highestEducation-${index}`}
                              className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                              Your highest education
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEducationTypeSelect(index, "ssc")
                                }
                                className={`px-4 py-2 rounded-full text-sm ${
                                  entry.highestEducation === "ssc"
                                    ? "bg-purple-500 text-white"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                SSC
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEducationTypeSelect(index, "hsc")
                                }
                                className={`px-4 py-2 rounded-full text-sm ${
                                  entry.highestEducation === "hsc"
                                    ? "bg-purple-500 text-white"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                HSC
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEducationTypeSelect(index, "belcher")
                                }
                                className={`px-4 py-2 rounded-full text-sm ${
                                  entry.highestEducation === "belcher"
                                    ? "bg-purple-500 text-white"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                Bachelor
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEducationTypeSelect(index, "master")
                                }
                                className={`px-4 py-2 rounded-full text-sm ${
                                  entry.highestEducation === "master"
                                    ? "bg-purple-500 text-white"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                Master
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEducationTypeSelect(index, "phd")
                                }
                                className={`px-4 py-2 rounded-full text-sm ${
                                  entry.highestEducation === "phd"
                                    ? "bg-purple-500 text-white"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                PhD
                              </button>
                            </div>
                          </div>

                          {/* Degree */}
                          <div>
                            <label
                              htmlFor={`degree-${index}`}
                              className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                              Degree
                            </label>
                            <input
                              type="text"
                              id={`degree-${index}`}
                              name="degree"
                              value={entry.degree}
                              onChange={(e) => handleChange(index, e)}
                              className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                            />
                          </div>

                          {/* Specialization */}
                          <div>
                            <label
                              htmlFor={`specialization-${index}`}
                              className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                              Specialization
                            </label>
                            <input
                              type="text"
                              id={`specialization-${index}`}
                              name="specialization"
                              value={entry.specialization}
                              onChange={(e) => handleChange(index, e)}
                              className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                            />
                          </div>

                          {/* College Name */}
                          <div>
                            <label
                              htmlFor={`collegeName-${index}`}
                              className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                              College Name
                            </label>
                            <input
                              type="text"
                              id={`collegeName-${index}`}
                              name="collegeName"
                              value={entry.collegeName}
                              onChange={(e) => handleChange(index, e)}
                              className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                            />
                          </div>

                          {/* Completion Year */}
                          <div>
                            <label
                              htmlFor={`completionYear-${index}`}
                              className="block text-left text-sm font-medium text-gray-700 mb-1"
                            >
                              Completion Year
                            </label>
                            <input
                              type="text"
                              id={`completionYear-${index}`}
                              name="completionYear"
                              value={entry.completionYear}
                              onChange={(e) => handleChange(index, e)}
                              className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                            />
                          </div>

                          {/* Currently Running Checkbox */}
                          <div className="col-span-1 md:col-span-2 flex justify-start w-full">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                name="currentlyRunning"
                                checked={entry.currentlyRunning}
                                onChange={(e) => handleChange(index, e)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                              />
                              <span className="ml-2 text-sm font-bold text-black">
                                Currently running
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-auto">
                  <button
                    type="button"
                    onClick={handleAddMore}
                    className="text-black px-3 py-2 rounded-full font-medium md:w-auto mb-3 md:mb-0 text-sm md:text-base ml-auto" // Added ml-auto
                  >
                    Add more +
                  </button>
                  {/* <Link to="/FormJobseeker3"> */}
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium w-full md:w-auto min-w-[120px]"
                  >
                    Save & Next
                  </button>
                  {/* </Link> */}
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

export default FormJobseeker2;
