import { useRef, useState } from "react"
import { X } from "lucide-react"

const RightSidebar = () =>  {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      console.log("Selected file:", file)
      // Here you could upload the file to your server
    }
  }

  return (
    <aside className="w-full lg:w-1/4 space-y-6 mt-12">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Email me for jobs</h3>
        <p className="text-sm text-gray-700">
          Get the latest job news and articles sent to your inbox weekly.
        </p>
        <input
          type="email"
          placeholder="name@email.com"
          className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="w-full mt-4 rounded-3xl py-2 bg-purple-500 hover:bg-purple-600 transition text-white">
          Subscribe
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="font-semibold text-lg mb-4">Get noticed faster</h3>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        {/* Upload Button */}
        <button
          className="w-full py-2 rounded-3xl bg-purple-500 hover:bg-purple-600 transition text-white"
          onClick={triggerFileInput}
        >
          Upload your resume
        </button>

        {/* Show selected file name */}
        {selectedFile && (
          <div className="mt-3 text-sm text-gray-700 flex items-center">
            <span className="truncate">{selectedFile.name}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => setSelectedFile(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default RightSidebar;