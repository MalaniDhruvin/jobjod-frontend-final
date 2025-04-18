"use client"

import { useEffect, useRef, useState } from "react"
import image from "../image/logo2.png"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { RxDashboard } from "react-icons/rx"
import image2 from "../image/profile.jpg"
import t4 from "../image/t4.png"
import t1 from "../image/t1.png"
import t2 from "../image/t2.png"
import t3 from "../image/t3.png"
import close from "../image/close-circle.png"
import crown from "../image/crown.png"
import List from "../image/List-list.png"
import tick from "../image/tick.png"
import star from "../image/star.png"
import Jobseekerheader from "./Jobseekerheader"
import { IoMail } from "react-icons/io5"
import { LiaShareAltSolid } from "react-icons/lia"
import { TfiMoreAlt } from "react-icons/tfi"
import { BASE_URL, USER_BASE_URL } from "../config"

// Utility function for conditional classNames
export const cn = (...classes) => classes.filter(Boolean).join(" ")

// Mock data (fallback if API is not ready)
const profileData = {
  name: "Anamoul",
  avatar: "/placeholder.svg?height=100&width=100"
}

// -----------------------
// JobDetails Component
// -----------------------
const JobDetails = ({ selectedJobId }) => {
  const [activeTab, setActiveTab] = useState("Job Description")
  const [job, setJob] = useState(null)
  const [company, setCompany] = useState(null)
  const [skills, setSkills] = useState({})
  const [appliedForDetail, setAppliedForDetail] = useState(null)

  const tabs = ["Application Status", "Job Description"]
  const tabsContainerRef = useRef(null)
  const activeTabRef = useRef(null)

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const activeTabElement = activeTabRef.current
      const scrollLeft =
        activeTabElement.offsetLeft -
        container.clientWidth / 2 +
        activeTabElement.clientWidth / 2
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth"
      })
    }
  }, [activeTab])

  // Scroll tabs left/right
  const scroll = direction => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const scrollAmount = container.clientWidth / 2
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  // When selectedJobId changes, fetch the job details and skills.
  useEffect(() => {
    if (!selectedJobId) return

    const fetchJobAndSkills = async () => {
      try {
        const jobRes = await fetch(`${BASE_URL}/jobs/${selectedJobId}`, {
          headers: { "Content-Type": "application/json" }
        })
        const jobData = await jobRes.json()
        // console.log("Job Data:", jobData)
        setJob(jobData)

        const skillsRes = await fetch(`${BASE_URL}/job-description/${selectedJobId}`, {
          headers: { "Content-Type": "application/json" }
        })
        const skillsData = await skillsRes.json()
        setSkills(skillsData)
      } catch (err) {
        console.error("Error fetching job details and skills:", err)
      }
    }

    fetchJobAndSkills()
  }, [selectedJobId])

  // Once job is fetched and contains a userId, fetch company details.
  useEffect(() => {
    if (!job?.userId) return

    const fetchCompanyDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/company/${job.userId}`, {
          headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        setCompany(data)
      } catch (err) {
        console.error("Error fetching company details:", err)
      }
    }

    fetchCompanyDetails()
  }, [job])

  // When selectedJobId changes, fetch the appliedFor details by job id.
  useEffect(() => {
    if (!selectedJobId) return

    const fetchAppliedForDetail = async () => {
      try {
        const userId = localStorage.getItem("userId")
        const token = localStorage.getItem("authToken")
        const fetchOptions = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        const res = await fetch(
          `${USER_BASE_URL}/users/appliedFor/${selectedJobId}/apply/${userId}`,
          fetchOptions
        )
        const data = await res.json()
        setAppliedForDetail(data.appliedFor)
      } catch (err) {
        console.error("Error fetching appliedFor detail:", err)
      }
    }

    fetchAppliedForDetail()
  }, [selectedJobId])

  const formatDate = dateInput => {
    const d = new Date(dateInput)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  if (!job || !company) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-0 md:p-6">
      <div className="relative w-50 md:w-50 max-w-50 md:max-w-50">
        {/* Scroll buttons for mobile */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-sm md:hidden"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <div
          className="flex items-center rounded-full w-50 md:w-50 overflow-x-auto scrollbar-hide"
          ref={tabsContainerRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex items-center px-6 bg-gray-100 p-1 rounded-full md:px-0">
            {tabs.map(tab => (
              <button
                key={tab}
                ref={activeTab === tab ? activeTabRef : null}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 md:px-4 rounded-full ms-2 me-2 text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-white text-purple-500 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-sm md:hidden"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      <div className="flex justify-between mt-10">
        <div className="mb-6 md:mb-8 w-max">
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {JSON.parse(job.jobTitle).label || "Product Designer"}
          </h1>
          <div className="flex flex-wrap items-center text-gray-600 mb-3">
            <span className="mr-2">✈️</span>
            <span className="mr-2">
              {company.companyName || "Grameenphone"}
            </span>
            <span className="mr-2">
              {company.location || "Dhaka, Bangladesh"}
            </span>
          </div>
          <div className="grid">
            <h6 className="font-bold mb-2">
              Salary: {job.minSalary}-{job.maxSalary} INR
            </h6>
            <div className="flex space-x-1">
              <img src={tick || "/placeholder.svg"} alt="tick" />
              <span className="text-sm font-medium">
                Applied on{" "}
                {appliedForDetail
                  ? formatDate(appliedForDetail.appliedOn)
                  : job.appliedDate || "23 May 20"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex space-x-4 h-max items-center">
            <IoMail size="24" />
            <LiaShareAltSolid size="30" />
            <TfiMoreAlt size="24" />
          </div>
          <div className="flex flex-wrap items-center text-sm text-gray-500">
            <span className="mr-4">Posted on {formatDate(job.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Display interviewers */}
      <div className="border rounded-xl p-3 mb-6 md:mb-8">
        {(job.interviewPersons || []).map((person, index) => (
          <div
            key={index}
            className="flex items-center justify-between mb-4 last:mb-0"
          >
            <div className="flex items-center gap-4">
              <img
                src={t4 || "/placeholder.svg"}
                className="w-12 h-12 rounded-full bg-gray-200"
                alt={person.name || "Interviewer"}
              />
              <div>
                <h3 className="font-medium">{person || "Interviewer"}</h3>
                <p className="text-sm text-gray-600">
                  {person.jobTitle || "Interviewer"} ·{" "}
                  {company.companyName || "Grameenphone"}
                </p>
              </div>
            </div>
            <button className="text-blue-500">Send Message</button>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="font-bold mb-3">Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-left">
            <li>
              {skills.responsibility ||
                "Work on and execute design projects from start to finish while meeting creative and technical requirements."}
            </li>
            <li>
              {skills.responsibility2 ||
                "Collaborate closely with engineers, researchers, clinicians, and product managers to iterate rapidly."}
            </li>
            <li>
              {skills.responsibility3 ||
                "Work on the entire project lifecycle, from wireframes to detailed specs across multiple UX platforms."}
            </li>
            <li>
              {skills.responsibility4 ||
                "Participate in regular design reviews and other team-wide design efforts; create and contribute to a great design team culture."}
            </li>
            <li>
              {skills.responsibility5 ||
                "Participate in user experience research and usability studies."}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold mb-3">Qualifications and Skills</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-left">
            {(skills.skills || []).map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-bold mb-3">Preferred Qualifications and Skills</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-left">
            {(skills.preferredSkills || []).map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        <div className="mt-8 border-t pt-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={t4 || "/placeholder.svg"}
                className="w-12 h-12 bg-blue-100 rounded-lg mr-4"
                alt=""
              />
              <div>
                <h3 className="font-medium">
                  {company.companyName || "Grameenphone Ltd."}
                </h3>
                <p className="text-sm text-gray-600">
                  {company.industry || "Telecommunications"} ·{" "}
                  {company.employeeCount || "6,525"} employees · Actively Hiring
                </p>
              </div>
            </div>
            <button className="text-blue-500">View Page</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// -----------------------
// JobItem Component for ApplicationsList
// -----------------------
// This nested component fetches job details for a given application (which only has id, status and appliedOn)
// and then displays the jobTitle, companyName, and location as required.
const JobItem = ({ application, onJobSelect }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchJobAndCompanyDetails = async () => {
      try {
        // First: Fetch job details
        const res = await fetch(`${BASE_URL}/jobs/${application.id}`, {
          headers: { "Content-Type": "application/json" }
        });
        const jobData = await res.json();
        setJobDetails(jobData);

        // Second: Fetch company info using userId from job details
        if (jobData?.userId) {
          const companyRes = await fetch(`${BASE_URL}/company/${jobData.userId}`, {
            headers: { "Content-Type": "application/json" }
          });
          const companyData = await companyRes.json();
          setCompanyInfo(companyData);
        }
      } catch (err) {
        console.error("Error fetching job or company details:", err);
      }
    };

    fetchJobAndCompanyDetails();
  }, [application.id]);

  return (
    <div
      className="flex items-center p-2 rounded-xl bg-purple-50 cursor-pointer"
      onClick={() => onJobSelect(application.id)}
    >
      <img
        src={t1 || "/placeholder.svg"}
        alt="Job icon"
        className="w-12 h-12 object-contain"
      />
      <div className="flex-1 min-w-0 ps-2">
        <h3 className="font-semibold truncate">
          {jobDetails
            ? (JSON.parse(jobDetails.jobTitle).label || `Job ${application.id}`)
            : `Job ${application.id}`}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {companyInfo
            ? `${companyInfo.companyName || "Company"} • ${companyInfo.location || "Location"}`
            : "Company • Location"}
        </p>
        <div className="flex mt-1">
          <span className="text-xs px-2 py-1 rounded-full inline-flex items-center text-green-500">
            {application.status}
          </span>
          <span className="text-xs ml-2">
            {new Date(application.appliedOn).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};


// -----------------------
// ApplicationsList Component
// -----------------------
const ApplicationsList = ({ filter = "All Jobs", onJobSelect }) => {
  const [applications, setApplications] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const initialSelectCalled = useRef(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve user details with appliedFor array
        const res = await fetch(`${USER_BASE_URL}/users/${userId}`, fetchOptions);
        const data = await res.json();
        // console.log("User Details:", data);
        // The API returns applications with only id, status, and appliedOn.
        setApplications(data.data.appliedFor || []);
      } catch (err) {
        console.error("Error fetching user applied jobs:", err);
      }
    };
    fetchUserDetails();
  }, [userId]);

  const filteredApplications =
    filter === "All Jobs"
      ? applications
      : applications.filter((app) =>
          app.status.toLowerCase() === filter.toLowerCase()
        );

  useEffect(() => {
    // Reset the flag when the filter changes.
    initialSelectCalled.current = false;
  }, [filter]);

  useEffect(() => {
    if (!initialSelectCalled.current && filteredApplications.length > 0) {
      onJobSelect(filteredApplications[0].id);
      initialSelectCalled.current = true;
    } else if (filteredApplications.length === 0) {
      onJobSelect(null);
    }
  }, [filteredApplications, onJobSelect]);

  return (
    <div className="space-y-4">
      {filteredApplications.map((app) => (
        // Use JobItem to display jobTitle, companyName, and location by fetching job details.
        <JobItem key={app.id} application={app} onJobSelect={onJobSelect} />
      ))}
    </div>
  );
};

// -----------------------
// DashboardSidebar Component
// -----------------------
const DashboardSidebar = ({ profile, isOpen, onClose }) => (
  <div
    className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}
  >
    <div className="p-6">
      <div className="flex items-center mb-4 ">
        <Link to="/">
          <img
            src={image || "/placeholder.svg"}
            alt="JobJod"
            className="text-center items-center mx-10"
          />
        </Link>
      </div>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-2 overflow-hidden">
          <img
            src={image2 || "/placeholder.svg"}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-black font-bold ">Hello, Anamoul</p>
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-4 p-6">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/Jobseeker"
              className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <RxDashboard />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/Job"
              className="flex items-center p-3 text-white rounded-lg bg-black"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="ml-3">Jobs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/Profile"
              className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="ml-3">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="##"
              className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="ml-3">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
)

// -----------------------
// Main Job Component
// -----------------------
const Job = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState(null)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const tabs = [
    "All Jobs",
    "Applied",
    "Short Listed",
    "Interview",
    "Hired",
    "Rejected"
  ]
  const [activeTab, setActiveTab] = useState(tabs[0])
  const tabsContainerRef = useRef(null)
  const activeTabRef = useRef(null)
  const filterDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const activeTabElement = activeTabRef.current
      const scrollLeft =
        activeTabElement.offsetLeft -
        container.clientWidth / 2 +
        activeTabElement.clientWidth / 2
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth"
      })
    }
  }, [activeTab])

  // Scroll tabs left/right
  const scroll = direction => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current
      const scrollAmount = container.clientWidth / 2
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
  }

  // onJobSelect is called when a job in the left list is clicked
  const handleJobSelect = jobId => {
    setSelectedJobId(jobId)
  }

  return (
    <>
      <div className="min-h-screen">
        <Jobseekerheader />
        <div className="lg:pl-64">
          <div className="p-3 flex flex-col sm:flex-row sm:items-center gap-x-4">
            {/* Mobile Filter Button */}
            <div className="relative sm:hidden w-full mb-2" ref={filterDropdownRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-full text-gray-700"
              >
                <span className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  {activeTab}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-20 border">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab)
                        setShowFilterDropdown(false)
                      }}
                      className={`block w-full text-left px-4 py-2 ${
                        activeTab === tab
                          ? "bg-purple-50 text-purple-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:block overflow-x-auto pb-2 sm:pb-0">
              <div className="relative w-full max-w-full">
                <div
                  className="flex items-center bg-gray-100 rounded-full p-1 w-full overflow-x-auto scrollbar-hide"
                  ref={tabsContainerRef}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <div className="flex items-center px-6 md:px-0">
                    {tabs.map(tab => (
                      <button
                        key={tab}
                        ref={activeTab === tab ? activeTabRef : null}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-2 md:px-4 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                          activeTab === tab
                            ? "bg-white text-purple-500 shadow-sm"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className="hidden sm:block px-6 py-2 rounded-full border border-gray-200 text-purple-500 hover:bg-gray-50 w-full sm:w-auto">
              Save
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar - Applications List */}
            <div className="w-full lg:w-[30%] p-3">
              <ApplicationsList filter={activeTab} onJobSelect={handleJobSelect} />
            </div>
            {/* Main Content - Job Details */}
            <div className="w-full lg:w-[70%] p-3">
              {selectedJobId ? (
                <JobDetails selectedJobId={selectedJobId} />
              ) : (
                <div>Please select a job to view details</div>
              )}
            </div>
          </div>
        </div>

        {isSidebarVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
            onClick={toggleSidebar}
          ></div>
        )}
        {showFilterDropdown && (
          <div
            className="fixed inset-0 bg-black bg-opacity-10 sm:hidden z-10"
            onClick={() => setShowFilterDropdown(false)}
          ></div>
        )}
      </div>
    </>
  )
}

export default Job
