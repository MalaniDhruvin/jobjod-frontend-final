"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus, User, X } from "lucide-react";
import Dheader from "./Dheader";
import JobPostModal from "./JobPostModal";
import DashSidebar from "./DashSidebar";
import { BASE_URL, USER_BASE_URL } from "../config";

// Replace with your token retrieval (from context, localStorage, etc.)

function CompanyPostJobs() {
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const location = useLocation();
  const substrLocation = location.pathname.substring(1);
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");

  // UI edit states
  const [isEditingJobDetails, setIsEditingJobDetails] = useState(false);
  const [isEditingRecruiter, setIsEditingRecruiter] = useState(false);
  const [isEditingAllQualifications, setIsEditingAllQualifications] =
    useState(false);

  // State used for editing forms
  const [editedJob, setEditedJob] = useState(null);
  // We'll store recruiters as an array of objects: [{ name, company }, ...]
  const [editedRecruiters, setEditedRecruiters] = useState([]);

  // State for jobs; job list from API will be merged with extra data.
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(0);
  const [isJobListOpen, setIsJobListOpen] = useState(false);
  const [appliedForJob, setAppliedForJob] = useState([]);

  // Helper: Common fetch options with token
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

  // 1. Fetch job list and company details together when component mounts.
  useEffect(() => {
    const fetchJobsAndCompany = async () => {
      try {
        // Fetch the job list for the company.
        const response = await fetch(
          `${BASE_URL}/job/by-company/${userId}`,
          fetchOptions
        );
        const jobList = await response.json();

        // Fetch company details (companyName, location, etc.)
        const companyResponse = await fetch(
          `${BASE_URL}/company/${userId}`,
          fetchOptions
        );
        const companyData = await companyResponse.json();

        // Merge company details and formatted dates (using createdAt & expiryTime) into each job.
        const updatedJobList = jobList.map((job) => {
          const jobTitleObj = JSON.parse(job.jobTitle);
          const postedDate = formatDate(job.createdAt);
          // Calculate expiry date
          const expiryDays = Number(job.expiryTime) || 0;
          const expireDateObj = new Date(job.createdAt);
          expireDateObj.setDate(expireDateObj.getDate() + expiryDays);
          const expireDate = formatDate(expireDateObj);

          // Convert interviewPersons array of strings -> array of objects
          const interviewers = Array.isArray(job.interviewPersons)
            ? job.interviewPersons.map((person) => ({
                name: person,
                company: companyData.companyName || "",
              }))
            : [];

          return {
            ...job,
            // Use the jobTitle object's "label" for display
            title: jobTitleObj.label,
            company: companyData.companyName,
            location: companyData.location,
            postedDate,
            expireDate,
            salary: `${job.minSalary}-${job.maxSalary} INR`,
            totalApplications: job.totalApplications || 0,
            // Ensure responsibilities, qualifications, etc. are arrays
            responsibilities: Array.isArray(job.responsibilities)
              ? job.responsibilities
              : job.responsibilities
              ? [job.responsibilities]
              : [],
            qualifications: Array.isArray(job.qualifications)
              ? job.qualifications
              : job.qualifications
              ? [job.qualifications]
              : [],
            preferredQualifications: Array.isArray(job.preferredQualifications)
              ? job.preferredQualifications
              : job.preferredQualifications
              ? [job.preferredQualifications]
              : [],
            // We store the final array of recruiter objects
            interviewPersons: interviewers,
          };
        });

        setJobs(updatedJobList);
        setSelectedJob(0);
        setEditedJob(updatedJobList[0]);
        // Set the recruiters array from the first job
        setEditedRecruiters(updatedJobList[0]?.interviewPersons || []);
      } catch (error) {
        console.error("Error fetching jobs and company data", error);
      }
    };

    fetchJobsAndCompany();
  }, []);

  // 2. Fetch skills & responsibilities for the selected job
  useEffect(() => {
    const fetchSkillsData = async (job) => {
      try {
        // Third API call: fetch skills and responsibilities
        const skillsRes = await fetch(
          `${BASE_URL}/job-description/${job.id}`,
          fetchOptions
        );
        const skillsData = await skillsRes.json();
        console.log("Skills Data:", skillsData);

        // Only update if the incoming data is different or not already set
        // Here we check if both responsibilities and qualifications are already arrays
        if (
          Array.isArray(job.responsibilities) &&
          job.responsibilities.length > 0 &&
          Array.isArray(job.qualifications) &&
          job.qualifications.length > 0
        ) {
          // Skip update if they already exist (or put any condition you prefer)
          return;
        }

        const updatedJob = {
          ...job,
          responsibilities: skillsData.responsibility
            ? Array.isArray(skillsData.responsibility)
              ? skillsData.responsibility
              : [skillsData.responsibility]
            : [],
          qualifications: skillsData.skills
            ? Array.isArray(skillsData.skills)
              ? skillsData.skills
              : [skillsData.skills]
            : [],
        };

        // Update the jobs array without causing infinite loops.
        setJobs((prevJobs) => {
          const newJobs = [...prevJobs];
          newJobs[selectedJob] = updatedJob;
          return newJobs;
        });
        setEditedJob(updatedJob);
      } catch (error) {
        console.error("Error fetching skills data", error);
      }
    };

    // Only call fetch if jobs array exists and if the current job doesn't have skills data.
    if (jobs.length && jobs[selectedJob]) {
      // Check if responsibilities or qualifications are missing before fetching again.
      if (
        !jobs[selectedJob].responsibilities ||
        !jobs[selectedJob].qualifications ||
        jobs[selectedJob].responsibilities.length === 0 ||
        jobs[selectedJob].qualifications.length === 0
      ) {
        fetchSkillsData(jobs[selectedJob]);
      }
    }
  }, [selectedJob, jobs]); // now include selectedJob if needed

  useEffect(() => {
    if (jobs.length && jobs[selectedJob] && jobs[selectedJob].id) {
      const fetchAppliedForJob = async () => {
        try {
          const response = await fetch(
            `${USER_BASE_URL}/users/appliedFor/${jobs[selectedJob].id}/apply`,
            fetchOptions
          );
          const appliedData = await response.json();
          setAppliedForJob(appliedData.usersApplied);
        } catch (error) {
          console.error("Error fetching applied for job data", error);
        }
      };
      fetchAppliedForJob();
    }
  }, [selectedJob, jobs]);

  // Keep editedJob and editedRecruiters in sync if user changes the selected job
  useEffect(() => {
    if (jobs.length && jobs[selectedJob]) {
      setEditedJob({ ...jobs[selectedJob] });
      setEditedRecruiters(jobs[selectedJob].interviewPersons || []);
    }
  }, [selectedJob, jobs]);

  // Toggle modal for job posting
  const openJobModal = () => {
    setIsJobModalOpen(true);
  };
  const closeJobModal = () => {
    setIsJobModalOpen(false);
  };

  // Toggle mobile job list dropdown
  const toggleJobList = () => {
    setIsJobListOpen(!isJobListOpen);
  };

  // When a job is selected from the list
  const selectJob = (index) => {
    setSelectedJob(index);
    setIsJobListOpen(false);
    // Reset editing states
    setIsEditingJobDetails(false);
    setIsEditingRecruiter(false);
    setIsEditingAllQualifications(false);
    // Load the new job
    setEditedJob({ ...jobs[index] });
    setEditedRecruiters(jobs[index].interviewPersons || []);
  };

  // // If data not loaded yet, show loader.
  // if (!jobs.length || !editedJob) {
  //   return <div>Loading...</div>
  // }

  const currentJob = jobs[selectedJob];

  // ----- JOB DETAILS EDIT HANDLERS -----
  const handleJobDetailsEdit = () => {
    setIsEditingJobDetails(true);
  };
  // Inside CompanyPostJobs component

  const saveJobDetails = async () => {
    try {
      // 1) Update companyName & location
      const companyRes = await fetch(`${BASE_URL}/company/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: editedJob.company,
          location:    editedJob.location,
        }),
      });
      if (!companyRes.ok) throw new Error("Company update failed");
  
      // 2) Prepare the job payload
      // a) Build jobTitle as an OBJECT so we don’t double-stringify:
      const jobTitlePayload = { label: editedJob.title };
  
      // b) Convert postedDate (dd/mm/yyyy) → ISO string
      const [pd, pm, py] = editedJob.postedDate.split("/");
      const createdAtISO = new Date(`${py}-${pm}-${pd}`).toISOString();
  
      // c) Compute expiryTime in days
      const [ed, em, ey] = editedJob.expireDate.split("/");
      const expiryDays = Math.round(
        (new Date(`${ey}-${em}-${ed}`) - new Date(createdAtISO)) /
          (1000 * 60 * 60 * 24)
      );
  
      // d) Split salary back into min & max
      const [minSal, maxSalWithUnit] = editedJob.salary.split("-");
      const maxSal = maxSalWithUnit.split(" ")[0];
  
      // 3) Update job fields in one call
      const jobRes = await fetch(`${BASE_URL}/jobs/${editedJob.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle:   jobTitlePayload,   // <-- object, not string
          createdAt:  createdAtISO,
          expiryTime: expiryDays,
          minSalary:  Number(minSal),
          maxSalary:  Number(maxSal),
        }),
      });
      if (!jobRes.ok) throw new Error("Job update failed");
  
      const updatedJobFromServer = await jobRes.json();
  
      // 4) Sync local state & exit edit mode
      const updatedJobs = [...jobs];
      updatedJobs[selectedJob] = {
        ...updatedJobFromServer.job,      // or however your API returns it
        interviewPersons: editedRecruiters,
      };
      setJobs(updatedJobs);
      setIsEditingJobDetails(false);

      window.location.reload();
  
    } catch (error) {
      console.error("Error updating job details:", error);
      // Optionally show an error toast/UI here
    }
  };
  
  const cancelJobDetailsEdit = () => {
    setEditedJob({ ...currentJob });
    setIsEditingJobDetails(false);
  };

  // ----- RECRUITER HANDLERS -----
  const handleRecruiterEdit = () => {
    setIsEditingRecruiter(true);
  };
  const saveRecruiterEdit = async() => {
    try {
      // 1) Prepare the payload: array of { name, company }
      const payload = editedRecruiters;
  
      // 2) Call your backend endpoint
      //    Adjust the URL to match your API (here I’m assuming /jobs/:id/interviewPersons)
      const res = await fetch(`${BASE_URL}/jobs/${editedJob.id}/interviewPerson`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interviewPersons: payload }),
      });
  
      if (!res.ok) {
        // handle a non-2xx HTTP status
        const err = await res.json();
        throw new Error(err.message || "Failed to update recruiters");
      }
  
      // 3) Parse the updated job (or just the updated recruiters) from the response
      const { interviewPersons: updatedList } = await res.json();
  
      // 4) Sync local state
      setJobs((prevJobs) => {
        const jobsCopy = [...prevJobs];
        jobsCopy[selectedJob] = {
          ...jobsCopy[selectedJob],
          interviewPersons: updatedList,
        };
        return jobsCopy;
      });
  
      setEditedRecruiters(updatedList);
      setIsEditingRecruiter(false);

      window.location.reload();
    } catch (error) {
      console.error("Error updating recruiters:", error);
      // TODO: show a toast or inline error message
    }
  };
  const cancelRecruiterEdit = () => {
    setEditedRecruiters(currentJob.interviewPersons || []);
    setIsEditingRecruiter(false);
  };

  // ----- QUALIFICATIONS HANDLERS -----
  const handleAllQualificationsEdit = () => {
    setIsEditingAllQualifications(true);
  };
  const saveAllQualificationsEdit = async() => {
    if (!editedJob?.id) return;

  try {
    // Build payload
    const payload = {
      responsibility: Array.isArray(editedJob.responsibilities)
        ? editedJob.responsibilities
        : [],
      skills: Array.isArray(editedJob.qualifications)
        ? editedJob.qualifications
        : []
    };

    // Call the API
    const res = await fetch(`${BASE_URL}/job-description/${editedJob.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).message);

    // Parse and rename
    const { data } = await res.json();
    const newResponsibilities = Array.isArray(data.responsibility)
      ? data.responsibility
      : [];
    const newQualifications = Array.isArray(data.skills)
      ? data.skills
      : [];

    // Sync state
    setJobs((prev) => {
      const copy = [...prev];
      copy[selectedJob] = {
        ...copy[selectedJob],
        responsibilities: newResponsibilities,
        qualifications:  newQualifications,
      };
      return copy;
    });
    setEditedJob((prev) => ({
      ...prev,
      responsibilities: newResponsibilities,
      qualifications:  newQualifications,
    }));

    // Exit edit mode
    setIsEditingAllQualifications(false);
  } catch (error) {
    console.error("Error saving requirements:", error);
  }
  };
  const cancelAllQualificationsEdit = () => {
    setEditedJob({ ...currentJob });
    setIsEditingAllQualifications(false);
  };

  // ----- INPUT CHANGE HANDLERS -----
  const handleJobDetailChange = (e) => {
    const { name, value } = e.target;
    setEditedJob({
      ...editedJob,
      [name]: value,
    });
  };

  // Recruiter array input changes
  const handleRecruiterChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...editedRecruiters];
    updated[index] = { ...updated[index], [name]: value };
    setEditedRecruiters(updated);
  };

  // ----- RESPONSIBILITIES HANDLERS -----
  const handleResponsibilityChange = (index, value) => {
    const updatedResponsibilities = [...editedJob.responsibilities];
    updatedResponsibilities[index] = value;
    setEditedJob({
      ...editedJob,
      responsibilities: updatedResponsibilities,
    });
  };
  const addResponsibility = () => {
    setEditedJob({
      ...editedJob,
      responsibilities: [...editedJob.responsibilities, ""],
    });
  };
  const removeResponsibility = (index) => {
    const updatedResponsibilities = [...editedJob.responsibilities];
    updatedResponsibilities.splice(index, 1);
    setEditedJob({
      ...editedJob,
      responsibilities: updatedResponsibilities,
    });
  };

  // ----- QUALIFICATIONS HANDLERS -----
  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...editedJob.qualifications];
    updatedQualifications[index] = value;
    setEditedJob({
      ...editedJob,
      qualifications: updatedQualifications,
    });
  };
  const addQualification = () => {
    setEditedJob({
      ...editedJob,
      qualifications: [...editedJob.qualifications, ""],
    });
  };
  const removeQualification = (index) => {
    const updatedQualifications = [...editedJob.qualifications];
    updatedQualifications.splice(index, 1);
    setEditedJob({
      ...editedJob,
      qualifications: updatedQualifications,
    });
  };

  // ----- PREFERRED QUALIFICATIONS HANDLERS -----
  const handlePreferredQualificationChange = (index, value) => {
    const updatedPreferredQualifications = [
      ...editedJob.preferredQualifications,
    ];
    updatedPreferredQualifications[index] = value;
    setEditedJob({
      ...editedJob,
      preferredQualifications: updatedPreferredQualifications,
    });
  };
  const addPreferredQualification = () => {
    setEditedJob({
      ...editedJob,
      preferredQualifications: [...editedJob.preferredQualifications, ""],
    });
  };
  const removePreferredQualification = (index) => {
    const updatedPreferredQualifications = [
      ...editedJob.preferredQualifications,
    ];
    updatedPreferredQualifications.splice(index, 1);
    setEditedJob({
      ...editedJob,
      preferredQualifications: updatedPreferredQualifications,
    });
  };

  // -------------------- Render JSX --------------------
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <DashSidebar substrLocation={substrLocation} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <Dheader />

        {jobs.length > 0 ? (
          <div className="flex-1 overflow-hidden">
            {/* Mobile-First Sidebar */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-3">
              <button
                onClick={openJobModal}
                className="w-full py-2 px-4 bg-white text-purple-500 border border-purple-500 rounded-xl flex items-center justify-center"
              >
                <span>Post New Job</span>
                <Plus className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Mobile Job Selection */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-3">
              <div>
                <button
                  onClick={toggleJobList}
                  className="w-full py-2 px-4 bg-violet-50 text-gray-900 rounded-md flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-left">{currentJob?.title}</h3>
                    <p className="text-sm text-gray-500 text-left">
                      <span className="font-semibold">
                        {currentJob?.company}
                      </span>
                      &nbsp;&nbsp; {currentJob?.location}
                    </p>
                  </div>
                  {isJobListOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                {isJobListOpen && (
                  <div className="z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    {jobs.map((job, index) => (
                      <button
                        key={index}
                        className={`w-full p-3 text-left hover:bg-gray-50 ${
                          selectedJob === index ? "bg-violet-50" : ""
                        }`}
                        onClick={() => selectJob(index)}
                      >
                        <h3 className="font-bold">
                          {job.jobTitle && JSON.parse(job.jobTitle).label}
                        </h3>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">{job.company}</span>
                          &nbsp;&nbsp; {job.location}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:flex">
              {/* Left Sidebar (desktop view): scrollable job list */}
              <div
                className="hidden lg:block w-full lg:w-1/4 bg-white border-r border-gray-200 p-4"
                style={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <button
                  onClick={openJobModal}
                  className="w-full py-2 px-4 bg-white text-purple-500 border border-purple-500 rounded-xl mb-6 flex items-center justify-center"
                >
                  <span>Post New Job</span>
                  <Plus className="h-4 w-4 ml-1" />
                </button>
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <button
                      key={index}
                      className={`w-full p-3 rounded-md text-left ${
                        selectedJob === index
                          ? "bg-violet-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => selectJob(index)}
                    >
                      <h3 className="font-bold text-gray-900">
                        {(() => {
                          try {
                            const first = JSON.parse(job.jobTitle);
                            const obj =
                              typeof first === "string"
                                ? JSON.parse(first)
                                : first;
                            return obj.label;
                          } catch {
                            return "";
                          }
                        })()}
                      </h3>

                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">{job.company}</span>
                        &nbsp;&nbsp; {job.location}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Details Area */}
              <div
                className="flex-1 p-4 lg:p-6 bg-white overflow-y-auto"
                style={{ height: "calc(100vh - 64px)", overflowY: "auto" }}
              >
                {/* Header Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 lg:mb-8 border-b border-gray-200 pb-2 lg:pb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Total Applications</p>
                    <h2 className="text-2xl lg:text-3xl font-bold">
                      {appliedForJob ? appliedForJob.length : 0}
                    </h2>
                  </div>
                  <Link to={`/CompanyApplications/${jobs[selectedJob]?.id}`}>
                    <button className="py-2 px-4 font-semibold bg-white text-purple-500 border border-purple-500 rounded-xl mt-2 md:mt-0">
                      View Applicants
                    </button>
                  </Link>
                </div>

                {/* Job Title and Edit Section */}
                {isEditingJobDetails ? (
                  <div className="mb-6 border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold">Edit Job Details</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={saveJobDetails}
                          className="p-2 bg-purple-500 text-white rounded-md flex items-center"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelJobDetailsEdit}
                          className="p-2 bg-gray-200 text-gray-700 rounded-md flex items-center"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={editedJob.title}
                          onChange={handleJobDetailChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={editedJob.company}
                            onChange={handleJobDetailChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={editedJob.location}
                            onChange={handleJobDetailChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Posted Date
                          </label>
                          <input
                            type="text"
                            name="postedDate"
                            value={editedJob.postedDate}
                            onChange={handleJobDetailChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expire Date
                          </label>
                          <input
                            type="text"
                            name="expireDate"
                            value={editedJob.expireDate}
                            onChange={handleJobDetailChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Salary
                        </label>
                        <input
                          type="text"
                          name="salary"
                          value={editedJob.salary}
                          onChange={handleJobDetailChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2">
                    <h1 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-0">
                      {(() => {
                        try {
                          const first = JSON.parse(currentJob.jobTitle);
                          const obj =
                            typeof first === "string"
                              ? JSON.parse(first)
                              : first;
                          return obj.label;
                        } catch {
                          return "";
                        }
                      })()}
                    </h1>
                    <div className="flex flex-col items-end">
                      <button
                        onClick={handleJobDetailsEdit}
                        className="text-purple-500 font-medium mb-2 flex items-center"
                      >
                        Edit
                      </button>
                      <span className="text-gray-500 text-sm text-right">
                        Posted on {currentJob?.postedDate} · Expire on{" "}
                        {currentJob?.expireDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Company and Location */}
                {!isEditingJobDetails && (
                  <div className="flex items-center mb-2">
                    <div className="bg-white p-1 rounded mr-2">
                      <div className="h-4 w-4 bg-blue-100 rounded-full"></div>
                    </div>
                    <span className="text-gray-700 font-semibold">
                      {currentJob?.company}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {currentJob?.location}
                    </span>
                  </div>
                )}

                {/* Salary */}
                {!isEditingJobDetails && (
                  <h2 className="font-bold mt-2 mb-4">
                    Salary: {currentJob?.salary}
                  </h2>
                )}

                {/* Recruiter Card (Interview Persons) */}
                {isEditingRecruiter ? (
                  <div className="border border-gray-200 rounded-xl p-3 lg:p-4 mb-4 lg:mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Edit Recruiters</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={saveRecruiterEdit}
                          className="p-1 bg-purple-500 text-white rounded-md flex items-center text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelRecruiterEdit}
                          className="p-1 bg-gray-200 text-gray-700 rounded-md flex items-center text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {editedRecruiters.map((recruiter, index) => (
                        <div key={index} className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={recruiter.name}
                              onChange={(e) => handleRecruiterChange(index, e)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={recruiter.company}
                              onChange={(e) => handleRecruiterChange(index, e)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-3 lg:p-4 mb-4 lg:mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        {editedRecruiters.length > 0 ? (
                          editedRecruiters.map((recruiter, index) => (
                            <div key={index}>
                              <h3 className="font-medium">{recruiter.name}</h3>
                              <p className="text-sm text-gray-500">
                                {recruiter.company}
                              </p>
                            </div>
                          ))
                        ) : (
                          <h3 className="font-medium">
                            No recruiters assigned
                          </h3>
                        )}
                      </div>
                      <button
                        onClick={handleRecruiterEdit}
                        className="text-purple-500 font-bold flex items-center"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}

                {/* Job Requirements Section */}
                <div className="mb-4 lg:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium">Job Requirements</h2>
                    {!isEditingAllQualifications ? (
                      <button
                        onClick={handleAllQualificationsEdit}
                        className="text-purple-500 font-medium flex items-center"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveAllQualificationsEdit}
                          className="p-1 bg-purple-500 text-white rounded-md flex items-center text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelAllQualificationsEdit}
                          className="p-1 bg-gray-200 text-gray-700 rounded-md flex items-center text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditingAllQualifications ? (
                    <div className="border border-gray-200 rounded-xl p-3 mb-4">
                      <h3 className="font-medium mb-2">Responsibilities</h3>
                      {editedJob.responsibilities.map((item, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <textarea
                            value={item}
                            onChange={(e) =>
                              handleResponsibilityChange(index, e.target.value)
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                          <button
                            onClick={() => removeResponsibility(index)}
                            className="ml-2 p-2 bg-red-100 text-red-500 rounded-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addResponsibility}
                        className="mt-2 p-2 bg-purple-100 text-purple-500 rounded-md flex items-center w-full justify-center mb-4"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Responsibility
                      </button>

                      <h3 className="font-medium mb-2">
                        Qualifications and Skills
                      </h3>
                      {editedJob.qualifications.map((item, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <textarea
                            value={item}
                            onChange={(e) =>
                              handleQualificationChange(index, e.target.value)
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                          <button
                            onClick={() => removeQualification(index)}
                            className="ml-2 p-2 bg-red-100 text-red-500 rounded-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addQualification}
                        className="mt-2 p-2 bg-purple-100 text-purple-500 rounded-md flex items-center w-full justify-center mb-4"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Qualification
                      </button>

                      <h3 className="font-medium mb-2">
                        Preferred Qualifications and Skills
                      </h3>
                      {editedJob.preferredQualifications.map((item, index) => (
                        <div key={index} className="flex items-start mb-2">
                          <textarea
                            value={item}
                            onChange={(e) =>
                              handlePreferredQualificationChange(
                                index,
                                e.target.value
                              )
                            }
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            rows={2}
                          />
                          <button
                            onClick={() => removePreferredQualification(index)}
                            className="ml-2 p-2 bg-red-100 text-red-500 rounded-md"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addPreferredQualification}
                        className="mt-2 p-2 bg-purple-100 text-purple-500 rounded-md flex items-center w-full justify-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Preferred Qualification
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Responsibilities</h3>
                        <ul className="list-disc pl-5 lg:pl-6 space-y-2 font-semibold">
                          {(currentJob?.responsibilities || []).map(
                            (item, index) => (
                              <li key={index} className="text-gray-700">
                                {item}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-medium mb-2">
                          Qualifications and Skills
                        </h3>
                        <ul className="list-disc pl-5 lg:pl-6 space-y-2 font-semibold">
                          {(currentJob?.qualifications || []).map(
                            (item, index) => (
                              <li key={index} className="text-gray-700">
                                {item}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">
                          Preferred Qualifications and Skills
                        </h3>
                        <ol className="list-decimal pl-5 lg:pl-6 space-y-2 font-semibold">
                          {(currentJob?.preferredQualifications || []).map(
                            (item, index) => (
                              <li key={index} className="text-gray-700">
                                {item}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">No job posts found.</span>
              <button
                onClick={openJobModal}
                className="text-purple-500 font-medium"
              >
                Post a Job
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              You can start by adding a new job post.
            </p>
          </div>
        )}
      </div>

      {/* Job Post Modal */}
      <JobPostModal isOpen={isJobModalOpen} onClose={closeJobModal} />
    </div>
  );
}

export default CompanyPostJobs;
