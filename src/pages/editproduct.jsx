import { useState, useEffect } from "react";
import "../createproduct.css";

export default function EditProducto() {

    const [productos, setProductos] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [formData, setFormData] = useState(null);

    const token = localStorage.getItem("token");

    // ✅ Cargar productos desde /productos/items
    useEffect(() => {
        fetch("http://localhost:4000/api/productos/items", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setProductos(data.data))
        .catch(err => console.log(err));
    }, [token]);

    // ✅ Selección por nombre
    const handleSelect = (e) => {
        const name = e.target.value;
        setSelectedName(name);

        const selected = productos.find(p => p.nombre === name);

        // ✅ Guardamos todo el producto incluyendo ID
        setFormData({ ...selected });
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

    // ✅ Enviamos el PATCH con ID (como tu backend requiere)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:4000/api/updateProducto", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                id: formData.id,   // ✅ requerido por tu controlador
                ...formData
            })
        });

        const data = await res.json();
        alert(data.message);
    };

    return (
        <div className="edit-container">
            <h2>Editar Producto</h2>

            {/* ✅ Lista con nombres */}
            <select className="select-product" onChange={handleSelect}>
                <option value="">Selecciona un producto...</option>

                {productos.map(p => (
                    <option key={p.id} value={p.nombre}>
                        {p.nombre}
                    </option>
                ))}
            </select>

            {formData && (
                <form onSubmit={handleSubmit} className="edit-form">

                    <label>Nombre</label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />

                    <label>Tipo</label>
                    <input
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                    />

                    <label>Precio</label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                    />

                    <label>Imagen</label>
                    <input
                        name="imagen"
                        value={formData.imagen}
                        onChange={handleChange}
                    />

                    <h3>Variantes</h3>

                    {formData.descripcion.map((item, index) => (
                        <div key={index} className="variant-box">

                            <label>Color</label>
                            <select
                                value={item.color}
                                onChange={(e) =>
                                    handleDescripcionChange(index, "color", e.target.value)
                                }
                            >
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="black">Black</option>
                            </select>

                            <label>Talla</label>
                            <select
                                value={item.talla}
                                onChange={(e) =>
                                    handleDescripcionChange(index, "talla", e.target.value)
                                }
                            >
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>

                            <label>Cantidad</label>
                            <input
                                type="number"
                                value={item.cantidad}
                                onChange={(e) =>
                                    handleDescripcionChange(index, "cantidad", e.target.value)
                                }
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn-save">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
}
