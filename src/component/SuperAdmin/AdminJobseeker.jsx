import { useState } from "react"
import img from "../../image/dashboard.png"
import Dheader2 from "../Dheader2"
import { Link, useLocation } from "react-router-dom"
import { Search, ChevronDown, AlignJustify, X } from "lucide-react"
import AdminSidebar from "./AdminSidebar"

function AdminJobseeker() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    joiningDate: "",
    policyViolation: ""
  })

  const location = useLocation()
  const substrLocation = location.pathname.substring(1)

  // Sample job seeker data
  const jobSeekers = [
    {
      id: 1,
      name: "Anamoul Willioms",
      joiningDate: "07/March/2025",
      status: "active",
      policyViolation: false,
      image: img
    },
    {
      id: 2,
      name: "Anamoul Willioms",
      joiningDate: "07/March/2025",
      status: "active",
      policyViolation: true,
      image: img
    },
    {
      id: 3,
      name: "John Smith",
      joiningDate: "15/April/2025",
      status: "inactive",
      policyViolation: false,
      image: img
    },
    {
      id: 4,
      name: "Sarah Johnson",
      joiningDate: "22/February/2025",
      status: "active",
      policyViolation: false,
      image: img
    }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleFilterChange = e => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const clearFilters = () => {
    setFilters({
      status: "",
      joiningDate: "",
      policyViolation: ""
    })
  }

  const handleSearchChange = e => {
    setSearchQuery(e.target.value)
  }

  // Filter job seekers based on selected filters and search query
  const filteredJobSeekers = jobSeekers.filter(jobSeeker => {
    // Check if job seeker matches all selected filters
    const matchesStatus = !filters.status || jobSeeker.status === filters.status

    // For joining date, we'll do a simple includes check
    const matchesJoiningDate =
      !filters.joiningDate ||
      jobSeeker.joiningDate.includes(filters.joiningDate)

    // For policy violation, convert the string filter to boolean
    const matchesPolicyViolation =
      filters.policyViolation === "" ||
      (filters.policyViolation === "yes" && jobSeeker.policyViolation) ||
      (filters.policyViolation === "no" && !jobSeeker.policyViolation)

    // Check if job seeker matches search query
    const matchesSearch =
      !searchQuery ||
      jobSeeker.name.toLowerCase().includes(searchQuery.toLowerCase())

    return (
      matchesStatus &&
      matchesJoiningDate &&
      matchesPolicyViolation &&
      matchesSearch
    )
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <AdminSidebar substrLocation={substrLocation} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Dheader2 />
        {/* <Chartdashboard/> */}

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="max-h-screen mx-auto p-0 sm:p-6 bg-white">
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search job seekers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                className="w-full sm:w-auto flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg min-w-[140px] sm:min-w-[180px]"
                onClick={toggleFilter}
              >
                <div className="flex items-center gap-2">
                  <AlignJustify className="h-5 w-5 text-gray-700" />
                  <span className="font-medium text-gray-700">Filter by</span>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-700 ml-2" />
              </button>
            </div>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800"><span className="hidden">Filters</span></h3>
                  <button
                    onClick={toggleFilter}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Joining Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Month
                    </label>
                    <select
                      name="joiningDate"
                      value={filters.joiningDate}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    >
                      <option value="">All Months</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>

                  {/* Policy Violation Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy Violation
                    </label>
                    <select
                      name="policyViolation"
                      value={filters.policyViolation}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    >
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 mr-2"
                  >
                    Clear All
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-700"
                    onClick={toggleFilter}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Employee Cards */}
            {filteredJobSeekers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredJobSeekers.map(jobSeeker => (
                  <div
                    key={jobSeeker.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <img
                        src={jobSeeker.image || "/placeholder.svg"}
                        alt="Employee profile"
                        width={80}
                        height={80}
                        className="rounded-md object-cover w-20 h-20"
                      />
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                          <div>
                            <h3 className="text-lg sm:text-xl font-semibold">
                              {jobSeeker.name}
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                              Joining : {jobSeeker.joiningDate}
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
                          <Link to="/Profile">
                            <button className="px-3 sm:px-6 py-1.5 sm:py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium">
                              Details
                            </button>
                          </Link>
                          <Link to="/Job">
                            <button className="px-3 sm:px-6 py-1.5 sm:py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium">
                              Job Applied
                            </button>
                          </Link>
                          <Link to="/Message">
                            <button className="px-3 sm:px-6 py-1.5 sm:py-2 bg-purple-500 text-white rounded-full text-xs sm:text-sm font-medium">
                              Check Messages
                            </button>
                          </Link>
                        </div>
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
                  onClick={clearFilters}
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
  )
}

export default AdminJobseeker
