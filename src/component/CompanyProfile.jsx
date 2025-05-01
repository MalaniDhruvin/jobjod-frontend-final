import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { PiBagSimpleFill } from "react-icons/pi";
import { FaTrophy, FaCrown } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import img2 from "../image/education.png";
import Dheader from "./Dheader";
import { useLocation } from "react-router-dom";
import { Trash2, Pencil, SquarePen } from "lucide-react";
import DashSidebar from "./DashSidebar";
import CompanyBasicInformation from "./CompanyBasicInformation";
import { IndustryModal } from "./IndustryModal";
import { SectionModal } from "./SectionModal";
import { RecognitionModal } from "./RecognitionModal";
import { CultureModal } from "./CultureModal";
import LegalDocuments from "./LegalDocuments";
import axios from "axios";
import { BASE_URL } from "../config";

function CompanyProfile() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const [items, setItems] = useState([]);
  const [showAddIndustryModal, setShowAddIndustryModal] = useState(false);
  const [showEditIndustryModal, setShowEditIndustryModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [showAddRecognitionModal, setShowAddRecognitionModal] = useState(false);
  const [showCultureModal, setShowCultureModal] = useState(false);
  const [showEditCultureModal, setShowEditCultureModal] = useState(false);
  const [showEditRecognitionModal, setShowEditRecognitionModal] = useState(false);
  const [recognitions, setRecognitions] = useState([]);
  const [name, setName] = useState({
    name:"",location:""
  });
  const [industries, setIndustries] = useState([
    { id: "1", name: "Information Technology" },
    { id: "2", name: "Digital Marketing" },
  ]);
  const [sections, setSections] = useState([
    {
      id: "1",
      title: "Overview",
      content: "ShareTrip is the country's first and pioneer online travel aggregator...",
    },
    {
      id: "2",
      title: "Vision",
      content: "ShareTrip is the country's first and pioneer online travel aggregator...",
    },
    {
      id: "3",
      title: "Mission",
      content: "ShareTrip is the country's first and pioneer online travel aggregator...",
    },
  ]);
  const [cultures, setCultures] = useState([]); // Already an empty array
  const [currentCulture, setCurrentCulture] = useState(null);
  const [newIndustry, setNewIndustry] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentRecognition, setCurrentRecognition] = useState(null);
  const location = useLocation();
  const substrLocation = location.pathname.substring(1);

  useEffect(() => {
    const fetchData = async () => {
      // 1) Fetch company overview + recognition
      try {
        console.log("Fetching data for user:", userId);
        console.log("Token:", token);

        // Company overview
        const companyRes = await axios.get(
          `${BASE_URL}/company-overview/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const companyArray = Array.isArray(companyRes.data)
          ? companyRes.data
          : [companyRes.data];
        const parsedItems = companyArray.map(item => ({
          ...item,
          companyIndustry:
            typeof item.companyIndustry === "string"
              ? JSON.parse(item.companyIndustry || "[]")
              : item.companyIndustry || []
        }));
        setItems(parsedItems);

        // Recognition
        const recogRes = await axios.get(
          `${BASE_URL}/recognition/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecognitions(
          Array.isArray(recogRes.data) ? recogRes.data : []
        );
      } catch (err) {
        console.error("Error fetching overview or recognition:", err);
        setItems([]);
        setRecognitions([]);
      }

      // 2) Fetch culture separately so its 404 won't clear items
      try {
        const cultureRes = await axios.get(
          `${BASE_URL}/culture/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = cultureRes.data || {};
        const cultureItems = [];
        if (data.companyEnvironment) {
          cultureItems.push({ id: 1, title: "Company Environment", content: data.companyEnvironment });
        }
        if (data.employeeBenefits) {
          cultureItems.push({ id: 2, title: "Employee Benefits", content: data.employeeBenefits });
        }
        if (data.careerDevelopment) {
          cultureItems.push({ id: 3, title: "Career Development", content: data.careerDevelopment });
        }
        setCultures(cultureItems);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("No culture data found for this user");
          setCultures([]);
        } else {
          console.error("Error fetching culture:", err);
        }
      }
    };

    fetchData();
  }, [token, userId]);

  // Culture API functions
  const addCulture = async (newCulture) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/culture`,
        { userId, ...newCulture },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCultures((prev) => [...prev, response.data]);
      setShowCultureModal(false);
    } catch (error) {
      console.error("Error adding culture:", error);
    }
  };

  const updateCulture = async (updatedCulture) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/culture/${updatedCulture.id}`,
        { userId, ...updatedCulture },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCultures((prev) =>
        prev.map((culture) =>
          culture.id === updatedCulture.id ? response.data : culture
        )
      );
      setShowEditCultureModal(false);
    } catch (error) {
      console.error("Error updating culture:", error);
    }
  };

  const deleteCulture = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/culture/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCultures((prev) => prev.filter((culture) => culture.id !== id));
    } catch (error) {
      console.error("Error deleting culture:", error);
    }
  };

  const addIndustry = async () => {
    if (!newIndustry.trim()) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/company-overview/industry/create`,
        { userId, companyIndustry: newIndustry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data?.companyIndustry) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === (prev[0]?.id || item.id)
              ? { ...item, companyIndustry: response.data.data.companyIndustry }
              : item
          )
        );
      }
      setNewIndustry("");
      setShowAddIndustryModal(false);
    } catch (error) {
      console.error("Error adding industry:", error);
    }
  };

  const NavItem = ({ icon, text, active = false }) => (
    <li
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
        active ? "bg-purple-50 text-purple-600" : "hover:bg-gray-50"
      }`}
    >
      {React.cloneElement(icon, {
        className: `w-5 h-5 ${active ? "text-purple-600" : "text-gray-500"}`,
      })}
      <span className={active ? "font-medium" : ""}>{text}</span>
    </li>
  );

  const updateIndustry = async (updatedIndustry) => {
    try {
      await axios.put(
        `${BASE_URL}/industry`,
        { userId, companyIndustry: [updatedIndustry.name] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIndustries((prev) =>
        prev.map((industry) =>
          industry.id === updatedIndustry.id ? updatedIndustry : industry
        )
      );

      const companyResponse = await axios.get(
        `${BASE_URL}/company-overview/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const parsedData = companyResponse.data.map((item) => ({
        ...item,
        companyIndustry:
          typeof item.companyIndustry === "string"
            ? JSON.parse(item.companyIndustry || "[]")
            : item.companyIndustry || [],
      }));

      setItems(parsedData);
      setShowEditIndustryModal(false);
    } catch (error) {
      console.error("Error updating industry:", error);
    }
  };

  const deleteIndustry = async (id, industryValue) => {
    try {
      await axios.delete(`${BASE_URL}/company-overview/industry`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          userId,
          industryValue: industryValue,
        },
      });

      const companyResponse = await axios.get(
        `${BASE_URL}/company-overview/industry/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const parsedData = companyResponse.data.map((item) => ({
        ...item,
        companyIndustry:
          typeof item.companyIndustry === "string"
            ? JSON.parse(item.companyIndustry || "[]")
            : item.companyIndustry || [],
      }));

      setItems(parsedData);
    } catch (error) {
      console.error("Error deleting industry:", error);
    }
  };

  const addSection = (section) => {
    setSections([...sections, section]);
    setShowAddSectionModal(false);
  };

  const updateSection = (updatedSection) => {
    setSections(
      sections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    setShowEditSectionModal(false);
  };

  const deleteSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const addRecognition = (recognition) => {
    setRecognitions((prev) => [recognition, ...prev]);
    setShowAddRecognitionModal(false);
  };

  const handleSaveRecognition = (updatedRecognition) => {
    setRecognitions((prevRecognitions) => {
      if (updatedRecognition.id) {
        return prevRecognitions.map((rec) =>
          rec.id === updatedRecognition.id ? updatedRecognition : rec
        );
      }
      return [updatedRecognition, ...prevRecognitions];
    });
    setShowEditRecognitionModal(false);
  };

  const deleteRecognitionData = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/recognition/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting recognition:", error);
    }
  };

  const deleteRecognition = (id) => {
    deleteRecognitionData(id);
    setRecognitions(
      recognitions.filter((recognition) => recognition.id !== id)
    );
  };

  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=96&width=96"
  );
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/company-overview/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditItem = (item) => {
    console.log("Edit item:", item);
    // Add logic for editing item
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newIndustry.trim()) {
      addIndustry();
    }
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <DashSidebar substrLocation={substrLocation} />
        <div className="flex-1 flex flex-col overflow-auto">
          <Dheader />
          <div className="min-h-[24rem] sm:min-h-[32rem] overflow-auto md:overflow-visible md:min-h-[56rem] lg:w-[80%] md:w-[80%] w-full mx-auto">
            <div className="relative bg-white overflow-hidden">
              <img
                alt="Profile Background"
                className="w-full h-auto object-cover object-center min-h-[12rem] sm:min-h-[16rem] md:min-h-[20rem] lg:min-h-[24rem] xl:min-h-[28rem] max-w-screen-lg mx-auto hidden md:block"
                src="/static/media/g.af47b1fe0a2396978832.png"
              />
            </div>
            <div className="relative">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative order-1 sm:order-none">
                    <div
                      className="relative cursor-pointer group"
                      onClick={handleImageClick}
                    >
                      <img
                        alt="Profile pictures"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover md:mt-4 transition-opacity group-hover:opacity-80"
                        src={profileImage}
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                        <span className="text-white opacity-0 group-hover:opacity-100">
                          Change
                        </span>
                      </div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <SquarePen className="w-5 h-5" />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className="text-center sm:text-left mt-auto mb-auto order-last">
                    <h1 className="text-2xl font-semibold">{name.name}</h1>
                    <p className="text-gray-600">{name.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 sticky">
                <div className="w-full lg:w-[280px] lg:flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm border m-4 md:p-4">
                    <nav>
                      <ul className="space-y-2 font-semibold">
                        <NavItem
                          icon={<PiBagSimpleFill />}
                          text="Information"
                          active
                        />
                        <NavItem icon={<FaTrophy />} text="Recognition" />
                        <NavItem icon={<FaCrown />} text="Culture" />
                        <NavItem
                          icon={<IoDocumentTextOutline />}
                          text="Legal Information"
                        />
                      </ul>
                    </nav>
                  </div>
                </div>
                <CompanyBasicInformation name={setName} />
              </div>

              <div className="rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 lg:pl-20 xl:pl-80 justify-center">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="pb-4 bg-white rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-medium text-gray-900">
                        Company Industry
                      </h2>
                      {!isEditing && (
                        <div className="flex gap-4">
                          <button
                            onClick={toggleEditMode}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {console.log(items)}
                      {items.map((item) => (
                        <div key={item.id} className="flex flex-wrap gap-2">
                          {Array.isArray(item.companyIndustry) ? (
                            item.companyIndustry.map((industry, index) => (
                              
                              <div
                                key={`${item.id}-${index}`}
                                className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full flex items-center"
                              >
                                <span>{industry}</span>
                                {isEditing && (
                                  <button
                                    onClick={() =>
                                      deleteIndustry(item.id, industry)
                                    }
                                    className="ml-2 hover:bg-purple-200 rounded-full p-1"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <div
                              key={item.id}
                              className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full flex items-center"
                            >
                              <span>{item.companyIndustry}</span>
                              {isEditing && (
                                <button
                                  onClick={() =>
                                    deleteIndustry(
                                      item.id,
                                      item.companyIndustry
                                    )
                                  }
                                  className="ml-2 hover:bg-purple-200 rounded-full p-1"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditing && (
                      <>
                        <div className="flex gap-2 mt-4">
                          <input
                            type="text"
                            name="companyIndustry"
                            value={newIndustry}
                            onChange={(e) => setNewIndustry(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add industry"
                            className="border rounded-md px-3 py-2 flex-grow"
                          />
                          <button
                            onClick={addIndustry}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                          >
                            Add
                          </button>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={toggleEditMode}
                            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                          >
                            Done
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {items.map((item, index) => (
                    <div key={item.id}>
                      <div className="mb-4 sm:mb-6 md:mb-8 mt-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 sm:mb-0">
                            Overview
                          </h2>
                          <div className="flex gap-4 mt-2 sm:mt-0">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-sm sm:text-base text-gray-500 hover:text-gray-700 font-semibold"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sm sm:text-base text-purple-500 hover:text-purple-700 font-semibold"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-2 text-justify">
                          {item.overview}
                        </p>
                        <button className="text-sm sm:text-base text-purple-500 hover:text-purple-700">
                          See More
                        </button>
                      </div>

                      <div className="mb-4 sm:mb-6 md:mb-8 mt-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 sm:mb-0">
                            Vision
                          </h2>
                          <div className="flex gap-4 mt-2 sm:mt-0">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-sm sm:text-base text-gray-500 hover:text-gray-700 font-semibold"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sm sm:text-base text-purple-500 hover:text-purple-700 font-semibold"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-2 text-justify">
                          {item.vision}
                        </p>
                        <button className="text-sm sm:text-base text-purple-500 hover:text-purple-700">
                          See More
                        </button>
                      </div>

                      <div className="mb-4 sm:mb-6 md:mb-8 mt-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2 sm:mb-0">
                            Mission
                          </h2>
                          <div className="flex gap-4 mt-2 sm:mt-0">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-sm sm:text-base text-gray-500 hover:text-gray-700 font-semibold"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sm sm:text-base text-purple-500 hover:text-purple-700 font-semibold"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-2 text-justify">
                          {item.mission}
                        </p>
                        <button className="text-sm sm:text-base text-purple-500 hover:text-purple-700">
                          See More
                        </button>
                      </div>
                      {index < items.length - 1 && (
                        <div className="border-b border-gray-200 mt-6 sm:mt-8"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 lg:pl-20 xl:pl-80">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12">
                        <img
                          src={img2}
                          alt="Recognition icon"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Recognition</h2>
                        <p className="text-gray-600 text-sm">
                          Add recognition to provide more information
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddRecognitionModal(true)}
                      className="px-6 py-2 font-semibold text-purple-600 bg-white border-2 border-purple-600 hover:bg-purple-100 rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-6">
                    {recognitions.map((recognition) => (
                      <div className="border-b pb-6" key={recognition.id}>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                            <img
                              src="/placeholder.svg"
                              alt={recognition.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-black">
                                  {recognition.from}
                                </h3>
                                <div className="flex flex-wrap gap-x-4 text-sm mt-1">
                                  <span>{recognition.title}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span>{recognition.achievementDate}</span>
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <button
                                  onClick={() =>
                                    deleteRecognition(recognition.id)
                                  }
                                  className="text-gray-500 hover:text-gray-700 font-semibold"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => {
                                    setCurrentRecognition(recognition);
                                    setShowEditRecognitionModal(true);
                                  }}
                                  className="text-purple-500 hover:text-purple-700 font-semibold"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                            <p className="mt-4 text-gray-700 text-justify">
                              {recognition.description}...{" "}
                              <span className="text-purple-500 cursor-pointer">
                                See More
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 lg:pl-20 xl:pl-80">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-8 mt-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-md flex items-center justify-center relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-orange-400 rounded-t-md"></div>
                        <div className="text-yellow-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">Culture</h1>
                        <p className="text-gray-600">
                          Add company culture information
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCultureModal(true)}
                      className="px-6 py-2 font-semibold text-purple-600 bg-white border-2 border-purple-600 hover:bg-purple-100 rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  {cultures.length > 0 ? (
                    cultures.map((culture) => (
                      <div className="mb-8" key={culture.id}>
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">{culture.title}</h2>
                          <div className="flex gap-4">
                            <button
                              onClick={() => deleteCulture(culture.id)}
                              className="text-gray-500 hover:text-gray-600 font-semibold"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => {
                                setCurrentCulture(culture);
                                setShowEditCultureModal(true);
                              }}
                              className="text-purple-500 hover:text-purple-700 font-semibold"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{culture.content}</p>
                        <button className="text-sm text-purple-600 mt-1">
                          See More
                        </button>
                        <div className="border-b border-gray-200 mt-6"></div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No cultures added yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg p-4 pt-[unset] sm:p-6 md:p-8 lg:p-10 xl:p-12 lg:pl-20 xl:pl-80">
                <LegalDocuments />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddIndustryModal && (
        <IndustryModal
          onClose={() => setShowAddIndustryModal(false)}
          onSave={addIndustry}
        />
      )}
      {showEditIndustryModal && currentIndustry && (
        <IndustryModal
          industry={currentIndustry}
          onClose={() => setShowEditIndustryModal(false)}
          onSave={updateIndustry}
        />
      )}
      {showAddSectionModal && (
        <SectionModal
          onClose={() => setShowAddSectionModal(false)}
          onSave={addSection}
        />
      )}
      {showEditSectionModal && currentSection && (
        <SectionModal
          section={currentSection}
          onClose={() => setShowEditSectionModal(false)}
          onSave={updateSection}
        />
      )}
      {showAddRecognitionModal && (
        <RecognitionModal
          onClose={() => setShowAddRecognitionModal(false)}
          onSave={addRecognition}
        />
      )}
      {showEditRecognitionModal && currentRecognition && (
        <RecognitionModal
          recognition={currentRecognition}
          onClose={() => setShowEditRecognitionModal(false)}
          onSave={handleSaveRecognition}
        />
      )}
      {showCultureModal && (
        <CultureModal
          onClose={() => setShowCultureModal(false)}
          onSave={addCulture}
        />
      )}
      {showEditCultureModal && currentCulture && (
        <CultureModal
          culture={currentCulture}
          onClose={() => setShowEditCultureModal(false)}
          onSave={updateCulture}
        />
      )}
    </>
  );
}

export default CompanyProfile;