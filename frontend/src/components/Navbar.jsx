import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">
            <BriefcaseBusiness size={20} />
          </span>

          <span className="logo-text">
            Career<span>Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/jobs" onClick={() => setMenuOpen(false)}>
            Find Jobs
          </Link>

          <Link to="/companies" onClick={() => setMenuOpen(false)}>
            Companies
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </nav>

        {/* Right Side */}
        <div className="navbar-actions">

          <Link to="/login" className="login-link">
            Sign In
          </Link>

          <Link to="/register" className="register-button">
            Get Started
          </Link>

        </div>

        {/* Mobile Menu */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>
    </header>
  )
}

export default Navbar