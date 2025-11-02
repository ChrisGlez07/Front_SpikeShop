import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../App.css';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(`Username: ${username}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
    }, [username, email, password]);

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
            <button className="btnRegister">Register</button>
            <Link to="/login" className="nav-link">Back to Login</Link>
        </div>
    );
};

export default Register;