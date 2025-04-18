"use client"

import { useState } from "react"
import { Modal } from "./common/Modal"

export const SectionModal = ({ section, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: section?.title || "",
    content: section?.content || ""
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave({ id: section?.id || Date.now().toString(), ...formData })
  }

  return (
    <Modal title={section ? "Edit Section" : "Add Section"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Section Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Overview"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Section content..."
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
            {section ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
