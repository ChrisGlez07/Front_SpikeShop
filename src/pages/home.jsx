import '../Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <>
      <section className="hero-banner">
        <div className="hero-content">
          <h2>ELEVATE YOUR PERFORMANCE</h2>
          <p>Discover premium sports apparel designed for champions.</p>
        </div>
      </section>

      <section className="carousel-section">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=1600&q=80"
                className="d-block w-100"
                alt="Sportswear 1"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://i.pinimg.com/originals/15/b4/20/15b420230729f86111c0a5ea058627be.jpg"
                className="d-block w-100"
                alt="Sportswear 2"
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80"
                className="d-block w-100"
                alt="Sportswear 3"
              />
            </div>
          </div>

          {/* Controles del carrusel */}
          <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      </section>
      <section className="services">
          <div className="container">
            <div className="row">
              <div className="col-md-4 service-item">
                <h4>Free Shipping</h4>
                <p>On orders over $100</p>
              </div>
              <div className="col-md-4 service-item">
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
              <div className="col-md-4 service-item">
                <h4>Secure Payment</h4>
                <p>100% secure checkout</p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
