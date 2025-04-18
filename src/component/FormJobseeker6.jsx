import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo2 from "../image/logo2.png";
import Dheader3 from "./Dheader3";
import axios from "axios"; // Import axios for API calls

function FormJobseeker6() {
  const location = useLocation(); // Use location hook to get state
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

  // Ensure userId is available
  console.log(userId);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    employmentType: "",
    workplace: "",
    location: "",
    shift: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Set up form data for submission
    const dataToSubmit = {
      userId: userId, // Include userId if necessary
      employmentType: formData.employmentType,
      workplace: formData.workplace,
      location: formData.location,
      shift: formData.shift,
    };

    try {
      // Make the API call to submit the form data
      const response = await axios.post(
        "http://localhost:5000/api/preferences", // Change the URL as necessary
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token for authorization
          },
        }
      );

      console.log("Form submission successful:", response.data);
      alert("Job preferences saved successfully!");

      // Optionally, navigate to another page after successful submission

      navigate("/Jobseeker", { state: { token, userId } });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error saving your job preferences.");
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
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
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
                  <Link to="/FormJobseeker5">
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </button>
                <h2 className="text-xl md:text-2xl font-bold">
                  Job Preferences
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] flex flex-col"
              >
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-6">
                    {/* Preferred Employment Type */}
                    <div>
                      <label
                        htmlFor="employmentType"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred employment type
                      </label>
                      <div className="relative">
                        <select
                          id="employmentType"
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleChange}
                          className="w-full appearance-none border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none bg-transparent text-base"
                        >
                          <option value="" disabled></option>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="freelance">Freelance</option>
                        </select>
                        <ChevronDown className="absolute right-2 bottom-3 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    {/* Preferred Workplace */}
                    <div>
                      <label
                        htmlFor="workplace"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred workplace
                      </label>
                      <div className="relative">
                        <select
                          id="workplace"
                          name="workplace"
                          value={formData.workplace}
                          onChange={handleChange}
                          className="w-full appearance-none border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none bg-transparent text-base"
                        >
                          <option value="" disabled></option>
                          <option value="on-site">On Site</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                        <ChevronDown className="absolute right-2 bottom-3 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    {/* Preferred Location */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Location
                      </label>
                      <div className="relative">
                        <select
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full appearance-none border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none bg-transparent text-base"
                        >
                          <option value="" disabled></option>
                          <option value="new-york">New York</option>
                          <option value="london">London</option>
                          <option value="singapore">Singapore</option>
                          <option value="tokyo">Tokyo</option>
                        </select>
                        <ChevronDown className="absolute right-2 bottom-3 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    {/* Preferred Shift */}
                    <div>
                      <label
                        htmlFor="shift"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred shift
                      </label>
                      <div className="relative">
                        <select
                          id="shift"
                          name="shift"
                          value={formData.shift}
                          onChange={handleChange}
                          className="w-full appearance-none border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none bg-transparent text-base"
                        >
                          <option value="" disabled></option>
                          <option value="day">Day Shift</option>
                          <option value="night">Night Shift</option>
                          <option value="flexible">Flexible</option>
                        </select>
                        <ChevronDown className="absolute right-2 bottom-3 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-2 md:gap-4 mt-8 md:mt-12">
                  {/* <Link to="/Jobseeker"> */}
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium"
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

export default FormJobseeker6;
