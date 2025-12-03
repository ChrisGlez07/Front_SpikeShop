import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../editproduct.css";
import Footer from "./Footer";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const APP_TOKEN = import.meta.env.VITE_TOKEN;

export default function EditProducto() {
    const [productos, setProductos] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAuth = () => {
            try {
                const savedUser = localStorage.getItem('user_session');
                
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    
                    if (userData.role !== 'admin') {
                        toast.error("You don´t have permission to access this page");
                        setTimeout(() => navigate("/items"), 2500);
                        return;
                    }
                } else {
                    toast.error("You must log in to access this page");
                    setTimeout(() => navigate("/login"), 2500);
                    return;
                }
            } catch (error) {
                console.error('Error verificating Authentificators:', error);
                localStorage.removeItem('user_session');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAuth();
    }, [navigate]);

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

            if (data && Array.isArray(data.data)) {
                const productosProcesados = data.data.map(producto => ({
                    id: producto.id || producto._id,
                    nombre: producto.nombre,
                    tipo: producto.tipo,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    descripcion: producto.descripcion || []
                }));
                setProductos(productosProcesados);
            } else {
                setProductos([]);
            }

        } catch (error) {
            console.error("Error obtain the products:", error.message);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchProductos();
        }
    }, [user]);

    const handleSelect = async (e) => {
        const id = e.target.value;
        setSelectedId(id);

        if (id) {
            try {
                const res = await fetch(`${API_BASE_URL}/productos/producto/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${APP_TOKEN}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    credentials: 'include'
                });
                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error(`Product not found with ID: "${id}"`);
                    }
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                
                const data = await res.json();
                
                if (data.data) {
                    setFormData({ 
                        id: data.data.id || data.data._id,
                        nombre: data.data.nombre,
                        tipo: data.data.tipo,
                        precio: data.data.precio,
                        imagen: data.data.imagen,
                        descripcion: data.data.descripcion || []
                    });
                } else {
                    throw new Error("The data for the selected product is missing.");
                }
            } catch (err) {
                toast.error(`Error: ${err.message}`);
            }
        } else {
            setFormData(null);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDescripcionChange = (index, field, value) => {
        const updated = [...formData.descripcion];
        updated[index][field] = value;

        setFormData({
            ...formData,
            descripcion: updated
        });
    };

    const handleDeleteVariation = (index) => {
        if (formData.descripcion.length <= 1) {
            toast.error("The product must have at least one variation.");
            return;
        }

        toast((t) => (
            <div className="toast-confirm-container">
                <p>Are you sure you want to delete this variation?</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            
                            const updatedDescripcion = formData.descripcion.filter((_, i) => i !== index);
                            
                            setFormData({
                                ...formData,
                                descripcion: updatedDescripcion
                            });
                            
                            toast.success("Variation successfully deleted.", { 
                                duration: 3000, 
                                id: t.id
                            });
                        }} 
                        className="btn-toast-confirm"
                        style={{ background: '#dc3545', color: 'white', marginRight: '8px' }}
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)} 
                        className="btn-toast-cancel"
                        style={{ background: '#6c757d', color: 'white' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { 
            duration: Infinity, 
            className: 'custom-confirm-toast', 
        });
    };

    const handleAddVariation = () => {
        const newVariation = {
            color: "black",
            talla: "M",
            cantidad: 0
        };

        setFormData({
            ...formData,
            descripcion: [...formData.descripcion, newVariation]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || user.role !== 'admin') {
            toast.error("You don´t have permission to update products");
            return;
        }

        const datosEnviados = {
            id: formData.id,
            nombre: formData.nombre,
            tipo: formData.tipo,
            precio: parseFloat(formData.precio),
            imagen: formData.imagen,
            descripcion: formData.descripcion.map(item => ({
                color: item.color,
                talla: item.talla,
                cantidad: parseInt(item.cantidad)
            }))
        };

        try {
            const res = await fetch(`${API_BASE_URL}/productos/updateProducto`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(datosEnviados)
            });

            if (res.status === 204) {
                toast.success("Product updated successfully.");
                await fetchProductos();
                setSelectedId("");
                setFormData(null);
                return;
            }

            const textResponse = await res.text();
            let data;
            
            if (textResponse) {
                data = JSON.parse(textResponse);
            } else {
                data = { message: "Successfully Operation" };
            }

            if (res.ok) {
                toast.success(data.message || "Product updated successfully.");
                await fetchProductos();
                setSelectedId("");
                setFormData(null);
            } else {
                toast.error(`Server Error: ${data.message || `Code ${res.status}`}`);
            }

        } catch (error){
            toast.error(`Error Updating the product: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        if (!user || user.role !== 'admin') {
            toast.error("You don´t have permission to delete products");
            return;
        }

        if (!formData?.id) {
            toast.error("There is no product selected to delete.");
            return;
        }

        const productoNombre = formData.nombre;
        const productoId = formData.id;

        toast((t) => (
            <div className="toast-confirm-container">
                <p>Are you sure that you want to delete "{productoNombre}"? This action cannot be cancelled.</p>
                <div className="toast-buttons">
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            performDelete(productoId, t.id); 
                        }} 
                        className="btn-toast-delete"
                        style={{ background: '#dc3545', color: 'white', marginRight: '8px', fontWeight: 'bold' }}
                    >
                        Yes, Delete Product
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)} 
                        className="btn-toast-cancel"
                        style={{ background: '#6c757d', color: 'white' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { 
            duration: Infinity,
            className: 'custom-confirm-toast', 
        });
    };

const performDelete = async (id, toastId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/productos/deleteProducto`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify({ id: id })
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            
            toast.success(data.message || "Product deleted successfully.", { 
                duration: 1000, 
                id: toastId 
            });
            
            await fetchProductos();
            setSelectedId("");
            setFormData(null);

        } catch (err) {
            toast.error(`Error deleting the product: ${err.message}`, { 
                duration: 1000, 
                id: toastId 
            });
        }
    };

    if (isLoading) {
        return (
            <div className="edit-container">
                <div className="loading">Verifying Permissions...</div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="edit-container">
                <div className="error-message">
                    You do not have permission to access this page. 
                    Current Role: {user?.role || 'No Admin'}
                </div>
            </div>
        );
    }

    return (
        <>
        <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#4BB543",
              color: "white",
              fontWeight: "bold"
            }
          },
          error: {
            style: {
              background: "#DC3545",
              color: "white",
              fontWeight: "bold"
            }
          }
        }}
      />
            <div className="edit-container">
                <h2>Product Configuration</h2>
                <div className="user-info">
                    <small>Connect as: {user.username} ({user.role})</small>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading products...</span>
                        </div>
                        <p>Loading Products...</p>
                    </div>
                )}

                <select 
                    className="select-product" 
                    onChange={handleSelect} 
                    value={selectedId}
                    disabled={loading}
                >
                    <option value="">Choose one product...</option>
                    {productos.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} - {p.tipo} - ${p.precio} 
                        </option>
                    ))}
                </select>

                {productos.length === 0 && !loading && (
                    <div className="no-products">
                        <p>There are no products to edit.</p>
                    </div>
                )}

                {formData && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-columns-container">
                            <div className="form-column">
                                <label>Producto ID</label>
                                <input
                                    type="text"
                                    value={formData.id || ''}
                                    disabled
                                    className="disabled-input"
                                />

                                <label>Name</label>
                                <input
                                    name="nombre"
                                    value={formData.nombre || ''}
                                    onChange={handleChange}
                                    required
                                />
                        
                                <label>Type</label>
                                <select
                                    name="tipo"
                                    value={formData.tipo || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose one type</option>
                                    <option value="Women">Women</option>
                                    <option value="Men">Men</option>
                                    <option value="Kids">Kids</option>
                                </select>
                            </div>
                            
                            <div className="form-column">
                                <label>Price</label>
                                <input
                                    type="number"
                                    step="1"
                                    name="precio"
                                    value={formData.precio || ''}
                                    onChange={handleChange}
                                    required
                                />

                                <label>Url Link Image</label>
                                <input
                                    name="imagen"
                                    value={formData.imagen || ''}
                                    onChange={handleChange}
                                    required
                                />
                                
                                <div className="image-preview-container">
                                    <label>Image Preview</label>
                                    <div className="image-preview">
                                        {formData.imagen ? (
                                            <img 
                                                src={formData.imagen} 
                                                alt="Product preview" 
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                                                }}
                                            />
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <span>No image available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="variations-header">
                            <h3>Variations</h3>
                            <button 
                                type="button" 
                                className="btn-add-variation"
                                onClick={handleAddVariation}
                            >
                                + Add Variation
                            </button>
                        </div>

                        {formData.descripcion && formData.descripcion.map((item, index) => (
                            <div key={index} className="variant-box">
                                    <h4>Variation {index + 1}</h4>
                                <label>Color</label>
                                <select
                                    value={item.color || 'red'}
                                    onChange={(e) =>
                                        handleDescripcionChange(index, "color", e.target.value)
                                    }
                                    required
                                >
                                    <option value="red">Red</option>
                                    <option value="blue">Blue</option>
                                    <option value="black">Black</option>
                                </select>

                                <label>Size</label>
                                <select
                                    value={item.talla || 'M'}
                                    onChange={(e) =>
                                        handleDescripcionChange(index, "talla", e.target.value)
                                    }
                                    required
                                >
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>

                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={item.cantidad || 0}
                                    onChange={(e) =>
                                        handleDescripcionChange(index, "cantidad", parseInt(e.target.value) || 0)
                                    }
                                    min="0"
                                    required
                                />

                                    <button 
                                        type="button" 
                                        className="btn-delete-variation"
                                        onClick={() => handleDeleteVariation(index)}
                                        disabled={formData.descripcion.length <= 1}
                                        title="Delete this variation"
                                    >
                                        Delete
                                    </button>
                            </div>
                        ))}

                        <div className="form-buttons">
                            <button type="submit" className="btn-save">Save Changes</button>
                            <button type="button" className="btn-delete" onClick={handleDelete}>
                                Delete Product
                            </button>
                        </div>
                        <br />
                        <br />
                    </form>
                )}
                <Link to="/admin2" className="nav-link home-link">
                    Go to Stock Home
                </Link>
            </div>
        <Footer />
    </>
    );
}