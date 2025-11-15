import React, { useState } from 'react';
import '../Card.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ producto }) => { 
    const { img, name, price, originalPrice, badge, descripciones } = producto;
    const [tallaSeleccionada, setTallaSeleccionada] = useState('');
    const [colorSeleccionado, setColorSeleccionado] = useState('');

    // Obtener tallas únicas disponibles
    const tallasDisponibles = [...new Set(descripciones
        .filter(desc => desc.cantidad > 0)
        .map(desc => desc.talla)
    )];

    // Obtener colores únicos disponibles para la talla seleccionada
    const coloresDisponibles = tallaSeleccionada 
        ? [...new Set(descripciones
            .filter(desc => desc.talla === tallaSeleccionada && desc.cantidad > 0)
            .map(desc => desc.color)
          )]
        : [];

    // Función para manejar selección de talla
    const handleTallaClick = (talla) => {
        setTallaSeleccionada(talla);
        setColorSeleccionado(''); // Resetear color cuando cambia la talla
    };

    // Función para manejar selección de color
    const handleColorChange = (event) => {
        setColorSeleccionado(event.target.value);
    };

    // Verificar si el producto está disponible para agregar al carrito
    const productoDisponible = tallaSeleccionada && colorSeleccionado;

    // Función para formatear el nombre del color
    const formatColorName = (color) => {
        return color.charAt(0).toUpperCase() + color.slice(1);
    };

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

                    {/* Contenedor principal de selectores */}
                    <div className="selectores-principal">
                        {/* Tallas con título */}
                        <div className="tallas-section">
                            <h6>Size:</h6>
                            <div className="tallas-container">
                                {tallasDisponibles.map(talla => (
                                    <button
                                        key={talla}
                                        className={`talla-btn ${tallaSeleccionada === talla ? 'selected' : ''}`}
                                        onClick={() => handleTallaClick(talla)}
                                    >
                                        {talla}
                                    </button>
                                ))}
                            </div>
                        </div>

                       
                            <div className="colores-dropdown-section">
                                <h6>Color:</h6>
                                <select 
                                    className="color-dropdown"
                                    value={colorSeleccionado}
                                    onChange={handleColorChange}
                                >
                                    <option value="">Select color</option>
                                    {coloresDisponibles.map(color => (
                                        <option key={color} value={color}>
                                            {formatColorName(color)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        
                    </div>
                    <div className="card-actions">
                        <button 
                            className={`btn-add-cart ${!productoDisponible ? 'disabled' : ''}`}
                            disabled={!productoDisponible}
                        >
                            {productoDisponible ? 'Add to Cart' : 'Add to my Cart'}
                        </button>
                        <button className="btn-favorite">❤</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;