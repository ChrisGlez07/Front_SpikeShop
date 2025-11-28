import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../edituser.css";
import Footer from "./Footer";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const APP_TOKEN = import.meta.env.VITE_TOKEN;

export default function EditUser() {
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserAuth = () => {
            try {
                const savedUser = localStorage.getItem('user_session');
                
                if (savedUser) {
                    const userData = JSON.parse(savedUser);
                    setUser(userData);
                    
                    if (userData.role !== 'admin') {
                        alert("You don't have permission to access this page");
                        navigate('/items');
                        return;
                    }
                } else {
                    alert("You must log in to access this page");
                    navigate('/login');
                    return;
                }
            } catch (error) {
                console.error('Error verifying authentication:', error);
                localStorage.removeItem('user_session');
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAuth();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const timestamp = new Date().getTime();
            const url = `${API_BASE_URL}/users?t=${timestamp}`;
            
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

            if (data && Array.isArray(data.data)) {
                const usersProcesados = data.data.map(user => ({
                    id: user.id || user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }));
                setUsers(usersProcesados);
            } else {
                setUsers([]);
            }

        } catch (error) {
            console.error("Error obtaining users:", error.message);
            alert("Error loading users: " + error.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const handleSelect = async (e) => {
        const id = e.target.value;
        setSelectedId(id);

        if (id) {
            try {
                const res = await fetch(`${API_BASE_URL}/users/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${APP_TOKEN}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                    credentials: 'include'
                });
                
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error(`User not found with ID: "${id}"`);
                    }
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                
                const data = await res.json();
                
                if (data.data) {
                    setFormData({ 
                        id: data.data.id || data.data._id,
                        username: data.data.username,
                        email: data.data.email,
                        role: data.data.role,
                        password: ""
                    });
                } else {
                    throw new Error("The data for the selected user is missing.");
                }
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        } else {
            setFormData(null);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || user.role !== 'admin') {
            alert("You don't have permission to update users");
            return;
        }

        if (!formData.username || !formData.email || !formData.role) {
            alert("Please fill all required fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        const datosEnviados = {
            id: formData.id,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password })
        };

        try {
            const res = await fetch(`${API_BASE_URL}/users/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                    "ngrok-skip-browser-warning": "true",
                },
                body: JSON.stringify(datosEnviados)
            });

            const textResponse = await res.text();
            let data;
            
            if (textResponse) {
                data = JSON.parse(textResponse);
            }

            if (res.ok) {
                alert(data?.message || "User updated successfully.");
                await fetchUsers();
                setSelectedId("");
                setFormData(null);
            } else {
                alert(`Error: ${data?.message || `Code ${res.status}`}`);
            }

        } catch (error){
            alert(`Error updating the user: ${error.message}`);
        }
    };

    const handleDelete = async () => {
        if (!user || user.role !== 'admin') {
            alert("You don't have permission to delete users");
            return;
        }

        if (!formData?.id) {
            alert("There is no user selected to delete.");
            return;
        }

        if (formData.id === user.id) {
            alert("You cannot delete your own account.");
            return;
        }

        if (!confirm(`Are you sure you want to delete the user "${formData.username}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/users/delete/${formData.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${APP_TOKEN}`,
                    "ngrok-skip-browser-warning": "true",
                }
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            
            alert(data.message || "User deleted successfully.");
            await fetchUsers();
            setSelectedId("");
            setFormData(null);

        } catch (err) {
            alert(`Error deleting the user: ${err.message}`);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (isLoading) {
        return (
            <div className="edit-container">
                <div className="loading">Verifying permissions...</div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="edit-container">
                <div className="error-message">
                    You do not have permission to access this page. 
                    Current Role: {user?.role || 'No user'}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="edit-container">
                <h2>User Management</h2>
                <div className="user-info">
                    <small>Connected as: {user.username} ({user.role})</small>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading users...</span>
                        </div>
                        <p>Loading Users...</p>
                    </div>
                )}

                <select 
                    className="select-user" 
                    onChange={handleSelect} 
                    value={selectedId}
                    disabled={loading}
                >
                    <option value="">Choose one user...</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>
                            {u.username} - {u.email} - {u.role}
                        </option>
                    ))}
                </select>

                {users.length === 0 && !loading && (
                    <div className="no-users">
                        <p>There are no users to edit.</p>
                    </div>
                )}

                {formData && (
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-columns-container">
                            <div className="form-column">
                                <label>User ID</label>
                                <input
                                    type="text"
                                    value={formData.id || ''}
                                    disabled
                                    className="disabled-input"
                                />

                                <label>Username *</label>
                                <input
                                    name="username"
                                    value={formData.username || ''}
                                    onChange={handleChange}
                                    required
                                />
                        
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-column">
                                <label>Role *</label>
                                <select
                                    name="role"
                                    value={formData.role || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose a role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <label>New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                        placeholder="Leave empty to keep current password"
                                        className="password-input"
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                <small className="password-hint">
                                    Leave blank to keep current password
                                </small>

                                <div className="user-summary">
                                    <h4>User Summary</h4>
                                    <div className="summary-content">
                                        <p><strong>Username:</strong> {formData.username}</p>
                                        <p><strong>Email:</strong> {formData.email}</p>
                                        <p><strong>Role:</strong> {formData.role}</p>
                                        <p><strong>ID:</strong> {formData.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-buttons">
                            <button type="submit" className="btn-save">Save Changes</button>
                            <button 
                                type="button" 
                                className="btn-delete" 
                                onClick={handleDelete}
                                disabled={formData.id === user?.id}
                                title={formData.id === user?.id ? "Cannot delete your own account" : "Delete this user"}
                            >
                                Delete User
                            </button>
                        </div>
                    </form>
                )}

                                <Link to="/admin3" className="nav-link home-link">
                    Go to User Home
                </Link>
            </div>
            <Footer />
        </>
    );
}