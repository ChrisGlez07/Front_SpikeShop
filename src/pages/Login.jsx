import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './Register.jsx';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState("alex@example.com");
    const [password, setPassword] = useState("123456");
    const location = useLocation();

    useEffect(() => {
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }, [email, password]);

    const showLoginForm = location.pathname === '/login' || location.pathname === '/login/';

    return (
        <div className="containerLoginRegister">
            {showLoginForm && (
                <div className="form-container"> 
                    <div className="userLogin">
                        <input
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div className="PasswordLogin">
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <button className="btnLogin">Login</button>
                    <Link to="/login/register" className="nav-link">Register</Link>
                </div>
            )}
            {/* Rutas anidadas */}
            <Routes>
                <Route path="register" element={<Register />} />
            </Routes>
        </div>
    );
};

export default Login;