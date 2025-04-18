import { useState } from "react";
import logo2 from "../image/logo2.png";

import {
  FileText,
  CreditCard,
  FileCheck,
  Building2,
  Store,
  BarChart3,
  UserSquare,
  File,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Dheader3 from "./Dheader3";

export default function FormCompany5() {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDocumentToggle = (document) => {
    if (selectedDocuments.includes(document)) {
      setSelectedDocuments(selectedDocuments.filter((doc) => doc !== document));
    } else {
      setSelectedDocuments([...selectedDocuments, document]);
    }
  };

  const isSelected = (document) => selectedDocuments.includes(document);

  return (
    <>
      {/* <Header /> */}
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
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
            <div className="h-1.5 md:h-2 bg-gray-300 rounded-full w-[14%] ml-1 md:ml-2"></div>
          </div>

          {/* Form Container - Fixed height for desktop, auto height for mobile */}
          <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] flex flex-col">
            {/* Header with back button */}
            <div className="flex items-center mb-4 md:mb-6">
              <Link to="/FormCompany4">
                <button
                  type="button"
                  className="mr-3 md:mr-4 rounded-full border border-gray-300 p-0.5 md:p-1"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold">
                Legal Information
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
              {/* Instruction */}
              <p className="mb-4 md:mb-6 text-gray-800">
                Select at least 1 document which you have available**
              </p>

              {/* Document Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* First Row */}
                <button
                  onClick={() => handleDocumentToggle("GST Certificate")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("GST Certificate")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <FileText
                    className={`mr-3 h-5 w-5 ${
                      isSelected("GST Certificate")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("GST Certificate")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    GST Certificate
                  </span>
                </button>

                <button
                  onClick={() => handleDocumentToggle("Company PAN Card")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("Company PAN Card")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <CreditCard
                    className={`mr-3 h-5 w-5 ${
                      isSelected("Company PAN Card")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("Company PAN Card")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    Company PAN Card
                  </span>
                </button>

                <button
                  onClick={() => handleDocumentToggle("FSSAI Certificate")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("FSSAI Certificate")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <FileCheck
                    className={`mr-3 h-5 w-5 ${
                      isSelected("FSSAI Certificate")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("FSSAI Certificate")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    FSSAI Certificate
                  </span>
                </button>

                {/* Second Row */}
                <button
                  onClick={() => handleDocumentToggle("Company Incorporation")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("Company Incorporation")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Building2
                    className={`mr-3 h-5 w-5 ${
                      isSelected("Company Incorporation")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("Company Incorporation")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    Company Incorporation
                  </span>
                </button>

                <button
                  onClick={() => handleDocumentToggle("Shop & Establishment")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("Shop & Establishment")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Store
                    className={`mr-3 h-5 w-5 ${
                      isSelected("Shop & Establishment")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("Shop & Establishment")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    Shop & Establishment
                  </span>
                </button>

                <button
                  onClick={() => handleDocumentToggle("MSME/Udhyam")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("MSME/Udhyam")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <BarChart3
                    className={`mr-3 h-5 w-5 ${
                      isSelected("MSME/Udhyam")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("MSME/Udhyam")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    MSME/Udhyam
                  </span>
                </button>

                {/* Third Row */}
                <button
                  onClick={() => handleDocumentToggle("ID Card")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("ID Card")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <UserSquare
                    className={`mr-3 h-5 w-5 ${
                      isSelected("ID Card")
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("ID Card")
                        ? "text-purple-500"
                        : "text-gray-700"
                    }
                  >
                    ID Card
                  </span>
                </button>

                <button
                  onClick={() => handleDocumentToggle("Other")}
                  className={`flex items-center p-4 rounded-xl border ${
                    isSelected("Other")
                      ? "bg-purple-100 border-purple-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <File
                    className={`mr-3 h-5 w-5 ${
                      isSelected("Other") ? "text-purple-500" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={
                      isSelected("Other") ? "text-purple-500" : "text-gray-700"
                    }
                  >
                    Other
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-end flex-col md:flex-row  items-center gap-2 md:gap-4 pt-3 md:pt-4">
              {/* <button className="text-gray-600 text-sm md:text-base font-medium hover:text-gray-800">
            Skip
          </button> */}
              <Link
                to={{
                  pathname: "/FormCompany6",
                  state: { selectedDocuments },
                }}
                state={{ selectedDocuments }}
              >
                <button
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium"
                  disabled={selectedDocuments.length === 0}
                >
                  Submit
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
