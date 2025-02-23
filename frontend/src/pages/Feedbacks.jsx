import { useState, useEffect } from "react";
import axios from "axios";

const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/feedback/all");
                setFeedbacks(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching feedbacks", error);
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    const openModal = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-center">Student Feedbacks</h2>

            {loading ? (
                <p className="text-center">Loading feedbacks...</p>
            ) : feedbacks.length === 0 ? (
                <p className="text-center">No feedbacks available.</p>
            ) : (
                <div className="">
                    {feedbacks.map((fb) => (
                        <div key={fb._id} className="flex flex-col">
                            <h1 className="my-4 font-semibold">{fb._id}</h1>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fb.feedbacks.map((feedb)=>(
                                    <div key={feedb._id} className="bg-white p-4 shadow-lg rounded-lg border">
                                        <br />
                                        <h2 className="text-2xl my-1">{feedb.name || "Unknown Student"}</h2>
                                        <p className="text-gray-600"><strong>Company:</strong> {feedb.company}</p>
                                        <p className="text-gray-600"><strong>Package:</strong> {feedb.package}</p>

                                        <button
                                            onClick={() => openModal(feedb)}
                                            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            View Feedback
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {/* <br /> */}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for displaying feedback details */}
            {isModalOpen && selectedFeedback && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[70%]">
                        <h3 className="text-lg font-bold mb-2">{selectedFeedback.studentId?.name}</h3>
                        <p className="text-gray-600"><strong>Company:</strong> <br />{selectedFeedback.company}</p>
                        <p className="text-gray-600"><strong>Package:</strong> <br />{selectedFeedback.package}</p>
                        <p className="mt-3"><strong>Feedback:</strong> <br />{selectedFeedback.feedback}</p>
                        <p className="mt-3"><strong>Questions:</strong> <br />{selectedFeedback.questions}</p>

                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedbacks;
