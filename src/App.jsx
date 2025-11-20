import { useState } from 'react'
import './App.css'
import Home from './pages/home.jsx'
import About from './pages/about.jsx'
import Contact from './pages/Contact.jsx'
import Search from './pages/search.jsx'
import Login from './pages/Login.jsx'
import Items from './pages/Items.jsx'
import Admin from './pages/adminhome.jsx'
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='containerHome'>
        <header className="header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-4">
                      <Link to="/items" className="image-link">
                    <img 
                      src="https://i.postimg.cc/LsYz2mRT/spie-Top.png" 
                      alt="Shop Items" 
                      className="header-image"
                    />
                  </Link>
              </div>
              <div className="col-md-8">
                <nav className="main-nav">
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/about" className="nav-link">About us</Link>
                  <Link to="/contact" className="nav-link">Contact us</Link>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/items" className="nav-link">Online Shop</Link>
                  <Link to="/admin" className="nav-link">Admin</Link>
                  <Search />
                </nav>
             </div>
            </div>
          </div>
        </header>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/*' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/items' element={<Items />} />
          <Route path='/admin/*' element={<Admin />} />
        </Routes>
      </div>
    </>
  )
}
export default App;