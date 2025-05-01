import React, { useState } from "react";
import { Modal } from "./common/Modal";
import axios from "axios";
import { USER_BASE_URL } from "../config";

export const EducationModal = ({ education, onClose, onSave }) => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [formData, setFormData] = useState({
    school: education?.school || "",
    course: education?.course || "",
    specialization: education?.specialization || "",
    completionYear: education?.completionYear || "",
    description: education?.description || "",
    highestEducation: education?.highestEducation || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entry = {
      userId,
      highestEducation: formData.highestEducation,
      description: formData.description,
      collegeName: formData.school,
      degree:formData.course,
      specialization: formData.specialization,
      completionYear: formData.completionYear
    };

    try {
      let res;
      if (education) {
        // UPDATE
        res = await axios.put(
          `${USER_BASE_URL}/education/${education.id}`,
          entry,
          { headers: authHeaders }
        );
      } else {
        // CREATE
        res = await axios.post(
          `${USER_BASE_URL}/education`,
          { educationEntries: [entry] },
          { headers: authHeaders }
        );
      }

      const returned = Array.isArray(res.data) ? res.data[0] : res.data;
      const item = {
        id: returned.id.toString(),
        school: returned.collegeName,
        course: returned.degree,
        specialization: returned.specialization,
        completionYear: returned.completionYear,
        highestEducation: returned.highestEducation,
        description: returned.description || formData.description,
        logo: returned.logoUrl || formData.logo
      };

      onSave(item);
      onClose();
      window.location.reload(); // Refresh the page to reflect changes
    } catch (err) {
      console.error("Education save error:", err);
    }
  };
  

  return (
    <Modal
      title={education ? "Edit Education" : "Add Education"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
            Highest Education
          </label>
          <input
            type="text"
            id="school"
            name="highestEducation"
            value={formData.highestEducation}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. University of Technology"
          />
        </div>
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
            School/Institution
          </label>
          <input
            type="text"
            id="school"
            name="school"
            value={formData.school}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. University of Technology"
          />
        </div>

        <div>
          <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
            Course/Degree
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Bachelor of Engineering"
          />
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Computer Engineering"
          />
        </div>

        <div>
          <label htmlFor="completionYear" className="block text-sm font-medium text-gray-700 mb-1">
            Completion Year
          </label>
          <input
            type="text"
            id="completionYear"
            name="completionYear"
            value={formData.completionYear}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 2022"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="Describe your studies, achievements, etc..."
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
            {education ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
