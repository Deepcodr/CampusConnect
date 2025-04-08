import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const textReg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const prnRegex = /^\d{2}UG(CS|ET|CH|ME|CE)\d{5}$/;
  const divRegex = /^[A-Z]$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,12}$/;

  const [userData, setUserData] = useState({
    // name: "",
    // email: "",
    username: "",
    password: "",
    // prn: "",
    // division: "",
    // year: "First Year",
    // branch: ""
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch logged-in user data to check admin role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/me`, {
          withCredentials: true, // Include session cookies
        });
        if (response.data.user.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login"); // Redirect to login if unauthorized
      }
    };
    fetchUser();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validateRegistration())
    {
      return;
    }
    
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/register`, userData, {
        withCredentials: true,
      });
      alert("User created successfully!");
      setUserData({
        // name: "",
        // email: "",
        username: "",
        password: "",
        // prn: "",
        // division: "",
        // year: "First Year",
        // branch: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user.");
    }
  };

  function validateRegistration() {
    // if(!textReg.exec(userData.name))
    // {
    //   alert("Enter a valid name");
    //   return false;
    // }

    // if(!divRegex.exec(userData.division))
    // {
    //   alert("Enter a valid division");
    //   return false;
    // }

    // if (!emailReg.exec(userData.email)) {
    //   alert("Enter valid  email");
    //   return false;
    // }

    // if(userData.prn!=userData.username)
    // {
    //   alert("Username should be same as PRN");
    //   return false;
    // }

    // if(!years.includes(userData.year))
    // {
    //   alert("Select a valid year");
    //   return false;
    // }

    // if(!branches.includes(userData.branch))
    // {
    //   alert("Select a valid branch");
    //   return false;
    // }

    // if(!prnRegex.exec(userData.prn))
    // {
    //   alert("Enter valid PRN");
    //   return false;
    // }

    if (!prnRegex.exec(userData.username)) {
      alert("Enter Valid Username");
      return false;
    }

    if(!passwordRegex.exec(userData.password))
    {
      alert("Enter a valid password\npassword must contain following pattern\nshould have 8 to 12 characters\nmust be alphanumeric \nmust contain one uppercase , one lowercase character\nmust contain one digit \nmust contain one special symbol")
      return false;
    }

    return true;
  }

  if (!isAdmin) {
    return <p className="text-center text-red-500">Access Denied. Admins Only.</p>;
  }

  return (
    <div className="min-h-max max-w-3xl mx-auto m-4 p-4 bg-white shadow-md rounded-lg text-stone-950">
      <h1 className="text-2xl font-bold mb-4">Register a New Student</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="name"
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">PRN</label>
          <input
            type="text"
            id="prn"
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.prn}
            onChange={(e) => setUserData({ ...userData, prn: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Year</label>
          <select
            className="w-full bg-slate-50 p-2 border rounded"
            // value={userData.year}
            defaultValue="Select Year"
            onChange={(e) => setUserData({ ...userData, year: e.target.value })}
          >
            <option disabled>Select Year</option>
            <option>First Year</option>
            <option>Second Year</option>
            <option>Third Year</option>
            <option>Final Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Branch</label>
          <select
            className="w-full bg-slate-50 p-2 border rounded"
            // value={userData.branch}
            defaultValue="Select Branch"
            onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
          >
            <option disabled>Select Branch</option>
            <option>CSE</option>
            <option>ENTC</option>
            <option>CHEM</option>
            <option>MECH</option>
            <option>CIVIL</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Division</label>
          <input
            type="text"
            className="w-full bg-slate-50 p-2 border rounded"
            id="division"
            value={userData.division}
            onChange={(e) => setUserData({ ...userData, division: e.target.value })}
            required
          />
        </div> */}
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full bg-slate-50 p-2 border rounded"
            id="username"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full bg-slate-50 p-2 border rounded"
            id="password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Registration;
