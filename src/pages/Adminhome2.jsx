import React from 'react';
import { Link } from 'react-router-dom';
import '../Adminhome.css';
import Footer from './Footer.jsx';

function Admin2() {
  return (
    <>
      <div className="admin2-container">
        <div className="admin2-content">
          <div className="admin2-logo-header">
            <h1 className="admin2-title">SpikeShop</h1>
          </div>
    
          <div className="admin2-buttons-container">
            <Link to="/createproduct" className="admin2-button spike-selling-button">
              <div className="admin2-button-image-container">
                <img 
                  src="https://i.pinimg.com/736x/8e/1b/25/8e1b25a5941e36a34423f76a2f39d7fb.jpg" 
                  alt="Create Product" 
                  className="admin2-button-image"
                />
              </div>
              <span className="admin2-button-text">Create Product</span>
            </Link>
          
            <Link to="/" className="admin2-button spike-stock-button">
              <div className="admin2-button-image-container">
                <img 
                  src="https://i.pinimg.com/736x/d4/b4/32/d4b4325a7d8d9d3ea0b97ae798f02aba.jpg" 
                  alt="Edit Product" 
                  className="admin2-button-image"
                />
              </div>
              <span className="admin2-button-text">Edit Product</span>
            </Link>
          </div>
          <div className="admin2-home-section">
            <Link to="/admin" className="admin2-home-button">Admin Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin2;