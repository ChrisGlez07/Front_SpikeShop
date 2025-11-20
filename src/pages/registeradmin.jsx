import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../registeradmin.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setUserType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const APP_TOKEN = import.meta.env.VITE_TOKEN;
  
  useEffect(() => {
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User Type: ${role}`);
  }, [username, email, password, role]);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_TOKEN}`,
        },
        
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          role: role 
        })
      });
       console.log(response);
      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Registro exitoso:", data);
        setSuccess("Usuario registrado exitosamente");
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || "Error en el registro");
        console.log("This user is already registered", data);
        setSuccess("");
        alert("This user is already registered");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="adminRegister">
      <div className="container-items">
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
 <div className="userTypeRegister">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="user-type-select"
          >
            <option value="" disabled>Select User Type</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button 
          className="btnRegister" 
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Register"}
        </button>

        <Link to="/login" className="nav-link">Back to Login</Link>
      </div>
    </div>
);
};

export default Register;