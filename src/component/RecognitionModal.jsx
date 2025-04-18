"use client";

import { useState } from "react";
import axios from "axios";
import { Modal } from "./common/Modal";
import { BASE_URL } from "../config";

export const RecognitionModal = ({ recognition, onClose, onSave }) => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    userId: userId,
    title: recognition?.title || "",
    from: recognition?.from || "",
    achievementDate: recognition?.achievementDate || "",
    description: recognition?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);
    // const recognitionEntries = { ...formData };
    // console.log(recognitionEntries);

    let response;
    try {
      if (recognition) {
        response = await axios.put(
          `${BASE_URL}/recognition/${recognition.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/recognition/single`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log(response.data);
      onSave({
        ...response.data,
      });
      onClose();
    } catch (error) {
      console.error("Error saving recognition:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={recognition ? "Edit Recognition" : "Add Recognition"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="from"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From
          </label>
          <input
            type="text"
            id="from"
            name="from"
            value={formData.from}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="e.g. California Institute of the Arts"
          />
        </div>

        <div>
          <label
            htmlFor="achievementDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Achievement Date
          </label>
          <input
            type="date"
            id="achievementDate"
            name="achievementDate"
            value={formData.achievementDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="2020-01-19"
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            placeholder="Institute of Arts, California"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="Describe the recognition..."
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
            disabled={loading}
          >
            {loading ? "Saving..." : recognition ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
