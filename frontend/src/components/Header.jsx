import React from "react"
import { Link } from "react-router-dom"
import { GraduationCap } from "lucide-react"

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
          <GraduationCap size={24} />
          <span>CampusConnect</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600">
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/companies" className="text-gray-600 hover:text-blue-600">
                Companies
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/jobPost" className="text-gray-600 hover:text-blue-600">
                Post Job
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login/Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

