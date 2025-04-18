"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import t1 from "../image/t1.png";
import t2 from "../image/t2.png";
import t3 from "../image/t3.png";
import t4 from "../image/t4.png";
import p1 from "../image/Notificationlogo1.png";
import star from "../image/star.png";
import tick from "../image/tick.png";
import { Facebook, Linkedin, MoreVertical } from "lucide-react";
import axios from "axios"

// Assume BASE_URL is exported from your config file.
import { BASE_URL,USER_BASE_URL } from "../config";

const Singlejobview = () => {
  // Extract jobId from URL parameters.
  const { jobId } = useParams();

  // Local state for fetched data.
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [skills, setSkills] = useState([]);

  // The rest of your UI states remain unchanged.
  const [expanded, setExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const menuRef = useRef(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showCompanyPage, setShowCompanyPage] = useState(false);
  const [appliedFor, setAppliedFor] = useState([]);

  // Assume the auth token is stored in localStorage.
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // For demonstration, we use a sample description.
  const description =
    "The right and contemporary use of technology is key to the progress of a nation. Keeping this in mind, Grameenphone always brings future-proof technology in order to facilitate your progress. The possibilities in this new world are immense and someone as bright as you should be the forerunner in leading the change...";

  // Close the share menu when clicking outside.
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Fetch job information, company details, and job skills.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch job info using jobId.
        const jobRes = await fetch(`${BASE_URL}/jobs/${jobId}`, fetchOptions);
        const jobData = await jobRes.json();
        console.log(jobData);
        setJob(jobData);

        // 2. Fetch company info using jobData.userId.
        const companyRes = await fetch(
          `${BASE_URL}/company/${jobData.userId}`,
          fetchOptions
        );
        const companyData = await companyRes.json();
        console.log(companyData);
        setCompany(companyData);

        // 3. Fetch skills using jobId (adjust endpoint as needed).
        const skillsRes = await fetch(
          `${BASE_URL}/job-description/${jobId}`,
          fetchOptions
        );
        const skillsData = await skillsRes.json();
        console.log(skillsData);
        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  useEffect(() => {
    axios
      .get(`${USER_BASE_URL}/users/appliedFor/${userId}`,fetchOptions)
      .then((res) => {
        // Expecting res.data.appliedFor to be an array
        setAppliedFor(res.data.appliedFor || []);
        console.log(res)
      })
      .catch((err) => {
        console.error("Error fetching applied jobs:", err);
      })
      .finally(() => {
        // setLoading(false);
      });
  }, [userId]);

  // Share functions.
  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out this job: ${job?.title || "Job"} at ${
        company?.companyName || ""
      }`
    );
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
    setShowShareMenu(false);
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(job?.title || "Job");
    const summary = encodeURIComponent(
      `Job opportunity at ${company?.companyName || ""}`
    );
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`,
      "_blank"
    );
    setShowShareMenu(false);
  };

  const expiryCalculate = (expiryTime, createdDate) => {
    const expiryDays = Number(expiryTime) || 0;
    const expireDateObj = new Date(createdDate);
    expireDateObj.setDate(expireDateObj.getDate() + expiryDays);
    const expireDate = formatDate(expireDateObj);
    return expireDate;
  };

  // Handlers for mobile view (remain unchanged)
  const handleJobItemClick = () => {
    if (window.innerWidth < 768) {
      setShowJobDetails(true);
      setShowCompanyPage(false);
    }
  };

  const handleBackToList = () => {
    setShowJobDetails(false);
    setShowCompanyPage(false);
  };

  const handleViewPageClick = (e) => {
    if (window.innerWidth < 768) {
      e.preventDefault();
      setShowCompanyPage(true);
      setShowJobDetails(false);
    }
  };

  const handleApply = (jobId) => {
    // Check if the job is already applied
    if (appliedFor.some((item) => item.id === jobId)) {
      alert("Already applied for this job");
      return;
    }
  
    const application = {
      id: jobId,
      appliedOn: new Date().toISOString(),
      status: "applied",
    };
  
    const updatedAppliedFor = [...appliedFor, application];
    setAppliedFor(updatedAppliedFor);
  
    axios
      .post(
        `${USER_BASE_URL}/users/${userId}/apply`,
        { jobIds: updatedAppliedFor },
        fetchOptions
      )
      .then((res) => {
        console.log("Updated appliedFor:", res.data.appliedFor);
        setIsApplied(true);
      })
      .catch((err) => {
        console.error("Error updating appliedFor:", err);
        // Optionally revert the state if the API fails
      });
  };
  

  // If job (and company) data have not loaded yet, show a loading indicator.
  if (!job || !company) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateInput) => {
    const d = new Date(dateInput);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Navbar />
      <div className="bg-white rounded-lg overflow-hidden md:flex">
        {/* Left Side - Job Listings (static sample listings remain unchanged) */}
        <div
          className={`w-full md:w-[22%] p-4 border-r-2 border-gray-200 ${
            showJobDetails || showCompanyPage ? "hidden md:block" : "block"
          }`}
        >
          <div className="text-xl font-semibold text-gray-700 mb-2 mx-6">
            Top job picks for you
          </div>
          <div className="text-xs text-gray-500 mx-6">
            Based on your search{" "}
            <span className="font-bold mx-2 md:mx-10">45 Results</span>
          </div>
          <div className="mt-4 p-2">
            {/* Sample Job Listing - This section would normally be dynamic */}
            <div
              className="flex items-center py-2 cursor-pointer hover:bg-blue-50"
              onClick={handleJobItemClick}
            >
              <img
                src={t1 || "/placeholder.svg"}
                alt="Company Logo"
                className="w-10 h-10 rounded-xl mr-2"
              />
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {job.title || "Product Designer"}
                </div>
                <div className="text-xs text-gray-500">
                  <span className="font-semibold text-black">
                    {company.companyName}
                  </span>{" "}
                  {company.location}
                </div>
                <div className="text-xs text-black font-semibold flex mt-2">
                  <img
                    src={tick || "/placeholder.svg"}
                    alt="tick"
                    className="mr-1 h-4 w-4"
                  />
                  Applied on 23 May 20
                </div>
              </div>
            </div>
            {/* You can repeat similar job listings as needed */}
          </div>
        </div>

        {/* Right Side - Job Details */}
        <div
          className={`w-full md:w-3/4 p-6 ${
            showJobDetails && !showCompanyPage ? "block" : "hidden md:block"
          }`}
          style={{
            overflowY: "scroll",
            maxHeight: "100vh",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {showJobDetails && (
            <button
              className="md:hidden mb-4 flex items-center text-gray-600"
              onClick={handleBackToList}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to jobs
            </button>
          )}
          <div className="flex flex-col md:flex-row justify-between items-start ">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {JSON.parse(job.jobTitle).label}
              </h2>
              <div className="text-gray-600">
                <span className="mr-1">
                  <img
                    src={t1 || "/placeholder.svg"}
                    className="w-4 h-4 inline mr-1"
                    alt="img"
                  />
                </span>
                <span className="font-semibold">{company.companyName}</span>{" "}
                {company.location}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-semibold">
                Posted on {formatDate(job.createdAt)} &nbsp; Expire On{" "}
                {expiryCalculate(job.expiryTime, job.createdAt)}
              </div>
              <h2 className="font-bold mt-2">
                Salary: {job.minSalary}-{job.maxSalary} INR
              </h2>
              <div className="flex items-center">
                {/* You can show applied status here */}
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {!isApplied ? (
                <>
                  <button
                    className="bg-purple-500 text-white rounded-xl px-6 py-2 text-sm font-medium mr-2"
                    // onClick={() => setIsApplied(true)}
                    onClick={()=>handleApply(jobId)}
                  >
                    Apply Now
                  </button>
                  <button
                    className="bg-black text-white rounded-xl px-5 py-2 text-sm font-medium"
                    onClick={() => setIsApplied(true)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <div className="flex items-center">
                  <img
                    src={tick || "/placeholder.svg"}
                    alt="tick"
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm font-semibold">
                    Applied on 23 May 20
                  </span>
                </div>
              )}
              <div className="relative ml-2" ref={menuRef}>
                <button
                  className="text-gray-500 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={shareOnWhatsApp}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-5 h-5 mr-3 text-green-500 fill-current"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Share on WhatsApp
                      </button>
                      <button
                        onClick={shareOnFacebook}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={shareOnLinkedIn}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Linkedin className="w-5 h-5 mr-3 text-blue-700" />
                        Share on LinkedIn
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* HR Manager Info */}
          <div className="flex flex-col gap-4 mt-8">
            {job.interviewPersons.map((person, index) => (
              <div
                key={index}
                className="flex items-center border-2 rounded-xl p-2"
              >
                <img
                  src={person.image || p1 || "/placeholder.svg"}
                  alt={person.name || "Interview person"}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {person}
                  </div>
                  <div className="text-xs text-gray-500">
                    Interviewer, {company.companyName}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Responsibilities */}
          <div className="mt-6">
            {/* Responsibilities */}
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Responsibilities
            </h3>
            <p className="text-gray-600 text-sm">{skills.responsibility}</p>
          </div>

          {/* Qualifications and Skills */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Qualifications and Skills
            </h3>
            <ul className="list-disc list-inside text-gray-600 text-sm">
              {(skills.skills || []).map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Preferred Qualifications and Skills */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Preferred Qualifications and Skills
            </h3>
            <ol className="list-decimal list-inside text-gray-600 text-sm">
              {(skills.preferredSkills || []).map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ol>
          </div>

          {/* Company Info */}
          <div className="mt-6 border-2 rounded-2xl p-4 md:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start md:items-center gap-2">
                <img
                  src={t1 || "/placeholder.svg"}
                  alt="Company Logo"
                  className="w-8 h-8 rounded-full mt-1 md:mt-0"
                />
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {company.companyName}
                  </div>
                  <div className="text-xs text-gray-500">
                    Telecommunications • {company.location} •{" "}
                    <span className="text-green-400 font-bold">
                      Actively Hiring
                    </span>
                  </div>
                </div>
              </div>
              <a
                href="##"
                className="text-purple-400 text-sm font-bold md:self-start"
                onClick={handleViewPageClick}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Page
              </a>
            </div>
            <div className="mt-3 md:mt-2">
              <p className="text-xs text-gray-600">
                {expanded ? description : description.substring(0, 150) + "..."}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-purple-400 ml-1 inline-flex items-center"
                >
                  {expanded ? "see less" : "see more"}
                </button>
              </p>
            </div>
          </div>
          {/* Contact Information and Additional Details */}
          {/* <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Information</h3>
            <div className="text-sm text-gray-600">
              <p>Website: {company.website || "www.grameenphone.com"}</p>
              <p>Email: {company.email || "careers@grameenphone.com"}</p>
              <p>Phone: {company.phone || "+880 2 9882990"}</p>
              <p>
                Address: {company.address || "GP House, Bashundhara, Baridhara, Dhaka-1229, Bangladesh"}
              </p>
            </div>
          </div> */}
        </div>

        {/* Company Page View (for mobile) */}
        <div
          className={`w-full md:w-3/4 p-6 ${
            showCompanyPage ? "block" : "hidden"
          }`}
          style={{
            overflowY: "scroll",
            maxHeight: "100vh",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <button
            className="mb-4 flex items-center text-gray-600"
            onClick={handleBackToList}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to jobs
          </button>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={t1 || "/placeholder.svg"}
              alt="Company Logo"
              className="w-16 h-16 rounded-xl"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {company.companyName}
              </h2>
              <div className="text-sm text-gray-600">
                {company.industry || "Telecommunications"} • {company.location}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-green-500 font-semibold">
                  Actively Hiring
                </span>{" "}
                • {company.employeeCount || "6,424"} employees
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                About the Company
              </h3>
              <p className="text-sm text-gray-600">
                {company.about || description}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Open Positions
              </h3>
              <div className="grid gap-4">
                {/* For demo, static open positions are shown */}
                <div className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="text-md font-medium text-gray-800">
                    {job.title}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {company.location} • Full-time
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Posted on {job.postedAt} • {job.salary}
                  </div>
                </div>
                {/* Add more listings as needed */}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Company Benefits
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Health Insurance
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Paid Time Off
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Flexible Hours
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Professional Development
                </div>
              </div>
            </div>
            {/* <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Contact Information</h3>
              <div className="text-sm text-gray-600">
                <p>Website: {company.website || "www.grameenphone.com"}</p>
                <p>Email: {company.email || "careers@grameenphone.com"}</p>
                <p>Phone: {company.phone || "+880 2 9882990"}</p>
                <p>Address: {company.address || "GP House, Bashundhara, Baridhara, Dhaka-1229, Bangladesh"}</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Singlejobview;
