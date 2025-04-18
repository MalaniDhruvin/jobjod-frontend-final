import { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowLeft, X, Plus } from "lucide-react";
import TimePicker from "./timePicker";
import PropTypes from "prop-types";
import SearchableDropdown from "./searchabledropdownupdated";
import axios from "axios";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function JobPostModal({ isOpen, onClose, options = [] }) {
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joiningDate, setJoiningDate] = useState(""); // Add state for joining date
  const [numberOfOpenings, setNumberOfOpenings] = useState(""); // Add state for number of openings

  const [jobTitle, setJobTitle] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [JobRole, setJobRole] = useState("");
  const [query, setQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [jobStartTime, setJobStartTime] = useState("09:00AM");
  const [jobEndTime, setJobEndTime] = useState("05:00PM");
  const [interviewStartTime, setInterviewStartTime] = useState("09:00AM");
  const [interviewEndTime, setInterviewEndTime] = useState("05:00PM");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [totalExperience, setTotalExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [gender, setGender] = useState("");
  const [showTotalExpDropdown, setShowTotalExpDropdown] = useState(false);
  const [showQualificationDropdown, setShowQualificationDropdown] =
    useState(false);
  const [showEnglishDropdown, setShowEnglishDropdown] = useState(false);
  const [minimumAgeOpen, setMinimumAgeOpen] = useState(false);
  const [minimumAge, setMinimumAge] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [industrySearchQuery, setIndustrySearchQuery] = useState("");
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    jobTiming: "",
    interviewTiming: "",
    interviewLocation: "",
    interviewInstructions: "",
    preferredIndustry: [],
    certifications: [],
    assets: [],
    interviewLocation: [],
  });

  const [offerBonus, setOfferBonus] = useState(null); // true, false or null
  const [acceptNearbyRelocation, setAcceptNearbyRelocation] = useState(null); // true, false or null
  const [securityDeposit, setSecurityDeposit] = useState("");

  const [skills, setSkills] = useState([]); // ✅ Stores selected skills
  const [selectedSkill, setSelectedSkill] = useState(null); // ✅ Tracks dropdown selection
  const [jobDescription, setJobDescription] = useState(""); // ✅ Stores job description

  const [newSkill, setNewSkill] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedPersons, setSelectedPersons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const [showMinDropdown, setShowMinDropdown] = useState(false);
  const [showMaxDropdown, setShowMaxDropdown] = useState(false);

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  const handleIndustryChange = (updatedIndustries) => {
    setFormData({ ...formData, preferredIndustry: updatedIndustries });
  };

  const experienceOptions = [
    "Fresher (less than 1 year)",
    "1 year",
    "2 years",
    "3 years",
    "4 years",
    "5 years",
  ];
  const experienceOptions2 = [
    "1 year",
    "2 years",
    "3 years",
    "4 years",
    "5 years",
  ];
  const jobTitleOptions = [
    {
      value: "software-engineer",
      label: "Software Engineer",
      group: "Technology",
    },
    {
      value: "frontend-developer",
      label: "Frontend Developer",
      group: "Technology",
    },
    {
      value: "backend-developer",
      label: "Backend Developer",
      group: "Technology",
    },
    {
      value: "full-stack-developer",
      label: "Full Stack Developer",
      group: "Technology",
    },
    {
      value: "mobile-developer",
      label: "Mobile Developer",
      group: "Technology",
    },
    { value: "devops-engineer", label: "DevOps Engineer", group: "Technology" },
    { value: "data-scientist", label: "Data Scientist", group: "Technology" },
    {
      value: "product-designer",
      label: "Product Designer",
      group: "Technology",
    },
    { value: "ui-ux-designer", label: "UI/UX Designer", group: "Technology" },
    { value: "qa-engineer", label: "QA Engineer", group: "Technology" },
  ];
  const expiryTimeOptions = [
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
  ];
  const JobRoleWork = [
    { value: "Software Engineer", label: "Software Engineer" },
    { value: "Web Developer", label: "Web Developer" },
    { value: "Data Scientist", label: "Data Scientist" },
    { value: "Database Administrator", label: "Database Administrator" },
    {
      value: "Information Security Analyst",
      label: "Information Security Analyst",
    },
    { value: "Project Manager", label: "Project Manager" },
    { value: "Cloud Engineer", label: "Cloud Engineer" },
  ];
  const industries = [
    "Software Development",
    "Data Science",
    "Product Design",
    "Digital Marketing",
    "Customer Service",
    "Sales & Business",
    "Healthcare & Medical",
    "Finance & Accounting",
    "Education & Training",
    "Engineering",
  ];
  const InterviewPersons = [
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Michael Johnson" },
    { name: "Emily Davis" },
    { name: "David Wilson" },
    { name: "Sarah Brown" },
    { name: "James Anderson" },
    { name: "Jessica Martinez" },
    { name: "Robert Taylor" },
    { name: "Laura Thomas" },
    { name: "Daniel White" },
  ];
  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami",
    "San Francisco",
    "Seattle",
    "Boston",
    "Dallas",
    "Atlanta",
    "Denver",
  ];
  const languageOptions = [
    "English",
    "Gujarati",
    "Hindi",
    "Marathi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Punjabi",
    "Urdu",
    "Malayalam",
    "Kannada",
    "Odia",
    "Assamese",
  ];
  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "HTML/CSS",
    "SQL",
    "TypeScript",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "UI/UX Design",
    "Project Management",
    "Data Analysis",
    "Marketing",
    "Content Writing",
  ];

  const genderOptions = ["Male", "Female", "Prefer not to say"];

  const certifications = [
    "AWS Certified Solutions Architect",
    "Certified Scrum Master (CSM)",
    "Google Data Analytics Professional Certificate",
    "Microsoft Certified Azure Fundamentals",
    "PMP Certification",
    "Cisco Certified Network Associate (CCNA)",
    "Certified Information Systems Security Professional (CISSP)",
    "CompTIA Security+",
    "ITIL Foundation Certification",
    "Certified Ethical Hacker (CEH)",
  ];

  const Assest = [
    "Laptop",
    "Mobile Device",
    "Monitor",
    "Keyboard",
    "Server",
    "Network Equipment",
    "Software License",
    "Company Vehicle",
  ];

  const resetForm = () => {
    setCurrentStep(1);
    setJobTitle("");
    setExpiryTime("");
    setQuery("");
    setIsAddingNew(false);
    setNewOption("");
    setJobStartTime("09:00AM");
    setJobEndTime("05:00PM");
    setInterviewStartTime("09:00AM");
    setInterviewEndTime("05:00PM");
    setMinExperience("");
    setMaxExperience("");
    setMinSalary("");
    setMaxSalary("");
    setTotalExperience("");
    setQualification("");
    setEnglishLevel("");
    setGender("");
    setShowTotalExpDropdown(false);
    setShowQualificationDropdown(false);
    setShowEnglishDropdown(false);
    setMinimumAgeOpen(false);
    setMinimumAge("");
    setIndustrySearchQuery("");
    setShowIndustryDropdown(false);
    setFormData({
      jobTiming: "",
      interviewTiming: "",
      interviewLocation: "",
      interviewInstructions: "",
      preferredIndustry: [],
      certifications: [],
      assets: [],
      interviewLocation: [],
    });
    setSkills([]);
    setSelectedSkill(null);
    setJobDescription("");
    setNewSkill("");
    setIsDropdownOpen(false);
    setSelectedPersons([]);
    setSearchTerm("");
    setSelectedIndustries([]);
    setSelectedLocations([]);
    setShowMinDropdown(false);
    setShowMaxDropdown(false);
    setSelectedLanguages([]);
    setSelectedDegrees([]);
    setSelectedSpecializations([]);
  };

  const handleAssetChange = (updatedAssets) => {
    setFormData((prev) => ({
      ...prev,
      assets: updatedAssets,
    }));
  };

  const handleCertificationChange = (updatedCertifications) => {
    setFormData({ ...formData, certifications: updatedCertifications });
  };

  // Filter options based on input
  const filteredOptions = skillOptions.filter(
    (skill) =>
      !skills.includes(skill) &&
      skill.toLowerCase().includes(newSkill.toLowerCase())
  );

  const handleSelectSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setNewSkill("");
    setIsDropdownOpen(false);
  };

  const handleRemoveSkill2 = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Skills submitted:", skills);
    // Handle form submission logic here
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (field) => {
    if (field === "experience") {
      setShowTotalExpDropdown(!showTotalExpDropdown);
    } else if (field === "qualification") {
      setShowQualificationDropdown(!showQualificationDropdown);
    } else if (field === "english") {
      setShowEnglishDropdown(!showEnglishDropdown);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowIndustryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showIndustryDropdown]);

  if (!isOpen) return null;

  const goToNextStep = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let jobData = {};
      let endpoint = "";

      switch (currentStep) {
        case 1:
          // Step 1: Basic Info
          jobData = {
            userId: userId,
            jobTitle,
            interviewPersons: selectedPersons.map((person) => person.name),
            industry: selectedIndustries,
            jobRole: JobRole,
            expiryTime: parseInt(expiryTime, 10),
            joiningDate,
            minSalary,
            maxSalary,
            noOfOpenings: numberOfOpenings,
          };
          endpoint = `${BASE_URL}/jobs`;
          break;

        case 2:
          // Step 2: Experience & Preferences
          jobData = {
            userId: userId,
            totalExperience: totalExperience,
            minExperience: minExperience,
            maxExperience: maxExperience,
            minimumQualification: qualification,
            gender: gender,
            englishRequirement: englishLevel,
            candidateLocations: selectedLocations,
            acceptNearbyRelocation: acceptNearbyRelocation, // placeholder (update if you add UI)
            offerBonus: offerBonus, // placeholder (update if you add UI)
          };
          endpoint = `${BASE_URL}/requirements`;
          break;

        case 3:
          // Step 3: Requirements
          jobData = {
            userId: userId,
            minAgeRequired: minimumAge,
            preferredLanguage: selectedLanguages,
            assets: formData.assets,
            degreeAndSpecialization: {
              degrees: selectedDegrees,
              specializations: selectedSpecializations,
            },
            certification: formData.certifications,
            preferredIndustry: formData.preferredIndustry,
            securityDepositRequired: securityDeposit, // placeholder (update if you add UI)
          };
          endpoint = `${BASE_URL}/personal-details`;
          break;

        case 4:
          // Step 4: Skills & Responsibilities
          jobData = {
            userId: userId,
            skills: skills,
            responsibility: jobDescription,
          };
          endpoint = `${BASE_URL}/job-description`;
          break;

        case 5:
          // Step 5: Interview Details
          jobData = {
            userId: userId,
            jobTiming: `${jobStartTime} - ${jobEndTime}`,
            interviewTiming: `${interviewStartTime} - ${interviewEndTime}`,
            interviewLocation: formData.interviewLocation,
            instructions: formData.interviewInstructions,
          };
          endpoint = `${BASE_URL}/job-schedule`;
          navigate("/CompanyDashboard"); // Navigate to jobs page after saving
          break;

        default:
          throw new Error("Invalid step");
      }

      console.log(jobData);

      const response = await axios.post(endpoint, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Step ${currentStep} saved:`, response.data);

      // Move to the next step only if successful
      setCurrentStep(currentStep + 1);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Failed to save job details");
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSalaryChange = (type, value) => {
    if (type === "min") {
      setMinSalary(value);
    } else {
      setMaxSalary(value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to add or remove a skill
  const handleSkillSelect = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const filteredIndustries = industrySearchQuery
    ? industries.filter((industry) =>
        industry.toLowerCase().includes(industrySearchQuery.toLowerCase())
      )
    : industries;

  const handleCancel = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    resetForm(); // Reset all form data
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };
  const filteredOptions2 =
    query === ""
      ? options
      : options.filter((option) =>
          option.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (field, value) => {
    if (field === "experience") {
      setTotalExperience(value);
      setShowTotalExpDropdown(false); // Close dropdown
    } else if (field === "qualification") {
      setQualification(value);
      setShowQualificationDropdown(false); // Close dropdown
    } else if (field === "english") {
      setEnglishLevel(value);
      setShowEnglishDropdown(false); // Close dropdown
    }
  };

  // Filter options based on input
  const filteredPersons = InterviewPersons.filter(
    (person) =>
      !selectedPersons.some((p) => p.name === person.name) &&
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add selected person
  const handleAddPerson = (person) => {
    setSelectedPersons([...selectedPersons, person]);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Remove person
  const handleRemovePerson = (index) => {
    setSelectedPersons(selectedPersons.filter((_, i) => i !== index));
  };

  const handleSelectOption = (value, type) => {
    if (type === "min") {
      setMinExperience(value);
      setShowMinDropdown(false);
    } else {
      setMaxExperience(value);
      setShowMaxDropdown(false);
    }
  };

  // Filter specializations based on selected degrees
  const getFilteredSpecializations = () => {
    let filteredSpecializations = [];
    selectedDegrees.forEach((degree) => {
      if (degreeSpecializationMap[degree]) {
        filteredSpecializations = [
          ...filteredSpecializations,
          ...degreeSpecializationMap[degree],
        ];
      }
    });
    return [...new Set(filteredSpecializations)];
  };

  const handleLocationChange = (updatedLocations) => {
    setFormData((prev) => ({
      ...prev,
      interviewLocation: updatedLocations,
    }));
  };

  return (
    <div className="  fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] py-4 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            {currentStep > 1 ? (
              <button
                onClick={goToPreviousStep}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
            <h2 className="text-xl font-bold ml-4">Post Job</h2>
          </div>

          {/* Step 1 Form */}
          {currentStep === 1 && (
            <form className="space-y-6">
              <h3 className="block text-sm font-medium text-dark-700 mb-1">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <SearchableDropdown
                  label="Job Title"
                  name="jobTitle"
                  placeholder="Select job title"
                  options={jobTitleOptions}
                  value={jobTitle}
                  onChange={setJobTitle}
                  groupBy="group"
                  allowAddNew={true}
                  allowDirectEdit={true}
                />
                {/* Interview Person Name */}
                <div>
                  <div className="relative">
                    <div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Interview Persons
                        </label>

                        {/* Input and Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                          <div className="flex items-center border-b border-gray-300">
                            <input
                              type="text"
                              name="interviewPersons"
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setIsDropdownOpen(true);
                              }}
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              className="w-full pb-2 focus:outline-none focus:border-purple-500"
                              placeholder="Type to add interview persons..."
                            />
                            <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
                          </div>

                          {/* Dropdown with Suggestions */}
                          {isDropdownOpen && filteredPersons.length > 0 && (
                            <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
                              {filteredPersons.map((person, index) => (
                                <li
                                  key={index}
                                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                                  onClick={() => handleAddPerson(person)}
                                >
                                  {person.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {/* Display Selected Persons */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedPersons.map((person, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
                            >
                              {person.name}
                              <X
                                className="h-4 w-4 text-purple-600 cursor-pointer"
                                onClick={() => handleRemovePerson(index)}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <MultiSelectIndustry
                  industries={industries}
                  selectedIndustries={selectedIndustries}
                  setSelectedIndustries={setSelectedIndustries}
                />

                {/* Expiry Time */}
                <div>
                  <StyledDropdown
                    label="Job Role/Area of Work"
                    placeholder="Select expiry time"
                    options={JobRoleWork}
                    value={JobRole}
                    onChange={setJobRole}
                    allowAddNew={true}
                    allowDirectEdit={true}
                  />
                </div>
                <div>
                  <StyledDropdown
                    label="Expiry Time"
                    placeholder="Select expiry time"
                    options={expiryTimeOptions}
                    value={expiryTime}
                    onChange={setExpiryTime}
                    allowAddNew={true}
                    allowDirectEdit={true}
                  />
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joining Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-500"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Salary */}
                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <input
                        id="min-salary"
                        type="number"
                        value={minSalary}
                        onChange={(e) =>
                          handleSalaryChange("min", e.target.value)
                        }
                        className="w-full border-0 border-b border-gray-300 rounded-none pb-2 focus:ring-0 focus:border-blue-500"
                        placeholder="Min Salary"
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        id="max-salary"
                        type="number"
                        value={maxSalary}
                        onChange={(e) =>
                          handleSalaryChange("max", e.target.value)
                        }
                        className="w-full border-0 border-b border-gray-300 rounded-none pb-2 focus:ring-0 focus:border-blue-500"
                        placeholder="Max Salary"
                      />
                    </div>
                  </div>
                </div>

                {/* Notice Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No of Openings
                  </label>
                  <input
                    type="text"
                    className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-500"
                    required
                    name="noOfOpenings"
                    onChange={(e) => setNumberOfOpenings(e.target.value)}
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                >
                  Save & Next
                </button>
              </div>
            </form>
          )}

          {/* Step 2 Form */}
          {currentStep === 2 && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <form className="space-y-6">
                  <h3 className="text-sm font-medium text-gray-700">
                    Candidate Requirement
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Total Experience */}
                      {/* Experience Dropdown */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 ">
                          Total Experience
                        </label>
                        <div
                          className="flex justify-between items-center border-b border-gray-300 pb-2 cursor-pointer "
                          onClick={() => toggleDropdown("experience")}
                        >
                          <span className="text-sm">
                            {totalExperience || "Total Experience of Candidate"}
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {showTotalExpDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                            <ul className="py-1 max-h-60 overflow-auto">
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("experience", "0-2 years")
                                }
                              >
                                0-2 years
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("experience", "2-5 years")
                                }
                              >
                                2-5 years
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("experience", "5-10 years")
                                }
                              >
                                5-10 years
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("experience", "10+ years")
                                }
                              >
                                10+ years
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Minimum Qualification */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 ">
                          Qualification
                        </label>
                        <div
                          className="flex justify-between items-center border-b border-gray-300 pb-2 cursor-pointer"
                          onClick={() => toggleDropdown("qualification")}
                        >
                          <span className="text-sm">
                            {qualification || "Minimum Qualification"}
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {showQualificationDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                            <ul className="py-1 max-h-60 overflow-auto">
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("qualification", "HSC")
                                }
                              >
                                HSC
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("qualification", "SSC")
                                }
                              >
                                SSC
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect(
                                    "qualification",
                                    "Bachelor's Degree"
                                  )
                                }
                              >
                                Bachelor's Degree
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect(
                                    "qualification",
                                    "Master's Degree"
                                  )
                                }
                              >
                                Master's Degree
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("qualification", "PhD")
                                }
                              >
                                PhD
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("qualification", "PhD")
                                }
                              >
                                no qualification
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* English Requirement */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 ">
                          English Requirement
                        </label>
                        <div
                          className="flex justify-between items-center border-b border-gray-300 pb-2 cursor-pointer"
                          onClick={() => toggleDropdown("english")}
                        >
                          <span className="text-sm">
                            {englishLevel || "English Requirement"}
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {showEnglishDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                            <ul className="py-1 max-h-60 overflow-auto">
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect("english", "Basic")}
                              >
                                Basic
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("english", "Intermediate")
                                }
                              >
                                Intermediate
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("english", "Advanced")
                                }
                              >
                                Advanced
                              </li>
                              <li
                                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleSelect("english", "Fluent")
                                }
                              >
                                Fluent
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Relocation Question */}
                      <div>
                        <p className="text-sm mb-3">
                          Would you like to receive applications from nearby
                          cities if they are willing to relocate?
                        </p>
                        <div className="flex gap-6 mt-6">
                          <div className="flex items-center">
                            <input
                              id="relocate-yes"
                              type="radio"
                              name="relocate"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={acceptNearbyRelocation === true}
                              onChange={() => setAcceptNearbyRelocation(true)}
                            />
                            <label
                              htmlFor="relocate-yes"
                              className="ml-2 text-sm text-gray-900"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="relocate-no"
                              type="radio"
                              name="relocate"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={acceptNearbyRelocation === false}
                              onChange={() => setAcceptNearbyRelocation(false)}
                            />
                            <label
                              htmlFor="relocate-no"
                              className="ml-2 text-sm text-gray-900"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="flex gap-4 relative">
                        {/* Min Experience Dropdown */}
                        <div className="flex-1 relative">
                          <label
                            htmlFor="relocate-no"
                            className="ml-2 text-sm text-gray-900"
                          >
                            Min Experience
                          </label>
                          <div
                            className="w-full border-0 border-b border-gray-300 pb-2 focus:ring-0 focus:border-purple-500 cursor-pointer"
                            onClick={() => setShowMinDropdown(!showMinDropdown)}
                          >
                            {minExperience || "Min Experience"}
                          </div>
                          {showMinDropdown && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              <ul className="py-1">
                                {experienceOptions.map((option, index) => (
                                  <li
                                    key={index}
                                    className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                                      minExperience === option
                                        ? "bg-gray-50 text-black font-medium"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectOption(option, "min")
                                    }
                                  >
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Max Experience Dropdown */}
                        <div className="flex-1 relative">
                          <label
                            htmlFor="relocate-no"
                            className="ml-2 text-sm text-gray-900"
                          >
                            Max Experience
                          </label>
                          <div
                            className="w-full border-0 border-b border-gray-300 pb-2 focus:ring-0 focus:border-purple-500 cursor-pointer"
                            onClick={() => setShowMaxDropdown(!showMaxDropdown)}
                          >
                            {maxExperience || "Max Experience"}
                          </div>
                          {showMaxDropdown && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              <ul className="py-1">
                                {experienceOptions2.map((option, index) => (
                                  <li
                                    key={index}
                                    className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                                      maxExperience === option
                                        ? "bg-gray-50 text-black font-medium"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectOption(option, "max")
                                    }
                                  >
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Gender */}
                      <SearchableDropdown
                        label="Gender"
                        options={genderOptions}
                        value={gender}
                        // onChange={setGender}
                        onChange={(selected) => setGender(selected)}
                        placeholder="Select gender"
                      />

                      {/* Candidate Locations */}
                      <div>
                        <MultiSelectLocation
                          locations={[
                            "New York",
                            "Los Angeles",
                            "Chicago",
                            "Houston",
                            "Phoenix",
                          ]} // Available location list
                          selectedLocations={selectedLocations} // Currently selected locations array
                          setSelectedLocations={(updated) =>
                            setSelectedLocations(updated)
                          } // Callback to update selected locations
                          allowAddNew={true} // Allow adding custom locations not in the list
                          allowDirectEdit={true} // Allow inline editing of selected locations
                        />
                      </div>

                      {/* Bonus Question */}
                      <div>
                        <p className="text-sm mb-3">
                          Do you offer bonus in addition to monthly salary?
                        </p>
                        <div className="flex gap-6">
                          <div className="flex items-center">
                            <input
                              id="bonus-yes"
                              type="radio"
                              name="bonus"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={offerBonus === true}
                              onChange={() => setOfferBonus(true)}
                            />
                            <label
                              htmlFor="bonus-yes"
                              className="ml-2 text-sm text-gray-900"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="bonus-no"
                              type="radio"
                              name="bonus"
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              checked={offerBonus === false}
                              onChange={() => setOfferBonus(false)}
                            />
                            <label
                              htmlFor="bonus-no"
                              className="ml-2 text-sm text-gray-900"
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex justify-end gap-4 pt-6">
                        <button
                          type="button"
                          className="px-8 py-2.5 rounded-full bg-[#FF9776] text-white transition-colors text-sm font-medium"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="px-8 py-2.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors text-sm font-medium"
                          onClick={goToNextStep}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 3 Form */}
          {currentStep === 3 && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <h3 className="block text-sm font-medium text-dark-700 mb-6">
                  Personal Details, Education, Addition Info (Optional)
                </h3>
                <form className="space-y-6">
                  {/* Minimum Age and Preferred Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Age Required
                      </label>
                      <input
                        type="number"
                        name="minAge"
                        value={minimumAge}
                        onChange={(e) => setMinimumAge(e.target.value)}
                        placeholder="Enter age"
                        className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Preferred Language Dropdown */}
                    <div>
                      <MultiSelectDropdown
                        label="Preferred Languages"
                        options={languageOptions}
                        selectedValues={selectedLanguages}
                        onChange={(updated) => setSelectedLanguages(updated)}
                        allowAddNew={true} // Allow adding custom languages
                        allowDirectEdit={true} // Allow inline editing of selected languages
                      />
                    </div>
                  </div>

                  {/* Other Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-6">
                        <MultiSelectDropdown5
                          label="Assets"
                          options={Assest}
                          selectedValues={formData.assets}
                          onChange={handleAssetChange}
                          allowAddNew={true}
                        />
                      </div>
                    </div>
                    <div>
                      {/* MultiSelectDropdown for Certifications */}
                      <MultiSelectDropdown4
                        label="Certifications"
                        options={certifications}
                        selectedValues={formData.certifications}
                        onChange={handleCertificationChange}
                        allowAddNew={true} // Allow adding custom certifications
                      />
                    </div>
                    <div className="mt-4">
                      <MultiSelectDropdown3
                        label="Preferred Industry"
                        options={industries}
                        selectedValues={formData.preferredIndustry}
                        onChange={handleIndustryChange}
                        allowAddNew={true} // Allow adding custom industries
                      />
                    </div>

                    <div>
                      <div className=" space-t-6 space-y-2">
                        {/* Degree Dropdown */}
                        <MultiSelectDropdown
                          label="Degrees"
                          options={Object.keys(degreeSpecializationMap)}
                          selectedValues={selectedDegrees}
                          onChange={(updated) => setSelectedDegrees(updated)}
                          allowAddNew={true} // Allow adding custom degrees
                        />

                        {/* Specialization Dropdown */}
                        <MultiSelectDropdown
                          label="Specializations"
                          options={getFilteredSpecializations()}
                          selectedValues={selectedSpecializations}
                          onChange={(updated) =>
                            setSelectedSpecializations(updated)
                          }
                          allowAddNew={true} // Allow adding custom specializations
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Deposit Question */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Is there any security deposit charged to the candidate?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="securityDeposit"
                          value="true"
                          checked={securityDeposit === "true"}
                          onChange={() => setSecurityDeposit("true")}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="securityDeposit"
                          value="false"
                          checked={securityDeposit === "false"}
                          onChange={() => setSecurityDeposit("false")}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      className="px-8 py-2.5 rounded-full bg-[#FF9776] text-white transition-colors text-sm font-medium"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-8 py-2.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors text-sm font-medium"
                      onClick={goToNextStep}
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 4 Form */}
          {currentStep === 4 && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <form className="space-y-6">
                  {/* Required Skills Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Skills
                    </label>

                    {/* Skills Input and Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <div className="flex items-center border-b border-gray-300">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => {
                            setNewSkill(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full pb-2 focus:outline-none focus:border-purple-500"
                          placeholder="Type to add skills..."
                        />
                        <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
                      </div>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && filteredOptions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredOptions.map((skill, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectSkill(skill)}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Selected Skills Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-[#e3dafb] text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill2(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Job Description Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description
                    </label>
                    <textarea
                      name="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Enter job responsibilities and details"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-purple-500 min-h-[120px]"
                    />
                  </div>

                  {/* Navigation Buttons */}
                  {/* Action buttons */}
                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      className="px-8 py-2.5 rounded-full bg-[#FF9776] text-white transition-colors text-sm font-medium"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-8 py-2.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors text-sm font-medium"
                      onClick={goToNextStep}
                    >
                      Next
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 5 Form */}
          {currentStep === 5 && (
            <div className="flex-1 overflow-y-hidden">
              <div className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Job Timing */}
                  <div>
                    <TimePicker
                      label="Job Timing"
                      startTime={jobStartTime}
                      endTime={jobEndTime}
                      onStartTimeChange={setJobStartTime}
                      onEndTimeChange={setJobEndTime}
                    />
                  </div>

                  {/* Interview Details */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                      {/* Interview Timing */}
                      <div>
                        <TimePicker
                          label="Interview Details"
                          startTime={interviewStartTime}
                          endTime={interviewEndTime}
                          onStartTimeChange={setInterviewStartTime}
                          onEndTimeChange={setInterviewEndTime}
                        />
                      </div>

                      {/* Interview Location */}
                      <div>
                        <MultiSelectDropdown6
                          label="Interview Location"
                          options={locations}
                          selectedValues={formData.interviewLocation}
                          onChange={handleLocationChange}
                          allowAddNew={true} // Allow adding custom locations
                        />
                      </div>
                    </div>

                    {/* Instructions for Interview */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instructions for Interview
                      </label>
                      <textarea
                        name="interviewInstructions"
                        value={formData.interviewInstructions}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter instructions for the interview"
                        className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-500"
                      ></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {/* Action buttons */}
                  <div className="flex justify-end gap-4 pt-6">
                    <button
                      type="button"
                      className="px-6 py-2.5 rounded-full bg-[#FF9776] text-white transition-colors text-sm font-medium"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors text-sm font-medium"
                      onClick={goToNextStep}
                      // onClick={onClose}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              Are you sure you want to close?
            </h3>
            <p className="text-gray-500 mb-6">
              Any unsaved changes will be lost.
            </p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 transition-colors text-sm font-medium"
                onClick={handleCancelClose}
              >
                No, continue editing
              </button>
              <button
                type="button"
                className="px-6 py-2 rounded-full bg-[#FF9776] text-white transition-colors text-sm font-medium"
                onClick={handleConfirmClose}
              >
                Yes, close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StyledDropdown = ({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the selected option label
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : "";

  // Group options by group
  const groupedOptions = options.reduce((groups, option) => {
    const group = option.group || "default";
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
    return groups;
  }, {});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Dropdown Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Dropdown Wrapper */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown Button */}
        <div
          className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-500 appearance-none bg-transparent cursor-pointer flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className={`${
              value ? "text-gray-900 font-medium" : "text-gray-500"
            }`}
          >
            {selectedLabel || placeholder}
          </div>
          <ChevronDown className="h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {Object.keys(groupedOptions).map((group) => (
              <div key={group}>
                {/* Group Header */}
                {group !== "default" && (
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    {group}
                  </div>
                )}
                {/* Group Options */}
                <ul className="py-1">
                  {groupedOptions[group].map((option, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 text-sm cursor-pointer ${
                        option.value === value
                          ? " text-black font-medium"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for validation
StyledDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      group: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const MultiSelectIndustry = ({
  industries,
  selectedIndustries,
  setSelectedIndustries,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter industries based on search term
  const filteredIndustries = industries.filter(
    (industry) =>
      !selectedIndustries.includes(industry) &&
      industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding an industry
  const handleAddIndustry = (industry) => {
    if (!selectedIndustries.includes(industry)) {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle removing an industry
  const handleRemoveIndustry = (index) => {
    const updatedIndustries = [...selectedIndustries];
    updatedIndustries.splice(index, 1);
    setSelectedIndustries(updatedIndustries);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Industry</label>
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            name="industry"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
            placeholder="Type to add industries..."
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown with Suggestions */}
        {isDropdownOpen && filteredIndustries.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredIndustries.map((industry, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddIndustry(industry)}
              >
                {industry}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display Selected Industries */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedIndustries.map((industry, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {industry}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveIndustry(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

const MultiSelectLocation = ({
  locations,
  selectedLocations,
  setSelectedLocations,
  allowAddNew = false,
  allowDirectEdit = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const dropdownRef = useRef(null);

  // Filter locations based on search term
  const filteredLocations = locations.filter(
    (location) =>
      !selectedLocations.includes(location) &&
      location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a location
  const handleAddLocation = (location) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom location
  const handleAddNewLocation = () => {
    if (searchTerm.trim() && !selectedLocations.includes(searchTerm.trim())) {
      setSelectedLocations([...selectedLocations, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing a location
  const handleRemoveLocation = (index) => {
    const updatedLocations = [...selectedLocations];
    updatedLocations.splice(index, 1);
    setSelectedLocations(updatedLocations);
  };

  // Start editing a location
  const handleStartEdit = (index) => {
    if (allowDirectEdit) {
      setEditingIndex(index);
      setEditValue(selectedLocations[index]);
      setIsEditing(true);
    }
  };

  // Save edited location
  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updatedLocations = [...selectedLocations];
      updatedLocations[editingIndex] = editValue.trim();
      setSelectedLocations(updatedLocations);
      setIsEditing(false);
      setEditingIndex(null);
      setEditValue("");
    }
  };

  // Handle key press in edit mode
  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditingIndex(null);
      setEditValue("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        if (isEditing) {
          handleSaveEdit();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Candidate Locations</label>
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
            placeholder="Type to add locations..."
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown with Suggestions */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredLocations.map((location, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddLocation(location)}
              >
                {location}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !locations.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewLocation}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Locations */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedLocations.map((location, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyPress}
                onBlur={handleSaveEdit}
                className="bg-transparent focus:outline-none w-full"
                autoFocus
              />
            ) : (
              <span
                className={allowDirectEdit ? "cursor-pointer" : ""}
                onClick={() => handleStartEdit(index)}
              >
                {location}
              </span>
            )}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveLocation(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

const MultiSelectDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  allowAddNew = false,
  allowDirectEdit = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new option
  const handleAddOption = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom option
  const handleAddNewOption = () => {
    if (searchTerm.trim() && !selectedValues.includes(searchTerm.trim())) {
      onChange([...selectedValues, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing an option
  const handleRemoveOption = (index) => {
    const updatedValues = [...selectedValues];
    updatedValues.splice(index, 1);
    onChange(updatedValues);
  };

  // Start editing a selected value
  const handleStartEdit = (index) => {
    if (allowDirectEdit) {
      setEditingIndex(index);
      setEditValue(selectedValues[index]);
      setIsEditing(true);
    }
  };

  // Save edited value
  const handleSaveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updatedValues = [...selectedValues];
      updatedValues[editingIndex] = editValue.trim();
      onChange(updatedValues);
      setIsEditing(false);
      setEditingIndex(null);
      setEditValue("");
    }
  };

  // Handle key press in edit mode
  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditingIndex(null);
      setEditValue("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        if (isEditing) {
          handleSaveEdit();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium">{label}</label>

      {/* Dropdown Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            placeholder="Type to add..."
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddOption(option)}
              >
                {option}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !options.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Values */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyPress}
                onBlur={handleSaveEdit}
                className="bg-transparent focus:outline-none w-full"
                autoFocus
              />
            ) : (
              <span
                className={allowDirectEdit ? "cursor-pointer" : ""}
                onClick={() => handleStartEdit(index)}
              >
                {value}
              </span>
            )}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveOption(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

// PropTypes for validation
MultiSelectDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  allowAddNew: PropTypes.bool,
  allowDirectEdit: PropTypes.bool,
};

const degreeSpecializationMap = {
  "Master of Business Administration (MBA)": [
    "Finance",
    "Marketing",
    "Human Resources",
    "Operations Management",
  ],
  "Bachelor of Technology (B.Tech)": [
    "Computer Science",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
  ],
  "Master of Science (M.Sc)": ["Mathematics", "Physics", "Chemistry"],
  // Add more mappings as needed
};

const MultiSelectDropdown2 = ({
  label,
  options,
  selectedValues,
  onChange,
  allowAddNew = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new option
  const handleAddOption = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom option
  const handleAddNewOption = () => {
    if (searchTerm.trim() && !selectedValues.includes(searchTerm.trim())) {
      onChange([...selectedValues, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing an option
  const handleRemoveOption = (index) => {
    const updatedValues = [...selectedValues];
    updatedValues.splice(index, 1);
    onChange(updatedValues);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium">{label}</label>

      {/* Dropdown Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            placeholder="Type to add..."
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddOption(option)}
              >
                {option}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !options.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Values */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {value}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveOption(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

MultiSelectDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  allowAddNew: PropTypes.bool,
};

const MultiSelectDropdown3 = ({
  label,
  options,
  selectedValues,
  onChange,
  allowAddNew = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new option
  const handleAddOption = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom option
  const handleAddNewOption = () => {
    if (searchTerm.trim() && !selectedValues.includes(searchTerm.trim())) {
      onChange([...selectedValues, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing an option
  const handleRemoveOption = (index) => {
    const updatedValues = [...selectedValues];
    updatedValues.splice(index, 1);
    onChange(updatedValues);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium">{label}</label>

      {/* Dropdown Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            placeholder="Type to add..."
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddOption(option)}
              >
                {option}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !options.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Values */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {value}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveOption(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

MultiSelectDropdown3.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  allowAddNew: PropTypes.bool,
};

const MultiSelectDropdown4 = ({
  label,
  options,
  selectedValues,
  onChange,
  allowAddNew = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new option
  const handleAddOption = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom option
  const handleAddNewOption = () => {
    if (searchTerm.trim() && !selectedValues.includes(searchTerm.trim())) {
      onChange([...selectedValues, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing an option
  const handleRemoveOption = (index) => {
    const updatedValues = [...selectedValues];
    updatedValues.splice(index, 1);
    onChange(updatedValues);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium">{label}</label>

      {/* Dropdown Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            placeholder="Type to add..."
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddOption(option)}
              >
                {option}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !options.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Values */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {value}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveOption(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

MultiSelectDropdown4.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  allowAddNew: PropTypes.bool,
};

const MultiSelectDropdown5 = ({
  label,
  options,
  selectedValues,
  onChange,
  allowAddNew = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new option
  const handleAddOption = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom option
  const handleAddNewOption = () => {
    if (searchTerm.trim() && !selectedValues.includes(searchTerm.trim())) {
      onChange([...selectedValues, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing an option
  const handleRemoveOption = (index) => {
    const updatedValues = [...selectedValues];
    updatedValues.splice(index, 1);
    onChange(updatedValues);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium">{label}</label>

      {/* Dropdown Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            placeholder="Type to add..."
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddOption(option)}
              >
                {option}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !options.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Values */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {value}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveOption(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

MultiSelectDropdown5.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  allowAddNew: PropTypes.bool,
};

const MultiSelectDropdown6 = ({
  label,
  options,
  selectedValues,
  onChange,
  allowAddNew = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      !selectedValues.includes(option) &&
      option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new option
  const handleAddOption = (option) => {
    if (!selectedValues.includes(option)) {
      onChange([...selectedValues, option]);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  // Handle adding a new custom option
  const handleAddNewOption = () => {
    if (searchTerm.trim() && !selectedValues.includes(searchTerm.trim())) {
      onChange([...selectedValues, searchTerm.trim()]);
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  };

  // Handle removing an option
  const handleRemoveOption = (index) => {
    const updatedValues = [...selectedValues];
    updatedValues.splice(index, 1);
    onChange(updatedValues);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium">{label}</label>

      {/* Dropdown Input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center border-b border-gray-300">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            placeholder="Type to add..."
            className="w-full pb-2 focus:outline-none focus:border-purple-500"
          />
          <ChevronDown className="h-5 w-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-50 max-h-40 overflow-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                onClick={() => handleAddOption(option)}
              >
                {option}
              </li>
            ))}
            {allowAddNew &&
              searchTerm.trim() &&
              !options.includes(searchTerm.trim()) && (
                <li
                  className="p-2 cursor-pointer hover:bg-gray-200 flex items-center gap-2 text-purple-600"
                  onClick={handleAddNewOption}
                >
                  <Plus className="h-4 w-4" />
                  Add "{searchTerm.trim()}"
                </li>
              )}
          </ul>
        )}
      </div>

      {/* Display Selected Values */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedValues.map((value, index) => (
          <span
            key={index}
            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2 border border-purple-300"
          >
            {value}
            <X
              className="h-4 w-4 text-purple-600 cursor-pointer"
              onClick={() => handleRemoveOption(index)}
            />
          </span>
        ))}
      </div>
    </div>
  );
};

MultiSelectDropdown6.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  allowAddNew: PropTypes.bool,
};
