import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const JobPost = () => {
    const [jobData, setJobData] = useState({
        job_name: "",
        job_id: "",
        company: "",
        job_description: "",
        location: "",
        experience: "",
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData({ ...jobData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                setMessage("Job posted successfully!");
                setJobData({
                    job_name: "",
                    job_id: "",
                    company: "",
                    job_description: "",
                    location: "",
                    experience: "",
                    expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                });
            } else {
                setMessage("Failed to post job. Please try again.");
            }
        } catch (error) {
            console.error("Error posting job:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-stone-950 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl bg-slate-50 font-bold mb-4">Post a New Job</h1>

                {message && (
                    <div
                        className={`mb-4 text-center p-2 rounded ${message.includes("successfully")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Job Name */}
                    <div className="mb-4">
                        <label htmlFor="job_name" className="block font-medium mb-1">
                            Job Role
                        </label>
                        <input
                            type="text"
                            id="job_name"
                            name="job_name"
                            value={jobData.job_name}
                            onChange={handleChange}
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Job ID */}
                    <div className="mb-4">
                        <label htmlFor="job_id" className="block font-medium mb-1">
                            Job ID
                        </label>
                        <input
                            type="text"
                            id="job_id"
                            name="job_id"
                            value={jobData.job_id}
                            onChange={handleChange}
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Company */}
                    <div className="mb-4">
                        <label htmlFor="company" className="block font-medium mb-1">
                            Company
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={jobData.company}
                            onChange={handleChange}
                            className="w-full bg-slate-50 text-stone-950 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Job Description */}
                    <div className="mb-4">
                        <label htmlFor="job_description" className="block font-medium mb-1">
                            Job Description
                        </label>
                        <textarea
                            id="job_description"
                            name="job_description"
                            value={jobData.job_description}
                            onChange={handleChange}
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label htmlFor="location" className="block font-medium mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={jobData.location}
                            onChange={handleChange}
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Experience */}
                    <div className="mb-4">
                        <label htmlFor="experience" className="block font-medium mb-1">
                            Experience (e.g., 2 years)
                        </label>
                        <input
                            type="text"
                            id="experience"
                            name="experience"
                            value={jobData.experience}
                            onChange={handleChange}
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Expiration Date */}
                    <div className="mb-4">
                        <label htmlFor="expirationDate" className="block font-medium mb-1">
                            Expiration Date
                        </label>
                        <DatePicker
                            selected={new Date(jobData.expirationDate)}
                            onChange={(date) =>
                                setJobData({ ...jobData, expirationDate: date.toISOString().split("T")[0] })
                            }
                            minDate={new Date()} // Prevent past dates
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Post Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JobPost;
