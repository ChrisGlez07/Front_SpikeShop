import { useState } from "react";
import "../createproduct.css";

export default function CreateProduct() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState([]);

  const [descItem, setDescItem] = useState({
    color: "",
    talla: "",
    cantidad: ""
  });

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const APP_TOKEN = import.meta.env.VITE_TOKEN;

  const addDescripcionItem = () => {
    if (!descItem.color || !descItem.talla || !descItem.cantidad) {
      alert("Complete color, size and quantity.");
      return;
    }

    setDescripcion([...descripcion, descItem]);
    setDescItem({ color: "", talla: "", cantidad: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { nombre, tipo, precio, imagen, descripcion };

      const response = await fetch(`${API_BASE_URL}/productos/createProducto`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) return alert("Error creating product.");

      alert("Product created successfully.");
      setNombre("");
      setTipo("");
      setPrecio("");
      setImagen("");
      setDescripcion([]);

    } catch (err) {
      alert("Error connecting to the server.");
    }
  };

  return (
    <div className="create-container">
      <h2>Create Product</h2>

      <form className="create-form" onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Product name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input 
          type="text"
          placeholder="Type"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <input 
          type="number"
          placeholder="Price"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <input 
          type="text"
          placeholder="Image URL"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        <h4>Variations (Color / Size / Quantity)</h4>

        <div className="desc-row">
          <select 
            value={descItem.color}
            onChange={(e) => setDescItem({ ...descItem, color: e.target.value })}
          >
            <option value="">Color</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="black">Black</option>
          </select>

          <select 
            value={descItem.talla}
            onChange={(e) => setDescItem({ ...descItem, talla: e.target.value })}
          >
            <option value="">Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={descItem.cantidad}
            onChange={(e) => setDescItem({ ...descItem, cantidad: e.target.value })}
          />

          <button type="button" className="btn-add" onClick={addDescripcionItem}>
            Add
          </button>
        </div>

        {descripcion.length > 0 && (
          <div className="desc-list">
            <h5>Added variations:</h5>
            {descripcion.map((d, i) => (
              <div key={i} className="desc-item">
                {d.color} - {d.talla} - {d.cantidad}
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn-submit">
          Create Product
        </button>
      </form>
    </div>
  );
}
