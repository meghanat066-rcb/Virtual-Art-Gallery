import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaEnvelope, FaPalette } from 'react-icons/fa'

import api from '../services/api'
import './ArtistDetails.css'

function ArtistDetails() {
    const { id } = useParams()

    const [artist, setArtist] = useState(null)
    const [artworks, setArtworks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(`/artists/${id}`)

                setArtist(response.data.artist)
                setArtworks(response.data.artworks || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load artist profile.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchArtist()
    }, [id])

    if (loading) {
        return (
            <main className="artevora-artist-details-page">
                <div className="artevora-artist-details-state">
                    <p>Loading artist profile...</p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="artevora-artist-details-page">
                <div className="artevora-artist-details-state">
                    <p>{error}</p>
                </div>
            </main>
        )
    }

    if (!artist) {
        return null
    }

    return (
        <main className="artevora-artist-details-page">

            {/* ARTIST HERO */}

            <section className="artevora-artist-details-hero">

                <div className="artevora-artist-details-image">
                    {artist.profileImage ? (
                        <img
                            src={artist.profileImage}
                            alt={artist.name}
                        />
                    ) : (
                        <div className="artevora-artist-details-placeholder">
                            {artist.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="artevora-artist-details-intro">

                    <span>ARTIST</span>

                    <h1>{artist.name}</h1>

                    <div className="artevora-artist-category">
                        <FaPalette />
                        <span>Paintings</span>
                    </div>

                    {artist.artistStatement && (
                        <p className="artevora-artist-statement">
                            {artist.artistStatement}
                        </p>
                    )}

                </div>

            </section>


            {/* BIOGRAPHY */}

            <section className="artevora-artist-biography">

                <div className="artevora-artist-section-label">
                    ABOUT THE ARTIST
                </div>

                <h2>Biography</h2>

                <p>
                    {artist.biography ||
                        'Biography information will be available soon.'}
                </p>

                {artist.email && (
                    <div className="artevora-artist-contact">
                        <FaEnvelope />
                        <span>{artist.email}</span>
                    </div>
                )}

            </section>


            {/* PUBLISHED WORKS */}

            <section className="artevora-artist-works">

                <div className="artevora-artist-section-label">
                    SELECTED WORKS
                </div>

                <h2>Published Works</h2>

                {artworks.length === 0 ? (
                    <div className="artevora-artist-no-works">
                        <p>
                            No published artworks available yet.
                        </p>
                    </div>
                ) : (
                    <div className="artevora-artist-works-grid">

                        {artworks.map((artwork) => (

                            <article
                                key={artwork._id}
                                className="artevora-artist-work-card"
                            >

                                <div className="artevora-artist-work-image">

                                    <img
                                        src={artwork.image}
                                        alt={artwork.title}
                                    />

                                </div>

                                <h3>{artwork.title}</h3>

                                <p>
                                    {artwork.medium ||
                                        artwork.category}
                                </p>

                            </article>

                        ))}

                    </div>
                )}

            </section>

        </main>
    )
}

export default ArtistDetails