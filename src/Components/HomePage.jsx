import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authStatus = localStorage.getItem("isAuthenticated");
        setIsAuthenticated(authStatus === "true");
    }, []);

    return ( 
        <div className="home-container">
            <div className="hero-section">
                <div className="content-wrapper">
                    <h2 className="welcome-text">Welcome to</h2>
                    <h1 className="title animate__animated animate__fadeIn">ERRANDS RUNNER</h1>
                    
                    <div className="icon-container">
                        <img 
                            src="images/icon.png" 
                            alt="Errands Runner Icon" 
                            className="home-icon animate__animated animate__bounceIn" 
                        />
                    </div>
                    
                    <h4 className="tagline animate__animated animate__fadeInUp">
                        <i>We Run Your Errands For You</i>
                    </h4>
                    
                    <div className="cta-buttons">
                        <button 
                            className="btn btn-primary animate__animated animate__fadeInLeft"
                            onClick={() => !isAuthenticated && navigate('/signup')}
                            disabled={isAuthenticated}
                        >
                            {isAuthenticated ? "Already Signed In" : "Get Started"}
                        </button>
                        <button 
                            className="btn btn-outline-primary animate__animated animate__fadeInRight"
                            onClick={() => navigate('/about')}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="features-section">
                <div className="feature-card">
                    <i className="fas fa-bolt feature-icon"></i>
                    <h3>Fast Service</h3>
                    <p>Get your errands completed in record time</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-shield-alt feature-icon"></i>
                    <h3>Reliable</h3>
                    <p>Trusted runners for all your needs</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-dollar-sign feature-icon"></i>
                    <h3>Affordable</h3>
                    <p>Competitive pricing for any budget</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
