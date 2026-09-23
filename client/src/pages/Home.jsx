import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaChevronLeft,
    FaChevronRight,
    FaMapMarkerAlt,
    FaClock,
    FaTicketAlt,
    FaCalendarAlt
} from 'react-icons/fa'
import './Home.css'
import api, { getImageUrl } from "../services/api";

function Home() {
    const navigate = useNavigate()

    const heroSlides = [
    {
        id: 1,
        title: 'Radiance in Art',
        artist: 'Isabella Moreau',
        year: '2024',
        image:
           'https://images.pexels.com/photos/14032254/pexels-photo-14032254.jpeg',
        position: 'center 10%'
    },
    {
        id: 2,
        title: 'A World of Color',
        artist: 'Olivia Taylor',
        year: '2026',
        image:
            'https://images.pexels.com/photos/29971335/pexels-photo-29971335.jpeg',
        position: 'center 35%'    
    },
    {
        id: 3,
        title: 'Light, Form & Expression',
        artist: 'Ethan Walker',
        year: '2025',
        image:
            'https://images.pexels.com/photos/28858124/pexels-photo-28858124.jpeg',
        position: 'center 10%'
    },
    {
        id: 4,
        title: 'Moments of Beauty',
        artist: 'Meera Iyer',
        year: '2025',
        image:
            'https://images.pexels.com/photos/1209998/pexels-photo-1209998.jpeg',
        position: 'center 40%'
    },
    {
        id: 5,
        title: 'The Essence of Beauty',
        artist: 'Rohan Mehta',
        year: '2024',
        image:
            'https://images.pexels.com/photos/910341/pexels-photo-910341.jpeg',
        position: 'center 10%'
    }
]

const [activeSlide, setActiveSlide] = useState(0)

const [featuredArtworks, setFeaturedArtworks] = useState([])
const [featuredLoading, setFeaturedLoading] = useState(true)
const [featuredError, setFeaturedError] = useState("")

const [featuredArtist, setFeaturedArtist] = useState(null)
const [artistLoading, setArtistLoading] = useState(true)

useEffect(() => {
    const sliderTimer = window.setInterval(() => {
        setActiveSlide((currentSlide) =>
            currentSlide === heroSlides.length - 1
                ? 0
                : currentSlide + 1
        )
    }, 5000)

    return () => {
        window.clearInterval(sliderTimer)
    }
}, [heroSlides.length])

const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
        currentSlide === 0
            ? heroSlides.length - 1
            : currentSlide - 1
    )
}

const showNextSlide = () => {
    setActiveSlide((currentSlide) =>
        currentSlide === heroSlides.length - 1
            ? 0
            : currentSlide + 1
    )
}
useEffect(() => {
    const fetchFeaturedArtworks = async () => {
        try {
            setFeaturedLoading(true)
            setFeaturedError("")

            const response = await api.get("/artworks/featured")

            setFeaturedArtworks(response.data.artworks || [])
        } catch (error) {
            setFeaturedError(
                error.response?.data?.message ||
                "Unable to load artworks."
            )
        } finally {
            setFeaturedLoading(false)
        }
    }

    fetchFeaturedArtworks()
}, [])
useEffect(() => {
    const fetchFeaturedArtist = async () => {
        try {
            setArtistLoading(true)

            const response = await api.get('/artists')

            const registeredArtists =
                response.data.artists || []

            /*
             * Only use artists that actually exist
             * in the registered artists collection.
             */
            const artistWithPhoto =
                registeredArtists.find(
                    (artist) => artist.profileImage
                )

            setFeaturedArtist(
                artistWithPhoto ||
                registeredArtists[0] ||
                null
            )
        } catch (error) {
            console.error(
                'Unable to load featured artist:',
                error
            )
            setFeaturedArtist(null)
        } finally {
            setArtistLoading(false)
        }
    }

    fetchFeaturedArtist()
}, [])
const currentSlide = heroSlides[activeSlide]
    
    return (
        <div>
            <section className="artevora-hero">
    <div className="artevora-hero-slides">
        {heroSlides.map((slide, index) => (
            <div
                key={slide.id}
                className={`artevora-hero-slide ${
                    index === activeSlide ? 'active' : ''
                }`}
                style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundPosition: slide.position
                }}
                aria-hidden={index !== activeSlide}
            />
        ))}
    </div>

    <div className="artevora-hero-overlay" />

    <button
        type="button"
        className="artevora-slider-arrow artevora-slider-left"
        onClick={showPreviousSlide}
        aria-label="Show previous artwork"
    >
        <FaChevronLeft />
    </button>

    <button
        type="button"
        className="artevora-slider-arrow artevora-slider-right"
        onClick={showNextSlide}
        aria-label="Show next artwork"
    >
        <FaChevronRight />
    </button>
