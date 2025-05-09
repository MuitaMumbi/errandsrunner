import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // Fixing the navigate usage

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // Check user role from the localStorage
  const isCreator = user && user.role === "Creator";
  const isRunner = user && user.role === "Runner";

  return (
    <nav className="navbar navbar-expand-lg navbar-muted ms-auto">
      <div className="container">
        <Link className="navbar-brand" to="/" id="head">
          The Errands Runner
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
            {/* Dashboard link visible for both creators and runners */}
            <li className="nav-item">
              <Link className="nav-link" to="/dash">
                Dashboard
              </Link>
            </li>

            {/* Show "Create Task" link only if the user is a creator */}
            {isCreator && (
              <li className="nav-item">
                <Link className="nav-link" to="/createtask">
                  Create Task
                </Link>
              </li>
            )}

            {/* Show "Available Tasks" link only if the user is a runner */}
            {isRunner && (
              <li className="nav-item">
                <Link className="nav-link" to="/availabletasks">
                  Available Tasks
                </Link>
              </li>
            )}

            {/* Always show "Contact Us" link */}
            <li className="nav-item">
              <Link className="nav-link" to="/contactus">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Show user info and logout option if logged in */}
        <div className="">
          {user ? (
            <div className="navbar-nav ms-auto">
              <b className="text-dark nav-link">Hello {user.username}</b>
              <button className="nav-link" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
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
