import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h1 className="mb-4">About Errands Runner</h1>

      <div className="row g-4">
        {/* Platform Description */}
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="lead">
                Errands Runner is a trusted platform that connects people who need help with everyday tasks 
                (like shopping, deliveries, and more) with reliable task runners ready to assist.
              </p>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">Our Mission</h3>
              <p>
                We aim to simplify life by creating opportunities for task creators and task runners to collaborate.
                Whether you're a busy professional, a student, or someone in need of a helping hand — Errands Runner makes it easy and safe to get tasks done.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title">How It Works</h3>
              <ol>
                <li>Create an account as a Task Creator or Runner.</li>
                <li>Creators post errands with details and budget.</li>
                <li>Runners browse available tasks and accept the ones they can handle.</li>
                <li>Runners and creators can chat and track task progress in real-time.</li>
                <li>Tasks are marked complete when done and rated for reliability.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Why Use */}
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Why Use Errands Runner?</h3>
              <ul>
                <li>Simple and easy to use</li>
                <li>Trusted community</li>
                <li>Secure messaging and task tracking</li>
                <li>Empowers people to earn by helping others</li>
              </ul>
              <p>
                Whether you're looking to outsource small chores or earn extra income by running errands, 
                Errands Runner is here to support your journey.
              </p>
              <p>
                <strong>Got questions?</strong> Contact us anytime — we're happy to help!
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/contactus')}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
