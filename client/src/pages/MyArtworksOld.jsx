import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import PageLayout from '../components/PageLayout'
import galleryBg from '../assets/Myartwork-bg.jpg'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'

function MyArtworks() {
    const [artworks, setArtworks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingArtwork, setEditingArtwork] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')

    const [editForm, setEditForm] = useState({
    title: '',
    artistName: '',
    category: '',
    description: '',
    story: '',
    artistStatement: '',
    medium: '',
    year: '',
    dimensions: '',
    availability: 'Available',
    price: ''
})

    const navigate = useNavigate()

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    useEffect(() => {
        if (!user || user.role !== 'artist') {
            setLoading(false)
            return
        }

        const fetchMyArtworks = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    '/artworks/my-artworks'
                )

                setArtworks(response.data.artworks || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your artworks.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchMyArtworks()
    }, [user])

    const statistics = useMemo(() => {
        return {
            total: artworks.length,

            approved: artworks.filter(
                (artwork) => artwork.status === 'approved'
            ).length,

            pending: artworks.filter(
                (artwork) => artwork.status === 'pending'
            ).length,

            rejected: artworks.filter(
                (artwork) => artwork.status === 'rejected'
            ).length
        }
    }, [artworks])

    const handleDelete = async (artworkId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this artwork?'
        )

        if (!confirmed) {
            return
        }

        try {
            await api.delete(`/artworks/${artworkId}`)

            setArtworks((currentArtworks) =>
                currentArtworks.filter(
                    (artwork) => artwork._id !== artworkId
                )
            )

            toast.success('Artwork deleted successfully!')
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Unable to delete artwork.'
            )
        }
    }

   const openEditForm = (artwork) => {
    setEditingArtwork(artwork)

    setEditForm({
        title: artwork.title || '',
        artistName: artwork.artistName || '',
        category: artwork.category || '',
        description: artwork.description || '',
        story: artwork.story || '',
        artistStatement: artwork.artistStatement || '',
        medium: artwork.medium || '',
        year: artwork.year || '',
        dimensions: artwork.dimensions || '',
        availability: artwork.availability || 'Available',
        price: artwork.price || ''
    })
}
    const handleEditChange = (event) => {
        const { name, value } = event.target

        setEditForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }

    const handleUpdate = async (event) => {
        event.preventDefault()

        try {
            const response = await api.patch(
                `/artworks/${editingArtwork._id}`,
                editForm
            )

            const updatedArtwork = response.data.artwork

            setArtworks((currentArtworks) =>
                currentArtworks.map((artwork) =>
                    artwork._id === updatedArtwork._id
                        ? updatedArtwork
                        : artwork
                )
            )

            setEditingArtwork(null)
            toast.success('Artwork updated successfully!')
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Unable to update artwork.'
            )
        }
    }
