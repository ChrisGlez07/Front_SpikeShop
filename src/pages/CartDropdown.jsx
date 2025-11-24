import React from 'react';
import '../CartDropdown.css';

const CartDropdown = ({ 
  cartItems, 
  isOpen, 
  onToggle, 
  onUpdateQuantity, 
  onRemoveItem, 
  onSaveCartItems,
  isLoading = false 
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.precioNumerico * item.quantity), 0);

  return (
    <div className="cart-dropdown-container">
      {/* Botón del carrito */}
      <button className="cart-toggle-btn" onClick={onToggle}>
        🛒
        {totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </button>

      {/* Dropdown del carrito */}
      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h5>Your Cart ({totalItems})</h5>
            <button className="close-cart" onClick={onToggle}>×</button>
          </div>

          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-variants">
                      <small>Size: {item.talla} | Color: {item.color}</small>
                    </div>
                    <div className="cart-item-price">${item.precioNumerico} x {item.quantity}</div>
                    <div className="cart-item-subtotal">
                      Subtotal: ${(item.precioNumerico * item.quantity).toFixed(2)}
                    </div>
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-item"
                    onClick={() => onRemoveItem(index)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button 
                  className="btn-clear" 
                  onClick={onSaveCartItems}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Shopping Cart"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;