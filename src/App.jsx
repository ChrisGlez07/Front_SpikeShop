import { useState } from 'react'
import './App.css'

import Home from './pages/home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Spike Shop</h1> 
      <Link to="/">
        <button>Home</button>
      </Link>
      <Link to="/about">
        <button>Acerca de</button>
      </Link>
      <Link to="/contact">
        <button>Contacto</button>
      </Link>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </>
  )
}

export default App