import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const isCreator = user && user.role === "Creator";
  const isRunner = user && user.role === "Runner";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/" id="head">
          <i className="bi bi-person-running me-2 text-primary"></i>
          THE ERRANDS RUNNER
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isCreator && (
              <li className="nav-item">
                <Link className="nav-link" to="/dash">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>
            )}
            {isCreator && (
              <li className="nav-item">
                <Link className="nav-link" to="/createtask">
                  <i className="bi bi-plus-circle me-1"></i> Create Task
                </Link>
              </li>
            )}
            {isRunner && (
              <li className="nav-item">
                <Link className="nav-link" to="/task">
                  <i className="bi bi-list-task me-1"></i> Available Tasks
                </Link>
              </li>
            )}
            {/* Optional Contact Us */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/contactus">
                <i className="bi bi-envelope me-1"></i> Contact Us
              </Link>
            </li> */}
          </ul>

          <div className="d-flex align-items-center ms-auto">
            {user ? (
              <div className="navbar-nav d-flex align-items-center">
                <span className="nav-link text-dark">
                  <i className="bi bi-person-circle me-1"></i> Hello {user.username}
                </span>
                <button className="btn nav-link" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Log out
                </button>
              </div>
            ) : (
              <div className="navbar-nav d-flex align-items-center">
                <Link to="/signin" className="nav-link">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/signup" className="nav-link">
                  <i className="bi bi-person-plus me-1"></i> Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
