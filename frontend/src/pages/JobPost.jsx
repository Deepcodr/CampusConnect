import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const JobPost = () => {
    const jobIdRegex = /^[A-Za-z0-9]+$/;
    const textReg = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    const numReg = /^[0-9]+$/;

    const [jobData, setJobData] = useState({
        job_name: "",
        job_id: "",
        company: "",
        about_company: "",
        job_description: "",
        location: "",
        experience: "",
        eligibleBranches: [],
        tenthPercentage: "",
        twelthPercentage: "",
        engineeringPercentage: "",
        package: "",
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    const branches = ["CSE", "ENTC", "MECH", "CIVIL", "CHEM"];

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobData({ ...jobData, [name]: value });
    };

    const handleBranchChange = (branch) => {
        setJobData((prev) => ({
            ...prev,
            eligibleBranches: prev.eligibleBranches.includes(branch)
                ? prev.eligibleBranches.filter((b) => b !== branch) // Remove if already selected
                : [...prev.eligibleBranches, branch], // Add if not selected
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePost()) {
            return;
        }
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/api/jobs`, {
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
                    about_company: "",
                    job_description: "",
                    location: "",
                    experience: "",
                    eligibleBranches: [],
                    tenthPercentage: "",
                    twelthPercentage: "",
                    engineeringPercentage: "",
                    package: "",
                    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                });
            } else {
                setMessage("Failed to post job. Please try again.");
            }
        } catch (error) {
            console.error("Error posting job:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    function validatePost() {
        if (!textReg.exec(jobData.job_name)) {
            alert("Enter a valid role ");
            return false;
        }

        if (!jobIdRegex.exec(jobData.job_id)) {
            alert("Enter a valid job id");
            return false;
        }

        if (!textReg.exec(jobData.company)) {
            alert("Enter valid company name");
            return false;
        }

        if(!textReg.exec(jobData.location))
        {
            alert("Enter a valid location");
            return false;
        }

        if (!numReg.exec(jobData.experience)) {
            alert("Enter valid experience");
            return false;
        }

        if(jobData.tenthPercentage<0 || jobData.twelthPercentage<0 || jobData.engineeringPercentage<0)
        {
            alert("Enter valid marks");
            return false;
        }

        return true;
    }

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

                    {/* About Company */}
                    <div className="mb-4">
                        <label htmlFor="about_company" className="block font-medium mb-1">
                            About Company
                        </label>
                        <textarea
                            type="text"
                            id="about_company"
                            name="about_company"
                            value={jobData.about_company}
                            onChange={handleChange}
                            className="w-full bg-slate-50 text-stone-950 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
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

                    {/* Package */}
                    <div className="mb-4">
                        <label htmlFor="Package" className="block font-medium mb-1">
                            Package
                        </label>
                        <input
                            type="text"
                            id="package"
                            name="package"
                            value={jobData.package}
                            onChange={handleChange}
                            className="w-full bg-slate-50 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Academic Marks Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-medium">10th %</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 85.5"
                                value={jobData.tenthPercentage}
                                onChange={(e) =>
                                    setJobData({ ...jobData, tenthPercentage: e.target.value })
                                }
                                className="w-full p-2 border rounded bg-white text-stone-950"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">12th/Diploma %</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 90.2"
                                value={jobData.twelthPercentage}
                                onChange={(e) =>
                                    setJobData({ ...jobData, twelthPercentage: e.target.value })
                                }
                                className="w-full p-2 border rounded bg-white text-stone-950"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Engineering %</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 78.6"
                                value={jobData.engineeringPercentage}
                                onChange={(e) =>
                                    setJobData({ ...jobData, engineeringPercentage: e.target.value })
                                }
                                className="w-full p-2 border rounded bg-white text-stone-950"
                            />
                        </div>
                    </div>

                    {/* Branch Selection Checkboxes */}
                    <div className="mb-4">
                        <label className="block font-medium">Eligible Branches</label>
                        <div className="flex flex-wrap gap-2">
                            {branches.map((branch) => (
                                <label key={branch} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={branch}
                                        checked={jobData.eligibleBranches.includes(branch)}
                                        onChange={() => handleBranchChange(branch)}
                                        className="w-4 h-4 appearance-none border-2 border-gray-400 checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                    />
                                    <span>{branch}</span>
                                </label>
                            ))}
                        </div>
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
