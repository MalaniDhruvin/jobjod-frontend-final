import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  CreditCard,
  FileCheck,
  Building2,
  Store,
  BarChart3,
  UserSquare,
  File,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dheader3 from "./Dheader3";
import axios from "axios"; // Import axios
import {BASE_URL} from "../config";

const documentConfig = {
  "GST Certificate": {
    icon: FileText,
    placeholder: "Enter GST Number",
    shortName: "gstNumber",
  },
  "Company PAN Card": {
    icon: CreditCard,
    placeholder: "Enter PAN Card Number",
    shortName: "panNumber",
  },
  "FSSAI Certificate": {
    icon: FileCheck,
    placeholder: "Enter FSSAI Number",
    shortName: "fssaiNumber",
  },
  "Company Incorporation": {
    icon: Building2,
    placeholder: "Enter Company Incorporation Number",
    shortName: "CompanyIncorporation",
  },
  "Shop & Establishment": {
    icon: Store,
    placeholder: "Enter Shop & Establishment Number",
    shortName: "ShopEstablishment",
  },
  "MSME/Udhyam": {
    icon: BarChart3,
    placeholder: "Enter MSME/Udhyam Number",
    shortName: "MSME_Udhyam",
  },
  "ID Card": {
    icon: UserSquare,
    placeholder: "Enter ID Card Number",
    shortName: "idCard",
  },
  Other: {
    icon: File,
    placeholder: "Enter Other Document Number",
    shortName: "other",
  },
};

export default function FormCompany6() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [documents, setDocuments] = useState({});

  useEffect(() => {
    const docs = location.state?.selectedDocuments || [
      "GST Certificate",
      "Company PAN Card",
      "FSSAI Certificate",
    ];
    setSelectedDocs(docs);

    const initialDocuments = {};
    docs.forEach((doc) => {
      const shortName =
        documentConfig[doc]?.shortName || doc.toLowerCase().replace(/\s+/g, "");
      initialDocuments[shortName] = { number: "", file: null };
    });
    setDocuments(initialDocuments);
  }, [location.state]);

  const handleNumberChange = (field, value) => {
    setDocuments({
      ...documents,
      [field]: { ...documents[field], number: value },
    });
  };

  const handleFileUpload = (field, file) => {
    setDocuments({
      ...documents,
      [field]: { ...documents[field], file },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    console.log("Documents before form submission:", documents);
  
    formData.append("userId", userId);
  
    // Map shortName back to document type
    const shortNameToDocType = Object.fromEntries(
      Object.entries(documentConfig).map(([docType, config]) => [config.shortName, docType])
    );
  
    Object.entries(documents).forEach(([shortName, doc]) => {
      // Append document type
      formData.append(`${shortName}_type`, shortNameToDocType[shortName] || "Other");
      // Append document number
      if (doc.number) {
        formData.append(`${shortName}_number`, doc.number);
      }
      // Append file
      if (doc.file) {
        formData.append(`${shortName}_file`, doc.file);
      }
    });
  
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/legaldocs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Document uploaded:", response.data);
      navigate("/CompanyDashboard");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <>
      <Dheader3 />
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-r from-purple-100 via-white to-purple-50">
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
            <div className="h-1.5 md:h-2 bg-green-400 rounded-full w-[14%] ml-1 md:ml-2"></div>
          </div>
          <div className="flex justify-between mb-4 md:mb-6 px-2 md:px-8">
            {/* Progress Steps */}
          </div>

          <div className="w-full bg-white rounded-xl md:rounded-3xl shadow-sm p-4 md:p-8 border border-gray-100 min-h-[450px] md:h-[520px] flex flex-col">
            <div className="flex items-center mb-4 md:mb-6">
              <Link to="/FormCompany5">
                <button
                  type="button"
                  className="mr-3 md:mr-4 rounded-full border border-gray-300 p-0.5 md:p-1"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold">
                Legal Information (Upload)
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1">
              <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-6 md:space-y-8">
                <p className="text-gray-600 text-sm md:text-base mb-4">
                  Please enter your document numbers and upload the
                  corresponding files
                </p>

                {selectedDocs.map((docName) => {
                  const config = documentConfig[docName] || {
                    icon: File,
                    placeholder: `Enter ${docName} Number`,
                    shortName: docName.toLowerCase().replace(/\s+/g, ""),
                  };
                  const IconComponent = config.icon;
                  const shortName = config.shortName;

                  return (
                    <div
                      key={shortName}
                      className="flex items-center gap-3 md:gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-purple-50">
                          {docName === "FSSAI Certificate" ? (
                            <span className="text-purple-500 font-semibold text-xs md:text-sm">
                              FSSAI
                            </span>
                          ) : (
                            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={config.placeholder}
                          value={documents[shortName]?.number || ""}
                          onChange={(e) =>
                            handleNumberChange(shortName, e.target.value)
                          }
                          className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-purple-400 text-sm md:text-base"
                        />
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(shortName, e.target.files[0])
                          }
                        />
                        <span className="text-white bg-purple-500 rounded-xl p-2 font-medium text-sm md:text-base whitespace-nowrap">
                          {documents[shortName]?.file
                            ? "Change File"
                            : "Upload "}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end flex-col md:flex-row items-center gap-2 md:gap-4 pt-3 md:pt-4">
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-base font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
