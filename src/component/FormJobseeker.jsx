import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import Dheader3 from "./Dheader3";

function FormJobseeker() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  const initialUserData = state?.userData;

  const initialFormData = {
    userId: userId || null,
    fullName: initialUserData?.fullName || "",
    birthDate: initialUserData?.birthDate || "",
    email: initialUserData?.email || "",
    gender: initialUserData?.gender || "",
    phone: initialUserData?.phone || "",
    location: initialUserData?.location || "",
    pincode: initialUserData?.pincode || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};
    const { fullName, email, gender, phone, location, birthDate, pincode } =
      formData;

    if (!fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!gender.trim()) {
      errors.gender = "Gender is required.";
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }
    if (!phone) {
      errors.phone = "Phone number is required.";
    }

    if (!location.trim()) {
      errors.location = "Location is required.";
    }

    if (!birthDate.trim()) {
      errors.birthDate = "Birth date is required.";
    } else if (new Date(birthDate).getTime() > Date.now()) {
      errors.birthDate = "Birth date cannot be in the future.";
    }

    if (!pincode) {
      errors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(pincode)) {
      errors.pincode = "Pincode must be 6 digits.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log(formData);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/users/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("User created successfully!");

      navigate("/FormJobseeker2", {
        state: { token, userId: response.data.userId },
      });

      setFormData(initialFormData);
    } catch (error) {
      setMessage("Error creating user.");
      console.error(error);
    }
  };

  return (
    <>
      <Dheader3 />

      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-100 via-white to-purple-50">
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

        <div className="relative w-full container mx-auto px-6 py-20 text-center z-10">
          <div className="mx-auto w-full max-w-4xl">
            <div className="flex justify-between mb-4 md:mb-6 px-2 md:px-8">
              <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%]"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
              <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
            </div>

            <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] overflow-y-auto">
              <div className="mb-4 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-left">
                  Basic Information
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] flex flex-col"
              >
                <div>
                  <input
                    type="hidden"
                    name="userId"
                    value={formData.userId || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full appearance-none border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none bg-transparent text-base"
                        >
                          <option value="" disabled></option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="prefer-not-to-say">
                            Prefer not to say
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2 bottom-3 h-4 w-4 " />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="birthDate"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Date of Birth
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 pb-2 pr-8 focus:border-purple-500 focus:outline-none text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-left text-sm font-medium text-gray-700 mb-1"
                      >
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        maxLength={6}
                        required
                        className="w-full border-b border-gray-300 pb-2 focus:border-purple-500 focus:outline-none text-base"
                      />
                    </div>
                  </div>
                </div>

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

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />
      </section>
    </>
  );
}

export default FormJobseeker;
