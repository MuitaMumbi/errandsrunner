import axios from "axios";
import { useState } from "react";
import{Link} from "react-router-dom"

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


  const submitForm = async (e) => {
    e.preventDefault();

    try {
      setLoading("Please wait while we submit your data");
      const data = new FormData();
      data.append("username", username);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);
      data.append("role", role)

      const response = await axios.post("https://Muita.pythonanywhere.com/api/signup", data);


      setLoading("")
      setSuccess(response.data.success)
       
    } catch (error) {
      setLoading("")
      setError(error.message)
    }
  }

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
          required onChange={(e) => setEmail(e.target.value)}
          />
          <br />
         
          <input 
          type="tel" 
          className="form-control" 
          placeholder="Enter Phone No" 
          required onChange={(e) => setPhone(e.target.value)}
          />
          <br />
    
          
          <input 
          type="password" 
          className="form-control"
           placeholder="Enter Password" 
           required onChange={(e) => setPassword(e.target.value)} 
           />
           <br />

           <input 
          type="text" 
          className="form-control"
           placeholder="Enter Role" 
           required onChange={(e) => setRole(e.target.value)} 
           />
           <br />
          
          <button className="btn btn-primary">Sign Up</button>
          </form>
          <p>Already have an account? <Link to = '/signin'>Sign In</Link></p>
        </div>
      </div>
     );
}
 
 
export default SignUp;
