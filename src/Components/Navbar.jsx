import React from "react";
import { Link, useNavigate } from "react-router-dom"; 

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-muted ms-auto " >
      <div className="container">
      
        <Link className="navbar-brand" to="/" id="head">
        {/* <img src="images/icon.png" alt="" /> */}
        The Errands Runner </Link>
        <button 
          className="navbar-toggler " 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            
            <li className="nav-item">
              <Link className="nav-link" to="/dash">Dashboard</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link" to="/createtask">Create Task</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contactus">Contact Us</Link>
            </li>
            
          </ul>
        </div>
        
        <div className="">
              {user && (
                <div className="navbar-nav ms-auto">
                  <b className="text-dark nav-link">Hello {user.username}</b>
                  <button className="nav-link" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}

              {!user && (
                <div className="navbar-nav ms-auto">
                  <Link to="/signin" className="nav-link">
                    Login
                  </Link>
                  <Link to="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

      </div>
    </nav>
  );
};

export default Navbar;