"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../image/login.png";
import axios from "axios";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showSendOtp, setShowSendOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [exist, setExist] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem("userType"); // Extract "userType" from location.state
  const otpRefs = useRef([]);

  // Set up refs array for OTP input fields
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  // Validate mobile number
  const validateMobileNumber = (number) => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(number)) {
      setMobileError("Please enter a valid mobile number (10 digits).");
      return false;
    }
    setMobileError("");
    return true;
  };

  // Validate OTP fields
  const validateOtp = () => {
    if (otp.some((digit) => digit === "")) {
      setOtpError("OTP cannot be empty.");
      return false;
    }
    setOtpError("");
    return true;
  };

  // Handle sending OTP
  const handleSendOtp = async () => {
    if (!validateMobileNumber(mobileNumber)) return;

    try {
      // Check if the mobile number is already registered with a different userType
      const response = await axios.get(
        `http://127.0.0.1:5000/api/otp/check-mobile?mobileNumber=${mobileNumber}`
      );
      setExist(response.data.exists);

      if (response.data.exists && response.data.userType !== userType) {
        setMessage(
          `This mobile number is already registered as a ${response.data.userType}. It cannot register as a ${userType}.`
        );
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setShowSendOtp(false);
        setOtpSent(true);
        setMessage("OTP has been sent. Please enter it to login.");
        otpRefs.current[0]?.focus();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;
  
    setIsLoading(true);
    try {
      // Verify OTP with backend API
      const apiUrl = "http://127.0.0.1:5000/api/otp/verify-otp";
      const payload = {
        mobileNumber,
        otp: otp.join(""),
        userType,
      };
  
      const response = await axios.post(apiUrl, payload);
      const token = response.data.token;
      const userIdFromResponse = response.data.login.id;
  
      // Store the auth token and userId in local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userIdFromResponse);
  
  
      // If mobile number is registered, redirect to dashboard.
      if (exist) {
        if (userType === "Job Seeker") {
          navigate("/Jobseeker");
        } else if (userType === "Job Giver") {
          navigate("/CompanyDashboard");
        }
      } else {
        // If not registered, navigate to the form page based on userType
        if (userType === "Job Seeker") {
          navigate("/FormJobseeker", {
            state: { token, userId: userIdFromResponse, userType },
          });
        } else if (userType === "Job Giver") {
          navigate("/FormCompany", {
            state: { token, userId: userIdFromResponse, userType },
          });
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Handle OTP input field changes
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) otpRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-900">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          className="w-full h-full object-cover opacity-75"
        />
      </div>

      {/* Session Content */}
      <div className="relative p-4 sm:p-8 rounded-2xl max-w-[600px] w-[95%] sm:w-auto border border-gray-100 bg-white">
        <Link to="/Login_Signin">
          <button className="absolute left-3 sm:left-6 border rounded-xl top-4 sm:top-9 p-2 hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-center text-gray-800 mt-10 sm:mt-0">
          {userType || "Log in/Sign up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Mobile Number Input */}
          <div>
            <div className="flex items-center border rounded-full overflow-hidden">
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                onBlur={() => validateMobileNumber(mobileNumber)}
                placeholder="Mobile Number"
                className="w-full h-10 sm:h-12 px-4 border-0 rounded-l-full text-sm sm:text-base focus:outline-none focus:ring-0"
                disabled={otpSent || isLoading}
              />
              <div className="bg-black text-white p-2 rounded-full h-8 sm:h-10 w-8 sm:w-10 flex items-center justify-center mr-1">
                <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
            </div>
            {mobileError && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {mobileError}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-3 w-3 sm:h-4 sm:w-4 border border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="text-xs sm:text-sm font-medium leading-none text-gray-700"
            >
              Remember me
            </label>
          </div>

          {/* Send OTP Button */}
          {!otpSent && (
            <>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full bg-[#2c3e6f] text-white py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-medium hover:bg-[#253459] transition duration-200"
              >
                {isLoading ? "Processing..." : "Send OTP"}
              </button>
              <p className="text-[10px] sm:text-xs text-center text-gray-600">
                By clicking Send OTP, you agree to our{" "}
                <Link to="/terms" className="text-red-600 hover:underline">
                  Terms and Conditions
                </Link>
              </p>
            </>
          )}

          {/* OTP Input Fields */}
          {otpSent && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex space-x-1 sm:space-x-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    maxLength={1}
                    className="w-9 h-9 sm:w-12 sm:h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                    disabled={isLoading}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-xs sm:text-sm text-red-500 text-center">
                  {otpError}
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2c3e6f] text-white py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base font-medium hover:bg-[#253459] transition duration-200"
              >
                {isLoading ? "Verifying..." : "Submit OTP"}
              </button>
            </div>
          )}
        </form>

        {/* Message Display */}
        {message && (
          <p className="mt-3 sm:mt-4 text-center text-blue-600 text-xs sm:text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
