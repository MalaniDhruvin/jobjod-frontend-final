import { AlertTriangle } from "lucide-react"
import { Modal } from "./common/Modal"

export const DeleteConfirmModal = ({ document, onClose, onConfirm }) => {
  return (
    <Modal title="Confirm Deletion" onClose={onClose}>
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        <h3 className="text-lg font-medium mb-2">Delete Document</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "{document.name}"? This action cannot
          be undone.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  )
}
