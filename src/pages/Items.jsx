import React, { useState, useEffect } from "react";
import Card from "./card.jsx";
import Filters from "./filtro.jsx";
import "../Items.css";

const Items = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const API_BASE_URL = "https://crenate-ariella-questioningly.ngrok-free.dev";
    const APP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IkFjY2VzbyBnZW5lcmljbyIsImlhdCI6MTc2MjI4OTc3MSwiZXhwIjoxNzYyMjkzMzcxfQ.b-P9iGNxJuLi0IotmjO1p2iTJVq46aDdA7LidEfOvDs";

    const Articulos = [
        {
            name: "Tenis Running Ultra",
            img: "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
            price: "$74.99",
            originalPrice: "$99.99",
            badge: "Nuevo"
        },
        {
            name: "Zapatillas Urbanas",
            img: "https://i.pinimg.com/736x/0b/27/a9/0b27a95f0ea82759f11a32ebb058b691.jpg",
            price: "$65.99",
            badge: null
        },
        {
            name: "Botines Deportivos",
            img: "https://i.pinimg.com/736x/e9/9a/0a/e99a0a3ff733a36a5764fa0f99fc8f9c.jpg",
            price: "$95.99",
            originalPrice: "$119.99",
            badge: "Popular"
        },
        {
            name: "Sneakers Casual",
            img: "https://i.pinimg.com/736x/2a/6b/10/2a6b10e91896a1d96838ed3c000617e4.jpg",
            price: "$59.99",
            badge: null
        },
        {
            name: "Zapatos Elegance Pro",
            img: "https://i.pinimg.com/736x/07/1d/39/071d398168fa7f1a308efa173933372a.jpg",
            price: "$109.99",
            badge: "Premium"
        },
    ];
    const fetchProductos = async () => {
        try {
            setLoading(true);
            
            const response = await fetch(`${API_BASE_URL}/items`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                const itemsFromAPI = data.items || data.data || [];

                if (itemsFromAPI.length > 0) {
                    const productosMapeados = itemsFromAPI.map((producto) => ({
                        name: producto.nombre || "Producto sin nombre",
                        img:
                            typeof producto.imagen === "string" && producto.imagen.startsWith("http")
                                ? producto.imagen
                                : "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
                        price: `$${producto.precio || "0"}`,
                        originalPrice: null,
                        badge: producto.tipo || null,
                    }));

                    setProductos(productosMapeados);
                    console.log("✅ Conexión exitosa con el API. Productos cargados desde el servidor.");
                } else {
                    console.log("⚠️ API respondió sin productos. Cargando productos predefinidos.");
                    setProductos(Articulos);
                }
            } else {
                throw new Error(data.message || "Error en la respuesta del API");
            }
        } catch (error) {
            console.error("❌ No se pudo conectar con el API. Se mostrarán productos predefinidos.");
            setProductos(Articulos);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <div className="items-page-container">
            {/* Filtros en el lado izquierdo */}
            <div className="filters-sidebar">
                <Filters />
            </div>

            {/* Contenido principal en el lado derecho */}
            <div className="items-main-content">
                {/* Header de la sección */}
                <div className="items-header">
                    <h1 className="items-title">Nuestra Colección</h1>
                    <p className="items-subtitle">
                        {loading
                            ? "Cargando productos..."
                            : productos.length > 0
                            ? `Descubre ${productos.length} productos con calidad premium`
                            : "No hay productos disponibles"}
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando productos...</span>
                        </div>
                        <p>Conectando con el servidor...</p>
                    </div>
                )}

                {/* Grid de productos */}
                {!loading && (
                    <div className="container">
                        <div className="row">
                            {productos.length > 0 ? (
                                productos.map((producto, index) => (
                                    <Card key={index} producto={producto} />
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="no-products">
                                        <h4>No hay productos disponibles</h4>
                                        <p>Intenta recargar la página o contacta al administrador.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Items;
