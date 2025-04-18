import { Modal } from "./common/Modal"
import { FileText } from "lucide-react"

export const ViewDocumentModal = ({ document, onClose }) => {
  // In a real application, you would display the actual document here
  // For this example, we'll just show document information

  return (
    <Modal title={`View ${document.name}`} onClose={onClose}>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>

        <h3 className="text-xl font-medium mb-2">{document.name}</h3>
        <p className="text-gray-500 mb-6">{document.fileInfo}</p>

        {document.fileData ? (
          <p className="text-sm text-gray-600 mb-4">
            File name: {document.fileData.name}
          </p>
        ) : (
          <p className="text-sm text-gray-600 mb-4">
            Document preview not available
          </p>
        )}

        <div className="w-full bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Document preview would appear here</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
