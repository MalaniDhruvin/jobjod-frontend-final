import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlignJustify,
  X
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function JobListings() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    salary: "",
    status: ""
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(3) // Show 3 jobs per page

  // Sample job data
  const jobListings = [
    {
      id: 1,
      logo: (
        <div className="bg-blue-600 p-2 rounded-lg">
          <div className="w-6 h-6 bg-white/30 rounded-full"></div>
        </div>
      ),
      company: "Linear company",
      title: "Software Engineer",
      isNew: true,
      location: "Brussels",
      type: "Full time",
      salary: "50-55k",
      timeAgo: "29 min ago",
      status: "active"
    },
    {
      id: 2,
      logo: (
        <div className="bg-white border border-gray-200 p-2 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold">N</span>
        </div>
      ),
      company: "Notion",
      title: "Junior UI Designer",
      location: "Madrid",
      type: "Full time",
      salary: "30-32k",
      timeAgo: "1 day ago",
      status: "active"
    },
    {
      id: 3,
      logo: (
        <div className="bg-purple-600 p-2 rounded-lg">
          <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full"></div>
        </div>
      ),
      company: "Spline studio",
      title: "Technical Support Engineer",
      location: "United States",
      type: "Full time",
      salary: "50-52k",
      timeAgo: "1 day ago",
      status: "inactive"
    },
    {
      id: 4,
      logo: (
        <div className="bg-red-600 p-2 rounded-lg">
          <div className="w-6 h-6 bg-white/30 rounded-sm rotate-45"></div>
        </div>
      ),
      company: "Raycast corp",
      title: "Product Designer",
      location: "London",
      type: "Full time",
      salary: "40-42k",
      timeAgo: "2 day ago",
      status: "inactive"
    },
    {
      id: 5,
      logo: (
        <div className="bg-blue-500 p-2 rounded-lg">
          <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      ),
      company: "Loom",
      title: "Copywriter (Growth)",
      location: "London",
      type: "Full time",
      salary: "38-40k",
      timeAgo: "3 day ago",
      status: "active"
    },
    {
      id: 6,
      logo: (
        <div className="bg-emerald-500 p-2 rounded-lg">
          <div className="w-6 h-6 bg-white/30 rounded-full"></div>
        </div>
      ),
      company: "Trainline group",
      title: "Senior UX/UI Designer",
      location: "Paris",
      type: "Full time",
      salary: "38-40k",
      timeAgo: "4 day ago",
      status: "inactive"
    }
  ]

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
      location: "",
      jobType: "",
      salary: "",
      status: ""
    })
  }

  const handleSearchChange = e => {
    setSearchQuery(e.target.value)
  }

  // Filter jobs based on selected filters and search query
  const filteredJobs = jobListings.filter(job => {
    // Check if job matches all selected filters
    const matchesLocation =
      !filters.location || job.location === filters.location
    const matchesJobType = !filters.jobType || job.type === filters.jobType
    const matchesSalary = !filters.salary || job.salary.includes(filters.salary)
    const matchesStatus = !filters.status || job.status === filters.status

    // Check if job matches search query
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())

    return (
      matchesLocation &&
      matchesJobType &&
      matchesSalary &&
      matchesStatus &&
      matchesSearch
    )
  })

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  return (
    <div className="min-h-20 mx-auto p-3 sm:p-4 bg-white rounded-lg shadow-sm">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
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
            <h3 className="font-medium text-gray-800 "><span className="hidden">Filters</span></h3>
            <button
              onClick={toggleFilter}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">All Locations</option>
                <option value="Brussels">Brussels</option>
                <option value="Madrid">Madrid</option>
                <option value="United States">United States</option>
                <option value="London">London</option>
                <option value="Paris">Paris</option>
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="Full time">Full time</option>
                <option value="Part time">Part time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Salary Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <select
                name="salary"
                value={filters.salary}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="">All Salaries</option>
                <option value="30-40k">30-40k</option>
                <option value="40-50k">40-50k</option>
                <option value="50-60k">50-60k</option>
              </select>
            </div>

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
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 mr-2"
            >
              Clear All
            </button>
            <button
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              onClick={toggleFilter}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="space-y-4">
        {currentJobs.length > 0 ? (
          currentJobs.map(job => (
            <JobCard
              key={job.id}
              logo={job.logo}
              company={job.company}
              title={job.title}
              isNew={job.isNew}
              location={job.location}
              type={job.type}
              salary={job.salary}
              timeAgo={job.timeAgo}
              status={job.status}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No jobs match your current filters</p>
            <button
              onClick={clearFilters}
              className="mt-2 text-purple-600 hover:text-purple-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination - Only show if we have filtered jobs */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md flex items-center justify-center ${
              currentPage === 1 ? "text-gray-300" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            // Show pages around current page
            let pageNumber
            if (totalPages <= 5) {
              pageNumber = index + 1
            } else if (currentPage <= 3) {
              pageNumber = index + 1
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index
            } else {
              pageNumber = currentPage - 2 + index
            }

            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md flex items-center justify-center ${
                  currentPage === pageNumber
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            )
          })}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md flex items-center justify-center ${
              currentPage === totalPages ? "text-gray-300" : "hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function JobCard({
  logo,
  company,
  title,
  isNew = false,
  location,
  type,
  salary,
  timeAgo,
  status
}) {
  return (
    <Link to="/Singlejobview">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex-shrink-0 w-12 h-12">{logo}</div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div>
              <p className="text-sm text-gray-600">{company}</p>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                {title}
                {isNew && (
                  <span className="text-xs text-purple-600 font-normal">
                    New post
                  </span>
                )}
              </h3>
            </div>
            <div className="sm:ml-auto">
              <span
                className={`px-2 sm:px-3 py-1 text-xs rounded-full ${
                  status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{type}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{timeAgo}</span>
            </div>
          </div>

          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-none">
            Mollit in laborum tempor Lorem incididunt irure. Aute eu ex ad sunt.
            Pariatur sint culpa do incididunt eiusmod eiusmod culpa. laborum
            tempor Lorem incididunt.
          </p>
        </div>
      </div>
    </Link>
  )
}
