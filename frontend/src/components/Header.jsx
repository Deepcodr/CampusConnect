// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const Header = () => {


//   return (
//     <header className="flex items-center justify-between px-4 py-3 bg-white text-white">
//       {/* Logo */}
//       <Link to="/" className="text-xl font-bold">
//         CampusPlacement
//       </Link>

//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { Link } from "react-router-dom"
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
        const response = await axios.get("http://localhost:5000/api/me", {
          withCredentials: true, // Include session cookies
        });
        const [firstname, lastname] = response.data.user.name.split(" ");
        const generatedImageUrl = `https://ui-avatars.com/api/?name=${firstname}+${lastname}`;
        setProfileImage(generatedImageUrl);

        setUser(response.data.user);


      } catch (error) {
        console.log(error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
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
                        {/* Student Links */}
                        {user.role === "STUDENT" && (
                          <>
                            <Link to="/jobs" className="block px-4 py-2 hover:bg-gray-200">Jobs</Link>
                            <Link to="/myapplications" className="block px-4 py-2 hover:bg-gray-200">My Applications</Link>
                            {user.placedStatus ? 
                            <Link to="/feedback" className="block px-4 py-2 hover:bg-gray-200">Feedback</Link> 
                            : "" 
                          }
                          </>
                        )}

                        {/* Admin Links */}
                        {user.role === "ADMIN" && (
                          <>
                            <Link to="/registration" className="block px-4 py-2 hover:bg-gray-200">Register Student</Link>
                            <Link to="/adminjobs" className="block px-4 py-2 hover:bg-gray-200">Jobs</Link>
                            <Link to="/jobPost" className="block px-4 py-2 hover:bg-gray-200">Post a Job</Link>
                            <Link to="/students" className="block px-4 py-2 hover:bg-gray-200">Students</Link>
                          </>
                        )}
                        {/* <Link
                          to="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link> */}
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
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Login
                </Link>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

