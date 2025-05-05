import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./component/LoginPage";
import AdminLogin from "./component/SuperAdmin/AdminLogin";
// import Signup from "./component/Signup";
import CompanyDashboard from "./component/CompanyDashboard";
import Jobseeker from "./component/Jobseeker";
import Job from "./component/Job";
import Profile from "./component/Profile";
import Message from "./component/Message";
import MessageView from "./component/MessageView";
import Home from "./component/Home";
import JobListingPage from "./component/JobListingPage";
import JobseekersSubSection from "./component/JobseekersSubSection";
import Singlejobview from "./component/Singlejobview";
import CompanyApplications from "./component/CompanyApplications";
import CompanyProfile from "./component/CompanyProfile";
import CompanyPostJobs from "./component/CompanyPostJobs";
import FormJobseeker from "./component/FormJobseeker";
import FormJobseeker2 from "./component/FormJobseeker2";
import FormJobseeker3 from "./component/FormJobseeker3";
import FormJobseeker4 from "./component/FormJobseeker4";
import FormJobseeker5 from "./component/FormJobseeker5";
import FormJobseeker6 from "./component/FormJobseeker6";
import FormJobseeker7 from "./component/FormJobseeker7";
import FormCompany from "./component/FormCompany";
import FormCompany2 from "./component/FormCompany2";
import FormCompany3 from "./component/FormCompany3";
import FormCompany4 from "./component/FormCompany4";
import FormCompany5 from "./component/FormCompany5";
import FormCompany6 from "./component/FormCompany6";
import JobPostModal from "./component/JobPostModal";
import AdminDashboard from "./component/SuperAdmin/AdminDashboard";
import Jobs from "./component/SuperAdmin/Jobs";
import AdminJobseeker from "./component/SuperAdmin/AdminJobseeker";
import AdminCompanies from "./component/SuperAdmin/AdminCompanies";
import Login_Signin from "./component/Login_Signin";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login_Signin" element={<Login_Signin />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          {/* <Route path="/Signup" element={<Signup  />} />  */}
          <Route path="/Jobseeker" element={<Jobseeker />} />
          <Route path="/Job" element={<Job />} />
          <Route path="/Job/:id" element={<Job />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="/Message" element={<Message />} />
          <Route path="/Message/:id" element={<Message />} />
          <Route path="/messageView/:id" element={<MessageView />} />
          <Route path="/Singlejobview/:jobId" element={<Singlejobview />} />
          <Route path="/JobListingPage" element={<JobListingPage />} />
          <Route
            path="/browsecompany"
            element={<JobListingPage isBrowseCompany />}
          />
          <Route
            path="/JobseekersSubSection"
            element={<JobseekersSubSection />}
          />
          <Route path="/CompanyDashboard" element={<CompanyDashboard />} />
          <Route
            path="/CompanyApplications"
            element={<CompanyApplications />}
          />
          <Route
            path="/CompanyApplications/:jobId"
            element={<CompanyApplications />}
          />
          <Route path="/CompanyProfile" element={<CompanyProfile />} />
          <Route path="/CompanyProfile/:id" element={<CompanyProfile />} />
          <Route path="/CompanyPostJobs" element={<CompanyPostJobs />} />
          <Route path="/CompanyPostJobs/:id" element={<CompanyPostJobs />} />
          <Route path="/FormJobseeker" element={<FormJobseeker />} />
          <Route path="/FormJobseeker2" element={<FormJobseeker2 />} />
          <Route path="/FormJobseeker3" element={<FormJobseeker3 />} />
          <Route path="/FormJobseeker4" element={<FormJobseeker4 />} />
          <Route path="/FormJobseeker5" element={<FormJobseeker5 />} />
          <Route path="/FormJobseeker6" element={<FormJobseeker6 />} />
          <Route path="/FormJobseeker7" element={<FormJobseeker7 />} />
          <Route path="/FormCompany" element={<FormCompany />} />
          <Route path="/FormCompany2" element={<FormCompany2 />} />
          <Route path="/FormCompany3" element={<FormCompany3 />} />
          <Route path="/FormCompany4" element={<FormCompany4 />} />
          <Route path="/FormCompany5" element={<FormCompany5 />} />
          <Route path="/FormCompany6" element={<FormCompany6 />} />
          <Route path="/JobPostModal" element={<JobPostModal />} />
          {/* Super Admin Routing  */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/Jobs" element={<Jobs />} />
          <Route path="/AdminJobseeker" element={<AdminJobseeker />} />
          <Route path="/AdminCompanies" element={<AdminCompanies />} />

          {/* <Route path="/RightSidebar" element={<RightSidebar />}/>} */}
        </Routes>
        {/* <Footer/> */}
      </Router>
    </>
  );
}

export default App;
