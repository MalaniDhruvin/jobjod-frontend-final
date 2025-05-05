"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import t4 from "../image/t4.png";
import Jobseekerheader from "./Jobseekerheader";
import axios from "axios";
import { BASE_URL, USER_BASE_URL } from "../config";

// Utility function for conditional classNames
export const cn = (...classes) => classes.filter(Boolean).join(" ");

const DashboardStats = ({ title, subtext, value }) => (
  <div className="rounded-xl border bg-white p-6">
    <div className="flex flex-col items-start justify-between">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{subtext}</p>
      </div>
      <div className="text-2xl font-bold mt-2 text-purple-500">{value}</div>
    </div>
  </div>
);

const JobList = ({ jobs }) => (
  <div className="space-y-4">
    {jobs.map((job, index) => (
      <div
        key={index}
        className="flex items-start gap-6 p-0 lg:p-4 bg-white rounded-lg shadow-sm"
      >
        <img
          src={job.logoUrl || "/placeholder.svg"}
          alt={`${job.company} logo`}
          className="h-12 w-12 rounded-lg object-contain"
        />
        <div>
          <h3 className="font-medium text-base">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.company} · {job.location}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
              ✓
            </span>
            <span className="text-xs text-gray-500">
              Applied on {job.appliedDate}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Jobseeker = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const [jobCount, setJobCount] = useState(0);
  const [areaCount, setAreaCount] = useState(0);
  const [qualifyByExp, setQualifyByExp] = useState(0);
  const [qualifyBySalary, setQualifyBySalary] = useState(0);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!userId) return;

    // 1️⃣ fetch the list of applications for this user
    fetch(`${USER_BASE_URL}/users/appliedFor/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(async (applications) => {
        // console.log("Applications:", applications)
        const detailed = await Promise.all(
          applications.appliedFor.map(async ({ id, appliedOn }) => {
            // 2️⃣ fetch job details
            const jobRes = await fetch(`${BASE_URL}/jobs/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const job = await jobRes.json();

            // 3️⃣ fetch company details
            const cmpRes = await fetch(`${BASE_URL}/company/${job.userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const cmp = await cmpRes.json();
            // cmp: { companyName, logoUrl, ... }

            // 4️⃣ stitch into our UI shape:
            const title = JSON.parse(job.jobTitle).label;
            const company = cmp.companyName || "Unknown Co";
            const location = cmp.location || "Unknown";
            const date = new Date(appliedOn);
            const appliedDate = date.toLocaleDateString("en-UK", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }); // → "03 May 2025"

            return {
              title,
              company,
              location,
              appliedDate,
              logoUrl: cmp.logoUrl || t4,
            };
          })
        );
        setAppliedJobs(detailed);
      })
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    let dummy = [];
    if (!userId) return;

    let isCancelled = false;

    fetch(`${USER_BASE_URL}/skills/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isCancelled) {
          data.data.forEach((skill) => {
            dummy.push(skill.skill);
          });

          // Now call the matchUserSkills API
          return fetch(`${BASE_URL}/job-description/search`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userSkills: dummy }),
          });
        }
      })
      .then((res) => {
        if (res && !res.ok) {
          throw new Error(`Match API responded ${res.status}`);
        }
        return res ? res.json() : null;
      })
      .then((matchData) => {
        if (!isCancelled && matchData) {
          // console.log("Match result: ", matchData);
          setMatchResults(matchData);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!matchResults || matchResults.length === 0) return;

    let isCancelled = false;

    const fetchJobAndCompanyData = async () => {
      const results = [];

      for (const match of matchResults) {
        if (match.match == "yes") {
          try {
            // Fetch job details by jobId
            const jobRes = await fetch(`${BASE_URL}/jobs/${match.jobId}`);
            if (!jobRes.ok) throw new Error(`Job API responded ${jobRes.status}`);
            const jobData = await jobRes.json();
            // console.log("Job Data:", jobData);

            const { jobTitle, userId } = jobData;

            // Fetch company details by userId
            const companyRes = await fetch(`${BASE_URL}/company/${userId}`);
            if (!companyRes.ok) throw new Error(`Company API responded ${companyRes.status}`);
            const companyData = await companyRes.json();
            // console.log("Company Data:", companyData);

            const { companyName } = companyData;
            const title = JSON.parse(jobTitle).label;
            console.log("Job Title:", title);

            // Push combined result
            results.push({ title, companyName });

          } catch (err) {
            console.error(err);
          }
        }
      }

      if (!isCancelled) {
        setJobData(results);
      }
    };

    fetchJobAndCompanyData();

    return () => {
      isCancelled = true;
    };
  }, [matchResults]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) return;

        // 1) Fetch all jobs & filter to this calendar-month
        const { data: allJobs } = await axios.get(`${BASE_URL}/jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("All Jobs:", allJobs);
        const now = new Date();
        const thisMonthJobs = allJobs.filter((job) => {
          const d = new Date(job.createdAt);
          return (
            d.getFullYear() === now.getFullYear() &&
            d.getMonth() === now.getMonth()
          );
        });
        setJobCount(thisMonthJobs.length);

        // 2) Fetch my profile → location
        const { data: me } = await axios.get(
          `${USER_BASE_URL}/preferences/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const myLocation = me[0]?.location;

        // 3) Count same-area companies
        const companyLocs = await Promise.all(
          allJobs.map((j) =>
            axios
              .get(`${BASE_URL}/company/${j.userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => r.data.location)
              .catch(() => null)
          )
        );
        const sameArea = companyLocs.reduce(
          (cnt, loc) => (loc === myLocation ? cnt + 1 : cnt),
          0
        );
        setAreaCount(sameArea);

        // 4) Fetch all experiences
        const { data: exps } = await axios.get(
          `${USER_BASE_URL}/experiences/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // parse dates robustly
        const totalYears = exps.reduce((sum, { startDate, endDate }) => {
          const parse = (str) => {
            if (!str) return null;
            if (str === "Present") return new Date();
            // if year-only like "2018"
            if (/^\d{4}$/.test(str)) return new Date(+str, 0, 1);
            return new Date(str);
          };
          const start = parse(startDate);
          const end = parse(endDate) || new Date();
          return sum + (end - start) / (1000 * 60 * 60 * 24 * 365);
        }, 0);
        // setTotalExperience(totalYears);

        // 5) Fetch each job's required minExperience
        const reqExps = await Promise.all(
          allJobs.map((j) =>
            axios
              .get(`${BASE_URL}/requirements/${j.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => r.data.minExperience)
              .catch(() => 0)
          )
        );

        // 6) Count how many thisMonthJobs I qualify by experience
        const expQualify = allJobs.filter(
          (job, idx) => totalYears >= (reqExps[idx] || 0)
        ).length;
        setQualifyByExp(expQualify);

        // 7) Decide my expected salary—e.g. from the most recent experience object:
        const expectedSalary = exps.length
          ? (exps[exps.length - 1].salary / 0.12) * 1000 // adjust field name if different
          : 0;
        console.log("Expected Salary:", expectedSalary);
        // 8) Count how many thisMonthJobs fall within my salary range
        const salQualify = allJobs.filter((job) => {
          if (!job.minSalary || !job.maxSalary) return false;
          return expectedSalary >= job.minSalary;
        }).length;
        setQualifyBySalary(salQualify);

        // … you can now continue with your existing application/meeting/status logic …
      } catch (err) {
        console.error("Failed to compute stats:", err);
      }
    };

    fetchStats();
  }, [userId, token]);

  useEffect(() => {
    if (!jobData || jobData.length === 0 || !userId) return;

    let isCancelled = false;

    const sendNotifications = async () => {
      for (const job of jobData) {
        const message = `New job matching your profile: ${job.title} at ${job.companyName}`;

        try {
          const res = await fetch(`${USER_BASE_URL}/notifications`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message,
              receiverId:userId,
            }),
          });

          if (!res.ok) {
            throw new Error(`Notification API responded ${res.status}`);
          }

          const result = await res.json();
          console.log("Notification created:", result);

        } catch (err) {
          console.error("Error creating notification:", err);
        }
      }
    };

    sendNotifications();

    return () => {
      isCancelled = true;
    };
  }, [jobData, userId]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Jobseekerheader />

      <div className="lg:pl-64">
        <main className="p-3 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[70%] space-y-6">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 md:gap-6">
                <DashboardStats
                  title="Potential Jobs"
                  subtext="(This Month)"
                  value={jobCount}
                />
                <DashboardStats
                  title="Area"
                  subtext="Jobs in your preferred area"
                  value={areaCount}
                />
                <DashboardStats
                  title="Salary"
                  subtext="Your expectation based"
                  value={qualifyBySalary}
                />
                <DashboardStats
                  title="Experience"
                  subtext="Your experience"
                  value={qualifyByExp}
                />
              </div>

              <div className="lg:hidden rounded-xl border bg-white p-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl">Applied Jobs</h2>
                  <Link
                    to="/job"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    <span className="font-semibold text-sm">All Jobs</span>
                  </Link>
                </div>
                <JobList jobs={appliedJobs.slice(0, 4)} />
              </div>

              <div className="rounded-xl border bg-white p-6">
                <h2 className="font-bold text-xl mb-4">Recent Notifications</h2>
                <div className="space-y-3">
                  <div className="rounded-lg p-3 hover:bg-gray-50 border border-gray-100">
                    <p className="text-sm">
                      Your application was viewed by Grameenphone
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="rounded-lg p-3 hover:bg-gray-50 border border-gray-100">
                    <p className="text-sm">
                      New job matching your profile: UX Designer at Alpha
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-full lg:w-[30%] rounded-xl border bg-white p-3 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl">Applied Jobs</h2>
                <Link
                  to="/job"
                  className="text-sm text-blue-500 hover:underline"
                >
                  <span className="font-semibold text-sm">All Jobs</span>
                </Link>
              </div>
              <JobList jobs={appliedJobs.slice(0, 4)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Jobseeker;
