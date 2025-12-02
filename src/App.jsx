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
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'bootstrap'
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const navigate = useNavigate();

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

  const handleUserLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/"), 2500);
  };

  return (
    <>
          <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#4BB543",
              color: "white",
              fontWeight: "bold"
            }
          }
        }}
      />
      <div className='containerHome'>
        <header className="header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <Link to="/items" className="image-link me-2">
                    <img 
                      src="https://i.postimg.cc/LsYz2mRT/spie-Top.png" 
                      alt="Shop Items" 
                      className="header-image"
                    />
                  </Link>
                  
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
                  
                  {!user && (
                    <Link to="/login" className="nav-link">Login</Link>
                  )}
                  
                  <Link to="/items" className="nav-link">Online Shop</Link>
                  
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