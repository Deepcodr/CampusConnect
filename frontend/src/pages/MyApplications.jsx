import React, { useEffect, useState } from "react";
import axios from "axios";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/myapplications", { withCredentials: true });
                console.log(response.data);
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
            <h2 className="text-2xl font-bold mb-6">My Applications</h2>
            {applications.length === 0 ? (
                <p className="text-center text-gray-500">You have not applied to any jobs yet.</p>
            ) : (
                applications.map((application) => (
                    <div key={application.applicationId} className="p-4 w-[80vw] bg-white border rounded shadow-md">
                        <h3 className="text-lg font-semibold">{application.jobName}</h3>
                        <p>Company : {application.company}</p>
                        <p>Application ID: {application.applicationId}</p>
                        <p>Date Applied: {new Date(application.appliedTime).toLocaleString()}</p>
                    </div>
                ))
                // <table className="min-w-full bg-white text-stone-950 border border-gray-200">
                //   <thead>
                //     <tr>
                //       <th className="px-4 py-2 border-b">Job Name</th>
                //       <th className="px-4 py-2 border-b">Company</th>
                //       <th className="px-4 py-2 border-b">Application ID</th>
                //       <th className="px-4 py-2 border-b">Applied Time</th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {applications.map((app) => (
                //       <tr key={app.applicationId} className="text-center">
                //         <td className="px-4 py-2 border-b">{app.jobName}</td>
                //         <td className="px-4 py-2 border-b">{app.company}</td>
                //         <td className="px-4 py-2 border-b">{app.applicationId}</td>
                //         <td className="px-4 py-2 border-b">{app.appliedTime}</td>
                //       </tr>
                //     ))}
                //   </tbody>
                // </table>
            )}
        </div>
    );
};

export default MyApplications;
