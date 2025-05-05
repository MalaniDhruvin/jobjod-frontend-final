import { useState, useEffect } from "react";
import axios from "axios";
import dashboard from "../image/dashboard.png";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config";

export default function ProfileInfo({name}) {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const { id } = useParams();

  const UserId = id ? id : userId;

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null); // No dummy data
  const [formData, setFormData] = useState(null);
  const [newPerson, setNewPerson] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [pincodeError, setPincodeError] = useState(null);

  const phoneRegex = /^\+?(\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{4,6})$/;
  const pincodeRegex = /^\d{6}$/;

  const validatePhone = (phone) => {
    setPhoneError(!phoneRegex.test(phone) ? "Invalid phone number format." : null);
  };

  const validatePincode = (pincode) => {
    setPincodeError(!pincodeRegex.test(pincode) ? "Invalid pincode. Please enter a 6-digit number." : null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "phone") validatePhone(value);
    if (name === "pincode") validatePincode(value);
  };

  const handleAddPerson = () => {
    if (newPerson.trim()) {
      setFormData((prev) => ({
        ...prev,
        interviewerName: [...(prev.interviewerName || []), newPerson.trim()],
      }));
      setNewPerson("");
    }
  };

  const handleRemovePerson = (index) => {
    setFormData((prev) => {
      const updatedPersons = [...(prev.interviewerName || [])];
      updatedPersons.splice(index, 1);
      return {
        ...prev,
        interviewerName: updatedPersons,
      };
    });
  };

  const handleSave = async () => {
    if (!phoneError && !pincodeError) {
      try {
        const response = await axios.put(
          `${BASE_URL}/company/${userId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setProfileData(formData);
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/company/${UserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const data = response.data;
          const interviewerName = Array.isArray(data.interviewerName)
            ? data.interviewerName
            : [];

          const finalData = { ...data, interviewerName };
          setProfileData(finalData);
          name({name:finalData.companyName,location:finalData.location});
          setFormData(finalData);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!formData || !profileData) {
    return (
      <div className="w-full max-w-5xl mx-auto p-4 border border-gray-200 rounded-xl">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 border border-gray-200 rounded-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 relative">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full">
            <img
              src={dashboard || "/placeholder.svg"}
              alt="logo"
              className="rounded full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">Basic Information</h2>
            <p>Update profile</p>
          </div>
        </div>
        {isEditing ? (
          <div className="flex flex-wrap gap-2 self-end sm:self-auto">
            <button
              className="py-2 px-4 border border-gray-200 rounded-xl hover:bg-gray-100"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="py-2 px-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
              onClick={handleSave}
              disabled={phoneError || pincodeError}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            className="py-2 px-4 border border-purple-500 text-purple-500 rounded-xl hover:bg-purple-50 absolute right-4 top-4 sm:static mt-4"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {["email", "phone", "location", "yearEst", "website", "pincode"].map((field) => (
          <div key={field} className="space-y-2">
            <div className="text-sm font-medium text-gray-500">
              {field === "yearEst"
                ? "Year Established"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </div>
            {isEditing ? (
              <input
                type={field === "email" ? "email" : field === "pincode" ? "number" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            ) : (
              <div className="text-gray-700">{profileData[field]}</div>
            )}
            {field === "phone" && phoneError && (
              <div className="text-red-500">{phoneError}</div>
            )}
            {field === "pincode" && pincodeError && (
              <div className="text-red-500">{pincodeError}</div>
            )}
          </div>
        ))}

        <div className="space-y-2 md:col-span-2">
          <div className="text-sm font-medium text-gray-500">Interview Persons</div>
          <div className="flex flex-wrap gap-2">
            {(isEditing ? formData.interviewerName : profileData.interviewerName || []).map(
              (person, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 p-2 rounded-xl"
                >
                  {person.name || person}
                  {isEditing && (
                    <button
                      className="ml-2 text-purple-600 hover:text-purple-800"
                      onClick={() => handleRemovePerson(index)}
                    >
                      ×
                    </button>
                  )}
                </span>
              )
            )}
            {isEditing && (
              <div className="flex gap-2 items-center mt-2">
                <input
                  placeholder="Add person"
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  className="w-48 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  className="py-2 px-4 border rounded-xl border-gray-200 hover:bg-gray-100"
                  onClick={handleAddPerson}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
