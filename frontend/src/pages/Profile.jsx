import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [profileImage, setProfileImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);


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
        // Set user data
        if (response.data.user.role == "ADMIN") {
          setIsAdmin(true);
        }
        setUser(response.data.user);
        setFormData(response.data.user);



      } catch (err) {
        console.log(err);
        setError("Failed to fetch user data. Please log in.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.put("http://localhost:5000/api/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

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
      <div className="bg-white shadow-md rounded-lg p-8 my-4 w-full max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <img
            src={profileImage || "https://avatar.iran.liara.run/public"}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>

        {!isAdmin ?
          <>
            {!user.profileCompletion && (
              <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                <strong>Incomplete Profile:</strong> Please update your profile to apply for jobs.
              </div>
            )}

            <div className="space-y-4">
              {isEditing ?
                <>
                  <div >
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Branch</label>
                    {/* <input
                      type="email"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    /> */}
                    <select name="branch" defaultValue="Select Branch" onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded bg-slate-50">
                      <option disabled>Select Branch</option>
                      {["CSE", "ENTC", "MECH", "CIVIL", "CHEM"].map((branch) => (
                        <option key={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">10th Percentage</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.tenthPercentage}
                      onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">12th/Diploma Percentage</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.twelthPercentage}
                      onChange={(e) => setFormData({ ...formData, twelthPercentage: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Engineering Percentage</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.engineeringPercentage}
                      onChange={(e) => setFormData({ ...formData, engineeringPercentage: e.target.value })}
                      required
                    />
                  </div>
                  {/* <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded text-stone-950 bg-slate-50" /> */}
                  {/* <input type="email" name="email" value={formData.email} disabled className="w-full p-2 border rounded bg-gray-100" /> */}
                  {/* <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded" /> */}
                  {/* <input type="text" name="prn" value={formData.prn} disabled className="w-full p-2 border rounded bg-gray-100" /> */}

                  {/* <input type="number" name="tenthPercentage" placeholder="10th Percentage" value={formData.tenthPercentage} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded" /> */}
                  {/* <input type="number" name="twelfthPercentage" placeholder="12th Percentage" value={formData.twelfthPercentage} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded" /> */}
                  {/* <input type="number" name="engineeringPercentage" placeholder="Engineering Percentage" value={formData.engineeringPercentage} onChange={handleChange} disabled={!isEditing} className="w-full p-2 border rounded" /> */}

                  <div>
                    <label className="block text-sm font-medium mb-2">Resume</label>
                    {/* <input
                      type="email"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    /> */}
                    <input type="file" name="resume" accept="application/pdf" onChange={handleFileChange} className="w-full p-2 border rounded" />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  </div>
                </>
                :
                <>
                  <h1 className="text-2xl font-bold text-center mb-4">{user.name}</h1>
                  <div className="text-gray-700">
                    <p className="mb-2">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="mb-2">
                      <strong>PRN:</strong> {user.prn}
                    </p>
                    <p className="mb-2">
                      <strong>Year:</strong> {user.year}
                    </p>
                    <p className="mb-2">
                      <strong>Branch:</strong> {user.branch}
                    </p>
                    <p className="mb-2">
                      <strong>Division:</strong> {user.division}
                    </p>
                    <p className="mb-2">
                      <strong>10th Percentage:</strong> {user.tenthPercentage ? user.tenthPercentage : "Not Filled"}
                    </p>
                    <p className="mb-2">
                      <strong>12th Percentage:</strong> {user.twelthPercentage ? user.twelthPercentage : "Not Filled"}
                    </p>
                    <p className="mb-2">
                      <strong>Engineering Percentage:</strong> {user.engineeringPercentage ? user.engineeringPercentage : "Not Filled"}
                    </p>
                    <p className="mb-2">
                      <strong>Resume :</strong> {user.resume ? <a href={`http://localhost:5000/resume`} target="_blank" className="text-blue-500 underline">View Resume</a> : "No resume uploaded"}
                    </p>
                    <p className="mb-2">
                      <strong>Role:</strong> {user.role}
                    </p>
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                    </div>
                  </div>
                </>
              }

            </div>
          </>

          :
          <>
            <h1 className="text-2xl font-bold text-center mb-4">{user.name}</h1>
            <div className="text-gray-700">
              <p className="mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="mb-2">
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default Profile;
