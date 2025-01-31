import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Jobs from "./pages/Jobs"
import Companies from "./pages/Companies"
import About from "./pages/About"
import LoginPage from "./pages/Login"
import JobPost from "./pages/JobPost"
import Registration from "./pages/Registration"
import Profile from "./pages/Profile"
import JobApply from "./pages/JobApply"
import AdminJobs from "./pages/AdminJobs"
import JobApplications from "./pages/JobApplications"
import MyApplications from "./pages/MyApplications"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen h-[100vh] w-[100vw] bg-gray-100 text-stone-950">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/adminjobs" element={<AdminJobs />} />
            <Route path="/jobapplicants/:jobId" element={<JobApplications />} />
            <Route path="/myapplications" element={< MyApplications />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/jobpost" element={<JobPost />} />
            <Route path="/apply/:jobId" element={<JobApply />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

