import React, { useState, useEffect } from "react";
import profile from "../image/profile.jpg";
import ProfileContent from "./ProfileContent";
import profilebg from "../image/g.png";
import { ProfileHeader } from "../component/ProfileHeader";
import { ProfileSidebar } from "../component/ProfileSidebar";
import { ProfileInfo } from "../component/ProfileInfo";
import Jobseekerheader from "./Jobseekerheader";
import axios from "axios";
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

  const [activeTab, setActiveTab] = useState("Information");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/experiences/${userId}`,
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
          location: item.department || "Not specified", // Fallback if no location
          period: `${item.startDate} - ${item.endDate || "Present"}`,
          description: `Worked as a ${item.jobTitle} in ${item.department} department.`,
          logo: "/placeholder.svg?height=48&width=48", // Adjust if the backend provides a logo URL
        }));

        setExperiences(formattedData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };

    const fetchEducation = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/education/${userId}`,
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
          course: `${item.degree} in ${item.specialization}`,
          grade: "A+",
          period: `${item.completionYear}`,
          description: `Completed ${item.degree} in ${item.specialization} from ${item.collegeName} in ${item.completionYear}.`,
        }));

        setEducation(formattedData);
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    };
    const fetchSkills = async () => {
      try {
        const response = await axios.get(
          `${USER_BASE_URL}/skills/${userId}`,
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
            level: item.level,
            rating: item.rating,
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
          `${USER_BASE_URL}/attachments/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log the full response data to inspect the structure
        console.log("Fetched attachments:", response.data.attachment);

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
    {
      id: "file1",
      name: "Resume-AnamoulRouf.pdf",
      size: "2.4 MB",
      url: "#",
      type: "application/pdf",
    },
    {
      id: "file2",
      name: "CaseStudy-01.pdf",
      size: "1.8 MB",
      url: "#",
      type: "application/msword",
    },
    {
      id: "file3",
      name: "Certificate.jpg",
      size: "3.2 MB",
      url: "#",
      type: "image/jpeg",
    },
  ]);
  const [experiences, setExperiences] = useState([
    {
      id: "exp1",
      role: "Senior Frontend Developer",
      company: "Acme Corporation",
      location: "San Francisco, CA",
      period: "Jan 2020 - Present",
      description:
        "Led the development of the company's flagship product, improving performance by 40%. Mentored junior developers and implemented best practices for code quality and testing. Collaborated with design and product teams to deliver high-quality user experiences.",
      logo: "/placeholder.svg?height=48&width=48",
    },
    {
      id: "exp2",
      role: "Frontend Developer",
      company: "Tech Innovations",
      location: "Remote",
      period: "Mar 2018 - Dec 2019",
      description:
        "Developed responsive web applications using React and TypeScript. Implemented state management with Redux and integrated RESTful APIs.",
      logo: "/placeholder.svg?height=48&width=48",
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: "1",
      school: "University of Technology",
      course: "UX Design Fundamentals · UX Design",
      grade: "A+",
      period: "2020 - 2021",
      description:
        "This hands-on course examines how content is organized and structured to create an experience for a user, and what role the designer plays in creating and shaping user experience. You will be led through a...",
    },
    {
      id: "2",
      school: "University of Pennsylvania",
      course: "Gamification · Game and Interactive Media Design",
      grade: "A+",
      period: "2019 - 2020",
      description:
        "Gamification is the application of game elements and digital game design techniques to non-game problems, such as business and social impact challenges. This course will teach you the mechanisms of gamification...",
    },
  ]);

  const [skills, setSkills] = useState([
    {
      id: "skill1",
      name: "React",
      level: "Expert",
      rating: 5,
    },
    {
      id: "skill2",
      name: "TypeScript",
      level: "Advanced",
      rating: 4,
    },
    {
      id: "skill3",
      name: "Node.js",
      level: "Intermediate",
      rating: 3,
    },
    {
      id: "skill4",
      name: "GraphQL",
      level: "Intermediate",
      rating: 3,
    },
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

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
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

  const handleDeleteEducation = (id) => {
    setEducation(education.filter((edu) => edu.id !== id));
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

  const handleDeleteSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
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
    const attachment = attachments.find((file) => file.id === id);
    if (attachment) {
      // In a real app, you would trigger a download
      console.log(`Downloading ${attachment.name}`);
      const link = document.createElement("a");
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteAttachment = (id) => {
    setAttachments(attachments.filter((file) => file.id !== id));
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
