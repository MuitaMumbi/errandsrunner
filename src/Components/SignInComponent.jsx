import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const SignIn = () => {

    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [role, setRole] = useState("")
    let [loading, setLoading] = useState("")
    let [error, setError] = useState("")
    let navigate = useNavigate()

    const submitForm =async(e) => {
        e.preventDefault();
        try {
            setError("")
            setLoading("Please wait...")

            const data = new FormData()
            data.append("username", username)
            data.append("password", password)
            data.append("role", role)

            const response = await axios.post("https://Muita.pythonanywhere.com/api/signin", data)
            if (response.data.user){
                localStorage.setItem("user", JSON.stringify(response.data.user))
                navigate("/")
            } else {
                setLoading("")
                setError(response.data.message);
            }
        } catch (error) {
            setLoading("")
            setError(error.message);
        }
    };

    return ( 
        <div className="row justify-content-center mt-4" id="form">
            <div className="col-md-6 card shadow p-4">
                <h2>Sign In</h2>
                <b className="text-danger">{error}</b>
                <b className="text-warning">{loading}</b>
                <form onSubmit={submitForm}>
                    <input 
                    type="text" 
                    placeholder="Enter Username" 
                    required 
                    className="form-control"
                    onChange={(e) => setUsername(e.target.value)}
                    /><br />
                    <input 
                    type="password" 
                    placeholder="Enter Password" 
                    required 
                    className="form-control" 
                    onChange={(e) => setPassword(e.target.value)}
                    /><br />

                    <input 
                    type="text" 
                    placeholder="Enter Role" 
                    required 
                    className="form-control" 
                    onChange={(e) => setRole(e.target.value)}
                    /><br />
                    <button className="btn btn-primary" type="submit">Sign In</button>
                </form>
                <p>Don't have an account? <Link  to="/signup">Sign Up</Link></p>
            </div>
        </div>
     );
}
 
export default SignIn;