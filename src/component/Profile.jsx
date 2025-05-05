import React, { useState, useEffect } from "react";
import profile from "../image/profile.jpg";
import ProfileContent from "./ProfileContent";
import profilebg from "../image/g.png";
import { ProfileHeader } from "../component/ProfileHeader";
import { ProfileSidebar } from "../component/ProfileSidebar";
import { ProfileInfo } from "../component/ProfileInfo";
import Jobseekerheader from "./Jobseekerheader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { USER_BASE_URL } from "../config";

const profileData = {
  name: "Anamoul Rouf",
  role: "Product Designer",
  email: "anamoulrouf.bd@gmail.com",
  gender: "Male",
  phone: "+919988776655",
  location: "New York, USA",
  website: "www.jobjod.com",
  avatarUrl: "/placeholder.svg?height=96&width=96",
};

const Profile = () => {
  const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
  const userId = localStorage.getItem("userId");
  const { id: paramUserId } = useParams();

  const UserId = paramUserId ? paramUserId : userId;

  const [activeTab, setActiveTab] = useState("Information");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/experiences/${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Transform backend data to match frontend state
        const formattedData = response.data.map((item) => ({
          id: item.id.toString(),
          role: item.jobTitle,
          company: item.companyName,
          department: item.department || "Not specified", // Fallback if no location
          period: `${item.startDate} - ${item.endDate || "Present"}`,
          industry: item.industry || "Not specified", // Fallback if no location
          employmentType: item.employmentType || "Not specified",
          salary: item.salary || "Not specified", // Fallback if no location
          description: ` ${item.description?item.description:"Not specified"}`,
          
        }));

        setExperiences(formattedData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    const fetchEducation = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/education/${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Format the data to match frontend requirements
        const formattedData = response.data.map((item) => ({
          id: item.id.toString(),
          school: item.collegeName,
          course: `${item.degree}`,
          specialization: `${item.specialization}`,
          completionYear: `${item.completionYear}`,
          description: `${item.description?item.description:"Not specified"}`,
          highestEducation: `${item.highestEducation}`,
        }));

        setEducation(formattedData);
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    };
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/skills/${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log(response.data.data);

        const formattedData = response.data.data.map((item) =>
          // console.log(item),
          ({
            id: item.id.toString(),
            name: item.skill,
            level: item.level? item.level : "not specified",
            rating: item.rating ? item.rating : "not specified",
          })
        );
        // console.log(formattedData);
        setSkills(formattedData);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    // Fetch the attachment for the user
    const fetchAttachment = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/attachments/${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log the full response data to inspect the structure
        // console.log("Fetched attachments:", response.data.attachment);

        // Assuming the backend response is an array of attachments
        const attachments = response.data.attachment; // Adjust based on the actual response structure
        if (Array.isArray(attachments)) {
          setAttachments(attachments); // Update state with the fetched attachments
        } else {
          // If only one attachment is returned, ensure it is an array
          setAttachments([attachments]);
        }
      } catch (error) {
        console.error("Error fetching attachment:", error);
      }
    };

    fetchExperiences();
    fetchEducation();
    fetchSkills();
    fetchAttachment();
  }, []);

  const [attachments, setAttachments] = useState([
  ]);
  const [experiences, setExperiences] = useState([
  ]);

  const [education, setEducation] = useState([
  ]);

  const [skills, setSkills] = useState([
  ]);

  // Handler functions for experiences
  const handleAddExperience = (experience) => {
    const newExperience = {
      id: `exp${Date.now()}`,
      ...experience,
    };
    setExperiences([newExperience, ...experiences]);
  };

  const handleEditExperience = (id, updatedExperience) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExperience } : exp
      )
    );
  };

  const handleDeleteExperience = async(id) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const authHeaders = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(
        `${USER_BASE_URL}/experiences/${id}`,
        { headers: authHeaders }
      );
      window.location.reload(); 
    } catch (err) {
      console.error("Experience delete error:", err);
    }
  };

  // Handler functions for education
  const handleAddEducation = (education) => {
    const newEducation = {
      id: `edu${Date.now()}`,
      ...education,
    };
    setEducation((prev) => [newEducation, ...prev]);
  };

  const handleEditEducation = (id, updatedEducation) => {
    console.log(education, id, updatedEducation);
    setEducation(
      education.map((edu) =>
        edu.id === id ? { ...edu, ...updatedEducation } : edu
      )
    );
  };

  const handleDeleteEducation = async(id) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const authHeaders = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(
        `${USER_BASE_URL}/education/${id}`,
        { headers: authHeaders }
      );
      window.location.reload(); 
    } catch (err) {
      console.error("Education delete error:", err);
    }
  };

  // Handler functions for skills
  const handleAddSkill = (skill) => {
    const newSkill = {
      id: `skill${Date.now()}`,
      ...skill,
    };
    setSkills([...skills, newSkill]);
  };

  const handleEditSkill = (id, updatedSkill) => {
    setSkills(
      skills.map((skill) =>
        skill.id === id ? { ...skill, ...updatedSkill } : skill
      )
    );
  };

  const handleDeleteSkill = async(id) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const authHeaders = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(
        `${USER_BASE_URL}/skills/${id}`,
        { headers: authHeaders }
      );
      window.location.reload(); 
    } catch (err) {
      console.error("Education delete error:", err);
    }
  };

  // Handler functions for attachments
  const handleAddFile = (file) => {
    const newAttachment = {
      id: `file${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: "#", // In a real app, you would upload the file and get a URL
      type: file.type,
    };
    setAttachments([...attachments, newAttachment]);
  };

  const handleViewAttachment = (id) => {
    const attachment = attachments.find((file) => file.id === id);
    if (attachment) {
      // In a real app, you would open the file in a new tab or modal
      console.log(`Viewing ${attachment.name}`);
      window.open(attachment.url, "_blank");
    }
  };

  const handleDownloadAttachment = (id) => {
    let downloadUrl = "";
    const attachment = attachments.find((file) => file.id === id);
    if (attachment) {
      // In a real app, you would trigger a download
      console.log(`Downloading ${attachment.fileName}`);
      downloadUrl = `${USER_BASE_URL}/attachments/${id}/download`;
    
        const filename = attachment.name || attachment.fileName || "download";
        console.log(`Downloading ${filename} from ${downloadUrl}`);
      
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
       };
  };

  const handleDeleteAttachment = async(id) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const authHeaders = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(
        `${USER_BASE_URL}/attachments/resume/${id}`,
        { headers: authHeaders }
      );
      window.location.reload(); 
    } catch (err) {
      console.error("Education delete error:", err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <div className="">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar} className="p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> */}
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <Jobseekerheader isSidebarVisible={isSidebarVisible} />

        <div className="flex  w-full  ">
          <div className="flex-1 w-full p-3 lg:ml-64">
            {/* Header Illustration */}
            <div className="relative bg-white overflow-hidden">
              <img
                src={profilebg}
                alt="Profile Background"
                className="h-2 sm:h-32 md:h-80 lg:w-[80%]  md:w-[80%] w-100 mx-auto hidden lg:block"
              />
            </div>

            <div className="min-h-screen  p-0 md:p-8">
              <div className="max-w-7xl mx-auto">
                <ProfileHeader
                  name={profile.name}
                  role={profile.role}
                  avatarUrl="/placeholder.svg?height=96&width=96"
                />

                <div className="flex flex-col lg:flex-row gap-6">
                  <ProfileSidebar
                    name={profile.name}
                    role={profile.role}
                    avatarUrl="/placeholder.svg?height=96&width=96"
                  />

                  <div className="flex-1">
                    {activeTab === "Information" && (
                      <ProfileInfo
                        profile={profile}
                        onEdit={() => console.log("Edit clicked")}
                      />
                    )}
                    {activeTab === "Experiences" && (
                      <ProfileContent experiences={experiences} />
                    )}
                    {activeTab === "Education" && (
                      <ProfileContent education={education} />
                    )}
                    {activeTab === "Skills" && (
                      <ProfileContent skills={skills} />
                    )}
                    {activeTab === "Attachments" && (
                      <ProfileContent attachments={attachments} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-5  ">
                  <ProfileContent
                    experiences={experiences}
                    education={education}
                    skills={skills}
                    attachments={attachments}
                    onAddExperience={handleAddExperience}
                    onEditExperience={handleEditExperience}
                    onDeleteExperience={handleDeleteExperience}
                    onAddEducation={handleAddEducation}
                    onEditEducation={handleEditEducation}
                    onDeleteEducation={handleDeleteEducation}
                    onAddSkill={handleAddSkill}
                    onEditSkill={handleEditSkill}
                    onDeleteSkill={handleDeleteSkill}
                    onAddFile={handleAddFile}
                    onViewAttachment={handleViewAttachment}
                    onDownloadAttachment={handleDownloadAttachment}
                    onDeleteAttachment={handleDeleteAttachment}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
