import { useState, useRef } from "react";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Dheader3 from "./Dheader3";
import axios from "axios";
import {BASE_URL} from "../config";

export default function FormCompany3() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const CompanyNames = [
    "Tech Innovations Ltd.",
    "Global Solutions Inc.",
    "Pioneer Software",
    "NextGen Technologies",
    "Elite Web Services",
    "Future Vision Corp.",
    "Summit IT Solutions",
    "Infinity Systems",
    "Skyline Enterprises",
    "Blue Ocean Technologies",
    "Vertex Solutions",
  ];

  // Initialize with one empty form
  const [recognitions, setRecognitions] = useState([
    {
      userId: userId, // Pass the userId
      title: "", // Store title for each recognition form
      achievementDate: "",
      from: "",
      description: "",
    },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const formContainerRef = useRef(null);
  const lastFormRef = useRef(null);

  const handleChange = (id, field, value) => {
    setRecognitions((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Debug: Check form values before validation
    console.log("Form Values:", recognitions);
  
    // Validation (you can add more validation checks if needed)
    if (
      recognitions.some(
        (recognition) =>
          !recognition.title ||
          !recognition.achievementDate ||
          !recognition.from
      )
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Create the recognitionEntries by explicitly excluding the 'id' from each recognition object
    const recognitionEntries = recognitions.map(({ id, ...recognitionData }) => recognitionData);
  
    // Debug: Check the processed recognitionEntries
    console.log("Recognition Entries (without ID):", recognitionEntries);
  
    try {
      const response = await axios.post(
        `${BASE_URL}/recognition`,
        {recognitionEntries},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Handle the success response
      console.log("Form submitted successfully:", response.data);
  
      // Redirect to the next form
      navigate("/FormCompany4");
    } catch (error) {
      // Handle error
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };
  
  

  const handleSkip = () => {
    console.log("Skipped to next step");
    // Handle skip logic here
  };

  const handleAddMore = () => {
    const newId = crypto.randomUUID();
    setRecognitions((prev) => [
      ...prev,
      {
        id: newId,
        userId: userId, // Pass the userId
        title: "", // Ensure title is empty for new forms
        achievementDate: "",
        from: "",
        description: "",
      },
    ]);

    setTimeout(() => {
      if (lastFormRef.current) {
        lastFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleRemove = (id) => {
    if (recognitions.length > 1) {
      setRecognitions((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  return (
    <>
      <Dheader3 />
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-r from-purple-100 via-white to-purple-50 ">
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
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
          </div>

          {/* Form Container - Fixed height for desktop, auto height for mobile */}
          <div
            ref={formContainerRef}
            className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 md:overflow-y-auto"
            style={{ maxHeight: "70vh" }}
          >
            {/* Header with back button */}
            <div className="flex items-center mb-4 md:mb-8">
              <Link to="/FormCompany2">
                <button
                  type="button"
                  className="mr-3 md:mr-4 rounded-full border border-gray-300 p-0.5 md:p-1"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </Link>
              <h2 className="text-xl md:text-2xl font-bold">Recognition</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Map through all recognition entries */}
              {recognitions.map((recognition, index) => (
                <div
                  key={recognition.id}
                  ref={index === recognitions.length - 1 ? lastFormRef : null}
                  className={`${
                    index > 0 ? "mt-8 pt-6 border-t border-gray-200" : ""
                  }`}
                >
                  {index > 0 && (
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Recognition #{index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleRemove(recognition.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Title */}
                  <div className="mb-4 md:mb-6">
                    <label
                      htmlFor={`title-${recognition.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id={`title-${recognition.id}`}
                      value={recognition.title}
                      onChange={(e) =>
                        handleChange(recognition.id, "title", e.target.value)
                      }
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />

                    {/* <SearchableDropdown
                      label=" Title"
                      placeholder="Title"
                      options={CompanyNames}
                      value={CompanyName}
                      onChange={setCompanyNames}
                      allowAddNew={true}
                      allowDirectEdit={true}
                    /> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6 mb-4 md:mb-6">
                    {/* Achievement Date */}
                    <div>
                      <label
                        htmlFor={`achievementDate-${recognition.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Achievement Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id={`achievementDate-${recognition.id}`}
                          value={recognition.achievementDate}
                          onChange={(e) =>
                            handleChange(
                              recognition.id,
                              "achievementDate",
                              e.target.value
                            )
                          }
                          className="w-full border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* From */}
                    <div>
                      <label
                        htmlFor={`from-${recognition.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        From
                      </label>
                      <input
                        type="text"
                        id={`from-${recognition.id}`}
                        value={recognition.from}
                        onChange={(e) =>
                          handleChange(recognition.id, "from", e.target.value)
                        }
                        className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 md:mb-8">
                    <label
                      htmlFor={`description-${recognition.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id={`description-${recognition.id}`}
                      value={recognition.description}
                      onChange={(e) =>
                        handleChange(
                          recognition.id,
                          "description",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              ))}

              {/* Bottom Buttons */}
              <div className="flex flex-wrap flex-col md:flex-row justify-end items-center gap-2 md:gap-4 mt-6 sm:mb-3 ">
                <Link to="/FormCompany4">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-gray-600 text-sm md:text-base font-medium hover:text-gray-800 mr-1"
                  >
                    Skip & Next
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={handleAddMore}
                  className="text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium"
                  style={{ backgroundColor: "#FF9F7B" }}
                >
                  Add More +
                </button>
                {/* <Link to="/FormCompany4"> */}
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2 md:py-3  rounded-full text-sm md:text-base  font-medium"
                >
                  Save & Next
                </button>
                {/* </Link> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
