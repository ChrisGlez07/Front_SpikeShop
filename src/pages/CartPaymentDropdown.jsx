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
            console.log("🔍 Fetching cart with ID:", cartId);

            const timestamp = new Date().getTime();
            const url = `${API_BASE_URL}/api/carrito/${cartId}?t=${timestamp}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                    "ngrok-skip-browser-warning": "true",
                },
                credentials: 'include',
                cache: 'no-store'
            });

            console.log("📊 Response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Cart loaded successfully:", data);

            if (data._id || data.carritoId) {
                setCartData(data);
                setError('');
            } else if (data.data) {
                setCartData(data.data);
                setError('');
            } else {
                throw new Error('Invalid cart data structure received');
            }

        } catch (error) {
            console.error("❌ Error loading cart:", error);
            setError(`Failed to load cart: ${error.message}`);
            setCartData(null);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener información de un producto por NOMBRE
    const getProductoByNombre = async (productoNombre) => {
        try {
            console.log(`🔍 Fetching product by name: ${productoNombre}`);

            const timestamp = new Date().getTime();
            const url = `${API_BASE_URL}/productos/nombre/${encodeURIComponent(productoNombre)}?t=${timestamp}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                    "ngrok-skip-browser-warning": "true",
                },
                credentials: 'include',
                cache: 'no-store'
            });

            if (!response.ok) {
                console.error(`❌ Error fetching product by name ${productoNombre}:`, response.status);
                return null;
            }

            const data = await response.json();
            console.log(`✅ Product data retrieved for ${productoNombre}:`, data);
            return data.data || data;
        } catch (error) {
            console.error(`❌ Error fetching product by name ${productoNombre}:`, error);
            return null;
        }
    };

    // Función para actualizar la cantidad de un producto por ID - CORREGIDA
    const updateProductoCantidad = async (productoId, updateData) => {
    try {
        console.log(`🔄 Updating product by ID ${productoId}:`, updateData);

        // ✅ El backend espera { id: <id> } pero ese id NO ES _id, es productInfo.id
        const patchData = {
            id: productoId, 
            ...updateData
        };

        console.log("📤 Sending PATCH data:", patchData);

        const response = await fetch(`${API_BASE_URL}/productos/updateProducto`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${APP_TOKEN}`,
                "ngrok-skip-browser-warning": "true",
            },
            credentials: 'include',
            body: JSON.stringify(patchData)
        });

        console.log("📊 PATCH Response status:", response.status);

        if (response.status === 204) {
            console.log("✅ Product updated successfully (204 No Content)");
            return true;
        }

        const responseText = await response.text();
        console.log("📄 Response text:", responseText);

        if (!responseText) {
            console.log("✅ Product updated successfully (Empty response)");
            return true;
        }

        try {
            const data = JSON.parse(responseText);
            if (response.ok) {
                console.log("✅ Product updated successfully:", data.message);
                return data.success || true;
            } else {
                console.error(`❌ Failed to update product:`, data.message || response.status);
                return false;
            }
        } catch {
            if (response.ok) {
                console.log("✅ Product updated successfully (Non-JSON response)");
                return true;
            } else {
                console.error(`❌ Failed to update product:`, responseText);
                return false;
            }
        }

    } catch (error) {
        console.error(`❌ Error updating product by ID ${productoId}:`, error);
        return false;
    }
};

    // Función para procesar un producto individual - MEJORADA
    const procesarProducto = async (productoCarrito) => {
    try {
        console.log(`🛒 Processing: ${productoCarrito.nombre}, Quantity: ${productoCarrito.cantidadComprada}`);
        
        // 1. Obtener el producto por NOMBRE
        const productoInfo = await getProductoByNombre(productoCarrito.nombre);
        
        if (!productoInfo) {
            console.error(`❌ Product not found: ${productoCarrito.nombre}`);
            return { success: false, error: 'Product not found' };
        }

        // ✅ Usamos productInfo.id (NO _id)
        const productoId = productoInfo.id;
        console.log(`📝 Product ID extracted: ${productoId} for ${productoCarrito.nombre}`);

        if (!productoId) {
            console.error(`❌ No 'id' field found for product: ${productoCarrito.nombre}`);
            console.log(`🔍 Available fields in product:`, Object.keys(productoInfo));
            return { success: false, error: 'No product id found' };
        }

        // 2. DEBUG: Mostrar todas las descripciones disponibles
        console.log(`🔍 Available descriptions for ${productoCarrito.nombre}:`, productoInfo.descripcion);
        console.log(`🔍 Cart description:`, productoCarrito.descripcion?.[0]);

        const descripcionCarrito = productoCarrito.descripcion?.[0];
        if (!descripcionCarrito) {
            console.error(`❌ No cart description found for product: ${productoCarrito.nombre}`);
            return { success: false, error: 'No cart description found' };
        }

        // 3. Buscar la variante (color + talla)
        const descripcionIndex = productoInfo.descripcion.findIndex(desc =>
            desc.color?.toLowerCase() === descripcionCarrito.color?.toLowerCase() &&
            desc.talla?.toUpperCase() === descripcionCarrito.talla?.toUpperCase()
        );

        if (descripcionIndex === -1) {
            console.error(`❌ No matching description found for ${productoCarrito.nombre}`);
            console.error(`   Cart: Color=${descripcionCarrito.color}, Size=${descripcionCarrito.talla}`);
            console.error(`   Available:`, productoInfo.descripcion.map(d => `Color=${d.color}, Size=${d.talla}`));
            return { success: false, error: 'No matching product variant found' };
        }

        const cantidadActual = productoInfo.descripcion[descripcionIndex].cantidad;
        const nuevaCantidad = cantidadActual - productoCarrito.cantidadComprada;

        if (nuevaCantidad < 0) {
            console.warn(`⚠️ Insufficient inventory for ${productoCarrito.nombre}: ${cantidadActual} available, ${productoCarrito.cantidadComprada} requested`);
            return { success: false, error: 'Insufficient inventory' };
        }

        // 4. Actualizar la cantidad de esa variante
        const descripcionesActualizadas = productoInfo.descripcion.map((desc, index) => 
            index === descripcionIndex 
                ? { ...desc, cantidad: nuevaCantidad }
                : desc
        );

        // 5. Crear payload para actualizar
        const updateData = {
            nombre: productoInfo.nombre,
            tipo: productoInfo.tipo,
            precio: productoInfo.precio,
            imagen: productoInfo.imagen,
            descripcion: descripcionesActualizadas
        };

        console.log(`📦 Updating inventory for ${productoCarrito.nombre}: ${cantidadActual} -> ${nuevaCantidad}`);
        
        const success = await updateProductoCantidad(productoId, updateData);
        
        if (success) {
            console.log(`✅ Inventory updated successfully for ${productoCarrito.nombre}`);
            return { 
                success: true, 
                message: `Updated ${productoCarrito.nombre}: ${cantidadActual} → ${nuevaCantidad}` 
            };
        } else {
            console.error(`❌ Failed to update inventory for ${productoCarrito.nombre}`);
            return { success: false, error: 'Update failed' };
        }

    } catch (error) {
        console.error(`❌ Error processing product ${productoCarrito.nombre}:`, error);
        return { success: false, error: error.message };
    }
};

    // Función para procesar el pago
    const processPayment = async () => {
        if (!cartData) return;

        setIsPaying(true);
        setError('');

        try {
            console.log("🔄 Starting inventory update for all products...");
            const resultados = [];
            let successfulUpdates = 0;

            for (const producto of cartData.productos) {
                const resultado = await procesarProducto(producto);
                resultados.push({
                    producto: producto.nombre,
                    ...resultado
                });
                
                if (resultado.success) {
                    successfulUpdates++;
                }
            }

            console.log(`📊 Inventory update results: ${successfulUpdates}/${cartData.productos.length} successful`);

            // 2. Si al menos un producto fue actualizado, generar el ticket
            if (successfulUpdates > 0) {
                const ticketData = {
                    carritoId: cartData._id || cartData.carritoId,
                    usuarioEmail: cartData.usuarioEmail,
                    productos: cartData.productos,
                    total: cartData.total,
                    estado: "payed",
                    fechaPago: new Date().toISOString(),
                    inventoryResults: resultados
                };

                console.log("🎫 Generating ticket with data:", ticketData);

                const response = await fetch(`${API_BASE_URL}/api/ticket`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${APP_TOKEN}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    credentials: 'include',
                    body: JSON.stringify(ticketData)
                });

                if (!response.ok) {
                    throw new Error(`Ticket generation failed with status: ${response.status}`);
                }

                const data = await response.json();
                console.log("✅ Ticket generated:", data);

                // 3. Mostrar resultado final
                const failedProducts = resultados.filter(r => !r.success);
                let mensaje = `✅ Payment processed successfully!\n\n`;
                mensaje += `🎫 Ticket ID: ${data._id || data.data?._id}\n`;
                mensaje += `📦 Inventory updated: ${successfulUpdates}/${cartData.productos.length} products\n`;
                
                if (failedProducts.length > 0) {
                    mensaje += `\n⚠️ Some products had issues:\n`;
                    failedProducts.forEach(r => {
                        mensaje += `• ${r.producto}: ${r.error}\n`;
                    });
                } else {
                    mensaje += `\nAll products processed successfully!`;
                }

                alert(mensaje);

                // Resetear el estado
                setCartData(null);
                setCartId('');
            } else {
                throw new Error('No products could be processed. Please check inventory levels and product variants.');
            }

        } catch (error) {
            console.error("❌ Error processing payment:", error);
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
            <button className="payment-toggle-btn" onClick={onToggle}>
                💳
            </button>

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
                                placeholder="Enter cart ID from saved cart..."
                                disabled={loading || isPaying}
                            />
                            <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '5px' }}>
                                Use the exact Cart ID from your saved cart confirmation
                            </small>
                        </div>

                        <button
                            className="btn-charge-cart"
                            onClick={chargeShoppingCart}
                            disabled={loading || isPaying || !cartId.trim()}
                        >
                            {loading ? 'Loading Cart...' : 'Charge Shopping Cart'}
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
                                        <p><strong>User:</strong> {cartData.usuarioEmail}</p>
                                        <p><strong>Total:</strong> ${cartData.total?.toFixed(2)}</p>
                                        <p><strong>Items:</strong> {cartData.productos?.length || 0}</p>
                                        <p><strong>Status:</strong> {cartData.estado}</p>
                                        <p><strong>Date:</strong> {new Date(cartData.fecha).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="products-preview">
                                    <h6>Products in Cart:</h6>
                                    {cartData.productos?.map((producto, index) => (
                                        <div key={index} className="product-preview">
                                            <span className="product-name">{producto.nombre}</span>
                                            <span className="product-quantity">{producto.cantidadComprada}x</span>
                                            <span className="product-price">${producto.precioUnitario}</span>
                                            {producto.descripcion?.[0] && (
                                                <span className="product-details">
                                                    {producto.descripcion[0].color} / {producto.descripcion[0].talla}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="payment-actions">
                                    <button
                                        className="btn-pay"
                                        onClick={processPayment}
                                        disabled={isPaying}
                                    >
                                        {isPaying ? 'Processing Payment...' : `Pay $${cartData.total?.toFixed(2)}`}
                                    </button>
                                    <button
                                        className="btn-clear"
                                        onClick={clearCart}
                                        disabled={isPaying}
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