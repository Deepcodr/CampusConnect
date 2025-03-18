import { useState, useEffect } from "react";
import axios from "axios";

const Feedback = () => {
    const [user, setUser] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        company: "",
        package: "",
        feedback: "",
        questions: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/me`, {
                    withCredentials: true, // Include session cookies
                });
                setUser(response.data.user);

                const res = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/feedback/get`, {
                    withCredentials: true,
                });
                setFeedback(res.data);
            } catch (err) {
                // setError("Failed to fetch user data. Please log in.");
                setFeedback(null);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/feedback`, formData,
                {
                    withCredentials: true,
                }
            );
            alert("Feedback submitted successfully!");
            setFeedback({ ...formData, feedbackFilled: true });
            window.location.reload(false);
        } catch (error) {
            console.error("Error submitting feedback", error);
        }
    };
    
    if (loading) {
        return <div className="text-center text-lg mt-10 my-4">Loading...</div>;
    }

    if (!user.placedStatus) {
        return <div className="text-red-500 text-center my-4 mx-auto">You are not placed yet</div>
    }


    return (
        <div className="max-w-2xl mx-auto my-4 p-6 bg-white shadow-md rounded-lg">
            {feedback && feedback.feedbackFilled ? (
                <div>
                    <h2 className="text-xl font-bold mb-4">Your Submitted Feedback</h2>
                    <p><strong>Company:</strong><br/>{feedback.company}</p>
                    <p><strong>Package:</strong><br /> {feedback.package}</p>
                    <p><strong>Feedback:</strong><br /> {feedback.feedback}</p>
                    <p><strong>Questions:</strong><br /> {feedback.questions}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold">Submit Your Feedback</h2>
                    <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-slate-50 text-stone-950"
                        required
                    />
                    <input
                        type="text"
                        name="package"
                        placeholder="Package"
                        value={formData.package}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-slate-50 text-stone-950"
                        required
                    />
                    <textarea
                        name="feedback"
                        placeholder="Your feedback"
                        value={formData.feedback}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-slate-50 text-stone-950"
                        required
                    />
                    <textarea
                        name="questions"
                        placeholder="Interview Questions"
                        value={formData.questions}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-slate-50 text-stone-950"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                        Submit Feedback
                    </button>
                </form>
            )}
        </div>
    );
};

export default Feedback;
