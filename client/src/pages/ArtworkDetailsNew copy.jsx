import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    FaCalendarAlt,
    FaEnvelope,
    FaExpand,
    FaHeart,
    FaRegHeart,
    FaShoppingBag,
    FaShareAlt,
    FaTag,
    FaRulerCombined
} from 'react-icons/fa'

import { toast } from 'react-toastify'

import api from '../services/api'
import './ArtworkDetailsNew.css'

import livingRoom from '../assets/room-mockups/living-room.jpg'
import bedroom from '../assets/room-mockups/bedroom.jpg'
import office from '../assets/room-mockups/office.jpg'
import galleryWall from '../assets/room-mockups/gallery-wall.jpg'
import diningRoom from '../assets/room-mockups/dining-room.jpg'

const ROOM_PREVIEWS = [
    {
        name: 'Living Room',
        subtitle: 'Modern Minimal Interior',
        note: 'Best suited for medium to large statement artworks.',
        image: livingRoom,
        artworkTop: '18%',
        artworkLeft: '50%'
    },
    {
        name: 'Bedroom',
        subtitle: 'Contemporary Bedroom',
        note: 'Ideal for calm, balanced and minimalist compositions.',
        image: bedroom,
        artworkTop: '15%',
        artworkLeft: '50%'
    },
    {
        name: 'Office',
        subtitle: 'Executive Workspace',
        note: 'Designed for focused spaces and expressive visual pieces.',
        image: office,
        artworkTop: '17%',
        artworkLeft: '51%'
    },
    {
        name: 'Gallery Wall',
        subtitle: 'Contemporary Exhibition',
        note: 'Showcases the artwork under gallery-style presentation.',
        image: galleryWall,
        artworkTop: '20%',
        artworkLeft: '50%'
    },
    {
        name: 'Dining Area',
        subtitle: 'Luxury Dining Interior',
        note: 'Suitable for artwork that adds warmth and character.',
        image: diningRoom,
        artworkTop: '14%',
        artworkLeft: '50%'
    }
]
const ARTWORK_SIZES = [
    {
        name: 'Small',
        dimensions: '40 × 30 cm',
        multiplier: 0.7,
        previewWidth: '13%'
    },
    {
        name: 'Medium',
        dimensions: '60 × 45 cm',
        multiplier: 0.85,
        previewWidth: '17%'
    },
    {
        name: 'Large',
        dimensions: '90 × 60 cm',
        multiplier: 1,
        previewWidth: '22%'
    },
    {
        name: 'XL',
        dimensions: '120 × 90 cm',
        multiplier: 1.4,
        previewWidth: '28%'
    }
]
function ArtworkDetailsNew() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [artwork, setArtwork] = useState(null)
    const [comments, setComments] = useState([])
    const [relatedArtworks, setRelatedArtworks] = useState([])

    

    const [selectedImage, setSelectedImage] = useState('')
    const [selectedRoomIndex, setSelectedRoomIndex] =
        useState(0)

    const [selectedSize, setSelectedSize] =
        useState('Large')

    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [favorite, setFavorite] = useState(false)

    const [loading, setLoading] = useState(true)
    const [liking, setLiking] = useState(false)
    const [savingFavorite, setSavingFavorite] =
        useState(false)

    const [error, setError] = useState('')

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const token = localStorage.getItem('token')

        useEffect(() => {
        const fetchArtworkDetails = async () => {
            try {
                setLoading(true)
                setError('')

                const [
                 artworkResponse,
                 commentsResponse,
                 artworksResponse
                ]  = await Promise.all([
                 api.get(`/artworks/${id}`),
                 api.get(`/comments/${id}`),
                 api.get('/artworks')
            ])

                const selectedArtwork =
                    artworkResponse.data.artwork
                const allArtworks =
    artworksResponse.data.artworks || []

const similarArtworks = allArtworks
    .filter(
        (item) =>
            String(item._id) !== String(id)
    )
    .slice(0, 5)

setRelatedArtworks(similarArtworks) 

                setArtwork(selectedArtwork)
                setSelectedImage(
                    selectedArtwork.image
                )

                setComments(
                    commentsResponse.data.comments || []
                )

                const currentUserId =
                    user?.id || user?._id

                const artworkLikes =
                    selectedArtwork.likes || []

                const alreadyLiked =
                    artworkLikes.some((likeUser) => {
                        const likeId =
                            typeof likeUser === 'object'
                                ? likeUser._id
                                : likeUser

                        return (
                            String(likeId) ===
                            String(currentUserId)
                        )
                    })

                setLiked(alreadyLiked)
                setLikeCount(artworkLikes.length)

                if (token) {
                    try {
                        const favoriteResponse =
                            await api.get('/favorites')

                        const favorites =
                            favoriteResponse.data
                                .favorites || []

                        const alreadyFavorite =
                            favorites.some(
                                (favoriteArtwork) =>
                                    String(
                                        favoriteArtwork._id
                                    ) === String(id)
                            )

                        setFavorite(alreadyFavorite)
                    } catch {
                        setFavorite(false)
                    }
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        'Unable to load artwork details.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchArtworkDetails()
    }, [id])
        const showPreviousRoom = () => {
        setSelectedRoomIndex((currentIndex) =>
            currentIndex === 0
                ? ROOM_PREVIEWS.length - 1
                : currentIndex - 1
        )
    }

    const showNextRoom = () => {
        setSelectedRoomIndex((currentIndex) =>
            currentIndex === ROOM_PREVIEWS.length - 1
                ? 0
                : currentIndex + 1
        )
    }
        const activeRoom =
        ROOM_PREVIEWS[selectedRoomIndex]

    const activeSize =
        ARTWORK_SIZES.find(
            (size) => size.name === selectedSize
        ) || ARTWORK_SIZES[2]

    const basePrice =
        Number(artwork?.price) || 0

    const selectedPrice = Math.round(
        basePrice * activeSize.multiplier
    )

    const formattedSelectedPrice =
        selectedPrice > 0
            ? `₹${selectedPrice.toLocaleString('en-IN')}`
            : 'Price on request'

    const availability =
        artwork?.availability || 'Available'

        const handleLike = async () => {
    if (!token) {
        toast.info(
            'Please login to like this artwork.'
        )
        navigate('/login')
        return
    }

    try {
        setLiking(true)

        const response = await api.patch(
            `/artworks/${id}/like`
        )

        setLiked(response.data.liked)
        setLikeCount(response.data.likeCount)

        toast.success(
            response.data.liked
                ? 'Artwork liked!'
                : 'Artwork unliked!'
        )
    } catch (err) {
        toast.error(
            err.response?.data?.message ||
                'Unable to update like.'
        )
    } finally {
        setLiking(false)
    }
}


const handleFavorite = async () => {
    if (!token) {
        toast.info(
            'Please login to save this artwork.'
        )
        navigate('/login')
        return
    }

    try {
        setSavingFavorite(true)

        const response = await api.patch(
            `/favorites/${id}`
        )

        setFavorite(response.data.favorite)

        toast.success(
            response.data.favorite
                ? 'Added to wishlist!'
                : 'Removed from wishlist!'
        )
    } catch (err) {
        toast.error(
            err.response?.data?.message ||
                'Unable to update wishlist.'
        )
    } finally {
        setSavingFavorite(false)
    }
}


const handleBuyNow = () => {
    if (!user) {
        toast.info(
            'Please login as a user to buy artwork.'
        )
        navigate('/login')
        return
    }

    if (user.role !== 'user') {
        toast.error(
            'Only users can purchase artworks.'
        )
        return
    }

    if (!artwork.price || artwork.price <= 0) {
        toast.error(
            'Price is not available for this artwork.'
        )
        return
    }

    if (artwork.availability === 'Sold') {
        toast.error(
            'This artwork has already been sold.'
        )
        return
    }

    const chosenSize =
        ARTWORK_SIZES.find(
            (size) => size.name === selectedSize
        ) || ARTWORK_SIZES[2]

    const finalPrice = Math.round(
        Number(artwork.price) *
            chosenSize.multiplier
    )

    const room =
        ROOM_PREVIEWS[selectedRoomIndex]

    navigate(`/payment/${artwork._id}`, {
        state: {
            selectedSize: chosenSize.name,
            selectedDimensions:
                chosenSize.dimensions,
            selectedPrice: finalPrice,
            selectedRoom: room.name
        }
    })
}


const handleEnquiry = () => {
    if (!user) {
        toast.info(
            'Please login to send an enquiry.'
        )
        navigate('/login')
        return
    }

    if (user.role !== 'user') {
        toast.error(
            'Only registered users can send enquiries.'
        )
        return
    }

    navigate(`/enquiry/${artwork._id}`)
}


const handleRoomPreview = () => {
    navigate(`/room-preview/${artwork._id}`)
}

        const handleArtistNavigation = () => {
    const artistId =
        typeof artwork?.uploadedBy === 'object'
            ? artwork.uploadedBy?._id
            : artwork?.uploadedBy

    if (artistId) {
        navigate(`/artist/${artistId}`)
    }
}

const handleSizeChange = (sizeName) => {
    setSelectedSize(sizeName)
}

const handleShare = async () => {
    const shareData = {
        title: artwork?.title || 'Artwork',
        text: `Check out ${artwork?.title || 'this artwork'}`,
        url: window.location.href
    }

    try {
        if (navigator.share) {
            await navigator.share(shareData)
        } else {
            await navigator.clipboard.writeText(
                window.location.href
            )

            toast.success(
                'Artwork link copied!'
            )
        }
    } catch {
        // User cancelled sharing
    }
}

    if (loading) {
        return (
            <div className="artevora-details-loading">
                Loading artwork...
            </div>
        )
    }

    if (error || !artwork) {
        return (
            <div className="artevora-details-error">
                {error || 'Artwork not found.'}
            </div>
        )
    }

    return (
        <div className="artevora-new-details-page">

            {/* =========================================
                TOP ARTWORK SECTION
            ========================================== */}

            <section className="artevora-product-section">

                {/* LEFT — SINGLE ARTWORK IMAGE */}
                <div className="artevora-product-visual">

                    <div className="artevora-zoom-container">

                        <img
                            src={
                                selectedImage ||
                                artwork.image
                            }
                            alt={artwork.title}
                            className="artevora-zoom-image"
                        />

                        <button
                            type="button"
                            className="artevora-image-expand"
                            aria-label="View artwork"
                            onClick={() =>
                                handleRoomPreview()
                            }
                        >
                            <FaExpand />
                        </button>

                    </div>

                </div>


                {/* RIGHT — ARTWORK INFORMATION */}
                <div className="artevora-product-info">

                    {/* TITLE */}
                    <h1 className="artevora-product-title">
                        {artwork.title}
                    </h1>


                    {/* ARTIST */}
                    <div className="artevora-artist-row">

                        <button
                            type="button"
                            className="artevora-artist-name"
                            onClick={
                                handleArtistNavigation
                            }
                        >
                            By {artwork.artistName}
                        </button>

                        <button
                            type="button"
                            className="artevora-artist-link"
                            onClick={
                                handleArtistNavigation
                            }
                        >
                            Know more about artist
                            <span>→</span>
                        </button>

                    </div>


                    {/* ARTWORK INFORMATION */}
                    <div className="artevora-artwork-meta">

                        <div className="artevora-meta-item">
                            <FaCalendarAlt />

                            <span>
                                {artwork.year ||
                                    'Year not specified'}
                            </span>
                        </div>

                        <span className="artevora-meta-divider" />

                        <div className="artevora-meta-item">
                            <FaTag />

                            <span>
                                {artwork.medium ||
                                    'Medium not specified'}
                            </span>
                        </div>

                        <span className="artevora-meta-divider" />

                        <div className="artevora-meta-item">
                            <FaRulerCombined />

                            <span>
                                {artwork.dimensions ||
                                    activeSize.dimensions}
                            </span>
                        </div>

                    </div>


                    {/* PRICE */}
                    <div className="artevora-price-section">

                        <div>
                            <h2>
                                {formattedSelectedPrice}
                            </h2>

                            <p>
                                Inclusive of all taxes
                            </p>
                        </div>

                        <div className="artevora-like-count">

                            <button
                                type="button"
                                onClick={handleLike}
                                disabled={liking}
                                aria-label="Like artwork"
                            >
                                {liked ? (
                                    <FaHeart />
                                ) : (
                                    <FaRegHeart />
                                )}
                            </button>

                            <span>
                                {likeCount}
                            </span>

                        </div>

                    </div>


                    {/* SIZE CARDS */}
                    <div className="artevora-size-section">

                        <h3>SIZE</h3>

                        <div className="artevora-size-cards">

                            {ARTWORK_SIZES.map(
                                (size) => {

                                    const sizePrice =
                                        Math.round(
                                            basePrice *
                                            size.multiplier
                                        )

                                    return (
                                        <button
                                            type="button"
                                            key={size.name}
                                            className={
                                                selectedSize ===
                                                size.name
                                                    ? 'active'
                                                    : ''
                                            }
                                            onClick={() =>
                                                handleSizeChange(
                                                    size.name
                                                )
                                            }
                                        >
                                            <strong>
                                                {
                                                    size.dimensions
                                                }
                                            </strong>

                                            <span>
                                                ₹
                                                {sizePrice.toLocaleString(
                                                    'en-IN'
                                                )}
                                            </span>
                                        </button>
                                    )
                                }
                            )}

                        </div>

                    </div>


                    {/* ENQUIRE + BUY */}
                    <div className="artevora-purchase-actions">

                        <button
                            type="button"
                            className="artevora-enquire-button"
                            onClick={
                                handleEnquiry
                            }
                        >
                            <FaEnvelope />

                            <span>
                                ENQUIRE NOW
                            </span>
                        </button>


                        <button
                            type="button"
                            className="artevora-buy-button"
                            onClick={
                                handleBuyNow
                            }
                        >
                            <FaShoppingBag />

                            <span>
                                BUY NOW
                            </span>
                        </button>

                    </div>


                    {/* WISHLIST + SHARE */}
                    <div className="artevora-secondary-actions">

                        <button
                            type="button"
                            onClick={
                                handleFavorite
                            }
                            disabled={
                                savingFavorite
                            }
                        >
                            {favorite ? (
                                <FaHeart />
                            ) : (
                                <FaRegHeart />
                            )}

                            <span>
                                {favorite
                                    ? 'ADDED TO WISHLIST'
                                    : 'ADD TO WISHLIST'}
                            </span>
                        </button>


                        <button
                            type="button"
                            onClick={
                                handleShare
                            }
                        >
                            <FaShareAlt />

                            <span>
                                SHARE ARTWORK
                            </span>
                        </button>

                    </div>

                </div>

            </section>

            <section className="artevora-about-artwork">

    <div className="artevora-about-description">

        <div className="artevora-section-heading">
            <h2>ABOUT THE ARTWORK</h2>
            <span />
        </div>

        <div className="artevora-about-text">

            <p>
                {artwork.description ||
                    `"${artwork.title}" is an expressive
                    artwork that captures emotion,
                    atmosphere and movement through
                    carefully layered colours and
                    textures.`}
            </p>

            <p>
                The artwork invites the viewer to pause,
                reflect and discover their own meaning
                within its composition. Every layer,
                colour and detail contributes to the
                overall visual experience.
            </p>

        </div>

        <div className="artevora-artist-signature">

            <div className="artevora-signature-line">
                <span>
                    {artwork.artistName || 'Artist'}
                </span>
            </div>

            <p>
                {artwork.artistName || 'Artist'}
            </p>

        </div>

    </div>


    <div className="artevora-artwork-specifications">

        <div className="artevora-spec-row">
            <span>Year Created</span>
            <strong>
                {artwork.year || 'Not specified'}
            </strong>
        </div>

        <div className="artevora-spec-row">
            <span>Medium</span>
            <strong>
                {artwork.medium || 'Not specified'}
            </strong>
        </div>

        <div className="artevora-spec-row">
            <span>Dimensions</span>
            <strong>
                {ARTWORK_SIZES.find(
                    (size) => size.name === selectedSize
                )?.dimensions ||
                    artwork.dimensions ||
                    'Not specified'}
            </strong>
        </div>

        <div className="artevora-spec-row">
            <span>Orientation</span>
            <strong>
                {artwork.orientation || 'Portrait'}
            </strong>
        </div>

        <div className="artevora-spec-row">
            <span>Framed</span>
            <strong>
                {artwork.framed || 'Yes'}
            </strong>
        </div>

        <div className="artevora-spec-row">
            <span>Ships From</span>
            <strong>
                {artwork.shipsFrom || 'India'}
            </strong>
        </div>

        <div className="artevora-spec-row">
            <span>Availability</span>
            <strong>
                {availability}
            </strong>
        </div>

    </div>

</section>

<section className="artevora-visualize-section">

    {/* SECTION TITLE */}
    <div className="artevora-visualize-header">
        <h2>VISUALIZE IN YOUR SPACE</h2>

        <p>
            See how this artwork looks in different spaces
            and find the perfect fit for your interior.
        </p>
    </div>


    <div className="artevora-visualize-layout">

        {/* =========================================
            LEFT CONTROL PANEL
           ========================================= */}

        <aside className="artevora-visualize-controls">

            {/* SIZE DROPDOWN */}

            <div className="artevora-visualize-control-group">

                <label htmlFor="artwork-size">
                    SELECT SIZE
                </label>

                <div className="artevora-size-dropdown-wrapper">

    <select
        id="artwork-size"
        value={selectedSize}
        onChange={(event) =>
            setSelectedSize(event.target.value)
        }
        className="artevora-size-dropdown"
    >
        {ARTWORK_SIZES.map((size) => (
            <option
                key={size.name}
                value={size.name}
            >
                {size.dimensions} — ₹
                {Math.round(
                    basePrice * size.multiplier
                ).toLocaleString('en-IN')}
            </option>
        ))}
    </select>

    <div className="artevora-selected-size-display">

        <div className="artevora-selected-size-info">

            <strong>
                {
                    ARTWORK_SIZES.find(
                        (size) =>
                            size.name === selectedSize
                    )?.dimensions
                }
            </strong>

            <span>
                {selectedPrice > 0
                    ? `₹${selectedPrice.toLocaleString(
                          'en-IN'
                      )}`
                    : 'Price on request'}
            </span>

        </div>

        <span className="artevora-size-arrow">
            ▾
        </span>

    </div>

</div>

            </div>


            {/* ROOM SELECTION */}

            <div className="artevora-visualize-control-group">

                <label>
                    SELECT ROOM
                </label>

                <div className="artevora-room-options">

                    {ROOM_PREVIEWS.map(
                        (room, index) => (

                            <button
                                type="button"
                                key={room.name}
                                className={
                                    selectedRoomIndex === index
                                        ? 'active'
                                        : ''
                                }
                                onClick={() =>
                                    setSelectedRoomIndex(index)
                                }
                            >

                                <span className="artevora-room-icon">

                                    {index === 0 && '🛋️'}
                                    {index === 1 && '🛏️'}
                                    {index === 2 && '🖥️'}
                                    {index === 3 && '▦'}
                                    {index === 4 && '🍽️'}

                                </span>

                                <span>
                                    {room.name}
                                </span>

                            </button>

                        )
                    )}

                </div>

            </div>

        </aside>


        {/* =========================================
            MAIN ROOM PREVIEW
           ========================================= */}

        <div className="artevora-main-room-preview">

            <div className="artevora-room-image-wrapper">

                <img
                    src={activeRoom.image}
                    alt={activeRoom.name}
                    className="artevora-room-background"
                />


                {/* ARTWORK OVER ROOM */}

                {artwork?.image && (

                    <img
                        src={
                            selectedImage ||
                            artwork.image
                        }
                        alt={artwork.title}
                        className="artevora-room-artwork"
                        style={{
                            top: activeRoom.artworkTop,
                            left: activeRoom.artworkLeft,
                            width: activeSize.previewWidth
                        }}
                    />

                )}

            </div>

        </div>


        {/* =========================================
            RIGHT ROOM THUMBNAILS
           ========================================= */}

        <div className="artevora-room-thumbnails">

            {ROOM_PREVIEWS.map(
    (room, index) => (

        <button
            type="button"
            key={room.name}
            className={
                selectedRoomIndex === index
                    ? 'active'
                    : ''
            }
            onClick={() =>
                setSelectedRoomIndex(index)
            }
        >

            <img
                src={room.image}
                alt={room.name}
            />

            <span>
                {room.name}
            </span>

        </button>

    )
)}

        </div>

    </div>

</section>
<section className="artevora-comments-section">

    <div className="artevora-comments-header">

        <div>
            <h2>COMMENTS & REVIEWS</h2>

            <span className="artevora-comments-line" />
        </div>

        <span className="artevora-comments-count">
            {comments.length}{' '}
            {comments.length === 1
                ? 'Comment'
                : 'Comments'}
        </span>

    </div>


    {comments.length === 0 ? (

        <div className="artevora-no-comments">

            <h3>No comments yet</h3>

            <p>
                Be the first to share your thoughts
                about this artwork.
            </p>

        </div>

    ) : (

        <div className="artevora-comments-list">

            {comments.map((comment, index) => (

                <div
                    className="artevora-comment-card"
                    key={comment._id || index}
                >

                    <div className="artevora-comment-user">

                        <div className="artevora-comment-avatar">
                            U
                        </div>

                        <div>
                            <strong>
                                User
                            </strong>
                        </div>

                    </div>

                    <p className="artevora-comment-text">
                        {comment.comment ||
                            comment.text ||
                            comment.content ||
                            'No comment text available.'}
                    </p>

                </div>

            ))}

        </div>

    )}

</section>

<section className="artevora-related-section">

    <div className="artevora-related-header">

        <div>
            <h2>MORE ARTWORKS YOU MAY LIKE</h2>

            <span className="artevora-related-line" />
        </div>

        <button
            type="button"
            onClick={() => navigate('/gallery')}
        >
            View All Artworks →
        </button>

    </div>


    {relatedArtworks.length > 0 ? (

        <div className="artevora-related-grid">

            {relatedArtworks.map((relatedArtwork) => (

                <article
                    className="artevora-related-card"
                    key={relatedArtwork._id}
                    onClick={() =>
                        navigate(
                            `/artwork/${relatedArtwork._id}`
                        )
                    }
                >

                    <div className="artevora-related-image">

                        <img
                            src={relatedArtwork.image}
                            alt={
                                relatedArtwork.title ||
                                'Artwork'
                            }
                        />

                    </div>


                    <div className="artevora-related-info">

                        <h3>
                            {relatedArtwork.title ||
                                'Untitled Artwork'}
                        </h3>

                        <p>
                            {relatedArtwork.artistName ||
                                'Artist'}
                        </p>

                        <span>
                            {Number(
                                relatedArtwork.price
                            ) > 0
                                ? `₹${Number(
                                      relatedArtwork.price
                                  ).toLocaleString(
                                      'en-IN'
                                  )}`
                                : 'Price on request'}
                        </span>

                    </div>

                </article>

            ))}

        </div>

    ) : (

        <div className="artevora-related-empty">

            <p>
                Explore more artworks from our
                collection.
            </p>

            <button
                type="button"
                onClick={() =>
                    navigate('/gallery')
                }
            >
                Explore Gallery
            </button>

        </div>

    )}

</section>


        </div>
    )
}

export default ArtworkDetailsNew