export default function Home() {
  return (
    <>
      <section className="hero-banner">
          <div className="container">
            <div className="hero-content">
              <h2>ELEVATE YOUR PERFORMANCE</h2>
              <p>Discover premium sports apparel designed for champions. Shop the latest collection with up to 40% off.</p>
            </div>
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