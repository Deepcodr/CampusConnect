import { useState, useEffect } from "react";
import axios from "axios";

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState({});
    const [expandedCompany, setExpandedCompany] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/feedback/all`);
                console.log(res.data);
                res.data.forEach(element => {
                    feedbacks["" + element._id] = element;
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching feedbacks", error);
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    // Toggle dropdown for a company
    const toggleDropdown = (company) => {
        setExpandedCompany(expandedCompany === company ? null : company);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Feedbacks</h1>

            <div className="space-y-4">
                {Object.keys(feedbacks).map((company) => (
                    <div key={company} className="border rounded-lg shadow">
                        {/* Company Header */}
                        <button
                            onClick={() => toggleDropdown(company)}
                            className="w-full text-left p-4 bg-green-500 text-white font-semibold rounded-t-lg flex justify-between"
                        >
                            {company}
                            <span>{expandedCompany === company ? "▲" : "▼"}</span>
                        </button>

                        {/* Feedback Cards */}
                        {expandedCompany === company && (
                            <div className="p-4 space-y-3 bg-gray-100">
                                {feedbacks[company].feedbacks.map((fb) => (
                                    <div
                                        key={fb._id}
                                        className="p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setSelectedFeedback(fb);
                                            setShowModal(true);
                                        }}
                                    >
                                        <p className="font-semibold">{fb.name} - {fb.package}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for Detailed Feedback */}
            {showModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 bg-gray-300 text-stone-500 hover:text-gray-700"
                            onClick={() => setShowModal(false)}
                        >
                            ✖
                        </button>

                        {/* Feedback Details */}
                        <p className="text-sm text-gray-600 mt-8"><strong>NAME : </strong>{selectedFeedback.name}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>PACKAGE : </strong>{selectedFeedback.package}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>PRN : </strong>{selectedFeedback.prn}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>YEAR : </strong>{selectedFeedback.year}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>BRANCH : </strong>{selectedFeedback.branch}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>DIVISION : </strong>{selectedFeedback.division}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>EMAIL : </strong>{selectedFeedback.email}</p>
                        <p className="text-sm text-gray-600 mt-2"><strong>FEEDBACK : </strong><br />{selectedFeedback.feedback}</p>
                        <p className="text-sm text-gray-600"><strong>INTERVIEW QUESTIONS : </strong><br />{selectedFeedback.questions}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedbacks;


// import { useState, useEffect } from "react";
// import axios from "axios";

// const Feedbacks = () => {
//     const [feedbacks, setFeedbacks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedFeedback, setSelectedFeedback] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     useEffect(() => {
//         const fetchFeedbacks = async () => {
//             try {
//                 const res = await axios.get("http://localhost:5000/api/feedback/all");
//                 setFeedbacks(res.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching feedbacks", error);
//                 setLoading(false);
//             }
//         };
//         fetchFeedbacks();
//     }, []);

//     const openModal = (feedback) => {
//         setSelectedFeedback(feedback);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedFeedback(null);
//     };

//     return (
//         <div className="max-w-6xl mx-auto p-6 min-h-screen">
//             <h2 className="text-2xl font-bold mb-4 text-center">Student Feedbacks</h2>

//             {loading ? (
//                 <p className="text-center">Loading feedbacks...</p>
//             ) : feedbacks.length === 0 ? (
//                 <p className="text-center">No feedbacks available.</p>
//             ) : (
//                 <div className="">
//                     {feedbacks.map((fb) => (
//                         <div key={fb._id} className="flex flex-col">
//                             <h1 className="my-4 font-semibold">{fb._id}</h1>
//                             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {fb.feedbacks.map((feedb)=>(
//                                     <div key={feedb._id} className="bg-white p-4 shadow-lg rounded-lg border">
//                                         <br />
//                                         <h2 className="text-2xl my-1">{feedb.name || "Unknown Student"}</h2>
//                                         <p className="text-gray-600"><strong>Company:</strong> {feedb.company}</p>
//                                         <p className="text-gray-600"><strong>Package:</strong> {feedb.package}</p>

//                                         <button
//                                             onClick={() => openModal(feedb)}
//                                             className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                                         >
//                                             View Feedback
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                             {/* <br /> */}
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Modal for displaying feedback details */}
//             {isModalOpen && selectedFeedback && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-[70%]">
//                         <h3 className="text-lg font-bold mb-2">{selectedFeedback.studentId?.name}</h3>
//                         <p className="text-gray-600"><strong>Company:</strong> <br />{selectedFeedback.company}</p>
//                         <p className="text-gray-600"><strong>Package:</strong> <br />{selectedFeedback.package}</p>
//                         <p className="mt-3"><strong>Feedback:</strong> <br />{selectedFeedback.feedback}</p>
//                         <p className="mt-3"><strong>Questions:</strong> <br />{selectedFeedback.questions}</p>

//                         <button
//                             onClick={closeModal}
//                             className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Feedbacks;
