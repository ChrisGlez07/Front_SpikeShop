import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const APP_TOKEN = import.meta.env.VITE_TOKEN;

export default function EditProducto() {
    const [productos, setProductos] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Cargar productos
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
            console.log("Datos recibidos del backend:", data);

            if (data && Array.isArray(data.data)) {
                const productosProcesados = data.data.map(producto => ({
                    id: producto.id || producto._id,
                    nombre: producto.nombre,
                    tipo: producto.tipo,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    descripcion: producto.descripcion || []
                }));
                console.log("Productos disponibles:", productosProcesados);
                setProductos(productosProcesados);
            } else {
                console.log("No se encontraron productos");
                setProductos([]);
            }

        } catch (error) {
            console.error("Error al obtener productos:", error.message);
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // ✅ Selección por ID - MÁS CONFIABLE
    const handleSelect = async (e) => {
        const id = e.target.value;
        setSelectedId(id);

        if (id) {
            try {
                console.log("Buscando producto por ID:", id);
                
                const res = await fetch(`${API_BASE_URL}/productos/producto/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${APP_TOKEN}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    credentials: 'include'
                });
                
                console.log("Respuesta del servidor:", res.status, res.statusText);
                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error(`Producto no encontrado con ID: "${id}"`);
                    }
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                
                const data = await res.json();
                console.log("Datos del producto:", data);
                
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
                    throw new Error("No se encontraron datos del producto");
                }
            } catch (err) {
                console.log("Error cargando producto:", err);
                alert(`Error: ${err.message}`);
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

    // ✅ Enviamos el PATCH con ID - CÓDIGO CORREGIDO
    const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ DEBUG: Mostrar datos que se envían
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
    
    console.log("📤 DATOS QUE SE ENVÍAN:", datosEnviados);

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

        console.log("📨 Status de respuesta:", res.status);
        console.log("📨 Status text:", res.statusText);
        console.log("📨 Headers:", Object.fromEntries(res.headers.entries()));

        // Manejar respuesta 204 (No Content)
        if (res.status === 204) {
            console.log("⚠️ El servidor respondió con 204 No Content");
            alert("Producto actualizado exitosamente (sin contenido de respuesta)");
            await fetchProductos();
            setSelectedId("");
            setFormData(null);
            return;
        }

        // Para otros status, intentar parsear JSON
        const textResponse = await res.text();
        console.log("📥 Respuesta en texto:", textResponse);

        let data;
        if (textResponse) {
            try {
                data = JSON.parse(textResponse);
                console.log("📥 Respuesta parseada:", data);
            } catch (jsonError) {
                console.error("❌ Error parseando JSON:", jsonError);
                alert("Error: Respuesta del servidor no es JSON válido");
                return;
            }
        } else {
            data = { message: "Operación exitosa (sin datos)" };
        }

        // ✅ LUEGO usar la data
        if (res.ok) {
            alert(data.message || "Producto actualizado exitosamente");
            await fetchProductos();
            setSelectedId("");
            setFormData(null);
        } else {
            console.error("❌ Error del servidor:", data);
            alert(`Error del servidor: ${data.message || `Código ${res.status}`}`);
        }

    } catch (err) {
        console.log("💥 Error de red/actualización:", err);
        alert("Error de conexión al actualizar el producto");
    }
};

    return (
        <div className="edit-container">
            <h2>Editar Producto</h2>

            {loading && (
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading products...</span>
                    </div>
                    <p>Cargando productos...</p>
                </div>
            )}

            {/* ✅ Lista con IDs en lugar de nombres */}
            <select 
                className="select-product" 
                onChange={handleSelect} 
                value={selectedId}
                disabled={loading}
            >
                <option value="">Selecciona un producto...</option>
                {productos.map(p => (
                    <option key={p.id} value={p.id}>
                        {p.nombre} - ${p.precio} (ID: {p.id})
                    </option>
                ))}
            </select>

            {productos.length === 0 && !loading && (
                <div className="no-products">
                    <p>No hay productos disponibles para editar.</p>
                </div>
            )}

            {formData && (
                <form onSubmit={handleSubmit} className="edit-form">
                    <label>ID del Producto</label>
                    <input
                        type="text"
                        value={formData.id || ''}
                        disabled
                        className="disabled-input"
                    />

                    <label>Nombre</label>
                    <input
                        name="nombre"
                        value={formData.nombre || ''}
                        onChange={handleChange}
                        required
                    />

                    <label>Tipo</label>
                    <input
                        name="tipo"
                        value={formData.tipo || ''}
                        onChange={handleChange}
                        required
                    />

                    <label>Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        name="precio"
                        value={formData.precio || ''}
                        onChange={handleChange}
                        required
                    />

                    <label>Imagen URL</label>
                    <input
                        name="imagen"
                        value={formData.imagen || ''}
                        onChange={handleChange}
                        required
                    />

                    <h3>Variantes</h3>

                    {formData.descripcion && formData.descripcion.map((item, index) => (
                        <div key={index} className="variant-box">
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

                            <label>Talla</label>
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

                            <label>Cantidad</label>
                            <input
                                type="number"
                                value={item.cantidad || 0}
                                onChange={(e) =>
                                    handleDescripcionChange(index, "cantidad", parseInt(e.target.value) || 0)
                                }
                                min="0"
                                required
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn-save">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
}