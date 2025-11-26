import React from 'react';
import { Link } from 'react-router-dom';
import '../Adminhome.css';
import Footer from './Footer.jsx';

function Admin() {
  return (
    <>
      <div className="admin-container">
        <div className="admin-content">
          <div className="logo-header">
            <h1 className="admin-title">SpikeShop</h1>
          </div>
    
          <div className="admin-buttons-container">
            <Link to="/admin3" className="admin-button spike-selling-button">
              <div className="button-image-container">
                <img 
                  src="https://i.pinimg.com/736x/6a/c7/15/6ac715accb77be2c1c4f3bcd8c973a0d.jpg" 
                  alt="User management" 
                  className="button-image"
                />
              </div>
              <span className="button-text">User Management</span>
            </Link>
          
            <Link to="/admin2" className="admin-button spike-stock-button">
              <div className="button-image-container">
                <img 
                  src="https://i.pinimg.com/736x/ea/e5/91/eae59192621aed18bd59a538f95f8637.jpg" 
                  alt="Spike Stock" 
                  className="button-image"
                />
              </div>
              <span className="button-text">Spike Stock</span>
            </Link>
          </div>
          <div className="home-section">
            <Link to="/" className="home-button">Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin;