import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    FaBars,
    FaTimes,
    FaRegUser,
    FaRegHeart,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import './Navbar.css'

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const closeMenu = () => {
        setMenuOpen(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setIsLoggedIn(false)
        setMenuOpen(false)

        toast.success('Logged out successfully!')

        navigate('/')
    }

    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <header className="site-header">
            <nav className="professional-navbar">
                <Link
                    to="/"
                    className="gallery-logo"
                    onClick={closeMenu}
                >
                    <span className="gallery-logo-main">
                        ARTEVORA
                    </span>

                    <span className="gallery-logo-sub">
                       GALLERY
                    </span>
                </Link>

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={
                        menuOpen
                            ? 'Close navigation menu'
                            : 'Open navigation menu'
                    }
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div
                    className={`professional-nav-links ${
                        menuOpen ? 'nav-menu-open' : ''
                    }`}
                >
                    <Link
                        to="/"
                        className={isActive('/') ? 'active-link' : ''}
                        onClick={closeMenu}
                    >
                        Home
                    </Link>

                    <Link
                        to="/gallery"
                        className={
                            isActive('/gallery')
                                ? 'active-link'
                                : ''
                        }
                        onClick={closeMenu}
                    >
                        Gallery
                    </Link>

                    <Link
                        to="/artists"
                        className={
                            isActive('/artists')
                                ? 'active-link'
                                : ''
                        }
                        onClick={closeMenu}
                    >
                        Artists
                    </Link>

                    <Link
                        to="/exhibitions"
                        className={
                            isActive('/exhibitions')
                                ? 'active-link'
                                : ''
                        }
                        onClick={closeMenu}
                    >
                        Exhibitions
                    </Link>

                   <Link
    to={localStorage.getItem('token') ? '/virtual-tour' : '/login'}
    className={
        isActive('/virtual-tour')
            ? 'active-link'
            : ''
    }
    onClick={closeMenu}
>
    Virtual Tour
</Link>

                    {!isLoggedIn ? (
                        <div className="nav-account-section">
                            <Link
                                to="/login"
                                className="nav-login-link"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="nav-register-button"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="nav-account-section">
                            {user?.role === 'artist' && (
    <Link
        to="/artist-dashboard"
        onClick={closeMenu}
    >
        Artist Dashboard
    </Link>
)}
                            {user?.role === 'user' && (
    <>
    </>
)}

                            
                            {user?.role !== 'artist' && (
    <Link
        to={
            user?.role === 'user'
                ? '/user-profile'
                : '/admin'
        }
        className="nav-profile-link"
        onClick={closeMenu}
        aria-label="Profile"
        title="Profile"
    >
        <FaRegUser className="nav-profile-icon" />

        <span className="nav-profile-name">
            {user?.name}
        </span>
    </Link>
)}
                            <button
                                type="button"
                                className="nav-logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar