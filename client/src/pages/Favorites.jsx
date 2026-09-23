import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaStar, FaTrash, FaUser, FaTag } from 'react-icons/fa'
import api from '../services/api'
import PageLayout from '../components/PageLayout'
import { toast } from 'react-toastify'

function Favorites({ isLoggedIn }) {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false)
            return
        }

        const fetchFavorites = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get('/favorites')

                setFavorites(response.data.favorites || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load favorite artworks.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [isLoggedIn])

    const removeFavorite = async (artworkId) => {
        try {
            await api.patch(`/favorites/${artworkId}`)

            setFavorites((currentFavorites) =>
                currentFavorites.filter(
                    (artwork) => artwork._id !== artworkId
                )
            )
            toast.success('Removed from favorites!')
        } catch (err) {
            toast.error(
    err.response?.data?.message ||
    'Unable to remove artwork from favorites.'
)
        }
    }

    if (!isLoggedIn) {
        return (
            <PageLayout background={favoritesBg}>
                <div className="login-page">
                    <div className="upload-container">
                        <h2>Login Required</h2>

                        <p style={{ margin: '20px 0' }}>
                            Please login first to view your favorite artworks.
                        </p>

                        <button onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="favorites-page">

                 <button
            type="button"
            className="artevora-back-profile"
            onClick={() => navigate('/user-profile')}
        >
            ← Back to Profile
        </button>
                <div className="page-heading">
                    <h1>
                        <FaStar /> My Favorites
                    </h1>

                    <p>
                        Your favorite artworks collected in one place.
                    </p>
                </div>

                {loading && (
                    <p className="favorites-message">
                        Loading favorite artworks...
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && favorites.length === 0 && (
                    <p className="favorites-message">
                        You have not added any favorite artworks yet.
                    </p>
                )}

                <div className="favorites-grid">
                    {favorites.map((artwork) => (
                        <div
                            className="favorite-card"
                            key={artwork._id}
                        >
                            <div
                                className="favorite-image"
                                onClick={() =>
                                    navigate(`/artwork/${artwork._id}`)
                                }
                            >
                                <img
                                    src={artwork.image}
                                    alt={artwork.title}
                                />
                            </div>

                            <div className="favorite-info">
                                <FaStar className="saved-star" />

                                <h3>{artwork.title}</h3>

                                <p>
                                    <FaUser /> {artwork.artistName}
                                </p>

                                <p>
                                    <FaTag /> {artwork.category}
                                </p>

                                <div className="favorite-actions">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/artwork/${artwork._id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                    <button
                                        className="remove-favorite-btn"
                                        onClick={() =>
                                            removeFavorite(artwork._id)
                                        }
                                    >
                                        <FaTrash /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    )
}

export default Favorites