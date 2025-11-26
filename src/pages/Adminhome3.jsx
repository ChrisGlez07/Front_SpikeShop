import React from 'react';
import { Link } from 'react-router-dom';
import '../Adminhome.css';
import Footer from './Footer.jsx';

function Admin3() {
  return (
    <>
      <div className="admin3-container">
        <div className="admin3-content">
          <div className="admin3-logo-header">
            <h1 className="admin3-title">SpikeShop</h1>
          </div>
    
          <div className="admin3-buttons-container">
            <Link to="/registeradmin" className="admin3-button spike-selling-button">
              <div className="admin3-button-image-container">
                <img 
                  src="https://i.pinimg.com/736x/b7/94/39/b7943935b86370db5e3e98b6eb0581bb.jpg" 
                  alt="Create new User" 
                  className="admin3-button-image"
                />
              </div>
              <span className="admin3-button-text">Create New User</span>
            </Link>
          
            <Link to="/edituser" className="admin3-button spike-stock-button">
              <div className="admin3-button-image-container">
                <img 
                  src="https://i.pinimg.com/736x/26/0c/7c/260c7cf4dc0c865eb977861f5f316e28.jpg" 
                  alt="Edit User" 
                  className="admin3-button-image"
                />
              </div>
              <span className="admin3-button-text">Edit User</span>
            </Link>
          </div>
          <div className="admin3-home-section">
            <Link to="/admin" className="admin2-home-button">Admin Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin3;