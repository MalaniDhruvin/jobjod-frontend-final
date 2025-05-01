import React, { useState } from "react";
import { Modal } from "./common/Modal";
import axios from "axios";
import { USER_BASE_URL } from "../config";

export const ExperienceModal = ({ experience, onClose, onSave }) => {
  const token     = localStorage.getItem("authToken");
  const userId    = localStorage.getItem("userId");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [formData, setFormData] = useState({
    role:        experience?.role || "",
    company:     experience?.company || "",
    department:    experience?.department || "",
    period:      experience?.period || "",
    description: experience?.description || "",
    industry: experience?.industry || "",
    employmentType: experience?.employmentType || "",
    salary: experience?.salary || "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // split period into start/end
    const parts = formData.period
  .split(/\s*[-–—]\s*/)
  .map((s) => s.trim());

// 2. pick out start & end
const startDate = parts[0];
let endDate = parts[1] || "";  // no redeclaration error

// 3. collapse if they’re identical or endDate is empty
if (!endDate || startDate.toLowerCase() === endDate.toLowerCase()) {
  endDate = "";
}

    // build the single-entry object
    const entry = {
      userId,
      jobTitle:    formData.role,
      companyName: formData.company,
      department:  formData.department,
      industry:    formData.industry,
      employmentType: formData.employmentType,
      salary:      formData.salary,
      startDate,
      endDate,
      description: formData.description,
    };

    try {
      let res;
      if (experience) {
        // EDIT: send single object
        res = await axios.put(
          `${USER_BASE_URL}/experiences/${experience.id}`,
          entry,
          { headers: authHeaders }
        );
      } else {
        // ADD: wrap in array under `experienceEntries`
        res = await axios.post(
          `${USER_BASE_URL}/experiences`,
          { experienceEntries: [entry] },
          { headers: authHeaders }
        );
      }

      // backend returns the created/updated record(s)
      const returned = Array.isArray(res.data) ? res.data[0] : res.data;
      const item = {
        id:          returned.id.toString(),
        role:        returned.jobTitle,
        company:     returned.companyName,
        location:    returned.department,
        period:      `${returned.startDate} - ${returned.endDate || "Present"}`,
        description: returned.description,
        logo:        returned.logoUrl
      };

      onSave(item);
      onClose();

      window.location.reload(); // reload the page to see the changes
    } catch (err) {
      console.error("Experience save error:", err);
      // e.g. show a toast here
    }
  };

  return (
    <Modal
      title={experience ? "Edit Experience" : "Add Experience"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <input
            type="text"
            id="role" name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Frontend Developer"
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            id="company" name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Acme Inc."
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            id="location" name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Engineering"
          />
        </div>

        {/* Period */}
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            id="period" name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Software Development"
          />
        </div>
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <input
            type="text"
            id="period" name="period"
            value={formData.period}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. Jan 2020 - Present"
          />
        </div>
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            employmentType
          </label>
          <input
            type="text"
            id="period" name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. full-time, part-time, internship"
          />
        </div>
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Salary
          </label>
          <input
            type="text"
            id="period" name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 5 LPA"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description" name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>

        {/* Actions */}
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
            {experience ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
