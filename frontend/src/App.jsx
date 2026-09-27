import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import BrowseJobs from './pages/BrowseJobs'
import JobDetails from './pages/JobDetails'
import ApplyJob from './pages/ApplyJob'
import MyApplications from './pages/MyApplications'
import JobSeekerDashboard from './pages/jobseeker/JobSeekerDashboard'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import PostJob from './pages/recruiter/PostJob'
import ApplicationDetails from './pages/recruiter/ApplicationDetails'
import EditJob from './pages/recruiter/EditJob'
import Companies from './pages/Companies'
import About from './pages/About'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<ApplyJob />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/post-job" element={<PostJob />} />
        <Route path="/recruiter/applications/:id" element={<ApplicationDetails />} />
        <Route path="/recruiter/jobs/:id/edit" element={<EditJob />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App