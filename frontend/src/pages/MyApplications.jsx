import React, { useEffect, useState } from "react";
import axios from "axios";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/myapplications`, { withCredentials: true });
                setApplications(response.data);
            } catch (err) {
                console.error("Error fetching applications:", err);
                setError("Failed to load applications. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Loading applications...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="mx-auto h-[70vh] p-4 bg-gray-100 text-stone-950">
            <h2 className="text-2xl font-bold mb-6 text-center">My Applications</h2>
            <div className="p-4 mt-4 space-y-4 flex flex-col justify-center">
                {applications.length === 0 ? (
                    <p className="text-center text-gray-500">You have not applied to any jobs yet.</p>
                ) : (
                    applications.map((application) => (
                        <div key={application.applicationId} className="p-4 mx-auto w-[80vw] shadow-md rounded-lg bg-white border rounded shadow-md">
                            <h3 className="text-lg font-semibold">{application.jobName}</h3>
                            <p>Company : {application.company}</p>
                            <p>Application ID: {application.applicationId}</p>
                            <p>Date Applied: {new Date(application.appliedTime).toLocaleString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyApplications;
