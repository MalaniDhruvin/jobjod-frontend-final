import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, X } from "lucide-react";
import { USER_BASE_URL } from "../config";

export default function JobPreference() {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const [preferences, setPreferences] = useState([]);
  const [editingPreference, setEditingPreference] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  // Fetch preferences from API
  const fetchPreferences = async () => {
    try {
      const response = await axios.get(
        `${USER_BASE_URL}/preferences/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  // Handle edit click for a specific field
  const handleEdit = (id, field, label) => {
    const preferenceToEdit = preferences.find((pref) => pref.id === id);
    setEditingPreference({ ...preferenceToEdit, field, label });
    setTempValue(preferenceToEdit[field] || "");
    setIsModalOpen(true);
  };

  // Save the changes to the field being edited
  const handleSave = async () => {
    if (editingPreference) {
      try {
        const { id, field } = editingPreference;
        const updatedPreference = { [field]: tempValue };

        await axios.put(
          `${USER_BASE_URL}/preferences/${id}`,
          updatedPreference,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPreferences((prev) =>
          prev.map((pref) =>
            pref.id === id ? { ...pref, [field]: tempValue } : pref
          )
        );
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error updating preference:", error);
      }
    }
  };

  // Handle delete field (clear value for specific field)
  const handleDelete = async (id, field) => {
    // console.log("Deleting preference:", id, field);
    try {
           await axios.delete(
             `${USER_BASE_URL}/preferences/${id}`,
             {
               headers: { Authorization: `Bearer ${token}` },
               data: { field }    // send { field: "location" } etc.
             }
           );

      setPreferences((prev) =>
        prev.map((pref) =>
          pref.id === id ? { ...pref, [field]: "" } : pref
        )
      );
    } catch (error) {
      console.error("Error deleting preference:", error);
    }
  };

  return (
    <div className="border rounded-xl border-gray-200 p-6 mt-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Preference</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {preferences.map((preference) => (
          <div
            key={preference.id + "-employment"}
            className="border rounded-xl border-gray-200 p-4 bg-white shadow-sm"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">
                Employment Type:
              </label>
              <div className="flex justify-between items-center">
                <span className="text-gray-800">
                  {preference.employmentType || "Not specified"}
                </span>
                <div className="flex space-x-1">
                  <button
                    className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => handleDelete(preference.id, "employmentType")}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>

                  <button
                    className="h-8 w-8 rounded-md bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
                    onClick={() => handleEdit(preference.id, "employmentType", "Employment Type")}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-violet-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {preferences.map((preference) => (
          <div
            key={preference.id + "-location"}
            className="border rounded-xl border-gray-200 p-4 bg-white shadow-sm"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">
                Location:
              </label>
              <div className="flex justify-between items-center">
                <span className="text-gray-800">
                  {preference.location || "Not specified"}
                </span>
                <div className="flex space-x-1">
                  <button
                    className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => handleDelete(preference.id, "location")}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>

                  <button
                    className="h-8 w-8 rounded-md bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
                    onClick={() => handleEdit(preference.id, "location", "Location")}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-violet-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {preferences.map((preference) => (
          <div
            key={preference.id + "-shift"}
            className="border rounded-xl border-gray-200 p-4 bg-white shadow-sm"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">
                Shift:
              </label>
              <div className="flex justify-between items-center">
                <span className="text-gray-800">
                  {preference.shift || "Not specified"}
                </span>
                <div className="flex space-x-1">
                  <button
                    className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => handleDelete(preference.id, "shift")}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>

                  <button
                    className="h-8 w-8 rounded-md bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
                    onClick={() => handleEdit(preference.id, "shift", "Shift")}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-violet-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {preferences.map((preference) => (
          <div
            key={preference.id + "-workplace"}
            className="border rounded-xl border-gray-200 p-4 bg-white shadow-sm"
          >
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-500 mb-1">
                Workplace:
              </label>
              <div className="flex justify-between items-center">
                <span className="text-gray-800">
                  {preference.workplace || "Not specified"}
                </span>
                <div className="flex space-x-1">
                  <button
                    className="h-8 w-8 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    onClick={() => handleDelete(preference.id, "workplace")}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </button>

                  <button
                    className="h-8 w-8 rounded-md bg-violet-100 hover:bg-violet-200 flex items-center justify-center transition-colors"
                    onClick={() => handleEdit(preference.id, "workplace", "Workplace")}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-violet-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">
                Edit {editingPreference?.label}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {editingPreference?.type === "select" ? (
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                >
                  {editingPreference.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder={`Enter ${editingPreference?.label}`}
                />
              )}
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-violet-600 rounded-md hover:bg-violet-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
