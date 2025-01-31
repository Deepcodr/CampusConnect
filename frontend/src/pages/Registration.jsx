import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    year: "First Year",
    division: "",
    prn: "",
    username: "",
    password: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch logged-in user data to check admin role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/me", {
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
    try {
      await axios.post("http://localhost:5000/api/register", userData, {
        withCredentials: true,
      });
      alert("User created successfully!");
      setUserData({
        name: "",
        email: "",
        year: "First Year",
        division: "",
        prn: "",
        username: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user.");
    }
  };

  if (!isAdmin) {
    return <p className="text-center text-red-500">Access Denied. Admins Only.</p>;
  }

  return (
    <div className="min-h-fit max-w-3xl mx-auto m-4 p-4 bg-white shadow-md rounded-lg text-stone-950">
      <h1 className="text-2xl font-bold mb-4">Register a New Student</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
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
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Year</label>
          <select
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.year}
            onChange={(e) => setUserData({ ...userData, year: e.target.value })}
          >
            <option>First Year</option>
            <option>Second Year</option>
            <option>Third Year</option>
            <option>Final Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Division</label>
          <input
            type="text"
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.division}
            onChange={(e) => setUserData({ ...userData, division: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">PRN</label>
          <input
            type="text"
            className="w-full bg-slate-50 p-2 border rounded"
            value={userData.prn}
            onChange={(e) => setUserData({ ...userData, prn: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full bg-slate-50 p-2 border rounded"
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
