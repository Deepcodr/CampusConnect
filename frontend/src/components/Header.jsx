import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GraduationCap } from "lucide-react"

function Header() {
  const [user, setUser] = useState(null); // Stores user data
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  // Fetch the logged-in user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/me`, {
          withCredentials: true, // Include session cookies
        });
        // const [firstname, lastname] = response.data.user.name.split(" ");
        // const generatedImageUrl = `https://ui-avatars.com/api/?name=${firstname}+${lastname}`;
        setProfileImage(`/userprofile.svg`);

        setUser(response.data.user);


      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/logout`, {}, { withCredentials: true });
      setUser(null); // Clear user state
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
            {/* <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link to="/feedbacks" className="text-gray-600 hover:text-blue-600">
                Feedback
              </Link>
            </li> */}
            {/* Student Links */}
            {user ? ((user.role === "STUDENT") && (
              <>
                <li><Link to="/jobs" className="text-gray-600 hover:text-blue-600">Jobs</Link></li>
                <li><Link to="/myapplications" className="text-gray-600 hover:text-blue-600">Applications</Link></li>
                <li>
                  <Link to="/feedbacks" className="text-gray-600 hover:text-blue-600">
                    Feedback
                  </Link>
                </li>
                {user.placedStatus ?
                  <li>
                    <Link to="/feedback" className="text-gray-600 hover:text-blue-600">Add Feedback</Link>
                  </li>
                  : ""
                }
              </>
            )) : <></>
            }

            {/* Admin Links */}
            {user ? (user.role === "ADMIN" && (
              <>
                <li>
                  <Link to="/registration" className="text-gray-600 hover:text-blue-600">Register Student</Link>
                </li>
                <li>
                  <Link to="/adminjobs" className="text-gray-600 hover:text-blue-600">Jobs</Link>
                </li>
                <li>
                  <Link to="/jobPost" className="text-gray-600 hover:text-blue-600">Post Job</Link>
                </li>
                <li>
                  <Link to="/students" className="text-gray-600 hover:text-blue-600">Students</Link>
                </li>
                <li>
                  <Link to="/feedbacks" className="text-gray-600 hover:text-blue-600">
                    Feedback
                  </Link>
                </li>
              </>
            )) : <></>}

            <div className="relative">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Profile Image */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={profileImage || ""} // Use a placeholder if no profile image
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block bg-white w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-600 hover:text-white"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/login"
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-600 hover:text-white"
                  >
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

