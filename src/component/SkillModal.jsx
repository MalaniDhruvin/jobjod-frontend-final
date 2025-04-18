"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

export const SkillModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditMode
}) => {
  const [formData, setFormData] = useState({
    name: "",
    level: "Beginner",
    rating: 1
  })

  useEffect(() => {
    if (initialData) {
      // Make sure we're not including the index in the form data
      const { index, ...rest } = initialData
      setFormData(rest)
    } else {
      setFormData({
        name: "",
        level: "Beginner",
        rating: 1
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = e => {
    e.preventDefault()
    onSave({
      name: formData.name,
      level: formData.level,
      rating: Number(formData.rating)
    })
  }

  const handleStarClick = rating => {
    setFormData({ ...formData, rating })
  }

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Skill" : "Add New Skill"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Skill Level
              </label>
              <select
                value={formData.level}
                onChange={e =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        formData.rating >= star
                          ? "text-purple-500 fill-purple-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {isEditMode ? "Save Changes" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
