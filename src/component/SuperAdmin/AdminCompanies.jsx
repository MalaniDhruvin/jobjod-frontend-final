import { useState } from "react"
import img from "../../image/icon.png"
import Dheader2 from "../Dheader2"
import { Link, useLocation } from "react-router-dom"
import { Search, AlignJustify, ChevronDown, X } from "lucide-react"
import AdminSidebar from "./AdminSidebar"

function AdminCompanies() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    joiningMonth: "",
    expiryMonth: "",
    verification: "",
    policyViolation: ""
  })

  const location = useLocation()
  const substrLocation = location.pathname.substring(1)

  // Sample company data
  const companies = [
    {
      id: 1,
      name: "Linear company",
      status: "active",
      verification: "verified",
      policyViolation: false,
      joiningDate: "07/March/2025",
      expiryDate: "15/March/2025",
      logo: img
    },
    {
      id: 2,
      name: "Linear company",
      status: "inactive",
      verification: "pending",
      policyViolation: false,
      joiningDate: "07/March/2025",
      expiryDate: "15/March/2025",
      logo: img
    },
    {
      id: 3,
      name: "Linear company",
      status: "active",
      verification: "verified",
      policyViolation: true,
      joiningDate: "07/March/2025",
      expiryDate: "15/March/2025",
      logo: img
    },
    {
      id: 4,
      name: "Acme Corp",
      status: "active",
      verification: "verified",
      policyViolation: false,
      joiningDate: "15/April/2025",
      expiryDate: "22/April/2026",
      logo: img
    },
    {
      id: 5,
      name: "Tech Solutions",
      status: "inactive",
      verification: "verified",
      policyViolation: false,
      joiningDate: "10/February/2025",
      expiryDate: "10/February/2026",
      logo: img
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
      joiningMonth: "",
      expiryMonth: "",
      verification: "",
      policyViolation: ""
    })
  }

  const handleSearchChange = e => {
    setSearchQuery(e.target.value)
  }

  // Filter companies based on selected filters and search query
  const filteredCompanies = companies.filter(company => {
    // Check if company matches all selected filters
    const matchesStatus = !filters.status || company.status === filters.status

    // For joining month, we'll do a simple includes check
    const matchesJoiningMonth =
      !filters.joiningMonth ||
      company.joiningDate.includes(filters.joiningMonth)

    // For expiry month, we'll do a simple includes check
    const matchesExpiryMonth =
      !filters.expiryMonth || company.expiryDate.includes(filters.expiryMonth)

    // For verification status
    const matchesVerification =
      !filters.verification || company.verification === filters.verification

    // For policy violation, convert the string filter to boolean
    const matchesPolicyViolation =
      filters.policyViolation === "" ||
      (filters.policyViolation === "yes" && company.policyViolation) ||
      (filters.policyViolation === "no" && !company.policyViolation)

    // Check if company matches search query
    const matchesSearch =
      !searchQuery ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase())

    return (
      matchesStatus &&
      matchesJoiningMonth &&
      matchesExpiryMonth &&
      matchesVerification &&
      matchesPolicyViolation &&
      matchesSearch
    )
  })

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <AdminSidebar substrLocation={substrLocation} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <div className="lg:block">
          <Dheader2 />
        </div>

        {/* Content Area */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="max-h-screen mx-auto p-0 sm:p-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search company..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none text-sm"
                />
              </div>
              <div className="relative">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

                  {/* Verification Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification
                    </label>
                    <select
                      name="verification"
                      value={filters.verification}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    >
                      <option value="">All</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
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

                  {/* Joining Month Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Month
                    </label>
                    <select
                      name="joiningMonth"
                      value={filters.joiningMonth}
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

                  {/* Expiry Month Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Month
                    </label>
                    <select
                      name="expiryMonth"
                      value={filters.expiryMonth}
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

            {/* Company Cards Grid */}
            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredCompanies.map(company => (
                  <div
                    key={company.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Image icon */}
                      <img
                        src={company.logo || "/placeholder.svg"}
                        alt="icon"
                        className="w-10 h-10 sm:w-auto sm:h-auto"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                          <h3 className="text-base sm:text-lg font-semibold">
                            {company.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                            {company.verification === "pending" && (
                              <span className="px-3 sm:px-4 py-1 bg-orange-400 text-white text-xs sm:text-sm rounded-full whitespace-nowrap">
                                Verification Pending
                              </span>
                            )}
                            {company.policyViolation && (
                              <span className="px-3 sm:px-4 py-1 bg-red-700 text-white text-xs sm:text-sm rounded-full whitespace-nowrap">
                                Policy Violet
                              </span>
                            )}
                            <span
                              className={`px-3 sm:px-4 py-1 ${
                                company.status === "active"
                                  ? "bg-emerald-500"
                                  : "bg-red-600"
                              } text-white text-xs sm:text-sm rounded-full`}
                            >
                              {company.status === "active"
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-6 mt-1 text-xs sm:text-sm text-gray-600">
                          <span>Joining: {company.joiningDate}</span>
                          <span>Expiry: {company.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                      <Link to="/CompanyProfile">
                        <button className="px-4 sm:px-6 py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium">
                          Details
                        </button>
                      </Link>
                      <Link to="/CompanyPostJobs">
                        <button className="px-4 sm:px-6 py-2 bg-black text-white rounded-full text-xs sm:text-sm font-medium">
                          Job Posts
                        </button>
                      </Link>
                      <Link to="/Message">
                        <button className="px-4 sm:px-6 py-2 bg-purple-400 text-white rounded-full text-xs sm:text-sm font-medium">
                          Check Messages
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-gray-500">
                  No companies match your current filters
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

export default AdminCompanies
