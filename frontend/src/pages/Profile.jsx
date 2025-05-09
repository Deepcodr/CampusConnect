import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [showToast, setShowToast] = useState(true);
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [profileImage, setProfileImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const branches = ["CSE", "ENTC", "CHEM", "MECH", "CIVIL"];
  const years = ["First Year", "Second Year", "Third Year", "Final Year"];

  const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const textReg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const prnRegex = /^\d{2}UG(CS|ET|CH|ME|CE)\d{5}$/;
  const divRegex = /^[A-Z]$/;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/me`, {
          withCredentials: true, // Include session cookies
        });
        // const [firstname, lastname] = response.data.user.name.split(" ");
        // const generatedImageUrl = `https://ui-avatars.com/api/?name=${firstname}+${lastname}`;
        setProfileImage(`/userprofile.svg`);
        // Set user data
        if (response.data.user.role == "ADMIN") {
          setIsAdmin(true);
        }
        console.log(response.data.user);
        setUser(response.data.user);
        setFormData(response.data.user);


      } catch (err) {
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

      if (! await validateProfile()) {
        return;
      }

      const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/api/profile`, formDataToSend, {
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

  function validateProfile() {
    if (!formData.name || !textReg.exec(formData.name)) {
      alert("Enter a valid name ");
      return false;
    }

    if (!formData.email || !emailReg.exec(formData.email)) {
      alert("Enter a valid email");
      return false;
    }

    if (!years.includes(formData.year)) {
      alert("Select a valid year");
      return false;
    }

    if (!divRegex.exec(formData.division)) {
      alert("Enter a valid division");
      return false;
    }

    if (!formData.branch || !branches.includes(formData.branch)) {
      alert("Select valid branch name");
      return false;
    }

    if (!formData.tenthPercentage || !formData.twelthPercentage || !formData.engineeringPercentage || formData.tenthPercentage < 0 || formData.twelthPercentage < 0 || formData.engineeringPercentage < 0) {
      alert("Enter valid marks");
      return false;
    }

    return true;
  }

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
      {showToast && <div className="absolute top-0 start-1/2 -translate-x-1/2 p-2">
        <div className="max-w-xs bg-teal-500 text-sm text-white rounded-xl shadow-lg" role="alert" tabIndex="-1" aria-labelledby="hs-toast-solid-color-teal-label">
          <div id="hs-toast-solid-color-teal-label" className="flex p-4">
            Login Successful!
          </div>
        </div>
      </div>}
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
                    <label className="block text-sm font-medium">Year</label>
                    <select
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.year}
                      defaultValue="Select Year"
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                      <option disabled>Select Year</option>
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
                      id="division"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Branch</label>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">Active Backlog</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 p-2 border rounded"
                      value={formData.activeBacklog}
                      onChange={(e) => setFormData({ ...formData, activeBacklog: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Resume</label>
                    <input type="file" name="resume" accept="application/pdf" onChange={handleFileChange} className="w-full p-2 border rounded" />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  </div>
                </>
                :
                <>
                  <h1 className="text-2xl font-bold text-center mb-4">{user.name ? user.name : "Name Not Available"}</h1>
                  <div className="text-gray-700">
                    <p className="mb-2">
                      <strong>Email:</strong> {user.email ? user.email : "Not Available"}
                    </p>
                    <p className="mb-2">
                      <strong>PRN:</strong> {user.prn ? user.prn : "Not Available"}
                    </p>
                    <p className="mb-2">
                      <strong>Year:</strong> {user.year ? user.year : "Not Available"}
                    </p>
                    <p className="mb-2">
                      <strong>Branch:</strong> {user.branch ? user.branch : "Not Available"}
                    </p>
                    <p className="mb-2">
                      <strong>Division:</strong> {user.division ? user.division : "Not Available"}
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
                      <strong>Active Backlog:</strong> {user.activeBacklog>=0 ? user.activeBacklog : "Not Filled"}
                    </p>
                    <p className="mb-2">
                      <strong>Resume :</strong> {user.resume ? <a href={`${import.meta.env.VITE_BACKEND_API_URL}/resume`} target="_blank" className="text-blue-500 underline">View Resume</a> : "No resume uploaded"}
                    </p>
                    <p className="mb-2">
                      <strong>Role:</strong> {user.role}
                    </p>

                  </div>
                  {/* {
                    !user.profileCompletion ?  */}
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                    </div>
                     {/* : <></>
                  } */}
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
