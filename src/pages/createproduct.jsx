import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../createproduct.css";
import Footer from "./Footer";

import toast, { Toaster } from "react-hot-toast";

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

  const authChecked = useRef(false);

  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const checkUserAuth = () => {
      try {
        const savedUser = localStorage.getItem("user_session");

        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          if (userData.role !== "admin") {
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
        console.error("Error verificating Authentificators:", error);
        localStorage.removeItem("user_session");
        navigate("/login");
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

    if (!user || user.role !== "admin") {
      toast.error("You don´t have permission to create products");
      return;
    }

    if (descripcion.length === 0) {
      toast.error("You must add at least one variation of Size/Color/Quantity");
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

      const response = await fetch(
        `${API_BASE_URL}/productos/createProducto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APP_TOKEN}`
          },
          body: JSON.stringify(body)
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Error 403: You don´t have permission to create products.");
          return;
        }

        toast.error(`Error creating product: ${responseData.message || "Error Unknown"}`);
        return;
      }

      toast.success("Product created successfully.");

      setNombre("");
      setTipo("");
      setPrecio("");
      setImagen("");
      setDescripcion([]);

    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("There was an error creating the product. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="create-container">
        <div className="loading">Verifying Permissions...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="create-container">
        <div className="error-message">
          You don´t have permission to access this page.
          Actual Role: {user?.role || "No Admin"}
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

      <div className="create-container">
        <h2>Create Product</h2>
        <div className="user-info">
          <small>
            Conectado como: {user.username} ({user.role})
          </small>
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
              onChange={(e) =>
                setDescItem({ ...descItem, color: e.target.value })
              }
            >
              <option value="">Color</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="black">Black</option>
            </select>

            <select
              value={descItem.talla}
              onChange={(e) =>
                setDescItem({ ...descItem, talla: e.target.value })
              }
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
              onChange={(e) =>
                setDescItem({ ...descItem, cantidad: e.target.value })
              }
            />

            <button
              type="button"
              className="btn-add"
              onClick={addDescripcionItem}
            >
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
