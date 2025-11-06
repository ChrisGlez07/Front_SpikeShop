import React, { useState, useEffect } from "react";
import Card from "./card.jsx";
import Filters from "./filtro.jsx";
import "../Items.css";

const Items = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_BASE_URL;
    const APP_TOKEN = import.meta.env.VITE_TOKEN;

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

const processProductData = (data) => {
    console.log("Datos CRUDOS recibidos:", data);
    
    let productosArray = [];
    
    if (data && Array.isArray(data.data)) {
        productosArray = data.data;
    }
    
    if (Array.isArray(productosArray) && productosArray.length > 0) {
        const productosMapeados = productosArray.map((producto) => ({
            name: producto.nombre,
            img: producto.imagen,
            price: `$${producto.precio}`,
            badge: producto.tipo,
        }));

        console.log("Productos mapeados:", productosMapeados);
        setProductos(productosMapeados);
    } else {
        console.log("No se encontraron productos, usando datos predefinidos");
        setProductos(Articulos);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <div className="items-page-container">
            <div className="filters-sidebar">
                <Filters />
            </div>

            <div className="items-main-content">
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

                {loading && (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando productos...</span>
                        </div>
                        <p>Conectando con el servidor...</p>
                    </div>
                )}

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
                                        <p>Intenta recargar la página o contacta al administrador please.</p>
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