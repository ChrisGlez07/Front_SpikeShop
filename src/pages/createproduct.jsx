import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../createproduct.css";
import Footer from "./Footer";

export default function CreateProduct() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [descItem, setDescItem] = useState({
    color: "",
    talla: "",
    cantidad: ""
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const APP_TOKEN = import.meta.env.VITE_TOKEN;

  useEffect(() => {
    const checkUserAuth = () => {
      try {
        const savedUser = localStorage.getItem('user_session');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          if (userData.role !== 'admin') {
            alert("You don´t have permission to access this page");
            navigate('/items');
            return;
          }
        } else {
          alert("You must log in to access this page");
          navigate('/login');
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

  const addDescripcionItem = () => {
    setDescripcion([...descripcion, descItem]);
    setDescItem({ color: "", talla: "", cantidad: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== 'admin') {
      alert("You don´t have permission to create products");
      return;
    }
    if (descripcion.length === 0) {
      alert("You must add at least one variation (description)");
      return;
    }

    try {
      const body = {
        nombre: nombre,
        tipo: tipo,
        precio: parseFloat(precio),
        imagen: imagen,
        descripcion: descripcion
      };

      const response = await fetch(`${API_BASE_URL}/productos/createProducto`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
        },
        body: JSON.stringify(body)
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          alert("Error 403: You don´t have permission to create products.");
          return;
        }
        
        alert(`Error creating product: ${responseData.message || "Error Unknown"}`);
        return;
      }

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

  if (isLoading) {
    return (
      <div className="create-container">
        <div className="loading">Verificando permisos...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="create-container">
        <div className="error-message">
          No tienes permisos para acceder a esta página. 
          Rol actual: {user?.role || 'No user'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="create-container">
        <h2>Create Product</h2>
        <div className="user-info">
          <small>Conectado como: {user.username} ({user.role})</small>
        </div>

        <form className="create-form" onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder="Product name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <select 
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>

          <input 
            type="number"
            placeholder="Price"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />

          <input 
            type="text"
            placeholder="Image URL"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            required
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

          <Link to="/admin2" className="nav-link home-link">
            Go to Stock Home
          </Link>
        </form>
      </div>
    <Footer />
    </>
  );
}