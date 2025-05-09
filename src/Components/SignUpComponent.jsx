import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  // create variables
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [loading, setLoading] = useState("");
  let [success, setSuccess] = useState("");
  let [error, setError] = useState("");

  const navigate = useNavigate(); // Hook for navigation
  

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      setLoading("Please wait while we submit your data...");
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);
      data.append("role", role);

      const response = await axios.post("https://Muita.pythonanywhere.com/api/signup", data);

      setLoading("");
      setSuccess(response.data.message);
      
      // Save the user info to localStorage (including role)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect based on user role
        if (response.data.user.role === "Creator") {
          navigate("/createtask"); // Redirect to Task Creator Dashboard
        } else if (response.data.user.role === "Runner") {
          navigate("/task"); // Redirect to Task Runner Dashboard
        }
      }
      localStorage.setItem("isAuthenticated", "true");

    } catch (error) {
      setLoading("");
      setError(error.message);
    }
  };

  return (
    <div id="form" className="row justify-content-center mt-4">
      <div className="col-md-6 card shadow p-4">
        <h2>Sign Up</h2>
        <b className="text-warning">{loading}</b>
        <b className="text-success">{success}</b>
        <b className="text-danger">{error}</b>
        <form onSubmit={submitForm}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />

          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />

          <input
            type="tel"
            className="form-control"
            placeholder="Enter Phone No"
            required
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />

          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          {/* <input
            type="text"
            className="form-control"
            placeholder="Enter Role"
            
            required
            onChange={(e) => setRole(e.target.value)}
          /> */}
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

          <br />

          <button className="btn btn-primary">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
