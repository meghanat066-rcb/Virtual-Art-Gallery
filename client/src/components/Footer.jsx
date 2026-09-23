import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
    <footer className="gallery-footer">
        <div className="page-container">

            <div className="gallery-footer-main">

                <div className="gallery-footer-brand">

                    <Link
                        to="/"
                        className="gallery-footer-logo"
                    >
                        ARTEVORA
                    </Link>

                    <p>
                        Where art, culture and creativity come
                        together through curated collections and
                        immersive virtual experiences.
                    </p>

                    <div className="gallery-footer-socials">

                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>

                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Facebook
                        </a>

                        <a
                            href="https://www.youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            YouTube
                        </a>

                    </div>

                </div>

                <div className="gallery-footer-column">

                    <h3>Explore</h3>

                    <Link to="/">Home</Link>

                    <Link to="/gallery">Gallery</Link>

                    <Link to="/exhibitions">
                        Exhibitions
                    </Link>

                    <Link to="/virtual-tour">
                        Virtual Tour
                    </Link>

                </div>

                <div className="gallery-footer-column">

                    <h3>Artist Hub</h3>

                    <Link to="/artist-profile">
                        Artist Profile
                    </Link>

                    <Link to="/upload-artwork">
                        Upload Artwork
                    </Link>

                    <Link to="/register">
                        Join as Artist
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

                <div className="gallery-footer-column">

                    <h3>Visit</h3>

                    <p>Bengaluru, India</p>

                    <p>Tuesday – Sunday</p>

                    <p>10:00 AM – 6:00 PM</p>

                    <a href="mailto:contact@artevora.com">
                        contact@artevora.com
                    </a>

                </div>

            </div>

            <div className="gallery-footer-bottom">

                <p>
                    © {currentYear} Artevora Gallery.
                    All rights reserved.
                </p>

                <div className="gallery-footer-legal">

                    <Link to="/privacy-policy">
                        Privacy Policy
                    </Link>

                    <Link to="/terms">
                        Terms & Conditions
                    </Link>

                </div>

            </div>

        </div>
    </footer>
)
}

export default Footer