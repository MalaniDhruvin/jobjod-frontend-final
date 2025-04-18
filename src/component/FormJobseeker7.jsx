"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dheader3 from "./Dheader3";
import axios from "axios"; // Import Axios

function FormJobseeker7() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

  // Ensure userId is available
  console.log(userId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize with an array of certification forms
  const [certifications, setCertifications] = useState([
    {
      id: 1,
      userId,
      certificateTitle: "",
      organization: "",
      date: "",
      validTill: "",
      link: "",
      neverExpire: false,
    },
  ]);

  const handleChange = (e, id) => {
    const { name, value, type, checked } = e.target;
    setCertifications((prev) =>
      prev.map((cert) =>
        cert.id === id
          ? {
              ...cert,
              [name]: type === "checkbox" ? checked : value,
            }
          : cert
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting certifications:", certifications);

    for (let cert of certifications) {
      if (!cert.certificateTitle || !cert.organization || !cert.date) {
        alert("Please fill in all the required fields.");
        return;
      }
    }

    const certificationsToSubmit = certifications.map(
      ({ id, neverExpire, ...rest }) => rest
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/api/certifications",
        { certifications: certificationsToSubmit },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      alert("Certifications saved successfully!");
      navigate("/FormJobseeker4", { state: { token, userId } });
    } catch (error) {
      console.error("Error submitting certifications:", error);
      alert("There was an error saving your certifications.");
    }
  };

  const addMoreCertification = () => {
    const newId =
      certifications.length > 0
        ? Math.max(...certifications.map((c) => c.id || 0)) + 1
        : 1;
    setCertifications((prev) => [
      ...prev,
      {
        id: newId,
        userId,
        certificateTitle: "",
        organization: "",
        date: "",
        validTill: "",
        link: "",
        neverExpire: false,
      },
    ]);
  };

  const removeCertification = (id) => {
    if (certifications.length > 1) {
      setCertifications((prev) => prev.filter((cert) => cert.id !== id));
    }
  };

  const dropdownRef = useRef(null);

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
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            </div>

            {/* Form Container */}
            <div
              id="form-container"
              className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6 md:mb-10">
                <Link to="/Formjobseeker3">
                  <button className="rounded-full border border-black p-0.5 md:p-1">
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </Link>
                <h1 className="text-xl md:text-2xl font-bold">
                  Certification & Other Course
                </h1>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                {certifications.map((certification, index) => (
                  <div
                    key={certification.id}
                    className={`p-4 rounded-lg ${
                      index > 0 ? "border border-gray-200 relative" : ""
                    }`}
                  >
                    {index > 0 && (
                      <div className="absolute top-2 right-2">
                        <button
                          type="button"
                          onClick={() => removeCertification(certification.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {index > 0 && (
                      <h3 className="text-left font-medium mb-4 text-purple-500">
                        Certification #{index + 1}
                      </h3>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      {/* Certificate Title */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`certificateTitle-${certification.id}`}
                          className="text-gray-600 text-sm block text-left"
                        >
                          Certificate title
                        </label>
                        <div className="border-b border-gray-300 pb-1">
                          <input
                            id={`certificateTitle-${certification.id}`}
                            name="certificateTitle"
                            type="text"
                            value={certification.certificateTitle}
                            onChange={(e) => handleChange(e, certification.id)}
                            className="w-full focus:outline-none text-base"
                          />
                        </div>
                      </div>

                      {/* Organization */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`organization-${certification.id}`}
                          className="text-gray-600 text-sm block text-left"
                        >
                          Organization
                        </label>
                        <div className="border-b border-gray-300 pb-1">
                          <input
                            id={`organization-${certification.id}`}
                            name="organization"
                            type="text"
                            value={certification.organization}
                            onChange={(e) => handleChange(e, certification.id)}
                            className="w-full focus:outline-none text-base"
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`date-${certification.id}`}
                          className="text-gray-600 text-sm block text-left"
                        >
                          Date
                        </label>
                        <div className="border-b border-gray-300 pb-1 flex items-center">
                          <input
                            id={`date-${certification.id}`}
                            name="date"
                            type="date"
                            value={certification.date}
                            onChange={(e) => handleChange(e, certification.id)}
                            className="w-full focus:outline-none text-base"
                          />
                        </div>
                      </div>

                      {/* Valid Till */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`validTill-${certification.id}`}
                          className="text-gray-600 text-sm block text-left"
                        >
                          Valid till
                        </label>
                        <div className="border-b border-gray-300 pb-1 flex items-center">
                          <input
                            id={`validTill-${certification.id}`}
                            name="validTill"
                            type="date"
                            value={certification.validTill}
                            onChange={(e) => handleChange(e, certification.id)}
                            className="w-full focus:outline-none text-base"
                            disabled={certification.neverExpire}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Link/Credentials */}
                    <div className="space-y-1 mt-6">
                      <label
                        htmlFor={`link-${certification.id}`}
                        className="text-gray-600 text-sm block text-left"
                      >
                        Link / Credentials
                      </label>
                      <div className="border-b border-gray-300 pb-1">
                        <input
                          id={`link-${certification.id}`}
                          name="link"
                          type="text"
                          value={certification.link}
                          onChange={(e) => handleChange(e, certification.id)}
                          className="w-full focus:outline-none text-base"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <div className="h-5 w-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          id={`neverExpire-${certification.id}`}
                          name="neverExpire"
                          checked={certification.neverExpire}
                          onChange={(e) => handleChange(e, certification.id)}
                          className="h-4 w-4 cursor-pointer"
                        />
                      </div>

                      <label
                        htmlFor={`neverExpire-${certification.id}`}
                        className="text-sm cursor-pointer font-semibold"
                      >
                        Never Expire
                      </label>
                    </div>
                  </div>
                ))}

                {/* Bottom Buttons  */}
                <div className="flex flex-wrap md:flex-row flex-col justify-end items-center gap-2 md:gap-4">
                  <Link to="/Formjobseeker4">
                    <button
                      type="button"
                      className="text-gray-600 text-sm md:text-base font-medium hover:text-gray-800 mr-1"
                    >
                      Skip & Next
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={addMoreCertification}
                    className="text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium"
                    style={{ backgroundColor: "#FF9F7B" }}
                  >
                    Add More +
                  </button>
                  {/* <Link to="/Formjobseeker4"> */}
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium"
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

export default FormJobseeker7;
