import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaPalette } from 'react-icons/fa'

import api from '../services/api'
import './Artists.css'

function Artists() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get('/artists')

                console.log('Artists response:', response.data)
console.log('Artists:', response.data.artists)
console.log(
    'Profile Images:',
    response.data.artists?.map((artist) => artist.profileImage)
)

                setArtists(response.data.artists || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load artists.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchArtists()
    }, [])

    return (
        <main className="artevora-artists-page">

            {/* HEADER */}

            <header className="artevora-artists-header">

                <span>MEET THE ARTISTS</span>

                <h1>
                    The Artists Behind
                    <br />
                    ArteVora
                </h1>

                <p>
                    Discover the creative minds whose
                    stories, ideas and works form our
                    collection.
                </p>

            </header>


            {/* LOADING */}

            {loading && (
                <div className="artevora-artists-state">
                    <div className="artevora-artists-loader" />
                    <p>Discovering our artists...</p>
                </div>
            )}


            {/* ERROR */}

            {!loading && error && (
                <div className="artevora-artists-state">
                    <p>{error}</p>
                </div>
            )}


            {/* EMPTY */}

            {!loading &&
                !error &&
                artists.length === 0 && (

                    <div className="artevora-artists-empty">

                        <FaPalette />

                        <h2>No Artists Yet</h2>

                        <p>
                            Artist profiles will appear here
                            once artists publish their work.
                        </p>

                    </div>
                )}


            {/* ARTISTS */}

            {!loading &&
                !error &&
                artists.length > 0 && (

                    <section className="artevora-artists-grid">

                        {artists.map((artist) => (

                            <article
                                className="artevora-artist-card"
                                key={artist._id}
                                onClick={() =>
                                    navigate(
                                        `/artists/${artist._id}`
                                    )
                                }
                            >

                                <div className="artevora-artist-photo">

                                   <img
    src={
        artist.profileImage
            ? artist.profileImage.startsWith('http')
                ? artist.profileImage
                : `http://localhost:8000${artist.profileImage}`
            : artist.image
    }
    alt={artist.name}
/>
                                    <div className="artevora-artist-overlay">
                                        <span>
                                            View Artist
                                        </span>

                                        <FaArrowRight />
                                    </div>

                                </div>


                                <div className="artevora-artist-info">

                                    <span>
                                        ARTIST
                                    </span>

                                    <h2>
                                        {artist.name}
                                    </h2>

                                    <p>
                                        Explore their
                                        collection
                                    </p>

                                </div>

                            </article>

                        ))}

                    </section>
                )}

        </main>
    )
}

export default Artists