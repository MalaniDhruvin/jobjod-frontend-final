import {
  Briefcase,
  Award,
  Crown,
  FileText,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Rectangle from "../image/Rectangle 3890.png";
import { useState } from "react";
import { ExperienceModal } from "./ExperienceModal";
import { SkillModal } from "./SkillModal";
import { FileUploadModal } from "./FileUploadModal";
import { EducationModal } from "./EducationModal";
import JobPreference from "./JobPreference";

export default function ProfileContent({
  experiences = [],
  education = [],
  skills = [],
  attachments = [],
  onAddExperience = () => {},
  onAddEducation = () => {},
  onAddSkill = () => {},
  onAddFile = () => {},
  onEditExperience = () => {},
  onDeleteExperience = () => {},
  onEditEducation = () => {},
  onDeleteEducation = () => {},
  onEditSkill = () => {},
  onDeleteSkill = () => {},
  onViewAttachment = () => {},
  onDownloadAttachment = () => {},
  onDeleteAttachment = () => {},
}) {
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  // State for editing
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  // console.log(editingEducation, "editingEducation");
  // Handlers for opening modals
  const handleAddExperienceClick = () => {
    setEditingExperience(null);
    setShowExperienceModal(true);
  };

  const handleEditExperienceClick = (id) => {
    const experience = experiences.find((exp) => exp.id === id);
    if (experience) {
      setEditingExperience(experience);
      setShowExperienceModal(true);
    }
  };

  const handleAddEducationClick = () => {
    setEditingEducation(null);
    setShowEducationModal(true);
  };

  const handleEditEducationClick = (id) => {
    const edu = education.find((e) => e.id === id);
    if (edu) {
      setEditingEducation(edu);
      setShowEducationModal(true);
    }
  };

  const handleAddSkillClick = () => {
    setEditingSkill(null);
    setShowSkillModal(true);
  };

  const handleEditSkillClick = (id) => {
    const skill = skills.find((s) => s.id === id);
    if (skill) {
      setEditingSkill(skill);
      setShowSkillModal(true);
    }
  };

  const handleAddFileClick = () => {
    setShowFileModal(true);
  };

  return (
    <>
      <div className="w-full max-w-5xl lg:ml-[310px] mt-2">
        {experiences.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <SectionHeader
              icon={<Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Experiences"
              buttonText="Add Experience"
              onButtonClick={handleAddExperienceClick}
            />
            <ExperienceList
              experiences={experiences}
              onEdit={handleEditExperienceClick}
              onDelete={onDeleteExperience}
            />
          </div>
        )}

        {education.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <SectionHeader
              icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Education & Certifications"
              buttonText="Add Education"
              onButtonClick={handleAddEducationClick}
            />
            <EducationList
              education={education}
              onEdit={handleEditEducationClick}
              onDelete={onDeleteEducation}
            />
          </div>
        )}

        {skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <SectionHeader
              icon={<Crown className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Skills"
              buttonText="Add Skills"
              onButtonClick={handleAddSkillClick}
            />
            <SkillsList
              skills={skills}
              onEdit={handleEditSkillClick}
              onDelete={onDeleteSkill}
            />
          </div>
        )}

        {attachments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <SectionHeader
              icon={<FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Attachments"
              buttonText="Add File"
              onButtonClick={handleAddFileClick}
            />
            <AttachmentsList
              attachments={attachments}
              onView={onViewAttachment}
              onDownload={onDownloadAttachment}
              onDelete={onDeleteAttachment}
            />
          </div>
        )}

        {/* Preference */}
        <JobPreference />
      </div>
      {/* Experience Modal */}
      {showExperienceModal && (
        <ExperienceModal
          experience={editingExperience}
          onClose={() => setShowExperienceModal(false)}
          onSave={(data) => {
            if (editingExperience) {
              onEditExperience(editingExperience.id, data);
            } else {
              onAddExperience(data);
            }
            setShowExperienceModal(false);
          }}
        />
      )}
      {showEducationModal && (
        <EducationModal
          education={editingEducation}
          onClose={() => setShowEducationModal(false)}
          onSave={(data) => {
            if (editingEducation) {
              onEditEducation(editingEducation.id, data);
            } else {
              onAddEducation(data);
            }
            setShowEducationModal(false);
          }}
        />
      )}
      {showSkillModal && (
        <SkillModal
          skill={editingSkill}
          onClose={() => setShowSkillModal(false)}
          onSave={(data) => {
            if (editingSkill) {
              onEditSkill(editingSkill.id, data);
            } else {
              onAddSkill(data);
            }
            setShowSkillModal(false);
          }}
        />
      )}

      {/* File Upload Modal */}
      {showFileModal && (
        <FileUploadModal
          onClose={() => setShowFileModal(false)}
          onUpload={(file) => {
            onAddFile(file);
            setShowFileModal(false);
          }}
        />
      )}
    </>
  );
}