const filteredArtworks =
    statusFilter === 'all'
        ? artworks
        : artworks.filter(
              (artwork) =>
                  artwork.status === statusFilter
          )
    if (!user) {
        return (
            <PageLayout background={galleryBg}>
                <div className="login-page">
                    <div className="upload-container">
                        <h2>Login Required</h2>

                        <p style={{ margin: '20px 0' }}>
                            Please login first.
                        </p>

                        <button onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </PageLayout>
        )
    }

    if (user.role !== 'artist') {
        return (
            <PageLayout background={galleryBg}>
                <div className="login-page">
                    <div className="upload-container">
                        <h2>Access Denied</h2>

                        <p style={{ margin: '20px 0' }}>
                            Only artists can view their uploaded artworks.
                        </p>

                        <button onClick={() => navigate('/gallery')}>
                            Back to Gallery
                        </button>
                    </div>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout background={galleryBg}>
            <div className="my-artworks-page">
                <div className="page-heading">
                    <h1>Artist Dashboard</h1>

                    <p>
                        Manage your uploaded artworks and track their
                        approval status.
                    </p>
                </div>

                <div className="artist-dashboard-stats">
                    <div>
                        <h3>{statistics.total}</h3>
                        <p>Total Uploads</p>
                    </div>

                    <div>
                        <h3>{statistics.approved}</h3>
                        <p>Approved</p>
                    </div>

                    <div>
                        <h3>{statistics.pending}</h3>
                        <p>Pending</p>
                    </div>

                    <div>
                        <h3>{statistics.rejected}</h3>
                        <p>Rejected</p>
                    </div>
                </div>

                {loading && (
                    <p className="my-artworks-message">
                        Loading your artworks...
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading && !error && artworks.length === 0 && (
                    <p className="my-artworks-message">
                        You have not uploaded any artwork yet.
                    </p>
                )}
<div className="my-collection-heading">
    <div>
        <span>ARTIST COLLECTION</span>
        <h2>My Artworks</h2>
    </div>

    <button
        className="artist-upload-button"
        onClick={() => navigate('/upload-artwork')}
    >
        + Upload Artwork
    </button>
</div>
<div className="artist-artwork-filters">
    <button
        className={statusFilter === 'all' ? 'active' : ''}
        onClick={() => setStatusFilter('all')}
    >
        All
    </button>

    <button
        className={
            statusFilter === 'approved'
                ? 'active'
                : ''
        }
        onClick={() => setStatusFilter('approved')}
    >
        Approved
    </button>

    <button
        className={
            statusFilter === 'pending'
                ? 'active'
                : ''
        }
        onClick={() => setStatusFilter('pending')}
    >
        Pending
    </button>

    <button
        className={
            statusFilter === 'rejected'
                ? 'active'
                : ''
        }
        onClick={() => setStatusFilter('rejected')}
    >
        Rejected
    </button>
</div>
                <div className="my-artworks-grid">
                    {filteredArtworks.map((artwork) => (
                        <div
                            className="my-artwork-card"
                            key={artwork._id}
                        >
                            <img
                                src={artwork.image}
                                alt={artwork.title}
                            />

                            <div className="my-artwork-info">
                                <div className="my-artwork-header">
    <h2>{artwork.title}</h2>

    <div className="artwork-icon-actions">
        <button
            className="edit-icon-btn"
            onClick={() => openEditForm(artwork)}
            title="Edit Artwork"
        >
            <FaEdit />
        </button>

        <button
            className="delete-icon-btn"
            onClick={() => handleDelete(artwork._id)}
            title="Delete Artwork"
        >
            <FaTrashAlt />
        </button>
    </div>
</div>

<span
    className={`artwork-status status-${artwork.status}`}
>
    {artwork.status}
</span>
                                <p>
                                    <strong>Artist:</strong>{' '}
                                    {artwork.artistName}
                                </p>

                                <p>
                                    <strong>Category:</strong>{' '}
                                    {artwork.category}
                                </p>

                                <p>
                                    <strong>Price:</strong> ₹
                                    {artwork.price}
                                </p>

                                <small>
                                    Uploaded on:{' '}
                                    {new Date(
                                        artwork.createdAt
                                    ).toLocaleDateString()}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingArtwork && (
                <div className="edit-modal-overlay">
                    <form
    className="edit-artwork-modal"
    onSubmit={handleUpdate}
>
    <h2>Edit Artwork</h2>

    <label>Artwork Title</label>
    <input
        type="text"
        name="title"
        value={editForm.title}
        onChange={handleEditChange}
        required
    />

    <label>Artist Name</label>
    <input
        type="text"
        name="artistName"
        value={editForm.artistName}
        onChange={handleEditChange}
        required
    />

    <label>Category</label>
    <select
        name="category"
        value={editForm.category}
        onChange={handleEditChange}
        required
    >
        <option value="">Select Category</option>
        <option value="Paintings">Paintings</option>
        <option value="Sculptures">Sculptures</option>
        <option value="Ceramics">Ceramics</option>
        <option value="Digital Art">Digital Art</option>
        <option value="Photography">Photography</option>
        <option value="Drawing">Drawing</option>
    </select>

    <label>Description</label>
    <textarea
        name="description"
        value={editForm.description}
        onChange={handleEditChange}
        rows="3"
        required
    />

    <label>Artwork Story</label>
    <textarea
        name="story"
        value={editForm.story}
        onChange={handleEditChange}
        rows="3"
        required
    />

    <label>Artist Statement</label>
    <textarea
        name="artistStatement"
        value={editForm.artistStatement}
        onChange={handleEditChange}
        rows="3"
        required
    />

    <label>Medium</label>
    <input
        type="text"
        name="medium"
        value={editForm.medium}
        onChange={handleEditChange}
        required
    />

    <label>Year</label>
    <input
        type="number"
        name="year"
        value={editForm.year}
        onChange={handleEditChange}
        min="1000"
        max={new Date().getFullYear()}
        required
    />

    <label>Dimensions</label>
    <input
        type="text"
        name="dimensions"
        value={editForm.dimensions}
        onChange={handleEditChange}
        required
    />

    <label>Availability</label>
    <select
        name="availability"
        value={editForm.availability}
        onChange={handleEditChange}
        required
    >
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
        <option value="Reserved">Reserved</option>
    </select>

    <label>Price</label>
    <input
        type="number"
        name="price"
        value={editForm.price}
        onChange={handleEditChange}
        min="1"
        required
    />

    <div className="edit-modal-buttons">
        <button type="submit">
            Update Artwork
        </button>

        <button
            type="button"
            onClick={() => setEditingArtwork(null)}
        >
            Cancel
        </button>
    </div>
</form>
                </div>
            )}
        </PageLayout>
    )
}

export default MyArtworks