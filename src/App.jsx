import { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/home.jsx'
import About from './pages/about.jsx'
import Contact from './pages/contact.jsx'
import Registeradmin from './pages/registeradmin.jsx'
import Login from './pages/Login.jsx'
import Createproduct from './pages/createproduct.jsx'
import EditProduct from './pages/editproduct.jsx'
import EditUser from './pages/edituser.jsx'
import Items from './pages/Items.jsx'
import Admin from './pages/adminhome.jsx'
import Admin2 from './pages/Adminhome2.jsx'
import Admin3 from './pages/Adminhome3.jsx'
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null) // Estado para el usuario

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  // Función para actualizar el usuario desde Login
  const handleUserLogin = (userData) => {
    setUser(userData);
  };

  // Función para logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  return (
    <>
      <div className='containerHome'>
        <header className="header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  {/* Logo */}
                  <Link to="/items" className="image-link me-2">
                    <img 
                      src="https://i.postimg.cc/LsYz2mRT/spie-Top.png" 
                      alt="Shop Items" 
                      className="header-image"
                    />
                  </Link>
                  
                  {/* Saludo y Logout al lado del logo */}
                  {user && (
                    <div className="user-info d-flex align-items-left">
                      <span className="user-greeting me-2">
                        Hello, {user.username}
                      </span>
                      <button 
                        onClick={handleLogout}
                        className="btn-logout"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-md-6">
                <nav className="main-nav d-flex justify-content-end">
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/about" className="nav-link">About us</Link>
                  <Link to="/contact" className="nav-link">Contact us</Link>
                  
                  {/* Mostrar Login si no hay usuario */}
                  {!user && (
                    <Link to="/login" className="nav-link">Login</Link>
                  )}
                  
                  <Link to="/items" className="nav-link">Online Shop</Link>
                  
                  {/* Solo mostrar Admin si el usuario es admin */}
                  {user && user.role === 'admin' && (
                    <Link to="/admin" className="nav-link">Admin</Link>
                  )}
                  
                </nav>
              </div>
            </div>
          </div>
        </header>
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route 
            path='/login/*' 
            element={<Login onUserLogin={handleUserLogin} />} 
          />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/items' element={<Items />} />
          <Route path='/admin/*' element={<Admin />} />
          <Route path='/admin2/*' element={<Admin2 />} />
          <Route path='/admin3/*' element={<Admin3 />} />
          <Route path='/registeradmin' element={<Registeradmin />} />
          <Route path='/editproduct' element={<EditProduct user={user} />} />
          <Route path='/edituser' element={<EditUser user={user} />} />
          <Route path='/createproduct' element={<Createproduct user={user} />} />
        </Routes>
      </div>
    </>
  )
}

export default App;