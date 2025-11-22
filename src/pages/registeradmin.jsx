import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../registeradmin.css';
import Footer from './Footer.jsx';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setUserType] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;
  const APP_TOKEN = import.meta.env.VITE_TOKEN;
  
  useEffect(() => {
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User Type: ${role}`);
  }, [username, email, password, role]);

    useEffect(() => {
    const checkUserAuth = () => {
      try {
        const savedUser = localStorage.getItem('user_session');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          if (userData.role !== 'admin') {
            alert("You don´t have permission to access this page");
            navigate('/items');
            return;
          }
        } else {
          alert("You must log in to access this page");
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('user_session');
        navigate('/login');
      } finally {
        setAuthLoading(false);
      }
    };

    checkUserAuth();
  }, [navigate]);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Please complete all fields");
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
        console.log("Succesfull Register:", data);
        setSuccess("User registered successfully");
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || "Register Error");
        setSuccess("");
      }
    } catch (error) {
      console.error("Register Error:", error);
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

return (
  <>
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
 <div className="userTypeRegister">
          <select
            value={role}
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

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <Link to="/admin" className="nav-link">Back to Admin Home</Link>
      </div>
    </div>
    <Footer />
  </>
);
};

export default Register;