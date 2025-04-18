"use client"
import { useState, useRef } from "react"
import { Modal } from "./common/Modal"
import { Upload } from "lucide-react"

export const EditDocumentModal = ({ document, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: document.id,
    name: document.name,
    status: document.status,
    fileInfo: document.fileInfo,
    fileData: document.fileData
  })

  const [newFile, setNewFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleNameChange = e => {
    setFormData({ ...formData, name: e.target.value })
  }

  const handleFileChange = e => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    setNewFile(file)

    const fileSize = (file.size / (1024 * 1024)).toFixed(2)
    const fileType =
      file.name
        .split(".")
        .pop()
        ?.toUpperCase() || "FILE"

    setFormData({
      ...formData,
      fileInfo: `${fileType} ${fileSize} MB`,
      fileData: file
    })
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal title={`Edit ${document.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="documentName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Document Name
          </label>
          <input
            type="text"
            id="documentName"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current File
          </label>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">{formData.fileInfo}</p>
          </div>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:bg-gray-50"
          >
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              {newFile ? newFile.name : "Click to replace file"}
            </span>
          </button>
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
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}
