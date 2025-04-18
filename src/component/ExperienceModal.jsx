import { useState } from "react"
import { Modal } from "./common/Modal"

export const ExperienceModal = ({ experience, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      role: experience?.role || "",
      company: experience?.company || "",
      location: experience?.location || "",
      period: experience?.period || "",
      description: experience?.description || "",
      logo: experience?.logo || ""
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
        title={experience ? "Edit Experience" : "Add Experience"}
        onClose={onClose}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. Frontend Developer"
            />
          </div>
  
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. Acme Inc."
            />
          </div>
  
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
              placeholder="e.g. San Francisco, CA"
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
              placeholder="e.g. Jan 2020 - Present"
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
              placeholder="Describe your responsibilities and achievements..."
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
              {experience ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    )
  }