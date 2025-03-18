import React, { useEffect, useState } from "react";
import axios from "axios";

const Students = () => {
    const [students, setStudents] = useState([]);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchUser();
        fetchStudents();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/me`, {
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

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/admin/students`, {
                withCredentials: true, // Ensure session-based authentication works
            });
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handlePlacedStatusChange = async (studentId, currentStatus) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/admin/updateplaced/${studentId}`,
                { placedStatus: !currentStatus },
                { withCredentials: true }
            );

            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student._id === studentId ? { ...student, placedStatus: !currentStatus } : student
                )
            );
        } catch (error) {
            console.error("Error updating placed status:", error);
        }
    };

    if (!isAdmin) {
        return <p className="text-center text-red-500">Access Denied. Admins Only.</p>;
    }

    return (
        <div className="max-w-5xl mx-auto my-4 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Student List</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="border-b">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">PRN</th>
                        <th className="px-4 py-2">Branch</th>
                        <th className="px-4 py-2">Placed Status</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id} className="border-b">
                            <td className="px-4 py-2 text-center">{student.name}</td>
                            <td className="px-4 py-2 text-center">{student.email}</td>
                            <td className="px-4 py-2 text-center">{student.prn}</td>
                            <td className="px-4 py-2 text-center">{student.branch}</td>
                            <td className="px-4 py-2 text-center">
                                {student.placedStatus ? (
                                    <span className="text-green-500 font-semibold">Placed</span>
                                ) : (
                                    <span className="text-red-500 font-semibold">Unplaced</span>
                                )}
                            </td>
                            <td className="px-4 py-2 text-center">
                                <button
                                    className={`px-4 py-2 text-white rounded-md ${student.placedStatus ? "bg-red-500" : "bg-green-500"
                                        }`}
                                    onClick={() => handlePlacedStatusChange(student._id, student.placedStatus)}
                                >
                                    {student.placedStatus ? "Mark Unplaced" : "Mark Placed"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Students;
