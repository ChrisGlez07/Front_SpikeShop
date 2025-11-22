import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Register from './Register.jsx';
import '../Login.css';
import Footer from './Footer.jsx';

const Login = ({ onUserLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const APP_TOKEN = import.meta.env.VITE_TOKEN;
  
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        if (onUserLogin) {
          onUserLogin(userData);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user_session');
      }
    }
  }, [onUserLogin]);

  useEffect(() => {
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }, [email, password]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please complete the information");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      console.log("Complete Answer form the server:", data); 

      if (response.ok && data.message === "Login successful") {
        console.log("Login exitoso - Datos del usuario:", data.data.user);
        alert("Login successfully");
        
        if (data.data && data.data.user) {
          const userData = {
            id: data.data.user.id,
            username: data.data.user.username,
            email: data.data.user.email,
            role: data.data.user.role
          };
          
          console.log("Datos que se guardarán en localStorage:", userData);

          setUser(userData);
          localStorage.setItem('user_session', JSON.stringify(userData));
          if (onUserLogin) {
            onUserLogin(userData);
          }
          
          console.log("Verificación - ¿Qué hay en localStorage?");
          const stored = localStorage.getItem('user_session');
          console.log("Usuario en localStorage:", JSON.parse(stored));
          
          navigate('/dashboard');
        } else {
          setError("User data is missing in the response");
        }
      } else {
        setError(data.message || "Error en el login");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showLoginForm = location.pathname === '/login' || location.pathname === '/login/';

  return (
    <>
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
      <Footer />
    </>
  );
};

export default Login;