</section>

<div className="artevora-hero-info">
    <h1 key={currentSlide.title}>
        {currentSlide.title}
    </h1>

    <div className="artevora-hero-meta">
        <span>{currentSlide.artist}</span>

        <span className="artevora-meta-divider" />

        <span>{currentSlide.year}</span>
    </div>
</div>
<section className="featured-artist-section section-spacing">
    <div className="page-container featured-artist-grid">

        {artistLoading ? (
            <div className="featured-artist-loading">
                Loading featured artist...
            </div>
        ) : featuredArtist ? (

            <>
                <div className="featured-artist-image">
                    <img
                        src={
                            featuredArtist.profileImage
                                ? getImageUrl(featuredArtist.profileImage)
                                : featuredArtist.image
                        }
                        alt={`Artist ${featuredArtist.name}`}
                    />
                </div>

                <div className="featured-artist-content">

                    <span className="section-label">
                        Featured Artist
                    </span>

                    <h2 className="section-heading">
                        {featuredArtist.name}
                    </h2>

                    <p className="featured-artist-category">
                        Contemporary Artist
                    </p>

                    <p className="section-description">
                        {featuredArtist.artistStatement ||
                            featuredArtist.biography ||
                            'Discover the artistic journey, creative vision and unique works of this ArteVora artist.'}
                    </p>

                    <div className="featured-artist-stats">

                        <div>
                            <span>
                                Specialization
                            </span>

                            <strong>
                                Contemporary Art
                            </strong>
                        </div>

                        <div>
                            <span>
                                Artist
                            </span>

                            <strong>
                                Registered Artist
                            </strong>
                        </div>

                        <div>
                            <span>
                                ArteVora
                            </span>

                            <strong>
                                Gallery Artist
                            </strong>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="featured-artist-read-more"
                        onClick={() =>
                            navigate(
                                `/artists/${featuredArtist._id}`
                            )
                        }
                    >
                        Explore Artist →
                    </button>

                </div>
            </>

        ) : (

            <div className="featured-artist-loading">
                No registered artists available.
            </div>

        )}

    </div>
</section>

