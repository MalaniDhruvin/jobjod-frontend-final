import { useState } from "react";
import { Modal } from "./common/Modal";

export const CultureModal = ({ culture, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: culture?.title || "",
    content: culture?.content || "",
  });
  // console.log("formData", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: culture?.id || Date.now().toString(), ...formData });
  };

  return (
    <Modal title={culture ? "Edit culture" : "Add culture"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            culture Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Company Environment"
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
            placeholder="culture content..."
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
            {culture ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
