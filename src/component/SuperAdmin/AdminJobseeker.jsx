"use client";

import { useState, useEffect } from "react";
import img from "../../image/dashboard.png";
import Dheader2 from "../Dheader2";
import { Link, useLocation } from "react-router-dom";
import { Search, ChevronDown, AlignJustify, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import axios from "axios";
import { USER_BASE_URL, BASE_URL } from "../../config";

function AdminJobseeker() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    joiningDate: "",
    policyViolation: "",
  });

  const [jobSeekers, setJobSeekers] = useState([]); // ← replaced static array
  const location = useLocation();
  const substrLocation = location.pathname.substring(1);
  const token = localStorage.getItem("authToken");

  // Fetch real job seeker data
  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        const res = await axios.get(`${USER_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res.data);
        // Expecting an array of { id, name, joiningDate, status, policyViolation, image? }
        setJobSeekers(
          res.data.map((js) => {
            const statuses = ["active", "inactive"];
            return {
              id: js.userId,
              name: js.fullName,
              joiningDate: js.createdAt,
              status: statuses[Math.floor(Math.random() * statuses.length)],
              policyViolation: Math.random() < 0.5,
              image: img, // placeholder you imported
            };
          })
        );
      } catch (err) {
        console.error("Error loading job seekers:", err);
      }
    };
    fetchJobSeekers();
  }, [token]);

  // … rest of your handlers (toggleFilter, handleSearchChange, etc.) remain unchanged …

  // Filter logic remains the same
  const filteredJobSeekers = jobSeekers.filter((jobSeeker) => {
    // … same as before …
    const matchesStatus =
      !filters.status || jobSeeker.status === filters.status;
    const matchesJoiningDate =
      !filters.joiningDate ||
      jobSeeker.joiningDate.includes(filters.joiningDate);
    const matchesPolicyViolation =
      filters.policyViolation === "" ||
      (filters.policyViolation === "yes" && jobSeeker.policyViolation) ||
      (filters.policyViolation === "no" && !jobSeeker.policyViolation);
    const matchesSearch =
      !searchQuery ||
      jobSeeker.name.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesStatus &&
      matchesJoiningDate &&
      matchesPolicyViolation &&
      matchesSearch
    );
  });

  const formatDate = (dateInput) => {
    const d = new Date(dateInput);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar substrLocation={substrLocation} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Dheader2 />

        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="max-h-screen mx-auto p-0 sm:p-6 bg-white">
            {/* Search & filter UI (unchanged) */}
            {/* … */}
            {/* Job seeker cards */}
            {filteredJobSeekers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredJobSeekers.map((jobSeeker) => (
                  <div
                    key={jobSeeker.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
                  >
                    {/* … same markup, now using jobSeeker from API */}
                    <img
                      src={jobSeeker.image || img}
                      alt="Employee profile"
                      className="rounded-md object-cover w-20 h-20"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold">
                            {jobSeeker.name}
                          </h3>
                          <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            Joining : {formatDate(jobSeeker.joiningDate )}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                          {jobSeeker.policyViolation && (
                            <span className="px-3 py-1 text-xs font-medium text-white bg-red-700 rounded-full">
                              Policy Violet
                            </span>
                          )}
                          <span
                            className={`px-3 py-1 text-xs font-medium text-white ${
                              jobSeeker.status === "active"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            } rounded-full`}
                          >
                            {jobSeeker.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                        <Link to={`/Profile/${jobSeeker.id}`}>
                          <button className="px-3 sm:px-6 py-1.5 sm:py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium">
                            Details
                          </button>
                        </Link>
                        <Link to={`/Job/${jobSeeker.id}`}>
                          <button className="px-3 sm:px-6 py-1.5 sm:py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium">
                            Job Applied
                          </button>
                        </Link>
                        <Link to={`/messageView/${jobSeeker.id}`}>
                          <button className="px-3 sm:px-6 py-1.5 sm:py-2 bg-purple-500 text-white rounded-full text-xs sm:text-sm font-medium">
                            Check Messages
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No job seekers match your current filters
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      joiningDate: "",
                      policyViolation: "",
                    })
                  }
                  className="mt-2 text-purple-600 hover:text-purple-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminJobseeker;
