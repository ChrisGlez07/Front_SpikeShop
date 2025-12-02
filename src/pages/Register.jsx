import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../Login.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const APP_TOKEN = import.meta.env.VITE_TOKEN;

  useEffect(() => {
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }, [username, email, password]);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      toast.error("Please complete all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User Create Successfully");

        setUsername("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        toast.error(data.message || "Error en el registro");
      }

    } catch (error) {
      console.error("Error en registro:", error);
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">

      {/* TOASTER PERSONALIZADO */}
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#4BB543',
              color: 'white',
              fontWeight: 'bold',
            },
          },
          error: {
            style: {
              background: '#ec5463ff',
              color: 'white',
              fontWeight: 'bold',
            },
          },
        }}
      />

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

      <button
        className="btnRegister"
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "Registrando..." : "Register"}
      </button>

      <Link to="/login" className="nav-link">
        Back to Login
      </Link>
    </div>
  );
};

export default Register;
