import { useState } from "react"
import { Modal } from "./common/Modal"

export const IndustryModal = ({ industry, onClose, onSave }) => {
  const [name, setName] = useState(industry?.name || "")

  const handleSubmit = e => {
    e.preventDefault()
    onSave({ id: industry?.id || Date.now().toString(), name })
  }

  return (
    <Modal
      title={industry ? "Edit Industry" : "Add Industry"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Industry Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Information Technology"
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
            {industry ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  )
}
