import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";


const GetErrands = () => {
    const [errands, setErrands] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [filteredErrands, setFilteredErrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedRunnerId, setSelectedRunnerId] = useState(null);
    const [showChat, setShowChat] = useState(false);

    const img_url = "https://Muita.pythonanywhere.com/static/images";
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    const getErrands = async () => {
        setError("");
        setLoading("Loading your errands...");
        try {
            if (!userId) {
                setLoading("");
                setError("User not logged in. Please log in to view your errands.");
                return;
            }

            const response = await axios.get(`https://Muita.pythonanywhere.com/api/geterrands?runner_id=${userId}`);
            const data = response.data;
            const userErrands = data.filter(errand => String(errand.creator_id) === String(userId));

            setErrands(userErrands);
            setFilteredErrands(userErrands);
            setLoading("");
        } catch (error) {
            setLoading("");
            setError(error.message);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = errands.filter(errand =>
            errand.errand_name.toLowerCase().includes(value.toLowerCase()) ||
            errand.errand_desc.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredErrands(filtered);
    };

    const handleCreateTask = () => {
        navigate('/createtask');
    };

    const openChatWithRunner = (runnerId) => {
        setSelectedRunnerId(runnerId);
        setShowChat(true);
    };

    useEffect(() => {
        getErrands();
    }, []);

    return (
        <div className="min-vh-100 bg-light">
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold mb-3">Find Help for Your Tasks</h1>
                    <p className="lead mb-4">Connect with task runners ready to assist you</p>
                    <button className="btn btn-warning mb-4" type="button" onClick={handleCreateTask}>Create Task</button>
                    <div className="col-lg-6 mx-auto">
                        <div className="input-group mb-3 shadow-lg">
                            <input
                                type="text"
                                placeholder="Search for available tasks"
                                className="form-control form-control-lg"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <button className="btn btn-warning" type="button">
                                <i className="bi bi-search"></i> Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-5">
                {loading && (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">{loading}</p>
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <h2 className="mb-4 fw-bold">Your Created Errands</h2>

                        {filteredErrands.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                                <h4 className="mt-3">No errands found</h4>
                                <p>Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredErrands.map((errand) => (
                                    <div className="col-md-4 col-lg-3" key={errand.id}>
                                        <div className="card h-100 shadow-sm border-0">
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title text-truncate">{errand.errand_name}</h5>
                                                <p className="card-text text-muted flex-grow-1">
                                                    {errand.errand_desc.slice(0, 100)}
                                                    {errand.errand_desc.length > 100 && "..."}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <span className="badge bg-warning text-dark fs-6">
                                                        Ksh {errand.errand_cost}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => navigate("/errand-details", { state: { errand } })}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                                {errand.runner_id && (
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary mt-2"
                                                        onClick={() => openChatWithRunner(errand.runner_id)}
                                                    >
                                                        <i className="bi bi-chat-dots me-1"></i> Message Runner
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Chat Window */}
                {showChat && selectedRunnerId && (
                    <div className="mt-5">
                        <h4 className="text-primary">Chat with Runner</h4>
                        <ChatWindow currentUserId={userId} chatPartnerId={selectedRunnerId} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4 mt-auto">
                <div className="container text-center">
                    <p className="mb-0">© {new Date().getFullYear()} TaskRunner Platform</p>
                </div>
            </footer>
        </div>
    );
};

export default GetErrands;
