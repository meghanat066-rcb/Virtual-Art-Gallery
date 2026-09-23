import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    FaArrowLeft,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaEnvelope,
    FaExpand,
    FaHeart,
    FaRegCommentDots,
    FaRegHeart,
    FaRegStar,
    FaShoppingCart,
    FaStar,
    FaUserCircle,
        
} from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '../services/api'
import './ArtworkDetails.css'
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
function ArtworkDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [artwork, setArtwork] = useState(null)
    const [comments, setComments] = useState([])

    const [selectedImage, setSelectedImage] = useState('')
    const [selectedThumbnail, setSelectedThumbnail] =
        useState(0)
    const [selectedRoomIndex, setSelectedRoomIndex] =
    useState(0)

const [selectedSize, setSelectedSize] =
    useState('Large')
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [favorite, setFavorite] = useState(false)

    const [commentText, setCommentText] = useState('')

    const [loading, setLoading] = useState(true)
    const [liking, setLiking] = useState(false)
    const [savingFavorite, setSavingFavorite] =
        useState(false)
    const [commentLoading, setCommentLoading] =
        useState(false)

    const [error, setError] = useState('')
    const [commentError, setCommentError] =
        useState('')

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const token = localStorage.getItem('token')
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
    useEffect(() => {
        const fetchArtworkDetails = async () => {
            try {
                setLoading(true)
                setError('')

                const [
                    artworkResponse,
                    commentsResponse
                ] = await Promise.all([
                    api.get(`/artworks/${id}`),
                    api.get(`/comments/${id}`)
                ])

                const selectedArtwork =
                    artworkResponse.data.artwork

                setArtwork(selectedArtwork)
                setSelectedImage(selectedArtwork.image)
                setSelectedThumbnail(0)

                setComments(
                    commentsResponse.data.comments || []
                )

                const currentUserId =
                    user?.id || user?._id

                const artworkLikes =
                    selectedArtwork.likes || []

                const alreadyLiked = artworkLikes.some(
                    (likeUser) => {
                        const likeId =
                            typeof likeUser === 'object'
                                ? likeUser._id
                                : likeUser

                        return (
                            String(likeId) ===
                            String(currentUserId)
                        )
                    }
                )

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
            typeof artwork.uploadedBy === 'object'
                ? artwork.uploadedBy?._id
                : artwork.uploadedBy

        if (artistId) {
            navigate(`/artist/${artistId}`)
        }
    }

    const handleCommentSubmit = async (event) => {
        event.preventDefault()

        if (!commentText.trim()) {
            setCommentError(
                'Please enter a comment.'
            )
            return
        }

        if (!token) {
            toast.info(
                'Please login to post a comment.'
            )
            navigate('/login')
            return
        }

        try {
            setCommentLoading(true)
            setCommentError('')

            const response = await api.post(
                `/comments/${id}`,
                {
                    text: commentText.trim()
                }
            )

            setComments((currentComments) => [
                response.data.comment,
                ...currentComments
            ])

            setCommentText('')

            toast.success(
                'Comment added successfully!'
            )
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigate('/login')
                return
            }

            const message =
                err.response?.data?.message ||
                'Unable to add comment.'

            setCommentError(message)
            toast.error(message)
        } finally {
            setCommentLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="artwork-details-state">
                <div className="details-loading-spinner" />

                <h1>Loading Artwork</h1>

                <p>
                    Preparing the artwork experience...
                </p>
            </main>
        )
    }

    if (error || !artwork) {
        return (
            <main className="artwork-details-state">
                <h1>Artwork Not Found</h1>

                <p className="error-message">
                    {error ||
                        'This artwork is unavailable.'}
                </p>

                <button
                    type="button"
                    className="details-primary-button"
                    onClick={() =>
                        navigate('/gallery')
                    }
                >
                    <FaArrowLeft />
                    Back to Artworks
                </button>
            </main>
        )
    }

    const formattedPrice =
        artwork.price && Number(artwork.price) > 0
            ? `₹${Number(
                  artwork.price
              ).toLocaleString('en-IN')}`
            : 'Price on request'

    const availability =
        artwork.availability || 'Available'
    
    const activeRoom =
    ROOM_PREVIEWS[selectedRoomIndex]

const activeSize =
    ARTWORK_SIZES.find(
        (size) => size.name === selectedSize
    ) || ARTWORK_SIZES[2]

const basePrice = Number(artwork.price) || 0

const selectedPrice = Math.round(
    basePrice * activeSize.multiplier
)

const formattedSelectedPrice =
    selectedPrice > 0
        ? `₹${selectedPrice.toLocaleString('en-IN')}`
        : 'Price on request'     

    /*
     * For now your backend stores one image.
     * The same image is temporarily used for four thumbnails.
     * Later this array will use four different uploaded images.
     */
    const artworkImages = [
        artwork.image,
        artwork.image,
        artwork.image,
        artwork.image
    ]

    return (
        <main className="artwork-details-page">
            <section className="artwork-details-navigation">
                <button
                    type="button"
                    onClick={() =>
                        navigate('/gallery')
                    }
                >
                    <FaArrowLeft />
                    Back to Artworks
                </button>
            </section>

            {/* Main artwork presentation */}
            <section className="artevora-artwork-intro">
                <div className="artevora-artwork-copy">
                    <p className="artwork-category-label">
                        {artwork.category}
                    </p>

                    <h1>{artwork.title}</h1>

                    <div className="artevora-artist-year">
                        <button
                            type="button"
                            onClick={
                                handleArtistNavigation
                            }
                        >
                            By {artwork.artistName}
                        </button>

                        <span />

                        <strong>
                            {artwork.year ||
                                'Year not specified'}
                        </strong>
                    </div>

                    <div className="artevora-long-story">
                        <p>
                            {artwork.story ||
                                artwork.description ||
                                'The artist has not added the complete story behind this artwork yet.'}
                        </p>

                        {artwork.artistStatement && (
                            <p>
                                {
                                    artwork.artistStatement
                                }
                            </p>
                        )}
                    </div>

                    <div className="artevora-price-status">
                        <p>{formattedPrice}</p>

                        <span
                            className={
                                availability
                                    .toLowerCase()
                                    .includes(
                                        'available'
                                    )
                                    ? 'available'
                                    : 'unavailable'
                            }
                        >
                            <FaCheckCircle />
                            {availability}
                        </span>
                    </div>

                    <div className="artwork-secondary-actions">
                        <button
                            type="button"
                            onClick={handleLike}
                            disabled={liking}
                            className={
                                liked ? 'active' : ''
                            }
                        >
                            {liked ? (
                                <FaHeart />
                            ) : (
                                <FaRegHeart />
                            )}

                            <span>
                                {liked
                                    ? 'Liked'
                                    : 'Like Artwork'}
                            </span>

                            <small>{likeCount}</small>
                        </button>

                        <button
                            type="button"
                            onClick={handleFavorite}
                            disabled={
                                savingFavorite
                            }
                            className={
                                favorite
                                    ? 'active'
                                    : ''
                            }
                        >
                            {favorite ? (
                                <FaStar />
                            ) : (
                                <FaRegStar />
                            )}

                            <span>
                                {favorite
                                    ? 'Saved to Wishlist'
                                    : 'Add to Wishlist'}
                            </span>
                        </button>
                    </div>

                    <div className="artwork-primary-actions">
                        <button
                            type="button"
                            className="details-enquiry-button"
                            onClick={handleEnquiry}
                        >
                            <FaEnvelope />
                            Send Enquiry
                        </button>

                        {(!user ||
                            user.role ===
                                'user') && (
                            <button
                                type="button"
                                className="details-buy-button"
                                onClick={handleBuyNow}
                                disabled={
                                    !artwork.price ||
                                    availability ===
                                        'Sold'
                                }
                            >
                                <FaShoppingCart />

                                {availability ===
                                'Sold'
                                    ? 'Sold'
                                    : 'Buy Now'}
                            </button>
                        )}
                    </div>

                    <p className="purchase-note">
                        Secure purchase, delivery
                        confirmation and artwork
                        verification are completed before
                        the order is finalized.
                    </p>
                </div>

                <div className="artevora-artwork-visual">
                    <div className="artevora-main-artwork-image">
                        <img
                            src={
                                selectedImage ||
                                artwork.image
                            }
                            alt={artwork.title}
                        />

                        <button
                            type="button"
                            className="artevora-expand-artwork"
                            onClick={handleRoomPreview}
                            aria-label="View artwork in your space"
                        >
                            <FaExpand />
                        </button>
                    </div>

                    <div className="artevora-artwork-thumbnails">
                        {artworkImages.map(
                            (image, index) => (
                                <button
                                    type="button"
                                    key={`${image}-${index}`}
                                    className={
                                        selectedThumbnail ===
                                        index
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() => {
                                        setSelectedImage(
                                            image
                                        )
                                        setSelectedThumbnail(
                                            index
                                        )
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={`${artwork.title} view ${
                                            index + 1
                                        }`}
                                    />
                                </button>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section className="artevora-room-preview-section">
    <div className="artevora-visualize-heading">
        <p className="details-section-label">
            Curated Preview
        </p>

        <h2>Visualize in Your Space</h2>

        <p>
            Imagine how this artwork transforms carefully
            selected interiors before choosing the size
            that suits your space.
        </p>
    </div>

    <div className="artevora-luxury-preview">
        <div className="artevora-room-stage">
            <img
                key={activeRoom.name}
                src={activeRoom.image}
                alt={`${activeRoom.name} interior`}
                className="artevora-selected-room"
            />

            <img
                src={selectedImage || artwork.image}
                alt={`${artwork.title} displayed in ${activeRoom.name}`}
                className="artevora-room-artwork"
                style={{
                    top: activeRoom.artworkTop,
                    left: activeRoom.artworkLeft,
                    width: activeSize.previewWidth
                }}
            />
        </div>

        <div className="artevora-room-navigation">
            <button
                type="button"
                onClick={showPreviousRoom}
                aria-label="Show previous interior"
            >
                <FaChevronLeft />
            </button>

            <div className="artevora-room-identity">
                <h3>{activeRoom.name}</h3>

                <p>{activeRoom.subtitle}</p>

                <small>{activeRoom.note}</small>

                <span>
                    {selectedRoomIndex + 1} /{' '}
                    {ROOM_PREVIEWS.length}
                </span>
            </div>

            <button
                type="button"
                onClick={showNextRoom}
                aria-label="Show next interior"
            >
                <FaChevronRight />
            </button>
        </div>
    </div>

    <div className="artevora-size-section">
        <p className="artevora-size-label">
            Artwork Size
        </p>

        <div className="artevora-luxury-sizes">
            {ARTWORK_SIZES.map((size) => (
                <button
                    type="button"
                    key={size.name}
                    className={
                        selectedSize === size.name
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        setSelectedSize(size.name)
                    }
                >
                    <strong>
                        {size.dimensions}
                    </strong>

                    <span>{size.name}</span>
                </button>
            ))}
        </div>
    </div>

    <div className="artevora-visualize-summary">
        <p>From</p>

        <h3>{formattedSelectedPrice}</h3>

        <div>
            <span>
                Certificate of Authenticity Included
            </span>

            <span>
                Estimated Delivery: 5–7 Business Days
            </span>
        </div>

        {(!user || user.role === 'user') && (
            <button
                type="button"
                onClick={handleBuyNow}
                disabled={
                    !artwork.price ||
                    availability === 'Sold'
                }
            >
                <FaShoppingCart />

                {availability === 'Sold'
                    ? 'Sold'
                    : 'Buy Selected Size'}
            </button>
        )}
    </div>
</section>

            {/* Compact artwork information */}
            <section className="artevora-compact-information">
                <div className="artevora-information-heading">
                    <p className="details-section-label">
                        Details
                    </p>

                    <h2>Artwork Information</h2>
                </div>

                <div className="artevora-information-list">
                    <div>
                        <span>Medium</span>

                        <strong>
                            {artwork.medium ||
                                'Not specified'}
                        </strong>
                    </div>

                    <div>
                        <span>Year</span>

                        <strong>
                            {artwork.year ||
                                'Not specified'}
                        </strong>
                    </div>

                    <div>
                        <span>Dimensions</span>

                        <strong>
                            {artwork.dimensions ||
                                'Not specified'}
                        </strong>
                    </div>

                    <div>
                        <span>Category</span>

                        <strong>
                            {artwork.category}
                        </strong>
                    </div>

                    <div>
                        <span>Materials</span>

                        <strong>
                            {artwork.materials ||
                                'Not specified'}
                        </strong>
                    </div>

                    <div>
                        <span>Certificate</span>

                        <strong>
                            {artwork.certificate ||
                                'Available on request'}
                        </strong>
                    </div>

                    <div>
                        <span>Delivery</span>

                        <strong>
                            {artwork.deliveryInfo ||
                                'Confirmed during purchase'}
                        </strong>
                    </div>

                    <div>
                        <span>Availability</span>

                        <strong>
                            {availability}
                        </strong>
                    </div>
                </div>
            </section>

            {/* Comments */}
            <section className="professional-comments-section">
                <div className="comments-heading">
                    <div>
                        <p className="details-section-label">
                            Community
                        </p>

                        <h2>
                            Comments ({comments.length})
                        </h2>
                    </div>

                    <FaRegCommentDots />
                </div>

                <form
                    className="professional-comment-form"
                    onSubmit={handleCommentSubmit}
                >
                    <FaUserCircle className="comment-user-icon" />

                    <div className="comment-input-wrapper">
                        {commentError && (
                            <p className="comment-error">
                                {commentError}
                            </p>
                        )}

                        <textarea
                            placeholder="Share your thoughts about this artwork..."
                            value={commentText}
                            onChange={(event) =>
                                setCommentText(
                                    event.target.value
                                )
                            }
                            maxLength={500}
                            disabled={commentLoading}
                        />

                        <span className="comment-character-count">
                            {commentText.length} / 500
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="post-comment-button"
                        disabled={commentLoading}
                    >
                        {commentLoading
                            ? 'Posting...'
                            : 'Post Comment'}
                    </button>
                </form>

                <div className="professional-comments-list">
                    {comments.length === 0 ? (
                        <div className="no-comments-message">
                            <FaRegCommentDots />

                            <h3>No comments yet</h3>

                            <p>
                                Be the first person to
                                share a thought about this
                                artwork.
                            </p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <article
                                className="professional-comment-card"
                                key={comment._id}
                            >
                                <FaUserCircle className="comment-avatar" />

                                <div className="comment-content">
                                    <div className="comment-header">
                                        <h4>
                                            {comment.user
                                                ?.name ||
                                                'Gallery User'}
                                        </h4>

                                        <span>
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString(
                                                'en-IN',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }
                                            )}
                                        </span>
                                    </div>

                                    <p>
                                        {comment.text}
                                    </p>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </main>
    )
}

export default ArtworkDetails