import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Register from './Register.jsx';
import '../App.css';

const Login = () => {  
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE_URL = "https://crenate-ariella-questioningly.ngrok-free.dev";
  const APP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IkFjY2VzbyBnZW5lcmljbyIsImlhdCI6MTc2MjI4OTc3MSwiZXhwIjoxNzYyMjkzMzcxfQ.b-P9iGNxJuLi0IotmjO1p2iTJVq46aDdA7LidEfOvDs";

  useEffect(() => {
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }, [email, password]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
          // También puedes usar solo uno de estos:
          // 'App-Token': APP_TOKEN
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Login exitoso:", data);
        alert("Login successfully");
        
        localStorage.setItem('user_session', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || "Error en el login");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const showLoginForm = location.pathname === '/login' || location.pathname === '/login/';

  return (
    <div className="containerLoginRegister">
      {showLoginForm && (
        <div className="form-container">
          <div className="userLogin">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className="PasswordLogin">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="btnLogin"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Login"}
          </button>

          <Link to="/login/register" className="nav-link">Register</Link>
        </div>
      )}

      <Routes>
        <Route path="register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default Login;