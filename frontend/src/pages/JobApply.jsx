import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const JobApply = () => {
    const { jobId } = useParams(); // Assuming jobId is passed in the route params
    const [user, setUser] = useState(null);
    const [job, setJob] = useState(null);
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
                const jobResponse = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
                    withCredentials: true,
                });
                setJob(jobResponse.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load data. Please try again.");
            }
        };

        fetchData();
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const formData = new FormData();

        formData.append("jobId",jobId);

        try {
            const response = await axios.post("http://localhost:5000/api/jobs/apply", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true
            });
            setSuccess("Application submitted successfully!");
        } catch (err) {
            if (err.status === 409) {
                setError("You have already Applied to this job.");
            } else {
                setError(err.response.data.error);
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
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Role :</h3>
                <div>{job.job_name}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Job ID :</h3>
                <div>{job.job_id}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Company :</h3>
                <div>{job.company}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">About Company :</h3>
                <div>{job.about_company}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Job Description :</h3>
                <div>{job.job_description}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Location :</h3>
                <div>{job.location}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Experience :</h3>
                <div>{job.experience}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Package :</h3>
                <div>{job.package}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Eligible Branches :</h3>
                <div>{
                job.eligibleBranches.map(branch => 
                  <h3 key={branch}>{branch}</h3>
                )
                }</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Required 10th Percentage :</h3>
                <div>{job.tenthPercentage}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Required 12th Percentage :</h3>
                <div>{job.twelthPercentage}</div>
            </div>
            <div className="mb-2">
                <h3 className="block font-semibold text-gray-700 mb-1">Required Engineering Aggregate :</h3>
                <div>{job.engineeringPercentage}</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
