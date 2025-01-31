import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobApply = () => {
    const { jobId } = useParams(); // Assuming jobId is passed in the route params
    const [user, setUser] = useState(null);
    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [additionalFiles, setAdditionalFiles] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch user and job data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user data
                const response = await axios.get("http://localhost:5000/api/me", {
                    withCredentials: true, // Include session cookies
                });

                setUser(response.data.user); // Set user data

                // Fetch job data
                const jobResponse = await axios.get(`http://localhost:5000/api/jobs/${jobId}`,{
                    withCredentials: true,
                });
                console.log(jobResponse);
                setJob(jobResponse.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load data. Please try again.");
            }
        };

        fetchData();
    }, [jobId]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (name === "resume") {
            setResume(files[0]);
        } else if (name === "additionalFiles") {
            setAdditionalFiles(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!resume) {
            setError("Resume is required!");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("jobName", job?.job_name);
        formData.append("userId", user?._id);
        formData.append("email", user?.email);
        formData.append("name", user?.name);
        formData.append("prn", user?.prn);
        formData.append("resume", resume);
        if (additionalFiles) {
            formData.append("additionalFiles", additionalFiles);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/apply", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);
            setSuccess("Application submitted successfully!");
        } catch (err) {
            if(err.status===409)
            {
                setError("You have already Applied to this job.");
            }else
            {
                setError("Failed to submit the application. Please try again.");
            }
        }
    };

    // Show loading until data is fetched
    if (!user || !job) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg mt-6 text-stone-950">
            <h1 className="text-2xl font-bold mb-4">Apply for {job.job_name} at {job.company}</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pre-filled fields */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="text"
                        value={user.email}
                        disabled
                        className="mt-1 text-gray-700 block w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={user.name}
                        disabled
                        className="mt-1 block w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">PRN</label>
                    <input
                        type="text"
                        value={user.prn}
                        disabled
                        className="mt-1 block w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Resume Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Resume (PDF only)
                    </label>
                    <input
                        type="file"
                        name="resume"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        required
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </div>

                {/* Additional Files Upload (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Upload Additional Files (Optional, PDF only)
                    </label>
                    <input
                        type="file"
                        name="additionalFiles"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobApply;
