import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dheader3 from "./Dheader3";
import { ChevronDown, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../config";

export default function FormCompany() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [selectedPersons, setSelectedPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const InterviewPersons = [
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Michael Johnson" },
    { name: "Emily Davis" },
    { name: "David Wilson" },
    { name: "Sarah Brown" },
    { name: "James Anderson" },
    { name: "Jessica Martinez" },
    { name: "Robert Taylor" },
    { name: "Laura Thomas" },
    { name: "Daniel White" },
  ];

  // Filter options based on input
  const filteredPersons = InterviewPersons.filter(
    (person) =>
      !selectedPersons.some((p) => p.name === person.name) &&
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add selected person
  const handleAddPerson = (person) => {
    setSelectedPersons([...selectedPersons, person]);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Remove person
  const handleRemovePerson = (index) => {
    setSelectedPersons(selectedPersons.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    userId: userId,
    companyName: "",
    interviewerName: "",
    email: "",
    phone: "",
    location: "",
    yearEst: "",
    website: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to send to the API
    const formPayload = {
      userId: userId,
      companyName: formData.companyName,
      interviewerName: selectedPersons,
      email: formData.emailAddress,
      phone: formData.mobileNumber,
      location: formData.location,
      yearEst: formData.yearEstablished,
      website: formData.website,
      pincode: formData.pincode,
      // Add any other necessary fields here
    };

    console.log(token)

    try {
      // Sending form data to an API (using POST method)
      const response = await axios.post(
        `${BASE_URL}/company/register`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token if needed
            "Content-Type": "application/json", // Specify the content type
          },
        }
      );

      console.log("API Response: ", response.data);

      navigate("/FormCompany2");
    } catch (error) {
      // Handle error
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>
      <Dheader3 />

      <div className="min-h-screen relative flex items-center justify-center p-4  bg-gradient-to-r from-purple-100 via-white to-purple-50">
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
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
          </div>

          {/* Form Container - Fixed height for desktop, auto height for mobile */}
          <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] md:overflow-y-auto">
            <div className="mb-4 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold">
                Basic Information
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] flex flex-col"
            >
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6">
                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Interview Person's Name */}
                  {/* Interview Person Name */}
                  <div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Interview Persons
                      </label>

                      {/* Input and Dropdown */}
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
                            placeholder="Type to add interview persons..."
                          />
                          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
                        </div>

                        {/* Dropdown with Suggestions */}
                        {isDropdownOpen && filteredPersons.length > 0 && (
                          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 z-100 overflow-auto">
                            {filteredPersons.map((person, index) => (
                              <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center  z-100 gap-2"
                                onClick={() => handleAddPerson(person)}
                              >
                                {person.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Display Selected Persons */}
                      <div className="mt-2 flex flex-wrap  z-100 gap-2">
                        {selectedPersons.map((person, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center  z-100 gap-2 border border-purple-300"
                          >
                            {person.name}
                            <X
                              className="h-4 w-4 text-purple-600 cursor-pointer"
                              onClick={() => handleRemovePerson(index)}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="emailAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="emailAddress"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location2}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Year Established */}
                  <div>
                    <label
                      htmlFor="yearEstablished"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Year Established
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="yearEstablished"
                        name="yearEstablished"
                        value={formData.yearEstablished} // Ensure it's never undefined
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

                          // Allow empty input
                          if (value === "") {
                            setFormData((prev) => ({
                              ...prev,
                              yearEstablished: "",
                            }));
                            return;
                          }

                          // Allow input up to 4 digits
                          if (value.length > 4) return;

                          // Update state immediately for partial values
                          setFormData((prev) => ({
                            ...prev,
                            yearEstablished: value,
                          }));
                        }}
                        placeholder="yyyy"
                        maxLength="4"
                        className="w-full border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  {/* Pincode */}
                  <div>
                    <label
                      htmlFor="pincode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

                        // Allow empty input
                        if (value === "") {
                          setFormData((prev) => ({ ...prev, pincode: "" }));
                          return;
                        }

                        // Restrict to 6 digits (typical pincode length)
                        if (value.length > 6) return;

                        // Update state
                        setFormData((prev) => ({ ...prev, pincode: value }));
                      }}
                      className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save & Next Button */}
              <div className="flex flex-col md:flex-row justify-end items-center gap-2 md:gap-4 mb-3 mt-4 md:mb-12 mt:mb-12">
                {/* <Link to="/FormCompany2"> */}
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
    </>
  );
}
