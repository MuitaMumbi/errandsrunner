import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import ChatWindow from "./ChatWindow"; // Adjust path if needed

const CreateTask = () => {
    const [errand_name, setErrandName] = useState("");
    const [errand_desc, setErrandDesc] = useState("");
    const [errand_cost, setErrandCost] = useState("");
    const [status, setStatus] = useState("");
    const [errand_photo, setErrandPhoto] = useState(null);
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [showChat, setShowChat] = useState(false); // 👈 Chat toggle
    const navigate = useNavigate();

    const checkUser = () => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            localStorage.clear();
            navigate("/signin");
            return false;
        }

        try {
            const userObj = JSON.parse(storedUser);
            setUser(userObj);
            setToken(userObj.access_token);
            return true;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
            localStorage.clear();
            navigate("/signin");
            return false;
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "errand_name") setErrandName(value);
        if (name === "errand_desc") setErrandDesc(value);
        if (name === "errand_cost") setErrandCost(value);
        if (name === "status") setStatus(value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setErrandPhoto(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (!user || !token) {
            navigate("/signin");
            return;
        }

        try {
            setError("");
            setSuccess("");
            setLoading("Please wait as we submit your data");

            const data = new FormData();
            data.append("errand_name", errand_name);
            data.append("errand_desc", errand_desc);
            data.append("errand_cost", errand_cost);
            data.append("errand_photo", errand_photo);
            data.append("creator_id", user.user_id);
            data.append("status", "available");

            const response = await axios.post(
                "https://Muita.pythonanywhere.com/api/adderrand",
                data,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            setLoading("");
            toast.success(response.data.success || "Errand created successfully!");
            navigate("/dash");

            setErrandName("");
            setErrandDesc("");
            setErrandCost("");
            setErrandPhoto(null);
            setPhotoPreview(null);
            document.querySelector('input[type="file"]').value = "";
        } catch (error) {
            setLoading("");
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/signin");
            } else {
                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message
                );
            }
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer position="top-right" autoClose={5000} />

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">Create New Task</h2>
                        </div>

                        <div className="card-body p-4">
                            <form onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="errand_name" className="form-label">
                                        Task Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="errand_name"
                                        name="errand_name"
                                        placeholder="Enter task title"
                                        required
                                        className="form-control"
                                        value={errand_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="errand_desc" className="form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        id="errand_desc"
                                        name="errand_desc"
                                        placeholder="Enter detailed description"
                                        required
                                        rows="4"
                                        className="form-control"
                                        value={errand_desc}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="errand_cost" className="form-label">
                                            Budget (KES) <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">Ksh</span>
                                            <input
                                                type="number"
                                                id="errand_cost"
                                                name="errand_cost"
                                                placeholder="Enter budget amount"
                                                required
                                                min="1"
                                                className="form-control"
                                                value={errand_cost}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="status" className="form-label">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-select"
                                            value={status}
                                            onChange={handleChange}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="errand_photo" className="form-label">
                                        Task Photo (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        id="errand_photo"
                                        name="errand_photo"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {photoPreview && (
                                        <div className="mt-2">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ maxHeight: "200px" }}
                                            />
                                        </div>
                                    )}
                                    <div className="form-text">
                                        Upload an image that helps describe the task (JPEG, PNG)
                                    </div>
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Task...
                                            </>
                                        ) : "Create Task"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Toggle Button */}
            <button
                onClick={() => setShowChat(prev => !prev)}
                className="btn btn-light position-fixed bottom-0 end-0 m-4 rounded-circle shadow"
                title="Chat"
                style={{ width: "60px", height: "60px", zIndex: 1050 }}
            >
                <i className="bi bi-chat-dots-fill fs-4 text-primary"></i>
            </button>

            {/* Chat Window */}
            {showChat && user && (
                <div className="position-fixed bottom-0 end-0 m-5" style={{ width: "350px", zIndex: 1040 }}>
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <span>Chat</span>
                            <button onClick={() => setShowChat(false)} className="btn-close btn-close-white"></button>
                        </div>
                        <div className="card-body p-2">
                            <ChatWindow currentUserId={user.user_id} chatPartnerId={2} /> {/* Replace 2 with your partner ID logic */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTask;
