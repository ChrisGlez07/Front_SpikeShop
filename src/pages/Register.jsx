import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://crenate-ariella-questioningly.ngrok-free.dev";
  const APP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IkFjY2VzbyBnZW5lcmljbyIsImlhdCI6MTc2MjI4OTc3MSwiZXhwIjoxNzYyMjkzMzcxfQ.b-P9iGNxJuLi0IotmjO1p2iTJVq46aDdA7LidEfOvDs";

  useEffect(() => {
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }, [username, email, password]);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Registro exitoso:", data);
        setSuccess("Usuario registrado exitosamente");
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="userRegister">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      <div className="emailRegister">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="passwordRegister">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button 
        className="btnRegister" 
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "Registrando..." : "Register"}
      </button>

      <Link to="/login" className="nav-link">Back to Login</Link>
    </div>
  );
};

export default Register;