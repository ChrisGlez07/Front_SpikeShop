import React, { useState, useEffect } from "react";
import Card from "./card.jsx";
import Filters from "./filtro.jsx";
import '../App.css';

const Items = () => {
    const [email, setEmail] = useState("alex@example.com");
    const [password, setPassword] = useState("123456");

    const Articulos = [
        
        {
            name: "Tenis Running Ultra",
            img: "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
            price: "$74.99",
            originalPrice: "$99.99",
            badge: "Nuevo"
        },
         {
            name: "Tenis Running Ultra",
            img: "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
            price: "$74.99",
            originalPrice: "$99.99",
            badge: "Nuevo"
        },
         {
            name: "Tenis Running Ultra",
            img: "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
            price: "$74.99",
            originalPrice: "$99.99",
            badge: "Nuevo"
        },
         {
            name: "Tenis Running Ultra",
            img: "https://i.pinimg.com/736x/66/8b/67/668b671564f171d22818dcaa866a904e.jpg",
            price: "$74.99",
            originalPrice: "$99.99",
            badge: "Nuevo"
        },
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

    useEffect(() => {
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }, [email, password]);

    return (
        <div className="items-page-container">
            {/* Filtros en el lado izquierdo */}
            <div className="filters-sidebar">
                <Filters/>
            </div>

            {/* Contenido principal en el lado derecho */}
            <div className="items-main-content">
                {/* Header de la sección */}
                <div className="items-header">
                    <h1 className="items-title">Nuestra Colección</h1>
                    <p className="items-subtitle">Descubre los mejores productos con calidad premium y diseños exclusivos</p>
                </div>

                {/* Grid de productos */}
                <div className="container">
                    <div className="row">
                        {Articulos.map((articulo, index) => (
                            <Card
                                key={index}
                                producto={articulo}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Items;