const SectionHeader = ({ icon, title, buttonText, onButtonClick }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
    <div className="flex items-center gap-2 mb-2 sm:mb-0">
      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">{icon}</div>
      <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
    </div>
    <button
      onClick={onButtonClick}
      className="px-3 py-1.5 sm:px-4 sm:py-2 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
    >
      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
      {buttonText}
    </button>
  </div>
);

const ExperienceList = ({ experiences, onEdit, onDelete }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {experiences.map((exp, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              src={Rectangle || "/placeholder.svg"}
              alt={exp.company}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-md sm:text-base">{exp.role}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{exp.company}</p>
            <p className="text-xs sm:text-sm text-gray-500">
              {exp.location} · {exp.period}
            </p>
            <p className="text-sm sm:text-sm text-gray-600 mt-1 sm:mt-2">
              {exp.description}
            </p>
            <button className="text-purple-500 text-xs sm:text-sm mt-1 sm:mt-2">
              See More
            </button>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
              onClick={() => onDelete(exp.id)}
            >
              Delete
            </button>
            <button
              className="text-purple-500 hover:text-purple-700 text-xs sm:text-sm"
              onClick={() => onEdit(exp.id)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const EducationList = ({ education, onEdit, onDelete }) => (
  <div className="space-y-4 sm:space-y-6">
    {education.map((edu, index) => (
      <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-shrink-0 ">
          <img
            src={Rectangle || "/placeholder.svg"}
            alt={edu.school}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-md sm:text-base">{edu.school}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{edu.course}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            Grade: {edu.grade} · {edu.period}
          </p>
          <p className="text-sm sm:text-sm text-gray-600 mt-1 sm:mt-2">
            {edu.description}
          </p>
          <button className="text-purple-500 text-xs sm:text-sm mt-1 sm:mt-2">
            See More
          </button>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
            onClick={() => onDelete(edu.id)}
          >
            Delete
          </button>
          <button
            className="text-purple-500 hover:text-purple-700 text-xs sm:text-sm"
            onClick={() => onEdit(edu.id)}
          >
            Edit
          </button>
        </div>
      </div>
    ))}
  </div>
);

const SkillsList = ({ skills, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    {skills.map((skill, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
      >
        <div>
          <h3 className="font-medium text-sm sm:text-base">{skill.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{skill.level}</p>
        </div>
        <div className="flex  items-center gap-2">
          {/* <div className="flex gap-0.5 sm:gap-1 mr-2">
            {[...Array(skill.rating).keys()].map(star => (
              <Star
                key={star}
                className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 fill-purple-500"
              />
            ))}
          </div> */}
          <div className="flex gap-2">
            <button
              className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
              onClick={() => onDelete(skill.id)}
            >
              <Trash2 className="h-4 w-4 text-gray-500" />
            </button>
            <button
              className="text-purple-500 hover:text-purple-700 text-xs sm:text-sm"
              onClick={() => onEdit(skill.id)}
            >
              <Pencil className="h-4 w-4 text-violet-500" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

const AttachmentsList = ({ attachments, onView, onDownload, onDelete }) => (
  <div className="space-y-2 sm:space-y-3">
    {attachments.map((file, index) => (
      <div
        key={index}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3  rounded-lg"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base">
              {file.fileName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500"> {formatFileSize(file.fileSize)}</p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
            onClick={() => onView(file.id)}
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
            onClick={() => onDownload(file.id)}
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
            onClick={() => onDelete(file.id)}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
);
