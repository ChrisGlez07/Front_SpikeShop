import React from 'react';
import '../Filters.css'
const Filters = () => {
  return (
    <div className="filters-section">
      <h5>Filters</h5>
    <img src="https://futbol.fandom.com/es/wiki/Colo-Colo" alt="Colo-Colo" />
      <div className="filter-group">
        <h6>Category</h6>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="shoes" />
          <label className="form-check-label" htmlFor="shoes">
            Shoes
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="clothing" />
          <label className="form-check-label" htmlFor="clothing">
            Clothing
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="accessories" />
          <label className="form-check-label" htmlFor="accessories">
            Accessories
          </label>
        </div>
      </div>
      
      <div className="filter-group">
        <h6>Price Range</h6>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="priceRange" id="under50" />
          <label className="form-check-label" htmlFor="under50">
            Under $50
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="priceRange" id="price50-100" />
          <label className="form-check-label" htmlFor="price50-100">
            $50 - $100
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="priceRange" id="over100" />
          <label className="form-check-label" htmlFor="over100">
            Over $100
          </label>
        </div>
      </div>
      

      <div className="filter-group">
        <h6>Size</h6>
        <div className="size-options">
          <button className="btn btn-outline-secondary btn-sm">S</button>
          <button className="btn btn-outline-secondary btn-sm">M</button>
          <button className="btn btn-outline-secondary btn-sm">L</button>
          <button className="btn btn-outline-secondary btn-sm">XL</button>
        </div>
      </div>

      {/* Botón para limpiar filtros */}
      <div className="filter-actions">
        <button className="btn btn-outline-primary btn-sm w-100">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;