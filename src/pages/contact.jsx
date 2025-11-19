import Footer from './Footer';
import '../contact.css';

export default function Contact() {
  return (
    <>
      <div className="containerContact">
        <div className="contactCard">
          <h1 className="contactTitle">Contact Us</h1>
          <h2 className="contactTitle2">Telephone Number: +52 123-456-7890</h2>
          <p className="contactSubtitle">Follow Us in our media accounts</p>
          
          <div className="socialContainer">
            <div className="socialCard instagram">
              <div className="socialIcon">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
              </div>
              <span className="socialName">Instagram</span>
            </div>

            <div className="socialCard facebook">
              <div className="socialIcon">
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" />
              </div>
              <span className="socialName">Facebook</span>
            </div>
        
            <div className="socialCard whatsapp">
              <div className="socialIcon">
                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968841.png" alt="WhatsApp" />
              </div>
              <span className="socialName">WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}