import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../PurchaseConfirmationModal.css';

const PurchaseConfirmationModal = ({ 
  isOpen, 
  onClose, 
  cartId, 
  cartData 
}) => {
  if (!isOpen) return null;

  // Crear contenido más detallado para el QR
  const qrContent = `CARRITO DE COMPRAS\n
ID: ${cartId || 'No disponible'}
Total: $${cartData?.total?.toFixed(2) || '0.00'}
Items: ${cartData?.productCount || 0}
Fecha: ${new Date().toLocaleDateString()}

${cartData?.products ? cartData.products.map(product => 
  `• ${product.name} - ${product.quantity}x - $${product.price} - ${product.color} - ${product.size}`
).join('\n') : 'No hay productos'}`;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Purchase Order Successfully Created</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="order-info">
            <div className="order-id">
              <strong>Order ID:</strong> 
              <span className="order-id-text">{cartId || 'Generando ID...'}</span>
            </div>
            
            <div className="order-details">
              <p><strong>Total:</strong> ${cartData?.total?.toFixed(2) || '0.00'}</p>
              <p><strong>Items:</strong> {cartData?.productCount || 0}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>

            {/* Mostrar productos del carrito */}
            {cartData?.products && cartData.products.length > 0 && (
              <div className="order-products">
                <h6>Products in this order:</h6>
                <div className="products-list">
                  {cartData.products.map((product, index) => (
                    <div key={index} className="product-item">
                      <span>{product.name}</span>
                      <span>{product.quantity}x</span>
                      <span>${product.price}</span>
                      <span>{product.color} / {product.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="qr-section">
            <h5>Scan QR Code for Order Details</h5>
            <div className="qr-container">
              <QRCodeSVG 
                value={qrContent}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="qr-note">
              Scan this QR code to access your complete order details
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;