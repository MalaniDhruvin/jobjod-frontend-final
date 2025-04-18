import React from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../image/login.png";
import jobseeker from "../image/jobseeker.png";
import jobgiver from "../image/jobgiver.png";

const UserSelection = () => {
  const navigate = useNavigate();

  // Function to handle navigation and pass the user type
  const handleNavigate = (userType) => {
    localStorage.setItem("userType", userType);
    navigate("/LoginPage");
  };

  return (
    <div className="relative    flex justify-center items-center  min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      {/* Background img */}
      <div className="absolute  bg-gray-900 inset-0 w-full h-full">
        <img
          src={logo2}
          alt="Office space background"
          className="w-full h-full object-cover opacity-75"
        />
      </div>
      <div className="relative p-8 rounded-2xl max-w-[600px] border border-gray-100 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Who are you?
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Job Seeker Option */}
          <div
            className="cursor-pointer border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center w-full sm:w-48 
                 hover:border-purple-500 hover:shadow-md transition-all duration-300 transform "
            onClick={() => handleNavigate("Job Seeker")}
            
          >
            <div className="p-4 rounded-full mb-4 ">
              <img
                src={jobseeker}
                alt="Job Seeker"
                className="h-24 w-24 object-contain rounded-full"
              />
            </div>
            <p className="mt-2 font-medium text-gray-800">Job Seeker</p>
            <p className="text-xs text-gray-500 mt-2">
              Looking for opportunities
            </p>
          </div>

          {/* Job Giver Option */}
          <div
            className="cursor-pointer border-4 rounded-xl p-6 flex flex-col items-center w-full sm:w-48
               hover:border-purple-500 hover:shadow-md transition-all duration-300 transform "
            onClick={() => handleNavigate("Job Giver")}
          >
            <div className="p-4 rounded-full mb-4">
              <img
                src={jobgiver}
                alt="Job Giver"
                className="h-24 w-24 object-contain rounded-full"
              />
            </div>
            <p className="mt-2 font-medium text-gray-800">Job Giver</p>
            <p className="text-xs text-gray-500 mt-2">Hiring talent</p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Select your role to continue
        </p>
      </div>
    </div>
  );
};

export default UserSelection;