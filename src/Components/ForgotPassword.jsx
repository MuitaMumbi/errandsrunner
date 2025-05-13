import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("https://Muita.pythonanywhere.com/api/forgot-password", {
                identifier: emailOrUsername,
            });

            if (response.data.success) {
                setMessage("A reset link has been sent to your email.");
            } else {
                setError(response.data.message || "Unable to send reset link.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 card p-4 shadow">
                    <h2 className="mb-4">Forgot Password</h2>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="emailOrUsername" className="form-label">Email or Username</label>
                            <input
                                type="text"
                                id="emailOrUsername"
                                className="form-control"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <p className="mt-3">
                        Remembered your password? <Link to="/signin">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
