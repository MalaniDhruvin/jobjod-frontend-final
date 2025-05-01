
import { useState } from "react"
import { Modal } from "./common/Modal"
import { Download, FileIcon } from "lucide-react"
import { cn } from "./Jobseeker"
import { USER_BASE_URL } from "../config"
import axios from "axios"

export const FileUploadModal = ({ onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
  
    const handleDrag = e => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true)
      } else if (e.type === "dragleave") {
        setDragActive(false)
      }
    }
  
    const handleDrop = e => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setSelectedFile(e.dataTransfer.files[0])
      }
    }
  
    const handleFileChange = e => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0])
      }
    }

        const handleSubmit = async e => {
          e.preventDefault()
          if (!selectedFile) return
      
          // build multipart payload
          const formData = new FormData()
          formData.append("file", selectedFile)
         formData.append("userId", localStorage.getItem("userId"))
      
          try {
            const token = localStorage.getItem("authToken")
            const res = await axios.post(
              `${USER_BASE_URL}/attachments`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data"
                }
             }
            )
            // pass saved attachment back up
            onUpload(res.data)
            onClose()
          } catch (err) {
            console.error("File upload error:", err)
            // optionally show error toast
          }
        }
  
    return (
      <Modal title="Upload File" onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center",
              dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300",
              selectedFile ? "bg-green-50" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <FileIcon fileType={selectedFile.type} />
                </div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-purple-600 hover:text-purple-800"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Download className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Drag and drop your file here, or{" "}
                  <label className="text-purple-600 hover:text-purple-800 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  Supports PDF, DOC, DOCX, JPG, PNG (max 10MB)
                </p>
              </div>
            )}
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
              disabled={!selectedFile}
              className={cn(
                "px-4 py-2 rounded-md",
                selectedFile
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              Upload
            </button>
          </div>
        </form>
      </Modal>
    )
  }