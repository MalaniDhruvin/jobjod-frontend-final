"use client"
import { Link } from "react-router-dom"
import t4 from "../image/t4.png"
import Jobseekerheader from "./Jobseekerheader"

// Utility function for conditional classNames
export const cn = (...classes) => classes.filter(Boolean).join(" ")

// Mock data
const jobData = [
  {
    title: "Product Designer",
    company: "Grameenphone",
    location: "Dhaka, Bangladesh",
    appliedDate: "23 May 20",
    logoUrl: t4
  },
  {
    title: "UX Designer",
    company: " Alpha",
    location: "Dhaka, Bangladesh",
    appliedDate: "10 June 20",
    logoUrl: t4
  },
  {
    title: "Product Designer",
    company: "Grameenphone",
    location: "Dhaka, Bangladesh",
    appliedDate: "23 May 20",
    logoUrl: t4
  },
  {
    title: "UX Designer",
    company: " Alpha",
    location: "Dhaka, Bangladesh",
    appliedDate: "10 June 20",
    logoUrl: t4
  },
  {
    title: "Frontend Developer",
    company: "Zudio",
    location: "Dhaka, Bangladesh",
    appliedDate: "15 July 20",
    logoUrl: t4
  }
]

// Components
const DashboardStats = ({ title, subtext, value }) => (
  <div className="rounded-xl border bg-white p-6">
    <div className="flex flex-col items-start justify-between">
      <div>
        <h3 className="font-semibold  ">{title}</h3>
        <p className="text-sm text-gray-500">{subtext}</p>
      </div>
      <div className="text-2xl font-bold mt-2 text-purple-500">{value}</div>
    </div>
  </div>
)

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
)

const Jobseeker = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Jobseekerheader />

      <div className="lg:pl-64">
        <main className="p-3 lg:p-8">
          {/* Desktop view remains the same with flex-row, mobile view uses flex-col */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - 80% on desktop */}
            <div className="w-full lg:w-[70%] space-y-6">
              {/* Stats section - always at the top */}
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 md:gap-6 ">
                <DashboardStats
                  title="Potential Jobs"
                  subtext="(This Month)"
                  value="13"
                />
                <DashboardStats
                  title="Area"
                  subtext="Jobs in your preferred area"
                  value="13"
                />
                <DashboardStats
                  title="Salary"
                  subtext="Your expectation based"
                  value="13"
                />
                <DashboardStats
                  title="Experience"
                  subtext="Your experience"
                  value="13"
                />
              </div>

              {/* Mobile Applied Jobs Section - Only visible on mobile */}
              <div className="lg:hidden rounded-xl border bg-white p-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl">Applied Jobs</h2>
                  <Link
                    to="/jobs"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    <span className="font-semibold text-sm">All Jobs</span>
                  </Link>
                </div>
                <JobList jobs={jobData} />
              </div>

              {/* Notifications Section */}
              <div className="rounded-xl border bg-white p-6">
                <h2 className="font-bold text-xl mb-4">Recent Notifications</h2>
                <div className="space-y-3">
                  <div className="rounded-lg p-3 hover:bg-gray-50 border border-gray-100">
                    <p className="text-sm">
                      Your application was viewed by Grameenphone, Your
                      application was viewed by Grameenphone
                    </p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="rounded-lg p-3 hover:bg-gray-50 border border-gray-100">
                    <p className="text-sm">
                      New job matching your profile: UX Designer at Alpha,New
                      job matching your profile: UX Designer at Alpha
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applied Jobs Section - 20% - Only visible on desktop */}
            <div className="hidden lg:block w-full lg:w-[30%] rounded-xl border bg-white p-3 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-xl">Applied Jobs</h2>
                <Link
                  to="/jobs"
                  className="text-sm text-blue-500 hover:underline"
                >
                  <span className="font-semibold text-sm">All Jobs</span> 
                </Link>
              </div>
              <JobList jobs={jobData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Jobseeker
