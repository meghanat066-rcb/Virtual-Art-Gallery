import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaImage,
    FaPlus
} from 'react-icons/fa'

import api from '../services/api'
import './ArtistMyArtworks.css'

const ARTWORK_SIZES = [
    {
        name: 'Small',
        dimensions: '40 × 30 cm',
        multiplier: 0.7
    },
    {
        name: 'Medium',
        dimensions: '60 × 45 cm',
        multiplier: 0.85
    },
    {
        name: 'Large',
        dimensions: '90 × 60 cm',
        multiplier: 1
    },
    {
        name: 'XL',
        dimensions: '120 × 90 cm',
        multiplier: 1.4
    }
]

function ArtistMyArtworks() {

    const navigate = useNavigate()

    const [artworks, setArtworks] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    useEffect(() => {

        if (!user || user.role !== 'artist') {
            navigate('/login')
            return
        }

        fetchMyArtworks()

    }, [user, navigate])


    const fetchMyArtworks = async () => {

        try {

            setLoading(true)

            const response = await api.get(
                '/artworks/my-artworks'
            )

            if (response.data?.success) {

                setArtworks(
                    response.data.artworks || []
                )

            }

        } catch (error) {

            console.error(
                'Error fetching my artworks:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to load your artworks.'
            )

        } finally {

            setLoading(false)

        }
    }


    const handleDelete = async (artworkId) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this artwork? This action cannot be undone.'
        )

        if (!confirmed) {
            return
        }

        try {

            setDeletingId(artworkId)

            const response = await api.delete(
                `/artworks/${artworkId}`
            )

            if (response.data?.success) {

                setArtworks((currentArtworks) =>
                    currentArtworks.filter(
                        (artwork) =>
                            artwork._id !== artworkId
                    )
                )

                toast.success(
                    response.data.message ||
                    'Artwork deleted successfully.'
                )
            }

        } catch (error) {

            console.error(
                'Error deleting artwork:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to delete artwork.'
            )

        } finally {

            setDeletingId(null)

        }
    }


    const getStatusClass = (status) => {

        if (status === 'approved') {
            return 'approved'
        }

        if (status === 'rejected') {
            return 'rejected'
        }

        return 'pending'
    }


    if (loading) {

        return (
            <div className="artist-my-artworks-page">

                <div className="my-artworks-loading">

                    <div className="my-artworks-loader" />

                    <h2>
                        Loading Your Artworks
                    </h2>

                    <p>
                        Please wait while we load your artwork collection.
                    </p>

                </div>

            </div>
        )
    }


    return (
        <div className="artist-my-artworks-page">

            {/* HEADER */}

            <div className="my-artworks-topbar">

                <button
                    type="button"
                    className="my-artworks-back-button"
                    onClick={() =>
                        navigate('/artist-dashboard')
                    }
                >
                    <FaArrowLeft />
                    Back to Dashboard
                </button>

                <span>
                    ARTIST STUDIO
                </span>

            </div>


            <div className="my-artworks-header">

                <div>

                    <span>
                        ARTIST COLLECTION
                    </span>

                    <h1>
                        My Artworks
                    </h1>

                    <p>
                        View, manage and update the artworks
                        you have submitted to the gallery.
                    </p>

                </div>

                <button
                    type="button"
                    className="add-artwork-button"
                    onClick={() =>
                        navigate('/upload-artwork')
                    }
                >
                    <FaPlus />
                    Add Artwork
                </button>

            </div>


            {/* SUMMARY */}

            <div className="my-artworks-summary">

                <div className="my-artworks-summary-card">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        {artworks.length}
                    </strong>

                    <small>
                        Artworks
                    </small>

                </div>


                <div className="my-artworks-summary-card">

                    <span>
                        APPROVED
                    </span>

                    <strong>
                        {
                            artworks.filter(
                                (artwork) =>
                                    artwork.status === 'approved'
                            ).length
                        }
                    </strong>

                    <small>
                        Published
                    </small>

                </div>


                <div className="my-artworks-summary-card">

                    <span>
                        PENDING
                    </span>

                    <strong>
                        {
                            artworks.filter(
                                (artwork) =>
                                    artwork.status === 'pending'
                            ).length
                        }
                    </strong>

                    <small>
                        Under Review
                    </small>

                </div>


                <div className="my-artworks-summary-card">

                    <span>
                        REJECTED
                    </span>

                    <strong>
                        {
                            artworks.filter(
                                (artwork) =>
                                    artwork.status === 'rejected'
                            ).length
                        }
                    </strong>

                    <small>
                        Needs Attention
                    </small>

                </div>

            </div>


            {/* ARTWORKS */}

            <section className="my-artworks-content">

                <div className="my-artworks-section-heading">

                    <div>

                        <span>
                            YOUR WORK
                        </span>

                        <h2>
                            Artwork Collection
                        </h2>

                    </div>

                    <div className="my-artworks-count">
                        {artworks.length} Artworks
                    </div>

                </div>


                {artworks.length === 0 ? (

                    <div className="my-artworks-empty">

                        <div className="my-artworks-empty-icon">
                            <FaImage />
                        </div>

                        <h2>
                            No artworks yet
                        </h2>

                        <p>
                            You have not submitted any artworks
                            to the gallery yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/upload-artwork')
                            }
                        >
                            <FaPlus />
                            Upload Your First Artwork
                        </button>

                    </div>

                ) : (

                    <div className="my-artworks-grid">

                        {artworks.map((artwork) => (

                           <article
    className="my-artwork-card"
    key={artwork._id}
>

    {/* IMAGE */}

    <div className="my-artwork-image-wrapper">

        {artwork.image ? (

            <img
                src={artwork.image}
                alt={artwork.title}
            />

        ) : (

            <div className="my-artwork-no-image">
                <FaImage />
            </div>

        )}

    </div>


    {/* ARTWORK INFORMATION */}

    <div className="my-artwork-info">

        <span className="my-artwork-category">
            {artwork.category}
        </span>

        <h3>
            {artwork.title}
        </h3>

        <p className="my-artwork-artist">
            {artwork.artistName}
        </p>
        <span
    className={`my-artwork-status ${getStatusClass(
        artwork.status
    )}`}
>
    {artwork.status}
</span>

    </div>


    {/* REPLICA PRICES */}

    
    <div className="my-artwork-price-list">

    <div className="my-artwork-price-column">

        {ARTWORK_SIZES.slice(0, 2).map((size) => {

            const sizeKey = size.name.toLowerCase()

            const replicaData =
                artwork.replicaPrices?.[sizeKey]

            const replicaPrice =
                replicaData?.available &&
                Number(replicaData.price) > 0
                    ? Number(replicaData.price)
                    : 0

            return (
                <div
                    className="my-artwork-price-item"
                    key={size.name}
                >

                    <span>
                        {size.dimensions}
                    </span>

                    <strong>
                        {replicaPrice > 0
                            ? `₹${replicaPrice.toLocaleString(
                                  'en-IN'
                              )}`
                            : 'Price on request'}
                    </strong>

                </div>
            )
        })}

    </div>


    <div className="my-artwork-price-column">

        {ARTWORK_SIZES.slice(2, 4).map((size) => {

            const sizeKey = size.name.toLowerCase()

            const replicaData =
                artwork.replicaPrices?.[sizeKey]

            const replicaPrice =
                replicaData?.available &&
                Number(replicaData.price) > 0
                    ? Number(replicaData.price)
                    : 0

            return (
                <div
                    className="my-artwork-price-item"
                    key={size.name}
                >

                    <span>
                        {size.dimensions}
                    </span>

                    <strong>
                        {replicaPrice > 0
                            ? `₹${replicaPrice.toLocaleString(
                                  'en-IN'
                              )}`
                            : 'Price on request'}
                    </strong>

                </div>
            )
        })}

    </div>

</div>



    {/* AVAILABILITY */}

    <div className="my-artwork-availability">

        <span className="my-artwork-column-label">
            AVAILABILITY
        </span>

        <strong>
            {artwork.availability || 'Available'}
        </strong>

    </div>


    {/* ACTIONS */}

    <div className="my-artwork-actions">

        <button
            type="button"
            className="my-artwork-edit-button"
            onClick={() =>
                navigate(
                    `/edit-artwork/${artwork._id}`
                )
            }
        >
            <FaEdit />
            Edit
        </button>

        <button
            type="button"
            className="my-artwork-delete-button"
            onClick={() =>
                handleDelete(artwork._id)
            }
            disabled={
                deletingId === artwork._id
            }
        >
            <FaTrash />

            {deletingId === artwork._id
                ? 'Deleting...'
                : 'Delete'}
        </button>

    </div>

</article> 

                        ))}

                    </div>

                )}

            </section>

        </div>
    )
}

export default ArtistMyArtworks