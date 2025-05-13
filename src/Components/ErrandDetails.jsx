import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ErrandDetails.css'; // Import the CSS file

const ErrandDetails = () => {
  // Use the `useLocation` hook to access the state passed via `navigate`
  const location = useLocation();
  const navigate = useNavigate();
  const errand = location.state ? location.state.errand : null; // Get the errand passed via state
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle navigate back to the previous page
  const handleBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  // If no errand is passed in the state, show an error
  if (!errand) {
    return (
      <div className="text-center py-5">
        <p>Error: No errand details found!</p>
      </div>
    );
  }

  // Check if the errand has been accepted or not
  const isAccepted = errand.accepted_by && errand.accepted_by !== '';

  return (
    <div className="errand-details-container">
      <div className="container">
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading details...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Errand Details */}
        {!loading && !error && (
          <div className="errand-details-card">
            <h1 className="errand-title">{errand.errand_name}</h1>
            <p className="errand-description">{errand.errand_desc}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="errand-cost">
                Ksh {errand.errand_cost}
              </span>
              <span className="date-info">
                Created on: {new Date(errand.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Accepted Status */}
            <div className={`accepted-status ${isAccepted ? "accepted" : "not-accepted"}`}>
              <strong>Status:</strong> {isAccepted ? "Accepted" : "Not Accepted"}
            </div>

            {/* Creator Info */}
            <div className="creator-info">
              <h5>Creator Information</h5>
              <p><strong>Name:</strong> {errand.creator_name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${errand.creator_email}`}>{errand.creator_email}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${errand.creator_phone}`}>{errand.creator_phone}</a></p>
            </div>

            {/* Back Button */}
            <div className="back-button-container">
              <button className="back-button" onClick={handleBack}>
                Back to Errands
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrandDetails;
