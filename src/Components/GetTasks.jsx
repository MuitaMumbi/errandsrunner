import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Navbar from "./Navbar";

const GetErrands = () => {
    const [errands, setErrands] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");
    const [filteredErrands, setFilteredErrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const img_url = "https://Muita.pythonanywhere.com/static/";
    const navigate = useNavigate();

    const getErrands = async () => {
        setError("");
        setLoading("Loading available errands...");
        try {
            const response = await axios.get("https://Muita.pythonanywhere.com/api/geterrands");
            setErrands(response.data);
            setFilteredErrands(response.data);
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

    useEffect(() => {
        getErrands();
    }, []);

    return (
        <div className="min-vh-100 bg-light">
            {/* <Navbar /> */}
            
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <h1 className="display-5 fw-bold mb-3">Find Help for Your Tasks</h1>
                    <p className="lead mb-4">Connect with task runners ready to assist you</p>
                    
                    <div className="col-lg-6 mx-auto">
                        <div className="input-group mb-3 shadow-lg">
                            <input
                                type="text"
                                placeholder="What do you need help with?"
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
                        <h2 className="mb-4 fw-bold">Available Errands</h2>
                        
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
                                            {/* {errand.product_photo && (
                                                <img 
                                                    src={img_url + errand.product_photo} 
                                                    className="card-img-top object-fit-cover" 
                                                    alt={errand.errand_name}
                                                    style={{ height: "180px" }}
                                                />
                                            )} */}
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title text-truncate">{errand.errand_name}</h5>
                                                <p className="card-text text-muted flex-grow-1">
                                                    {errand.errand_desc.slice(0, 100)}
                                                    {errand.errand_desc.length > 100 && "..."}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center">
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
                                            </div>
                                            <div className="card-footer bg-transparent border-top-0">
                                                <small className="text-muted">
                                                    Posted {new Date(errand.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
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