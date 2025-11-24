import React, { useState, useEffect } from "react";
import Card from "./card.jsx";
import "../Items.css";
import '../Filters.css';
import '../CartDropdown.css';
import '../PurchaseConfirmationModal.css';
import CartDropdown from "./CartDropdown.jsx";
import CartPaymentDropdown from "./CartPaymentDropdown.jsx";
import PurchaseConfirmationModal from "./PurchaseConfirmationModal.jsx";

const Items = () => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [lastCartId, setLastCartId] = useState("");
    const [lastCartData, setLastCartData] = useState({});
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const [filtros, setFiltros] = useState({
        categorias: [],
        precio: '',
        talla: ''
    });

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const APP_TOKEN = import.meta.env.VITE_TOKEN;

    useEffect(() => {
        const savedUser = localStorage.getItem('user_session');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('user_session');
            }
        }
    }, []);

    const Articulos = [
        {
            id: 1,
            name: "Tenis Running Ultra",
            img: "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
            price: "$74.99",
            originalPrice: "$99.99",
            badge: "Nuevo",
            tipo: "Nuevo",
            precioNumerico: 74.99,
            descripciones: [
                {
                    color: "red",
                    talla: "M",
                    cantidad: 10
                },
                {
                    color: "blue",
                    talla: "L",
                    cantidad: 5
                },
                {
                    color: "black",
                    talla: "XL",
                    cantidad: 8
                }
            ]
        },
        {
            id: 2,
            name: "Zapatillas Urbanas",
            img: "https://i.pinimg.com/736x/0b/27/a9/0b27a95f0ea82759f11a32ebb058b691.jpg",
            price: "$65.99",
            badge: null,
            tipo: "Popular",
            precioNumerico: 65.99,
            descripciones: [
                {
                    color: "black",
                    talla: "S",
                    cantidad: 15
                },
                {
                    color: "blue",
                    talla: "M",
                    cantidad: 7
                }
            ]
        },
        {
            id: 3,
            name: "Botines Deportivos",
            img: "https://i.pinimg.com/736x/e9/9a/0a/e99a0a3ff733a36a5764fa0f99fc8f9c.jpg",
            price: "$95.99",
            originalPrice: "$119.99",
            badge: "Popular",
            tipo: "Popular",
            precioNumerico: 95.99,
            descripciones: [
                {
                    color: "black",
                    talla: "L",
                    cantidad: 12
                },
                {
                    color: "red",
                    talla: "M",
                    cantidad: 6
                },
                {
                    color: "blue",
                    talla: "XL",
                    cantidad: 3
                }
            ]
        },
        {
            id: 4,
            name: "Sneakers Casual",
            img: "https://i.pinimg.com/736x/2a/6b/10/2a6b10e91896a1d96838ed3c000617e4.jpg",
            price: "$59.99",
            badge: null,
            tipo: "Básico",
            precioNumerico: 59.99,
            descripciones: [
                {
                    color: "blue",
                    talla: "S",
                    cantidad: 20
                },
                {
                    color: "red",
                    talla: "M",
                    cantidad: 10
                }
            ]
        },
        {
            id: 5,
            name: "Zapatos Elegance Pro",
            img: "https://i.pinimg.com/736x/07/1d/39/071d398168fa7f1a308efa173933372a.jpg",
            price: "$109.99",
            badge: "Premium",
            tipo: "Premium",
            precioNumerico: 109.99,
            descripciones: [
                {
                    color: "black",
                    talla: "M",
                    cantidad: 8
                },
                {
                    color: "black",
                    talla: "L",
                    cantidad: 4
                },
                {
                    color: "black",
                    talla: "XL",
                    cantidad: 2
                }
            ]
        },
    ];

    // Función addToCart
    const addToCart = (productoCarrito) => {
        console.log("Agregando al carrito:", productoCarrito);
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item =>
                item.id === productoCarrito.id &&
                item.talla === productoCarrito.talla &&
                item.color === productoCarrito.color
            );

            if (existingItemIndex !== -1) {
                return prevItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...productoCarrito, quantity: 1 }];
            }
        });
    };

    const updateCartQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map((item, i) =>
                i === index ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (index) => {
        setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const saveCartItems = async () => {
        if (!user || !user.email) {
            alert("You need to be logged in to save your cart");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty. Add some items first.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const total = cartItems.reduce((sum, item) =>
                sum + (item.precioNumerico * item.quantity), 0
            );

            const cartData = {
                usuarioEmail: user.email,
                productos: cartItems.map(item => ({
                    productoId: item._id || `local_${item.id}_${Date.now()}`,
                    nombre: item.name,
                    tipo: item.tipo || item.badge || "General",
                    cantidadComprada: item.quantity,
                    precioUnitario: item.precioNumerico,
                    imagen: item.img,
                    descripcion: [
                        {
                            color: item.color || "default",
                            talla: item.talla || "M",
                            cantidad: item.quantity
                        }
                    ]
                })),
                total: total,
                estado: 'activo'
            };

            console.log("Enviando datos al servidor:", cartData);

            const response = await fetch(`${API_BASE_URL}/api/carrito/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${APP_TOKEN}`,
                },
                body: JSON.stringify(cartData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const result = await response.json();
            console.log("✅ RESPUESTA COMPLETA DEL SERVIDOR:", result);

            // DEBUG: Verificar todas las posibles ubicaciones del ID
            console.log("🔍 Buscando cartId en:", {
                result_data: result.data,
                result_data_id: result.data?._id,
                result_data_carritoId: result.data?.carritoId,
                result_carritoId: result.carritoId,
                result_id: result._id
            });

            // Obtener el ID del carrito con más opciones
            const cartId = result.data?._id || 
                          result.data?.carritoId || 
                          result.carritoId || 
                          result._id ||
                          `temp_${Date.now()}`;

            console.log("🎯 Cart ID encontrado:", cartId);

            setLastCartId(cartId);
            setLastCartData({
                total: total,
                productCount: cartItems.length,
                products: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.precioNumerico,
                    color: item.color,
                    size: item.talla
                }))
            });

            // Mostrar modal de confirmación
            setShowConfirmation(true);

            // Limpiar carrito después de guardar exitosamente
            setCartItems([]);
            setIsCartOpen(false);

        } catch (error) {
            console.error("Error saving cart items:", error);
            setError("Failed to save cart: " + error.message);
            alert("Failed to save cart. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Funciones toggle corregidas
    const togglePayment = () => {
        setIsPaymentOpen(!isPaymentOpen);
        // Cerrar el carrito normal si está abierto
        if (isCartOpen) {
            setIsCartOpen(false);
        }
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
        // Cerrar el payment si está abierto
        if (isPaymentOpen) {
            setIsPaymentOpen(false);
        }
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    // Manejar cambios en los filtros
    const handleCategoriaChange = (categoria) => {
        setFiltros(prev => {
            const nuevasCategorias = prev.categorias.includes(categoria)
                ? prev.categorias.filter(cat => cat !== categoria)
                : [...prev.categorias, categoria];

            return { ...prev, categorias: nuevasCategorias };
        });
    };

    const handlePrecioChange = (rangoPrecio) => {
        setFiltros(prev => ({
            ...prev,
            precio: prev.precio === rangoPrecio ? '' : rangoPrecio
        }));
    };

    const handleTallaChange = (talla) => {
        setFiltros(prev => ({
            ...prev,
            talla: prev.talla === talla ? '' : talla
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            categorias: [],
            precio: '',
            talla: ''
        });
    };

    // Aplicar filtros
    useEffect(() => {
        let resultados = [...productos];

        // Filtrar por categoría (badge/tipo)
        if (filtros.categorias.length > 0) {
            resultados = resultados.filter(producto =>
                filtros.categorias.includes(producto.badge) ||
                filtros.categorias.includes(producto.tipo)
            );
        }

        // Filtrar por precio
        if (filtros.precio) {
            switch (filtros.precio) {
                case 'under400':
                    resultados = resultados.filter(producto =>
                        producto.precioNumerico < 400
                    );
                    break;
                case 'price400-700':
                    resultados = resultados.filter(producto =>
                        producto.precioNumerico >= 400 && producto.precioNumerico <= 700
                    );
                    break;
                case 'over700':
                    resultados = resultados.filter(producto =>
                        producto.precioNumerico > 700
                    );
                    break;
                default:
                    break;
            }
        }

        // Filtrar por talla
        if (filtros.talla) {
            resultados = resultados.filter(producto =>
                producto.talla === filtros.talla ||
                (producto.descripciones && producto.descripciones.some(desc =>
                    desc.talla === filtros.talla && desc.cantidad > 0
                ))
            );
        }

        setProductosFiltrados(resultados);
    }, [productos, filtros]);

    const processProductData = (data) => {
        console.log("Datos CRUDOS recibidos:", data);

        let productosArray = [];

        if (data && Array.isArray(data.data)) {
            productosArray = data.data;
        }

        if (Array.isArray(productosArray) && productosArray.length > 0) {
            const productosMapeados = productosArray.map((producto) => ({
                id: producto._id,
                name: producto.nombre,
                img: producto.imagen,
                price: `$${producto.precio}`,
                precioNumerico: producto.precio,
                badge: producto.tipo,
                tipo: producto.tipo,
                descripciones: producto.descripcion ? producto.descripcion.map(desc => ({
                    color: desc.color,
                    talla: desc.talla,
                    cantidad: desc.cantidad
                })) : []
            }));
            console.log("Productos mapeados:", productosMapeados);
            setProductos(productosMapeados);
            setProductosFiltrados(productosMapeados);
        } else {
            console.log("No se encontraron productos, usando datos predefinidos");
            setProductos(Articulos);
            setProductosFiltrados(Articulos);
        }
    };

    const fetchProductos = async () => {
        try {
            setLoading(true);

            const timestamp = new Date().getTime();
            const url = `${API_BASE_URL}/productos/items?t=${timestamp}`;
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
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            processProductData(data);

        } catch (error) {
            console.error("Error al obtener productos:", error.message);
            console.log("Usando productos predefinidos");
            setProductos(Articulos);
            setProductosFiltrados(Articulos);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const Filters = () => {
        return (
            <div className="filters-section">
                <div className="filter-group">
                    <h6>Category</h6>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="Men"
                            checked={filtros.categorias.includes('Men')}
                            onChange={() => handleCategoriaChange('Men')}
                        />
                        <label className="form-check-label" htmlFor="Men">
                            Men
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="Women"
                            checked={filtros.categorias.includes('Women')}
                            onChange={() => handleCategoriaChange('Women')}
                        />
                        <label className="form-check-label" htmlFor="Women">
                            Women
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="Kids"
                            checked={filtros.categorias.includes('Kids')}
                            onChange={() => handleCategoriaChange('Kids')}
                        />
                        <label className="form-check-label" htmlFor="Kids">
                            Kids
                        </label>
                    </div>
                </div>

                <div className="filter-group">
                    <h6>Price range</h6>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="priceRange"
                            id="under400"
                            checked={filtros.precio === 'under400'}
                            onChange={() => handlePrecioChange('under400')}
                        />
                        <label className="form-check-label" htmlFor="under400">
                            Less than $400
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="priceRange"
                            id="price400-700"
                            checked={filtros.precio === 'price400-700'}
                            onChange={() => handlePrecioChange('price400-700')}
                        />
                        <label className="form-check-label" htmlFor="price400-700">
                            $400 - $700
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="priceRange"
                            id="over700"
                            checked={filtros.precio === 'over700'}
                            onChange={() => handlePrecioChange('over700')}
                        />
                        <label className="form-check-label" htmlFor="over700">
                            More than $700
                        </label>
                    </div>
                </div>

                <div className="filter-group">
                    <h6>Size</h6>
                    <div className="size-options">
                        {['S', 'M', 'L', 'XL'].map(talla => (
                            <button
                                key={talla}
                                className={`btn btn-sm ${filtros.talla === talla ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => handleTallaChange(talla)}
                            >
                                {talla}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-actions">
                    <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={limpiarFiltros}
                    >
                        Clean filters
                    </button>
                </div>

                <div className="filter-results">
                    <small>{productosFiltrados.length} of {productos.length} products</small>
                </div>
            </div>
        );
    };

    return (
        <div className="items-page-container">
            <div className="filters-sidebar">
                <Filters />
            </div>

            <div className="items-main-content">
                <div className="items-header">
                    <h1 className="items-title">Our collection</h1>
                    <p className="items-subtitle">
                        {loading
                            ? "Loading products..."
                            : productosFiltrados.length > 0
                                ? `Find our ${productosFiltrados.length} premium quality products`
                                : "There aren't products with those specifications"}
                    </p>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading products...</span>
                        </div>
                        <p>Connecting to server...</p>
                    </div>
                )}

                {!loading && (
                    <div className="container">
                        <div className="row">
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto, index) => (
                                    <Card key={index} producto={producto}
                                        onAddToCart={addToCart} />
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="no-products">
                                        <h4>No products match the filters</h4>
                                        <p>Try adjusting the filters or clear them to see all products.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Carrito normal para todos los usuarios */}
            <CartDropdown
                cartItems={cartItems}
                isOpen={isCartOpen}
                onToggle={toggleCart}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeFromCart}
                onSaveCartItems={saveCartItems}
                isLoading={isLoading}
            />

            {/* Payment dropdown solo para admin */}
            {user && user.role === 'admin' && (
                <CartPaymentDropdown
                    isOpen={isPaymentOpen}
                    onToggle={togglePayment}
                />
            )}

            <PurchaseConfirmationModal
                isOpen={showConfirmation}
                onClose={closeConfirmation}
                cartId={lastCartId}
                cartData={lastCartData}
            />
        </div>
    );
};

export default Items;