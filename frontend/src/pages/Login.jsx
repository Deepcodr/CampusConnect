import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const prnRegex = /^\d{2}UG(CS|ET|CH|ME|CE)\d{5}$/g;
  const emailReg= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if(!validateLogin())
    {
      return;
    }

    try {
      // Send login data to the backend
      await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/api/login`,
        formData,
        { withCredentials: true } // Include cookies in the request
      );
      sessionStorage.setItem("showLoginToast", "true");
      window.location.href = "/profile";
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  function validateLogin() {
    var username = document.getElementById("username").value;

    if (!prnRegex.exec(username) && !emailReg.exec(username)) {
      alert("Enter Valid Username");
      return false;
    }
    else {
      return true;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-stone-950  ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