<section className="curated-artworks-section section-spacing">
    <div className="page-container">
        <div className="curated-artworks-header">
            <div>
                <span className="section-label">
                    Curated Collection
                </span>

                <h2 className="section-heading">
                    Selected Artworks
                </h2>

                <p className="section-description">
                    Discover selected works representing
                    traditional craftsmanship and contemporary
                    artistic expression.
                </p>
            </div>

            <button
                type="button"
                className="curated-view-all"
                onClick={() => navigate('/gallery')}
            >
                Explore Collection →
            </button>
        </div>

        {featuredLoading && (
            <p className="curated-status">
                Loading selected artworks...
            </p>
        )}

        {featuredError && (
            <p className="curated-status curated-error">
                {featuredError}
            </p>
        )}

        {!featuredLoading &&
            !featuredError &&
            featuredArtworks.length === 0 && (
                <div className="curated-empty-state">
                    <h3>Collection Coming Soon</h3>

                    <p>
                        Approved artworks will appear here once
                        they are added to the gallery.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/gallery')}
                    >
                        Visit Gallery →
                    </button>
                </div>
            )}

        {!featuredLoading &&
            !featuredError &&
            featuredArtworks.length > 0 && (
                <div className="curated-artworks-grid">
                    {featuredArtworks.map((artwork) => (
                        <article
                            key={artwork._id}
                            className="curated-artwork-card"
                            onClick={() =>
                                navigate(
                                    `/artwork/${artwork._id}`
                                )
                            }
                        >
                            <div className="curated-artwork-image">
                                <img
                                    src={artwork.image}
                                    alt={artwork.title}
                                />
                            </div>

                            <div className="curated-artwork-info">
                                <div>
                                    <h3>{artwork.title}</h3>

                                    <p>
                                        {artwork.artistName}
                                    </p>
                                </div>

                                <div className="curated-artwork-meta">
                                    <span>
                                        {artwork.category}
                                    </span>

                                    <span>
                                        {artwork.year ||
                                            new Date(
                                                artwork.createdAt
                                            ).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
    </div>
</section>

<section className="home-exhibition-section section-spacing">
    <div className="page-container home-exhibition-layout">
        <div className="home-exhibition-content">
            <span className="section-label">
                Current Exhibition
            </span>

            <h2>
                Echoes of Time
            </h2>

            <div className="home-exhibition-divider" />

            <div className="home-exhibition-dates">
                <FaCalendarAlt />

                <span>15 August 2026</span>

                <span className="home-exhibition-date-line" />

                <span>30 September 2026</span>
            </div>

            <p>
                Discover a curated exhibition featuring
                contemporary paintings, sculptures and ceramics
                that celebrate craftsmanship, culture and
                artistic expression.
            </p>

            <button
                type="button"
                className="home-exhibition-button"
                onClick={() => navigate('/exhibitions')}
            >
                Explore Exhibition →
            </button>
        </div>

        <div className="home-exhibition-visual">
            <img
                 src="https://images.openai.com/static-rsc-4/XsgJJ0k4hJAHG3OdtBnfah7zNin5IMZk5VOLrQ0A47CV6WNGmLDnW7rndy4LOVxE8IJvZvEC7z2xiLoVqzTHsMdh5BQ0VhIQWUmgNZAVYs9mcRGv7qozBwD_9R9XWyWqFd6_lvTkfJ9VS-K5gQSyAU3qkg-u80UwG_5VK7gbhkZeHkoK0XXw9tFKlPURxnAN?purpose=fullsize"
                alt="Echoes of Time exhibition"
            />

            <div className="home-exhibition-info-bar">
                <div className="home-exhibition-info-item">
                    <FaMapMarkerAlt />

                    <div>
                        <strong>Artevora Gallery</strong>
                        <span>Main Exhibition Hall</span>
                    </div>
                </div>

                <div className="home-exhibition-info-item">
                    <FaClock />

                    <div>
                        <strong>10:00 AM – 6:00 PM</strong>
                        <span>Tuesday – Sunday</span>
                    </div>
                </div>

                <div className="home-exhibition-info-item">
                    <FaTicketAlt />

                    <div>
                        <strong>Free Entry</strong>
                        <span>Open to all visitors</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section className="virtual-tour-section section-spacing">
    <div className="page-container virtual-tour-layout">

        <div
            className="virtual-tour-image"
            onClick={() => navigate("/virtual-tour")}
        >
            <img
                 src="https://images.openai.com/static-rsc-4/iE_3tz3RIlP__Q2kr6THXn50g9PM39Xr-px9iaYcNVq9_VWRzlcz2a2SSIdJjFHMB1T3ACF4sUFXeu1bKS4isLhfK7IvZbWLpkWvgCMlQCfvpzd3ShaG15I0OjTQOs0HPHRQoa33c-_OPh4SFBaNJ14rTBqdN99jnUTtxVQ4d43giLlKVJRkOBgThMeCOklI?purpose=fullsize"
                alt="Virtual Tour"
            />

            <div className="virtual-tour-overlay">

                <div className="virtual-play-button">
                    ▶
                </div>

                <span>
                    Take a Virtual Walk
                </span>

            </div>
        </div>

        <div className="virtual-tour-content">

            <span className="section-label">
                Virtual Tour
            </span>

            <h2>
                Experience Art
                <br />
                Beyond Physical Walls
            </h2>

            <div className="virtual-tour-divider"></div>

            <p>
                Explore exhibitions and artworks through an
                immersive virtual environment designed to
                recreate the experience of visiting a real
                gallery from anywhere in the world.
            </p>

            <button
                className="virtual-tour-button"
                onClick={() =>
                    navigate("/virtual-tour")
                }
            >
                Start Virtual Experience →
            </button>

        </div>

    </div>
</section>
        </div>
    )
}

export default Home