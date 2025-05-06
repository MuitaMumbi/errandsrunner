import React from 'react';
import "../App.css"
const ContactUs = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {/* Left Section (Form) */}
        <div className="col-lg-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Contact Us</h2>
            <p className="text-center mb-4">We Would Love To Hear From You</p>
            
            <form>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Please Enter Your Name"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Please Enter Your Email"
                  required
                />
              </div>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Enter Your Message"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button className="btn btn-primary btn-block w-100">Submit</button>
            </form>
          </div>
        </div>

        {/* Right Section (Map) */}
        <div className="col-lg-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Our Location</h2>
            <h5 className="text-center mb-4">Find us at:</h5>
            <div>
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?width=100%25&amp;height=300&amp;hl=en&amp;q=Westlands,%20Nairobi+(The%20Spice%20Haven)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                title="The Spice Haven Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
