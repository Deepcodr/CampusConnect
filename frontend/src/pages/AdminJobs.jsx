import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

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

        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/jobs");
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (!isAdmin) {
        return <p className="text-center text-red-500">Access Denied. Admins Only.</p>;
    }

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-stone-950">
            <h1 className="text-3xl font-bold text-center text-stone-950">Jobs</h1>
            <div className="p-4 mt-4 space-y-4 flex flex-col justify-center">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="bg-white w-[80vw] mx-auto shadow-md rounded-lg p-6 flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-xl text-stone-950 font-bold mb-2">{job.job_name}</h2>
                            <p className="text-gray-700">{job.company}</p>
                            <p className="text-gray-600 text-sm">{job.location}</p>
                        </div>
                        <div className="flex space-x-4 mt-2">
                            <Link to={`/jobapplicants/${job._id}`} className="text-blue-500">
                                View Applicants
                            </Link>
                        </div>
                    </div>
                    // <div key={job._id} className="p-4 border rounded shadow-md">
                    //     <h3 className="text-lg font-semibold">{job.job_name}</h3>
                    //     <p>{job.company}</p>
                    //     <p>{job.location}</p>
                    //     <p>{job.experience}</p>
                        // <div className="flex space-x-4 mt-2">
                        //     <Link to={`/jobapplicants/${job._id}`} className="text-blue-500">
                        //         View Applicants
                        //     </Link>
                        //     <button
                        //         onClick={() => handleExport(job._id)}
                        //         className="text-white bg-blue-500 px-4 py-2 rounded"
                        //     >
                        //         Export to Excel
                        //     </button>
                        // </div>
                    // </div>
                ))}
            </div>
        </div>
    );
};

export default AdminJobs;
