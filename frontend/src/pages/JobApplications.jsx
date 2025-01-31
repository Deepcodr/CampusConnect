import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const JobApplications = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const { jobId } = useParams();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/admin/job/${jobId}/applicants`);
                setApplicants(response.data);
            } catch (error) {
                console.error("Error fetching applicants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);

    const handleExport = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/job/${jobId}/applicants/export`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "applicants.xlsx";
            link.click();
        } catch (error) {
            console.error("Error exporting applicants:", error);
        }
    };

    if (loading) return <div>Loading applicants...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-stone-950">
            <h1 className="text-3xl font-bold text-center text-stone-950">Applicants for Job {applicants[0].jobName}</h1>
            <div className="p-4 mt-4 space-y-4 flex flex-col justify-center">
                {applicants.map((applicant) => (
                    <div key={applicant.applicationId} className="p-4 w-[80vw] mx-auto border rounded shadow-md">
                        <h3 className="text-lg font-semibold">{applicant.studentName}</h3>
                        <p>PRN: {applicant.prn}</p>
                        <p>Application ID: {applicant.applicationId}</p>
                        <p>Date Applied: {new Date(applicant.dateApplied).toLocaleString()}</p>
                    </div>
                ))}
                <button
                    onClick={() => handleExport(jobId)}
                    className="text-white w-[20vw] mx-auto bg-blue-500 px-4 py-2 rounded"
                >
                    Export to Excel
                </button>
            </div>
        </div>
    );
};

export default JobApplications;
