import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submitForm = async (e) => {
        e.preventDefault();

        // Validate the form data
        if (!username || !password || !role) {
            setError("All fields are required");
            return;
        }

        try {
            setError("");
            setLoading("Please wait...");

            const data = new FormData();
            data.append("username", username);
            data.append("password", password);
            data.append("role", role);

            const response = await axios.post("https://Muita.pythonanywhere.com/api/signin", data);
           
            if (response.data.user) {
                console.log("User object:", response.data.user);

                // Store user data in localStorage
                localStorage.setItem("user", JSON.stringify(response.data.user));
                // After successful login response
                localStorage.setItem("user_id", response.data.user.user_id); 
                localStorage.setItem("isAuthenticated", "true");
                // Redirect user based on role
                if (response.data.user.role === "Runner") {
                    navigate("/task");
                } else if (response.data.user.role === "Creator") {
                    navigate("/dash");
                } else {
                    navigate("/"); // Default redirect (if role is unrecognized)
                }
                
            } else {
                setLoading("");
                setError(response.data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setLoading("");
            setError(error.response?.data?.message || "Error connecting to the server. Please try again.");
        }
        
       
    };

    return (
        <div className="row justify-content-center mt-4" id="form">
            <div className="col-md-6 card shadow p-4">
                <h2>Sign In</h2>
                {error && <b className="text-danger">{error}</b>}
                {loading && <b className="text-warning">{loading}</b>}
                
                <form onSubmit={submitForm}>
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Enter Username"
                            required
                            className="form-control"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            placeholder="Enter Password"
                            required
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-control"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            {/* <option value="admin">Admin</option> */}
                            <option value="Runner">Task Runner</option>
                            <option value="Creator">Task Creator</option>
                        </select>
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        Sign In
                    </button>
                </form>

                <p className="mt-3">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
