import { Search, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoFilter } from "react-icons/io5";
import { BASE_URL, USER_BASE_URL } from "../config";

export default function JobCandidateListing() {
  // — your existing UI state
  const [isOpen, setIsOpen] = useState(false);
  /* ... */

  // ▼ NEW: grab jobId param from URL ▼
  const { jobId: jobIdParam } = useParams();

  // ▼ NEW: state for jobs, company, candidates, and selected index ▼
  const [jobs, setJobs] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  const options = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Utility to shuffle an array
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  // 1️⃣ Fetch jobs list on mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/job/by-company/${userId}`,
          fetchOptions
        );
        const data = await res.json();
        setJobs(data || []);
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
    };
    loadJobs();
  }, []);

  // 2️⃣ Fetch company info on mount
  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/company/${userId}`,
          fetchOptions
        );
        const data = await res.json();
        setCompanyInfo(data);
      } catch (err) {
        console.error("Error loading company info:", err);
      }
    };
    loadCompany();
  }, []);

  // Helper: fetch skills for a candidate
  const fetchSkillsByCandidate = async (cand) => {
    try {
      const res = await fetch(
        `${USER_BASE_URL}/skills/${cand.id}`,
        fetchOptions
      );
      const d = await res.json();
      return d.data || cand.skills || "—";
    } catch {
      return cand.skills || "—";
    }
  };

  // 3️⃣ When a job is clicked (or first mounts with a param), fetch its candidates + skills
  const loadCandidatesForJob = async (index) => {
    setSelectedJobIndex(index);
    const job = jobs[index];
    try {
      const res = await fetch(
        `${USER_BASE_URL}/users/appliedFor/${job.id}/apply`,
        fetchOptions
      );
      const data = await res.json();
      const fetched = data.usersApplied || [];

      // enrich each with skills
      const enriched = await Promise.all(
        fetched.map(async (cand) => ({
          ...cand,
          skills: await fetchSkillsByCandidate(cand),
        }))
      );
      setCandidates(enriched);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setCandidates([]);
    }
  };

  // ▼ UPDATED: select initial job based on jobIdParam (or fallback to 0) ▼
  useEffect(() => {
    if (!jobs.length) return;
    let idx = 0;
    if (jobIdParam) {
      const found = jobs.findIndex((j) => String(j.id) === jobIdParam);
      if (found !== -1) idx = found;
    }
    loadCandidatesForJob(idx);
  }, [jobs, jobIdParam]);

  // Called when user picks a new status from the select
  const updateApplicationStatus = async (candId, newStatus) => {
    const jobId = jobs[selectedJobIndex]?.id;
    if (!jobId) return;

    try {
      const res = await fetch(
        `${USER_BASE_URL}/users/${jobId}/apply/${candId}/status`,
        {
          method: "PUT",
          headers: {
            ...fetchOptions.headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Status update failed");
      // update local state
      setCandidates((cs) =>
        cs.map((c) => (c.id === candId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error(err);
      // you could show a toast here
    }
  };

  const formatDate = (dateInput) => {
    const d = new Date(dateInput);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-full lg:w-1/4 bg-white border-r border-gray-200 p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="search job name..."
            className="pl-10 w-full bg-gray-50 border rounded-full py-2 text-sm"
          />
        </div>

        {/* Job Listings (scrollable) */}
        <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2"
        style={{
          scrollbarWidth: "none",
        }}
        >
          {jobs.map((job, idx) => (
            <div
              key={job.id}
              onClick={() => loadCandidatesForJob(idx)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedJobIndex === idx
                  ? "bg-violet-100"
                  : "bg-violet-50 hover:bg-violet-100"
              }`}
            >
              <h3 className="font-medium">
                {JSON.parse(job.jobTitle).label}
              </h3>
              <div className="text-sm text-muted-foreground mt-1">
                <p>{companyInfo?.companyName}</p>
                <p>{companyInfo?.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-3 md:p-6 overflow-y-auto">
        {/* Candidate Cards */}
        <div className="space-y-4">
          {candidates.map((cand, i) => (
            <div
              key={cand.id || i}
              className="shadow-sm overflow-hidden bg-violet-50 rounded-md border border-gray-100"
            >
              <div className="p-3 md:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  {/* Candidate Info */}
                  <div
                    className={`flex-1 ${cand.blur ? "filter blur-sm" : ""}`}
                  >
                    <h2 className="text-xl font-semibold">{cand.name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="font-medium">{cand.role}</p>
                      <span className="text-muted-foreground">
                        ({cand.experience})
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium">Skills:</p>
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(cand.skills)
                          ? cand.skills
                              .map((skill) =>
                                typeof skill === "object"
                                  ? skill.skill ||
                                    skill.label ||
                                    JSON.stringify(skill)
                                  : skill
                              )
                              .join(", ")
                          : cand.skills}
                      </p>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium">
                        Available to join from:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cand.availability}
                      </p>
                    </div>
                    {!cand.blur && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-3">
                          Contact Information
                        </h3>
                        <div className="flex flex-col font-semibold gap-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{cand.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{cand.email}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Action Panel */}
                  <div className="md:text-right">
                    <p className="text-sm text-muted-foreground mb-4">
                      Application: {formatDate(cand.appliedOn)}
                    </p>

                    <div className="space-y-2 w-full md:w-auto">
                      <div className="dropdown-container relative z-10">
                        <select
                          className="w-full md:w-48 rounded-full bg-gray-200 text-gray-800 py-2 px-4 font-medium hover:bg-gray-300 transition-colors"
                          value={cand.status || "Applied"}
                          onChange={(e) =>
                            updateApplicationStatus(cand.id, e.target.value)
                          }
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button className="w-full md:w-48 sm:w-48 justify-center rounded-full bg-violet-400 py-2 px-4 font-medium text-gray-800 hover:bg-violet-500">
                        Profile
                      </button>
                      <br />

                      <button className="w-full md:w-48 sm:w-48 justify-center rounded-full bg-black text-white py-2 px-4 font-medium hover:bg-gray-800">
                        Resume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
);
}
