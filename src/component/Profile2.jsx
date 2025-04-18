import { Briefcase, Award, Crown, FileText, Plus, Eye, Download, Trash } from "lucide-react"

export default function Profile2() {
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showEducationModal, setShowEducationModal] = useState(false)
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)

  const handleAddExperienceClick = () => {
    setEditingExperience(null)
    setShowExperienceModal(true)
  }
  return (
    <>
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-10 max-w-screen-lg mx-auto w-full sm:w-[720px] sm:mr-[320px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center"></div>
      <div className="mt-6 sm:mt-8">
        {/* Experiences Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Experiences</h2>
          </div>
          <button handleAddExperienceClick={handleAddExperienceClick} className="px-3 py-1.5 sm:px-4 sm:py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Experience
          </button>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <ExperienceItem
            title="Sr. Product Designer"
            company="ShortFin"
            location="Dhaka, Bangladesh"
            period="January 2022 to Present"
            description="ShortFin is the country's first and pioneer online travel aggregator (OTA). My goal was to craft a functional and delightful experience through web and mobile apps currently consisting of 12M+ & 6.5m+ billon users..."
          />
          <ExperienceItem
            title="Product Designer"
            company="Grameenphone"
            location="Dhaka, Bangladesh"
            period="January 2022 to Present"
            description="ShortFin is the country's first and pioneer online travel aggregator (OTA). My goal was to craft a functional and delightful experience through web and mobile apps..."
          />
        </div>
      </div>

      {/* Education Section */}
      <div className="mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Education & Certifications</h2>
          </div>
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Education
          </button>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <EducationItem
            institution="California Institute of the Arts"
            course="UX Design Fundamentals · UX Design"
            grade="Grade: A+ · 2020 - 2021"
            description="This hands-on course examines how content is organized and structured to create an experience for a user, and what role the designer plays in creating and shaping user experience. You will be led through a..."
          />
          <EducationItem
            institution="University of Pennsylvania"
            course="Gamification · Game and Interactive Media Design"
            grade="Grade: A+ · 2019 - 2020"
            description="Gamification is the application of game elements and digital game design techniques to non-game problems, such as business and social impact challenges. This course will teach you the mechanisms of gamification..."
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>
          </div>
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add Skills
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <SkillItem skill="UX Design" level="Expert" rating={5} />
          <SkillItem skill="UI Design" level="Expert" rating={5} />
          <SkillItem skill="User Research" level="Expert" rating={5} />
          <SkillItem skill="Design System" level="Expert" rating={5} />
        </div>
      </div>

      {/* Attachments Section */}
      <div className="mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">Attachments</h2>
          </div>
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Add File
          </button>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <AttachmentItem filename="Resume-AnamoulRouf.pdf" filesize="1.2 MB" />
          <AttachmentItem filename="CaseStudy-01.pdf" filesize="1.7 MB" />
        </div>
      </div>
    </div>
    {showExperienceModal && (
        <ExperienceModal
          experience={editingExperience}
          onClose={() => setShowExperienceModal(false)}
          onSave={data => {
            if (editingExperience) {
              onEditExperience(editingExperience.id, data)
            } else {
              onAddExperience(data)
            }
            setShowExperienceModal(false)
          }}
        />
      )}
    </>
  )
}

function ExperienceItem({ title, company, location, period, description }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="flex-shrink-0">
        <img alt={company} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" src="/placeholder.svg?height=48&width=48" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{company}</p>
        <p className="text-xs sm:text-sm text-gray-500">
          {location} · {period}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">{description}</p>
        <button className="text-purple-500 text-xs sm:text-sm mt-1 sm:mt-2">See More</button>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button className="text-gray-500 hover:text-gray-700 text-sm sm:text-sm">Delete</button>
        <button className="text-purple-500 hover:text-purple-700 text-sm sm:text-sm">Edit</button>
      </div>
    </div>
  )
}

function EducationItem({ institution, course, grade, description }) {
  return (
    <div className="flex flex- sm:flex-row gap-3 sm:gap-4">
      <div className="flex-shrink-0">
        <img
          alt={institution}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
          src="/placeholder.svg?height=48&width=48"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-sm sm:text-base">{institution}</h3>
        <p className="text-xs sm:text-sm text-gray-600">{course}</p>
        <p className="text-xs sm:text-sm text-gray-500">{grade}</p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">{description}</p>
        <button className="text-purple-500 text-xs sm:text-sm mt-1 sm:mt-2">See More</button>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0">
        <button className="text-gray-500 hover:text-gray-700 text-sm sm:text-sm">Delete</button>
        <button className="text-purple-500 hover:text-purple-700 text-sm sm:text-sm">Edit</button>
      </div>
    </div>
  )
}

function SkillItem({ skill, level, rating }) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-medium text-sm sm:text-base">{skill}</h3>
        <p className="text-xs sm:text-sm text-gray-500">{level}</p>
      </div>
      <div className="flex gap-0.5 sm:gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 fill-purple-500" />
        ))}
      </div>
    </div>
  )
}

function AttachmentItem({ filename, filesize }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
          <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium text-sm sm:text-base">{filename}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{filesize}</p>
        </div>
      </div>
      <div className="flex gap-1 sm:gap-2">
        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
          <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}

function Star(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
    </svg>
  )
}

