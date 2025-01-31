import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [profileImage, setProfileImage] = useState("");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/me", {
          withCredentials: true, // Include session cookies
        });
        const [firstname, lastname] = response.data.user.name.split(" ");
        const generatedImageUrl = `https://ui-avatars.com/api/?name=${firstname}+${lastname}`;
        setProfileImage(generatedImageUrl);
        console.log(response);
        setUser(response.data.user); // Set user data
        

      } catch (err) {
        console.log(err);
        setError("Failed to fetch user data. Please log in.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
        <br />
        <a href="/login" className="text-blue-500 underline">
          Log in here
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-stone-950">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img
            src={profileImage || "https://avatar.iran.liara.run/public"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">{user.name}</h1>
        <div className="text-gray-700">
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="mb-2">
            <strong>Year:</strong> {user.year}
          </p>
          <p className="mb-2">
            <strong>Division:</strong> {user.division}
          </p>
          <p className="mb-2">
            <strong>PRN:</strong> {user.prn}
          </p>
          <p className="mb-2">
            <strong>Role:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
