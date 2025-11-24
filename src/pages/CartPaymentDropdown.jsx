import React, { useState } from 'react';
import '../CartPaymentDropdown.css';

const CartPaymentDropdown = ({ 
  isOpen, 
  onToggle 
}) => {
    const [cartId, setCartId] = useState('');
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const APP_TOKEN = import.meta.env.VITE_TOKEN;

    // Función para cargar el carrito
    const chargeShoppingCart = async () => {
        if (!cartId.trim()) {
            setError('Please enter a valid cart ID');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/carrito/${cartId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${APP_TOKEN}`,
                }
            });

            if (!response.ok) {
                throw new Error('Cart not found or invalid ID');
            }

            const result = await response.json();
            console.log("Cart loaded:", result);
            
            if (result.success && result.data) {
                setCartData(result.data);
            } else {
                throw new Error('Invalid cart data received');
            }

        } catch (error) {
            console.error("Error loading cart:", error);
            setError(error.message || 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    // Función para procesar el pago
    const processPayment = async () => {
        if (!cartData) return;

        setIsPaying(true);
        setError('');

        try {
            const paymentData = {
                ...cartData,
                estado: 'completado',
                fechaPago: new Date().toISOString()
            };

            const response = await fetch(`${API_BASE_URL}/api/carrito/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_TOKEN}`,
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error('Payment processing failed');
            }

            const result = await response.json();
            console.log("Payment successful:", result);
            
            alert('Payment processed successfully!');
            // Resetear el estado
            setCartData(null);
            setCartId('');

        } catch (error) {
            console.error("Error processing payment:", error);
            setError(error.message || 'Payment failed');
        } finally {
            setIsPaying(false);
        }
    };

    const clearCart = () => {
        setCartData(null);
        setCartId('');
        setError('');
    };

    return (
        <div className="cart-payment-dropdown-container">
            {/* Botón del payment dropdown - Solo visible para admin */}
            <button className="payment-toggle-btn" onClick={onToggle}>
                💳
            </button>

            {/* Dropdown del payment */}
            {isOpen && (
                <div className="cart-payment-dropdown">
                    <div className="payment-header">
                        <h5>Admin Payment Panel</h5>
                        <button className="close-payment" onClick={onToggle}>×</button>
                    </div>

                    <div className="payment-content">
                        <div className="input-section">
                            <label htmlFor="cartId">Cart ID:</label>
                            <input
                                id="cartId"
                                type="text"
                                value={cartId}
                                onChange={(e) => setCartId(e.target.value)}
                                placeholder="Enter cart ID..."
                                disabled={loading || isPaying}
                            />
                        </div>

                        <button 
                            className="btn-charge-cart"
                            onClick={chargeShoppingCart}
                            disabled={loading || isPaying || !cartId.trim()}
                        >
                            {loading ? 'Loading...' : 'Charge Shopping Cart'}
                        </button>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        {cartData && (
                            <div className="cart-details">
                                <div className="cart-summary">
                                    <h6>Order Summary</h6>
                                    <div className="order-info">
                                        <p><strong>Cart ID:</strong> {cartData.carritoId || cartData._id}</p>
                                        <p><strong>Total:</strong> ${cartData.total?.toFixed(2)}</p>
                                        <p><strong>Items:</strong> {cartData.productos?.length || 0}</p>
                                        <p><strong>Status:</strong> {cartData.estado}</p>
                                    </div>
                                </div>

                                <div className="products-preview">
                                    <h6>Products:</h6>
                                    {cartData.productos?.slice(0, 3).map((producto, index) => (
                                        <div key={index} className="product-preview">
                                            <span>{producto.nombre}</span>
                                            <span>{producto.cantidadComprada}x</span>
                                        </div>
                                    ))}
                                    {cartData.productos?.length > 3 && (
                                        <div className="more-items">
                                            +{cartData.productos.length - 3} more items
                                        </div>
                                    )}
                                </div>

                                <div className="payment-actions">
                                    <button 
                                        className="btn-pay"
                                        onClick={processPayment}
                                        disabled={isPaying}
                                    >
                                        {isPaying ? 'Processing...' : `Pay $${cartData.total?.toFixed(2)}`}
                                    </button>
                                    <button 
                                        className="btn-clear"
                                        onClick={clearCart}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPaymentDropdown;