import '../footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">SpikeShop</h3>
          <p className="footer-text">
            Your Ultimate Sportswear Shop
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Address</h4>
          <p className="footer-text">
            Av. Lopez Mateos<br />
            Aguascalientes<br />
            C.P. 20174
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">Contact us</h4>
          <div className="phone-container">
            <span className="phone-number">+52 12 3456 7891</span>

          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 SpikeShop. Copyright Reserved.</p>
      </div>
    </footer>
  );
}