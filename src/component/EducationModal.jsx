import { useState } from "react"
import { Modal } from "./common/Modal"

export const EducationModal = ({ education, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      school: education?.school || "",
      course: education?.course || "",
      grade: education?.grade || "",
      period: education?.period || "",
      description: education?.description || "",
      logo: education?.logo || ""
    })
  
    const handleChange = e => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  
    const handleSubmit = e => {
      e.preventDefault()
      onSave(formData)
    }
  
    return (
      <Modal
        title={education ? "Edit Education" : "Add Education"}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="school"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              School/Institution
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. University of Technology"
            />
          </div>
  
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course/Degree
            </label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. Bachelor of Science in Computer Science"
            />
          </div>
  
          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grade
            </label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. 3.8 GPA"
            />
          </div>
  
          <div>
            <label
              htmlFor="period"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Period
            </label>
            <input
              type="text"
              id="period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. 2018 - 2022"
            />
          </div>
  
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded-md"
              placeholder="Describe your studies, achievements, etc..."
            />
          </div>
  
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Logo URL (optional)
            </label>
            <input
              type="text"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="e.g. https://example.com/logo.png"
            />
          </div>
  
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              {education ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    )
  }