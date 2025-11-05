import React from 'react';
import '../Card.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ producto }) => { 
    const { img, name, price, originalPrice, badge } = producto; 
    
    return (
        <div className="product-column">
            <div className="card">
                <div className="card-img-container">
                    <img src={img} className="card-img-top" alt={name}/>
                    {badge && <span className="product-badge">{badge}</span>}
                </div>
                <div className="card-body">
                    <h3 className="card-text">{name}</h3>
                    <div className="product-price">
                        {originalPrice && <span className="original-price">{originalPrice}</span>}
                        {price}
                    </div>
                    <div className="card-actions">
                        <button className="btn-add-cart">Añadir al Carrito</button>
                        <button className="btn-favorite">❤</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;