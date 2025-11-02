import { useState } from 'react'
import './App.css'
import Home from './pages/home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Search from './pages/search.jsx'
import Login from './pages/login.jsx'
import Items from './pages/Items.jsx'
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
                <h1 className="logo">SPIKESHOP</h1>
              </div>
              <div className="col-md-8">
                <nav className="main-nav">
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/about" className="nav-link">About us</Link>
                  <Link to="/contact" className="nav-link">Contact us</Link>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/items" className="nav-link">Online Shop</Link>
                  <Search />
                </nav>
              </div>
            </div>
          </div>
          <section className="servicesBarTop">
            <div className="container">
              <div className="row">
                <div className="col-md-4 service-item">
                  <Link to="/Items" className="nav-link">Items</Link>
                </div>
                <div className="col-md-4 service-item">

                </div>
                <div className="col-md-4 service-item">

                </div>
              </div>
            </div>
          </section>
        </header>
        <div className="row">
        </div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/*' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/items' element={<Items />} />
        </Routes>
      </div>
    </>
  )
}

export default App