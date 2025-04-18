"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus, User, X } from "lucide-react";
import Dheader from "./Dheader";
import JobPostModal from "./JobPostModal";
import DashSidebar from "./DashSidebar";
import { BASE_URL } from "../config";
import Filters from "./Filters";
import JobList from "./JobList";
import RightSidebar from "./RightSidebar";
import Navbar from "./Navbar";
import Group from "../image/Group.svg";
import Footer from "./Footer";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

const JobListingPage = ({ isBrowseCompany }) => {
  // State for jobs – these will be merged with data from three APIs.
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(0);

  // UI state and other states...
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isEditingJobDetails, setIsEditingJobDetails] = useState(false);
  const [isEditingRecruiter, setIsEditingRecruiter] = useState(false);
  const [isEditingAllQualifications, setIsEditingAllQualifications] = useState(false);

  // For editing a specific job’s details.
  const [editedJob, setEditedJob] = useState(null);
  const [editedRecruiter, setEditedRecruiter] = useState({ name: "", company: "" });

  const [isJobListOpen, setIsJobListOpen] = useState(false);

  // Filters and other UI states from the original code
  const [filters, setFilters] = useState({
    location: "",
    salary: "",
    salaryType: "Yearly",
    datePosted: "",
    experience: "",
    employmentType: [],
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [jobType, setJobType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  // Helper: Common fetch options with token.
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Utility: Format a date as dd/mm/yyyy.
  const formatDate = (dateInput) => {
    const d = new Date(dateInput);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Combined API calls: jobs, company, and schedule.
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch the jobs list from the correct endpoint.
        const jobsRes = await fetch(`${BASE_URL}/jobs`, fetchOptions);
        const jobList = await jobsRes.json();

        // 2. For each job, fetch company details using job.userId and fetch schedule.
        const jobsWithSchedule = await Promise.all(
          jobList.map(async (job) => {
            // Company details based on userId from the job object.
            const companyRes = await fetch(`${BASE_URL}/company/${job.userId}`, fetchOptions);
            const companyData = await companyRes.json();

            // Schedule API remains the same.
            const scheduleRes = await fetch(`${BASE_URL}/job-schedule/${job.id}`, fetchOptions);
            const scheduleData = await scheduleRes.json();

            // Parse the job title assuming it is a JSON string.
            const jobTitleObj = JSON.parse(job.jobTitle);

            return {
              id: job.id,
              title: jobTitleObj.label,
              salary: `${job.minSalary}-${job.maxSalary}`,
              postedAt: formatDate(job.createdAt),
              company: companyData.companyName,
              location: companyData.location,
              workingTime: scheduleData.jobTiming || "",
              // You can add more properties here if needed for filtering.
            };
          })
        );

        setJobs(jobsWithSchedule);
        setSelectedJob(0);
        setEditedJob(jobsWithSchedule[0]);
      } catch (error) {
        console.error("Error fetching data from APIs", error);
      }
    };
    fetchAllData();
  }, []);
  
 const filteredJobs = jobs.filter((job) => {
  // Check Location (example):
  let locationMatch = true;
  if (filters.location && filters.location !== "Any") {
    locationMatch = job.location.toLowerCase().includes(filters.location.toLowerCase());
  }

  // Check Salary (example):
  let salaryMatch = true;
  if (filters.salary && filters.salary !== "Any") {
    const jobMinSalary = parseInt(job.salary.split("-")[0], 10);
    const filterSalaryValue = parseInt(filters.salary.replace(/[^\d]/g, ""), 10);
    salaryMatch = jobMinSalary >= filterSalaryValue * 1000;
  }

  // Check Date of Posting:
  let datePostedMatch = true;
  if (filters.datePosted && filters.datePosted !== "All time") {
    const dateParts = job.postedAt.split("/");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);
    const postedDate = new Date(year, month - 1, day);
    // console.log(postedDate)

    const now = new Date();
    const diffHours = (now - postedDate) / (1000 * 60 * 60);
    // console.log(diffHours)
    
    if (filters.datePosted === "Last 24 hours") {
      datePostedMatch = diffHours <= 40;
    } else if (filters.datePosted === "Last 3 days") {
      datePostedMatch = diffHours <= 72;
    } else if (filters.datePosted === "Last 7 days") {
      datePostedMatch = diffHours <= 168;
    }
  }

  return locationMatch && salaryMatch && datePostedMatch;
});


  
  // Other functions from the original code remain unchanged.
  const toggleJobModal = () => {
    setIsJobModalOpen(true);
  };

  const closeJobModal = () => {
    setIsJobModalOpen(false);
  };

  const toggleJobList = () => {
    setIsJobListOpen(!isJobListOpen);
  };

  const selectJob = (index) => {
    setSelectedJob(index);
    setIsJobListOpen(false);
    setIsEditingJobDetails(false);
    setIsEditingRecruiter(false);
    setIsEditingAllQualifications(false);
    setEditedJob({ ...jobs[index] });
    // If needed, set recruiter info here.
    setEditedRecruiter({
      name: "",
      company: jobs[index].company,
    });
  };

  if (!jobs.length || !editedJob) {
    return <div>Loading...</div>;
  }

  const currentJob = jobs[selectedJob];

  // ----- JOB DETAILS EDIT HANDLERS -----
  const handleJobDetailsEdit = () => {
    setIsEditingJobDetails(true);
  };
  const saveJobDetails = () => {
    const updatedJobs = [...jobs];
    updatedJobs[selectedJob] = { ...editedJob };
    setJobs(updatedJobs);
    setIsEditingJobDetails(false);
  };
  const cancelJobDetailsEdit = () => {
    setEditedJob({ ...currentJob });
    setIsEditingJobDetails(false);
  };

  // ----- RECRUITER HANDLERS -----
  const handleRecruiterEdit = () => {
    setIsEditingRecruiter(true);
  };
  const saveRecruiterEdit = () => {
    const updatedJobs = [...jobs];
    updatedJobs[selectedJob] = {
      ...currentJob,
      // In this merged example, recruiter data is not provided by the APIs.
    };
    setJobs(updatedJobs);
    setIsEditingRecruiter(false);
  };
  const cancelRecruiterEdit = () => {
    setEditedRecruiter({
      name: "",
      company: currentJob.company,
    });
    setIsEditingRecruiter(false);
  };

  // ----- QUALIFICATIONS HANDLERS -----
  const handleAllQualificationsEdit = () => {
    setIsEditingAllQualifications(true);
  };
  const saveAllQualificationsEdit = () => {
    const updatedJobs = [...jobs];
    updatedJobs[selectedJob] = { ...editedJob };
    setJobs(updatedJobs);
    setIsEditingAllQualifications(false);
  };
  const cancelAllQualificationsEdit = () => {
    setEditedJob({ ...currentJob });
    setIsEditingAllQualifications(false);
  };

  const handleJobDetailChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({
      ...editedJob,
      [name]: value,
    });
  };

  return (
    <>
      <div className="min-h-screen relative">
        {/* Background image with overlay */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <img
            src={Group || "/placeholder.svg"}
            alt="Background Pattern"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <Navbar />
        <div className="w-full max-w-[1800px] mx-auto py-1 px-4 sm:px-10 lg:px-20">
          <div className="mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Find your{" "}
              <span className="text-purple-500">
                {isBrowseCompany ? "desired job" : "new job"}
              </span>{" "}
              today
            </h1>
            <p className="text-gray-700 mb-8">
              Thousands of jobs in the computer, engineering, and technology
              sectors are waiting for you.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Searching for:", { jobType, location: locationFilter });
              }}
            >
              <div className="flex flex-col sm:flex-row overflow-hidden">
                {/* Job Type Input */}
                <div className="flex items-center flex-1 bg-white p-4 border border-gray-200 rounded-md mb-3 sm:mb-0 sm:rounded-l-full sm:border-r-0">
                  <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Information Technology"
                    className="w-full bg-white focus:outline-none text-gray-700 ml-3"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  />
                </div>
                {/* Location Input */}
                <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-md mb-3 sm:mb-0 sm:rounded-none p-4">
                  <MapPin className="text-gray-400 w-5 h-5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="City, state or zip"
                    className="w-full bg-white focus:outline-none text-gray-700 ml-3"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                {/* Find Jobs Button */}
                <button
                  type="submit"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-4 px-6 transition-colors duration-200 rounded-md w-full sm:w-auto sm:rounded-r-full"
                >
                  Find Jobs
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mt-6 mb-4">
            <button
              onClick={() => setShowFilterSidebar((prev) => !prev)}
              className="flex items-center justify-center w-full bg-white border border-gray-200 rounded-md py-3 px-4 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters - visible only on large screens */}
            <div className="hidden lg:block w-[25%]">
              {/* Pass filters and setFilters to allow Filters to update the state */}
              <Filters filters={filters} setFilters={setFilters} />
            </div>

            {/* Job List and Right Sidebar */}
            {/* Pass the filtered jobs */}
            <JobList jobs={filteredJobs} isBrowseCompany={isBrowseCompany} />
            <RightSidebar />
          </div>
        </div>
        <Footer />
      </div>
      <JobPostModal isOpen={isJobModalOpen} onClose={closeJobModal} />
    </>
  );
};

export default JobListingPage;
