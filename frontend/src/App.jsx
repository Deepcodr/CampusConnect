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

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen h-[100vh] w-[100vw]">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/jobpost" element={<JobPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

