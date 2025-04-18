import { useState } from "react";

const Filters = ({ filters, setFilters }) => {
  // For radio groups, you can define the available options.
  const locationOptions = [
    "Any",
    "Near me",
    "Remote job",
    "Exact location",
    "Within 15 km",
    "Within 30 km",
    "Within 50 km",
  ];

  const salaryOptions = ["Any", "> 30k", "> 50k", "> 80k", "> 100k"];
  const dateOptions = ["All time", "Last 24 hours", "Last 3 days", "Last 7 days"];
  const experienceOptions = ["Any experience", "Internship", "Work remotely"];
  const employmentOptions = ["Full-time", "Temporary", "Part-time"];

  return (
    <aside className="w-full lg:w-[100%] xl:w-[100%] bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-hidden lg:mt-12">
      <h2 className="text-lg font-semibold mb-4 hidden lg:block">Filters</h2>

      {/* Location Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Location</h3>
        <ul className="space-y-2">
          {locationOptions.map((location, index) => (
            <li key={index}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="location"
                  value={location}
                  checked={filters.location === location}
                  onChange={() =>
                    setFilters({ ...filters, location: location })
                  }
                  className="form-radio text-purple-500 focus:ring-purple-500"
                />
                <span className="text-l">{location}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Salary Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Salary</h3>
        <div className="flex space-x-0 mb-4 overflow-auto scrollbar-hide">
          {["Hourly", "Monthly", "Yearly"].map((type, index) => (
            <button
              key={index}
              className={`px-3 py-1 text-sm transition-colors duration-200 ease-in-out ${
                type === filters.salaryType
                  ? "bg-blue-200 text-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-purple-100"
              }`}
              onClick={() =>
                setFilters({ ...filters, salaryType: type })
              }
            >
              {type}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {salaryOptions.map((salary, index) => (
            <li key={index}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="salary"
                  value={salary}
                  checked={filters.salary === salary}
                  onChange={() =>
                    setFilters({ ...filters, salary: salary })
                  }
                  className="form-radio text-purple-500 focus:ring-purple-500"
                />
                <span className="text-l">{salary}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Date of Posting */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Date of posting</h3>
        <ul className="space-y-2">
          {dateOptions.map((date, index) => (
            <li key={index}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="date"
                  value={date}
                  checked={filters.datePosted === date}
                  onChange={() =>
                    setFilters({ ...filters, datePosted: date })
                  }
                  className="form-radio text-purple-500 focus:ring-purple-500"
                />
                <span className="text-l">{date}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Work Experience */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Work experience</h3>
        <ul className="space-y-2">
          {experienceOptions.map((experience, index) => (
            <li key={index}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="experience"
                  value={experience}
                  checked={filters.experience === experience}
                  onChange={() =>
                    setFilters({ ...filters, experience: experience })
                  }
                  className="form-radio text-purple-500 focus:ring-purple-500"
                />
                <span className="text-l">{experience}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Type of Employment */}
      <div>
        <h3 className="text-lg font-medium mb-2">Type of employment</h3>
        <ul className="space-y-2">
          {employmentOptions.map((employment, index) => (
            <li key={index}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={`employment-${index}`}
                  checked={filters.employmentType.includes(employment)}
                  onChange={(e) => {
                    const updatedEmployment = e.target.checked
                      ? [...filters.employmentType, employment]
                      : filters.employmentType.filter((item) => item !== employment);
                    setFilters({ ...filters, employmentType: updatedEmployment });
                  }}
                  className="form-checkbox text-purple-500 focus:ring-purple-500"
                />
                <span className="text-l">{employment}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Filters;
