import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    FaCalendarAlt,
    FaEnvelope,
    FaHeart,
    FaRegHeart,
    FaStar,
    FaRegStar,
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


/* =========================================================
   ROOM PREVIEWS
========================================================= */

const ROOM_PREVIEWS = [
    {
        name: 'Living Room',
        subtitle: 'Modern Minimal Interior',
        note: 'Best suited for medium to large statement artworks.',
        image: livingRoom,
        artworkTop: '38%',
        artworkLeft: '50%',
        wallWidth: '34%',
        wallHeight: '42%'
    },

    {
        name: 'Bedroom',
        subtitle: 'Contemporary Bedroom',
        note: 'Ideal for calm, balanced and minimalist compositions.',
        image: bedroom,
        artworkTop: '28%',
        artworkLeft: '50%',
        wallWidth: '30%',
        wallHeight: '35%'
    },

    {
        name: 'Office',
        subtitle: 'Executive Workspace',
        note: 'Designed for focused spaces and expressive visual pieces.',
        image: office,
        artworkTop: '30%',
        artworkLeft: '25%',
        wallWidth: '30%',
        wallHeight: '40%'
    },

    {
        name: 'Gallery Wall',
        subtitle: 'Contemporary Exhibition',
        note: 'Showcases the artwork under gallery-style presentation.',
        image: galleryWall,
        artworkTop: '47%',
        artworkLeft: '50%',
        wallWidth: '28%',
        wallHeight: '38%'
    },

    {
        name: 'Dining Area',
        subtitle: 'Luxury Dining Interior',
        note: 'Suitable for artwork that adds warmth and character.',
        image: diningRoom,
        artworkTop: '28%',
        artworkLeft: '45%',
        wallWidth: '25%',
        wallHeight: '38%'
    }
]


/* =========================================================
   ARTWORK SIZES
========================================================= */

const ARTWORK_SIZES = [
    {
        key: 'small',
        name: 'Small',
        dimensions: '40 × 30 cm',
        multiplier: 0.7,
        widthRatio: 40,
        heightRatio: 30,
        previewScale: 0.55
    },

    {
        key: 'medium',
        name: 'Medium',
        dimensions: '60 × 45 cm',
        multiplier: 0.85,
        widthRatio: 60,
        heightRatio: 45,
        previewScale: 0.72
    },

    {
        key: 'large',
        name: 'Large',
        dimensions: '90 × 60 cm',
        multiplier: 1,
        widthRatio: 90,
        heightRatio: 60,
        previewScale: 1
    },

    {
        key: 'xl',
        name: 'XL',
        dimensions: '120 × 90 cm',
        multiplier: 1.4,
        widthRatio: 120,
        heightRatio: 90,
        previewScale: 1.28
    }
]


function ArtworkDetailsNew() {

    const { id } = useParams()
    const navigate = useNavigate()


    /* =========================================================
       ARTWORK DATA
    ========================================================= */

    const [artwork, setArtwork] = useState(null)

    const [comments, setComments] = useState([])

    const [newComment, setNewComment] = useState('')

    const [postingComment, setPostingComment] =
        useState(false)

    const [relatedArtworks, setRelatedArtworks] =
        useState([])


    /* =========================================================
       GALLERY / VISUALIZATION
    ========================================================= */

    const [selectedImage, setSelectedImage] =
        useState('')

    const [selectedRoomIndex, setSelectedRoomIndex] =
        useState(0)

    const [selectedSize, setSelectedSize] =
        useState('Small')

    const [visualizeSize, setVisualizeSize] =
        useState('Small')

    const [activeArtworkView, setActiveArtworkView] =
        useState('Original')

    const [selectedGalleryImage, setSelectedGalleryImage] =
        useState(0)


    /* =========================================================
       LIKE / FAVORITE
    ========================================================= */

    const [liked, setLiked] =
        useState(false)

    const [likeCount, setLikeCount] =
        useState(0)

    const [favorite, setFavorite] =
        useState(false)

        const [showShareOptions, setShowShareOptions] =
    useState(false)


    /* =========================================================
       REPLICA DATA
       
       IMPORTANT:
       Replicas now come from actual Replica documents
       returned by:
       
       artworkResponse.data.replicas
    ========================================================= */

    const [replicas, setReplicas] =
        useState([])

    const [selectedReplica, setSelectedReplica] =
        useState(null)


    /* =========================================================
       LOADING / ACTION STATES
    ========================================================= */

    const [loading, setLoading] =
        useState(true)

    const [liking, setLiking] =
        useState(false)

    const [savingFavorite, setSavingFavorite] =
        useState(false)

    const [error, setError] =
        useState('')


    /* =========================================================
       CURRENT USER
    ========================================================= */

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const token =
        localStorage.getItem('token')


    /* =========================================================
       FETCH ARTWORK DETAILS
    ========================================================= */

    useEffect(() => {

        const fetchArtworkDetails = async () => {

            try {

                setLoading(true)
                setError('')


                const [
                    artworkResponse,
                    commentsResponse,
                    artworksResponse
                ] = await Promise.all([

                    api.get(`/artworks/${id}`),

                    api.get(`/comments/${id}`),

                    api.get('/artworks')

                ])


                /* =====================================================
                   SELECTED ARTWORK
                ===================================================== */

                const selectedArtwork =
                    artworkResponse.data.artwork

                    console.log("DETAILS ARTWORK DATA:", selectedArtwork)
console.log("DETAILS REPLICA IMAGE:", selectedArtwork?.replicaImage)
console.log("DETAILS REPLICA PRICES:", selectedArtwork?.replicaPrices)


                /* =====================================================
                   ACTUAL REPLICA DOCUMENTS
                   
                   DO NOT use:
                   artwork.replicaPrices
                   
                   Replicas are now obtained directly from:
                   artworkResponse.data.replicas
                ===================================================== */

                const artworkReplicas =
                    artworkResponse.data.replicas || []

                    console.log('ARTWORK DETAILS RESPONSE:', artworkResponse.data)
                    console.log('REPLICAS:', artworkReplicas)



                setArtwork(selectedArtwork)

                setReplicas(artworkReplicas)


                /* =====================================================
                   DEFAULT ARTWORK IMAGE
                ===================================================== */

                setSelectedImage(
                    selectedArtwork.image
                )


                /* =====================================================
                   DEFAULT REPLICA
                   
                   Find first available replica.
                ===================================================== */

                const firstAvailableReplica =
                    artworkReplicas.find(
                        (replica) =>
                            replica &&
                            Number(replica.price) > 0
                    )


                if (firstAvailableReplica) {

                    setSelectedReplica(
                        firstAvailableReplica
                    )


                    /*
                     * If the replica contains a size,
                     * automatically select that size.
                     */

                    const replicaSize =
                        String(
                            firstAvailableReplica.size ||
                            firstAvailableReplica.artworkSize ||
                            ''
                        ).toLowerCase()


                    const sizeMap = {
                        small: 'Small',
                        medium: 'Medium',
                        large: 'Large',
                        xl: 'XL'
                    }


                    if (sizeMap[replicaSize]) {

                        setSelectedSize(
                            sizeMap[replicaSize]
                        )

                    }

                }


                /* =====================================================
                   RELATED ARTWORKS
                ===================================================== */

                const allArtworks =
                    artworksResponse.data.artworks || []


                const similarArtworks =
                    allArtworks
                        .filter(
                            (item) =>
                                String(item._id) !==
                                String(id)
                        )
                        .slice(0, 5)


                setRelatedArtworks(
                    similarArtworks
                )


                /* =====================================================
                   COMMENTS
                ===================================================== */

                setComments(
                    commentsResponse.data.comments || []
                )


                /* =====================================================
                   LIKES
                ===================================================== */

                const currentUserId =
                    user?.id || user?._id


                const artworkLikes =
                    selectedArtwork.likes || []


                const alreadyLiked =
                    artworkLikes.some(
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

                setLikeCount(
                    artworkLikes.length
                )


                /* =====================================================
                   FAVORITE
                ===================================================== */

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


                        setFavorite(
                            alreadyFavorite
                        )

                    } catch {

                        setFavorite(false)

                    }

                }

            } catch (err) {

                console.error(
                    'ARTWORK DETAILS FETCH FAILED:',
                    err
                )

                console.error(
                    'STATUS:',
                    err.response?.status
                )

                console.error(
                    'RESPONSE:',
                    err.response?.data
                )

                console.error(
                    'URL:',
                    err.config?.url
                )


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


    /* =========================================================
       DISPLAYED ARTWORK
       
       ORIGINAL:
       artwork
       
       REPLICA:
       selectedReplica
    ========================================================= */

    const displayedArtwork =
  activeArtworkView === 'Replica'
    ? {
        ...artwork,
        image: artwork?.replicaImage || artwork?.image || ''
      }
    : artwork

const displayedImage = displayedArtwork?.image || ''

    const displayedPrice =
        Number(displayedArtwork?.price) || 0


    /* =========================================================
       ORIGINAL ARTWORK ID
    ========================================================= */

    const originalArtworkId =
        artwork?.artworkType === 'Original'
            ? artwork?._id
            : artwork?.originalArtwork?._id ||
              artwork?.originalArtwork ||
              null


    /* =========================================================
       ROOM CONTROLS
    ========================================================= */

    const showPreviousRoom = () => {

        setSelectedRoomIndex(
            (currentIndex) =>
                currentIndex === 0
                    ? ROOM_PREVIEWS.length - 1
                    : currentIndex - 1
        )

    }


    const showNextRoom = () => {

        setSelectedRoomIndex(
            (currentIndex) =>
                currentIndex ===
                ROOM_PREVIEWS.length - 1
                    ? 0
                    : currentIndex + 1
        )

    }


    const activeRoom =
        ROOM_PREVIEWS[selectedRoomIndex]


    /* =========================================================
       SELECTED SIZE
    ========================================================= */

    const activeSize =
        ARTWORK_SIZES.find(
            (size) =>
                size.name === selectedSize
        ) || ARTWORK_SIZES[2]


    const activeVisualizeSize =
        ARTWORK_SIZES.find(
            (size) =>
                size.name === visualizeSize
        ) || ARTWORK_SIZES[0]


    /* =========================================================
       PRICE
       
       ORIGINAL:
       artwork price × size multiplier
       
       REPLICA:
       actual selected Replica document price
    ========================================================= */

    const basePrice =
        Number(artwork?.price) || 0


    const selectedReplicaPrice =
        activeArtworkView === 'Replica' &&
        selectedReplica
            ? Number(selectedReplica.price) || 0
            : Math.round(
                basePrice *
                activeSize.multiplier
            )


    const selectedPrice =
        selectedReplicaPrice


    const formattedSelectedPrice =
        selectedPrice > 0
            ? `₹${selectedPrice.toLocaleString('en-IN')}`
            : 'Price on request'


    const availability =
        displayedArtwork?.availability ||
        'Available'


    /* =========================================================
       POST COMMENT
    ========================================================= */

    const handlePostComment = async () => {

        if (!token) {

            toast.info(
                'Please login to write a comment.'
            )

            navigate('/login')

            return

        }


        if (!newComment.trim()) {

            toast.error(
                'Please write a comment first.'
            )

            return

        }


        try {

            setPostingComment(true)


            const response =
                await api.post(
                    `/comments/${id}`,
                    {
                        text:
                            newComment.trim()
                    }
                )


            const createdComment =
                response.data.comment


            setComments(
                (currentComments) => [
                    ...currentComments,
                    createdComment
                ]
            )


            setNewComment('')


            toast.success(
                'Comment posted successfully!'
            )

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                'Unable to post comment.'
            )

        } finally {

            setPostingComment(false)

        }

    }


    /* =========================================================
       LIKE
    ========================================================= */

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


            const response =
                await api.patch(
                    `/artworks/${id}/like`
                )


            setLiked(
                response.data.liked
            )


            setLikeCount(
                response.data.likeCount
            )


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


    /* =========================================================
       FAVORITE
    ========================================================= */

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


            const response =
                await api.patch(
                    `/favorites/${id}`
                )


            setFavorite(
                response.data.favorite
            )


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


    /* =========================================================
       BUY NOW
    ========================================================= */

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


        if (
            !displayedArtwork?.price ||
            Number(displayedArtwork.price) <= 0
        ) {

            toast.error(
                'Price is not available for this artwork.'
            )

            return

        }


        if (
            displayedArtwork.availability ===
            'Sold'
        ) {

            toast.error(
                'This artwork has already been sold.'
            )

            return

        }


        const chosenSize =
            ARTWORK_SIZES.find(
                (size) =>
                    size.name === selectedSize
            ) || ARTWORK_SIZES[2]


        /*
         * For replicas, use the actual Replica
         * document price.
         */

        const finalPrice =
            activeArtworkView === 'Replica' &&
            selectedReplica
                ? Number(selectedReplica.price) || 0
                : Math.round(
                    Number(displayedArtwork.price) *
                    chosenSize.multiplier
                )


        if (finalPrice <= 0) {

            toast.error(
                'Price is not available for this artwork.'
            )

            return

        }


        const room =
            ROOM_PREVIEWS[selectedRoomIndex]


        navigate(
            `/payment/${displayedArtwork._id}`,
            {
                state: {

                    selectedSize:
                        chosenSize.name,

                    selectedDimensions:
                        chosenSize.dimensions,

                    selectedPrice:
                        finalPrice,

                    selectedRoom:
                        room.name,

                    artworkType:
                        activeArtworkView,

                    replicaId:
                        activeArtworkView ===
                        'Replica'
                            ? selectedReplica?._id
                            : null

                }
            }
        )

    }


    /* =========================================================
       ENQUIRY
    ========================================================= */

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


        navigate(
            `/enquiry/${displayedArtwork._id}`
        )

    }


    /* =========================================================
       ARTIST NAVIGATION
    ========================================================= */

    const handleArtistNavigation = () => {

    const artistId =
        typeof artwork?.uploadedBy === 'object'
            ? artwork.uploadedBy?._id
            : artwork?.uploadedBy

    if (artistId) {

        navigate(
            `/artists/${artistId}`,
            {
                state: {
                    from: `/artwork/${artwork?._id}`
                }
            }
        )

    }

}


    /* =========================================================
       SIZE CHANGE
       
       IMPORTANT:
       Selecting a size now finds the matching
       actual Replica document.
    ========================================================= */

    const handleSizeChange = (sizeName) => {

    setSelectedSize(sizeName)

    if (activeArtworkView !== 'Replica') {
        return
    }

    const selectedSizeData = ARTWORK_SIZES.find(
        (size) => size.name === sizeName
    )

    if (!selectedSizeData) {
        return
    }

    const sizeKey = selectedSizeData.key

    /*
     * Replica uses ONE shared image.
     * The selected size only changes the
     * visual size and the price.
     */

    setSelectedReplica({
        size: sizeKey,
        name: sizeName,
        dimensions: selectedSizeData.dimensions,
        price:
            artwork?.replicaPrices?.[sizeKey]?.price || 0,
        image: artwork?.replicaImage || ''
    })

    /*
     * Always use the single uploaded
     * replica image.
     */

    setSelectedImage(
        artwork?.replicaImage || ''
    )

}

    /* =========================================================
       ARTWORK VIEW CHANGE
       
       ORIGINAL / REPLICA
    ========================================================= */

   
const handleArtworkViewChange = (view) => {
    setActiveArtworkView(view)

    if (view === 'Original') {
        setSelectedImage(artwork?.image || '')
        return
    }

    if (view === 'Replica') {
        setSelectedImage(artwork?.replicaImage || '')
        setSelectedSize('Medium')
    }
}

    /* =========================================================
       SHARE
    ========================================================= */

   const handleShare = () => {
    setShowShareOptions((current) => !current)
}


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <div className="artevora-details-loading">

                Loading artwork...

            </div>

        )

    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error || !artwork) {

        return (

            <div className="artevora-details-error">

                {error ||
                    'Artwork not found.'}

            </div>

        )

    }


    return (

        <div className="artevora-new-details-page">


            {/* =====================================================
                PRODUCT SECTION
            ===================================================== */}

            <section className="artevora-product-section">


                {/* =================================================
                    LEFT — ARTWORK GALLERY
                ================================================= */}

                <div className="artevora-artwork-gallery">


                    {/* VERTICAL THUMBNAILS */}

                    <div className="artevora-gallery-thumbnails">

                        <button
                            type="button"
                            className="artevora-gallery-arrow"
                            aria-label="Previous image"
                        >
                            ↑
                        </button>


                        <button
                            type="button"
                            className="artevora-gallery-thumbnail active"
                            onClick={() => {

                                setSelectedGalleryImage(0)

                                setSelectedImage(
                                    displayedImage
                                )

                            }}
                        >

                            <img
                                src={
                                    displayedImage ||
                                    artwork.image
                                }
                                alt={
                                    artwork.title
                                }
                            />

                        </button>


                        <button
                            type="button"
                            className="artevora-gallery-arrow"
                            aria-label="Next image"
                        >
                            ↓
                        </button>

                    </div>


                    {/* MAIN IMAGE */}

                    <div className="artevora-product-visual">

                        <div className="artevora-zoom-container">

                            <img
                                className="artevora-zoom-image"

                                src={
                                    selectedImage ||
                                    displayedImage
                                }

                                alt={
                                    displayedArtwork.title
                                }

                                style={{
    transform:
        activeArtworkView === 'Replica'
            ? `scale(${
                ARTWORK_SIZES.find(
                    (size) =>
                        size.name === selectedSize
                )?.previewScale || 0.72
            })`
            : 'scale(1)'
}}


                                onMouseEnter={(
                                    event
                                ) => {

                                    const image =
                                        event.currentTarget

                                    const container =
                                        image.parentElement

                                    container.classList.add(
                                        'is-zooming'
                                    )

                                }}


                                onMouseMove={(
                                    event
                                ) => {

                                    const image =
                                        event.currentTarget

                                    const container =
                                        image.parentElement

                                    const containerRect =
                                        container.getBoundingClientRect()

                                    const imageWidth =
                                        image.offsetWidth

                                    const imageHeight =
                                        image.offsetHeight

                                    const imageLeft =
                                        (
                                            containerRect.width -
                                            imageWidth
                                        ) / 2

                                    const imageTop =
                                        (
                                            containerRect.height -
                                            imageHeight
                                        ) / 2

                                    const mouseX =
                                        event.clientX -
                                        containerRect.left

                                    const mouseY =
                                        event.clientY -
                                        containerRect.top

                                    const insideImage =
                                        mouseX >= imageLeft &&
                                        mouseX <=
                                            imageLeft +
                                            imageWidth &&
                                        mouseY >= imageTop &&
                                        mouseY <=
                                            imageTop +
                                            imageHeight


                                    if (!insideImage) {

                                        return

                                    }


                                    const zoomScale =
                                        2.8


                                    const imageX =
                                        mouseX -
                                        imageLeft

                                    const imageY =
                                        mouseY -
                                        imageTop


                                    const scaledX =
                                        imageX *
                                        zoomScale

                                    const scaledY =
                                        imageY *
                                        zoomScale


                                    let translateX =
                                        mouseX -
                                        imageLeft -
                                        scaledX

                                    let translateY =
                                        mouseY -
                                        imageTop -
                                        scaledY


                                    const scaledWidth =
                                        imageWidth *
                                        zoomScale

                                    const scaledHeight =
                                        imageHeight *
                                        zoomScale


                                    const minTranslateX =
                                        containerRect.width -
                                        imageLeft -
                                        scaledWidth

                                    const maxTranslateX =
                                        -imageLeft

                                    const minTranslateY =
                                        containerRect.height -
                                        imageTop -
                                        scaledHeight

                                    const maxTranslateY =
                                        -imageTop


                                    translateX =
                                        Math.max(
                                            minTranslateX,
                                            Math.min(
                                                maxTranslateX,
                                                translateX
                                            )
                                        )


                                    translateY =
                                        Math.max(
                                            minTranslateY,
                                            Math.min(
                                                maxTranslateY,
                                                translateY
                                            )
                                        )


                                    const centerOffsetX =
                                        (
                                            imageWidth -
                                            scaledWidth
                                        ) / 2

                                    const centerOffsetY =
                                        (
                                            imageHeight -
                                            scaledHeight
                                        ) / 2


                                    const finalTranslateX =
                                        translateX -
                                        centerOffsetX

                                    const finalTranslateY =
                                        translateY -
                                        centerOffsetY


                                    image.style.transform = `
                                        translate(
                                            ${finalTranslateX}px,
                                            ${finalTranslateY}px
                                        )
                                        scale(${zoomScale})
                                    `

                                }}


                                onMouseLeave={(
                                    event
                                ) => {

                                    const image =
                                        event.currentTarget

                                    const container =
                                        image.parentElement


                                    const currentSize =
    ARTWORK_SIZES.find(
        (size) =>
            size.name === selectedSize
    )

image.style.transform =
    activeArtworkView === 'Replica'
        ? `scale(${currentSize?.previewScale || 0.72})`
        : 'scale(1)'

                                    container.classList.remove(
                                        'is-zooming'
                                    )

                                }}

                            />


                            

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT — ARTWORK INFORMATION
                ================================================= */}

                <div className="artevora-product-info">


                    {/* ORIGINAL / REPLICA */}

                    <div className="artevora-artwork-tabs">

                        <button
                            type="button"
                            className={
                                activeArtworkView ===
                                'Original'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                handleArtworkViewChange(
                                    'Original'
                                )
                            }
                        >
                            Original
                        </button>


                        {replicas.length > 0 && (

                            <button
                                type="button"
                                className={
                                    activeArtworkView ===
                                    'Replica'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() =>
                                    handleArtworkViewChange(
                                        'Replica'
                                    )
                                }
                            >
                                Replica
                            </button>

                        )}

                    </div>


                    {/* TITLE */}

                    <h1 className="artevora-product-title">

                        {displayedArtwork.title}

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

                            By {
                                artwork.artistName
                            }

                        </button>


                        <button
                            type="button"
                            className="artevora-artist-link"
                            onClick={
                                handleArtistNavigation
                            }
                        >

                            Know more about artist

                            <span>
                                →
                            </span>

                        </button>

                    </div>


                    {/* TYPE + ACTIONS */}

                    <div className="artevora-artwork-view-row">

                        <span className="artevora-artwork-badge">

                            {
                                activeArtworkView.toUpperCase()
                            }

                        </span>


                        <div className="artevora-artwork-actions">


                            {/* LIKE */}

                            <div className="artevora-artwork-action">

                                <button
                                    type="button"
                                    className={
                                        liked
                                            ? 'artevora-action-button active'
                                            : 'artevora-action-button'
                                    }
                                    onClick={
                                        handleLike
                                    }
                                    disabled={
                                        liking
                                    }
                                    aria-label={
                                        liked
                                            ? 'Unlike artwork'
                                            : 'Like artwork'
                                    }
                                >

                                    {
                                        liked
                                            ? <FaHeart />
                                            : <FaRegHeart />
                                    }

                                </button>


                                <span>
                                    {likeCount}
                                </span>

                            </div>


                            {/* SHARE */}

                            <div className="artevora-share-wrapper">

    {activeArtworkView ===
        'Replica' && (

        <button
            type="button"
            className="artevora-action-button"
            onClick={() =>
                setShowShareOptions(
                    (current) => !current
                )
            }
            aria-label="Share artwork"
        >
            <FaShareAlt />
        </button>

    )}

    {showShareOptions && (
        <div className="artevora-share-menu">

            <div className="artevora-share-menu-title">
                Share Artwork
            </div>

            <a
                href={`https://wa.me/?text=${encodeURIComponent(
                    `Check out ${
                        artwork?.title ||
                        'this artwork'
                    } on ArteVora Gallery: ${window.location.href}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="artevora-share-option"
            >
                WhatsApp
            </a>

            <a
                href={`mailto:?subject=${encodeURIComponent(
                    artwork?.title || 'Artwork'
                )}&body=${encodeURIComponent(
                    `Check out ${
                        artwork?.title ||
                        'this artwork'
                    } on ArteVora Gallery: ${window.location.href}`
                )}`}
                className="artevora-share-option"
            >
                Email
            </a>

            <button
                type="button"
                className="artevora-share-option"
                onClick={async () => {
                    await navigator.clipboard.writeText(
                        window.location.href
                    )

                    toast.success(
                        'Artwork link copied!'
                    )

                    setShowShareOptions(false)
                }}
            >
                Copy Link
            </button>

            <button
                type="button"
                className="artevora-share-option"
                onClick={async () => {
                    if (navigator.share) {
                        await navigator.share({
                            title:
                                artwork?.title ||
                                'Artwork',
                            text:
                                `Check out ${
                                    artwork?.title ||
                                    'this artwork'
                                } on ArteVora Gallery.`,
                            url:
                                window.location.href
                        })

                        setShowShareOptions(false)
                    } else {
                        toast.info(
                            'More sharing options are not available on this device.'
                        )
                    }
                }}
            >
                Other
            </button>

        </div>
    )}

</div>

                            {/* WISHLIST */}

                            {activeArtworkView ===
                                'Replica' && (

                                <button
                                    type="button"
                                    className={
                                        favorite
                                            ? 'artevora-action-button active'
                                            : 'artevora-action-button'
                                    }
                                    onClick={
                                        handleFavorite
                                    }
                                    disabled={
                                        savingFavorite
                                    }
                                    aria-label={
                                        favorite
                                            ? 'Remove from wishlist'
                                            : 'Add to wishlist'
                                    }
                                >

                                    {
                                        favorite
                                            ? <FaStar />
                                            : <FaRegStar />
                                    }

                                </button>

                            )}

                        </div>

                    </div>


                    {/* SHORT ARTWORK DESCRIPTION */}

<div className="artevora-product-description">

    <p>
        {
            displayedArtwork.description ||
            displayedArtwork.story ||
            'Explore this artwork from the ArteVora Gallery collection.'
        }
    </p>

</div>


                    {/* =================================================
                        REPLICA PURCHASE
                    ================================================= */}

                    {activeArtworkView ===
                        'Replica' && (

                        <>

                         <div className="artevora-size-section">

    <h3>
        SIZE
    </h3>

    <div className="artevora-size-cards">

        {ARTWORK_SIZES.map((size) => {

            const replicaData =
                artwork?.replicaPrices?.[size.key]

            if (
                !replicaData ||
                !replicaData.available ||
                Number(replicaData.price) <= 0
            ) {
                return null
            }

            return (

                <button
                    type="button"
                    key={size.key}
                    className={
                        selectedSize === size.name
                            ? 'active'
                            : ''
                    }
                    onClick={() =>
                        handleSizeChange(size.name)
                    }
                >

                    <strong>
                        {size.dimensions}
                    </strong>

                    <span>
                        ₹
                        {Number(
                            replicaData.price
                        ).toLocaleString('en-IN')}
                    </span>

                </button>

            )

        })}

    </div>

</div>   


                            {/* PRICE */}

                            <div className="artevora-price-section">

                                <div>

                                    <h2>
                                        {
                                            formattedSelectedPrice
                                        }
                                    </h2>

                                </div>

                            </div>


                            {/* PURCHASE ACTIONS */}

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
                                    disabled={
                                        displayedArtwork.availability ===
                                        'Sold' ||
                                        !selectedReplica
                                    }
                                >

                                    <FaShoppingBag />

                                    <span>

                                        {
                                            displayedArtwork.availability ===
                                            'Sold'
                                                ? 'SOLD'
                                                : 'BUY NOW'
                                        }

                                    </span>

                                </button>

                            </div>

                        </>

                    )}


                    {/* =================================================
                        ORIGINAL NOTICE
                    ================================================= */}
                    {activeArtworkView === 'Original' && (

    <div className="artevora-price-section">

        <div>

            <h2>
                {
                    basePrice > 0
                        ? `₹${basePrice.toLocaleString('en-IN')}`
                        : 'Price on request'
                }
            </h2>

        </div>

    </div>

)}

                    {activeArtworkView ===
                        'Original' && (

                        <div className="artevora-original-notice">

                            <span>
                                ORIGINAL ARTWORK
                            </span>

                            <p>
                                This is the artist's original
                                artwork. Original works are
                                presented for viewing and
                                appreciation.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* =========================================================
                ABOUT ARTWORK
            ========================================================= */}

            <section className="artevora-about-artwork">

                <div className="artevora-about-description">

                    <div className="artevora-section-heading">

                        <h2>
                            ABOUT THE ARTWORK
                        </h2>

                        <span />

                    </div>


                    <div className="artevora-about-text">

                        <p>

                            {
                                displayedArtwork.story ||
                                artwork.story ||
                                'No story has been provided for this artwork yet.'
                            }

                        </p>

                    </div>


                    <div className="artevora-artist-signature">

                        <div className="artevora-signature-line">

                            <span>
                                {
                                    artwork.artistName ||
                                    'Artist'
                                }
                            </span>

                        </div>


                        <p>
                            {
                                artwork.artistName ||
                                'Artist'
                            }
                        </p>

                    </div>

                </div>


                <div className="artevora-artwork-specifications">

                    <div className="artevora-spec-row">

                        <span>
                            Year Created
                        </span>

                        <strong>
                            {
                                artwork.year ||
                                'Not specified'
                            }
                        </strong>

                    </div>


                    <div className="artevora-spec-row">

                        <span>
                            Medium
                        </span>

                        <strong>
                            {
                                artwork.medium ||
                                'Not specified'
                            }
                        </strong>

                    </div>


                    <div className="artevora-spec-row">

    <span>
        Dimensions
    </span>

    <strong>
        {
            artwork.dimensions ||
            'Not specified'
        }
    </strong>

</div>


                    <div className="artevora-spec-row">

                        <span>
                            Orientation
                        </span>

                        <strong>
                            {
                                artwork.orientation ||
                                'Portrait'
                            }
                        </strong>

                    </div>


                    <div className="artevora-spec-row">

                        <span>
                            Framed
                        </span>

                        <strong>
                            {
                                artwork.framed ||
                                'Yes'
                            }
                        </strong>

                    </div>


                    <div className="artevora-spec-row">

                        <span>
                            Ships From
                        </span>

                        <strong>
                            {
                                artwork.shipsFrom ||
                                'India'
                            }
                        </strong>

                    </div>


                    <div className="artevora-spec-row">

                        <span>
                            Availability
                        </span>

                        <strong>
                            {availability}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =========================================================
                VISUALIZE IN YOUR SPACE
            ========================================================= */}

            {(artwork.framed === 'Yes' || artwork.replicaAvailable === true) && (

                <section className="artevora-visualize-section">


                    <div className="artevora-visualize-header">

                        <h2>
                            VISUALIZE IN YOUR SPACE
                        </h2>

                        <p>
                            See how this artwork looks in different
                            spaces and find the perfect fit for your interior.
                        </p>

                    </div>


                    <div className="artevora-visualize-layout">


                        {/* LEFT CONTROLS */}

                        <aside className="artevora-visualize-controls">


                            {/* SIZE */}

                            <div className="artevora-visualize-control-group">

                                <label htmlFor="artwork-size">

                                    SELECT SIZE

                                </label>


                                <div className="artevora-size-dropdown-wrapper">

                                    <select
                                        id="artwork-size"
                                        value={
                                            visualizeSize
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setVisualizeSize(
                                                event.target.value
                                            )
                                        }
                                        className="artevora-size-dropdown"
                                    >

                                        {ARTWORK_SIZES.map(
                                            (size) => {

                                                const replica =
                                                    replicas.find(
                                                        (
                                                            item
                                                        ) => {

                                                            const itemSize =
                                                                String(
                                                                    item.size ||
                                                                    item.artworkSize ||
                                                                    item.sizeKey ||
                                                                    ''
                                                                ).toLowerCase()


                                                            return (
                                                                itemSize ===
                                                                    size.key ||
                                                                itemSize ===
                                                                    size.name.toLowerCase()
                                                            )

                                                        }
                                                    )


                                                const price =
                                                    activeArtworkView ===
                                                        'Replica' &&
                                                    replica
                                                        ? Number(
                                                            replica.price
                                                        )
                                                        : Math.round(
                                                            basePrice *
                                                            size.multiplier
                                                        )


                                                return (

                                                    <option
                                                        key={
                                                            size.name
                                                        }
                                                        value={
                                                            size.name
                                                        }
                                                    >

                                                        {
                                                            size.dimensions
                                                        }

                                                        {' — ₹'}

                                                        {
                                                            price > 0
                                                                ? price.toLocaleString(
                                                                    'en-IN'
                                                                )
                                                                : 'Price on request'
                                                        }

                                                    </option>

                                                )

                                            }
                                        )}

                                    </select>


                                    <div className="artevora-selected-size-display">

                                        <div className="artevora-selected-size-info">

                                            <strong>

                                                {
                                                    ARTWORK_SIZES.find(
                                                        (
                                                            size
                                                        ) =>
                                                            size.name ===
                                                            visualizeSize
                                                    )?.dimensions
                                                }

                                            </strong>


                                            <span>

                                                {
                                                    (() => {

                                                        const selectedVisualSize =
                                                            ARTWORK_SIZES.find(
                                                                (
                                                                    size
                                                                ) =>
                                                                    size.name ===
                                                                    visualizeSize
                                                            )


                                                        if (
                                                            activeArtworkView ===
                                                            'Replica'
                                                        ) {

                                                            const replica =
                                                                replicas.find(
                                                                    (
                                                                        item
                                                                    ) => {

                                                                        const itemSize =
                                                                            String(
                                                                                item.size ||
                                                                                item.artworkSize ||
                                                                                item.sizeKey ||
                                                                                ''
                                                                            ).toLowerCase()


                                                                        return (
                                                                            itemSize ===
                                                                                selectedVisualSize?.key ||
                                                                            itemSize ===
                                                                                selectedVisualSize?.name.toLowerCase()
                                                                        )

                                                                    }
                                                                )


                                                            return replica &&
                                                                Number(
                                                                    replica.price
                                                                ) > 0
                                                                ? `₹${Number(
                                                                    replica.price
                                                                ).toLocaleString(
                                                                    'en-IN'
                                                                )}`
                                                                : 'Price on request'

                                                        }


                                                        return basePrice >
                                                            0
                                                            ? `₹${Math.round(
                                                                basePrice *
                                                                (
                                                                    selectedVisualSize?.multiplier ||
                                                                    1
                                                                )
                                                            ).toLocaleString(
                                                                'en-IN'
                                                            )}`
                                                            : 'Price on request'

                                                    })()
                                                }

                                            </span>

                                        </div>


                                        <span className="artevora-size-arrow">
                                            ▾
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* ROOM */}

                            <div className="artevora-visualize-control-group">

                                <label>
                                    SELECT ROOM
                                </label>


                                <div className="artevora-room-options">

                                    {ROOM_PREVIEWS.map(
                                        (
                                            room,
                                            index
                                        ) => (

                                            <button
                                                type="button"
                                                key={
                                                    room.name
                                                }
                                                className={
                                                    selectedRoomIndex ===
                                                    index
                                                        ? 'active'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    setSelectedRoomIndex(
                                                        index
                                                    )
                                                }
                                            >

                                                <span className="artevora-room-icon">

                                                    {
                                                        index ===
                                                        0 &&
                                                        '🛋️'
                                                    }

                                                    {
                                                        index ===
                                                        1 &&
                                                        '🛏️'
                                                    }

                                                    {
                                                        index ===
                                                        2 &&
                                                        '🖥️'
                                                    }

                                                    {
                                                        index ===
                                                        3 &&
                                                        '▦'
                                                    }

                                                    {
                                                        index ===
                                                        4 &&
                                                        '🍽️'
                                                    }

                                                </span>


                                                <span>
                                                    {
                                                        room.name
                                                    }
                                                </span>

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        </aside>


                        {/* MAIN ROOM */}

                        <div className="artevora-main-room-preview">

                            <div className="artevora-room-image-wrapper">

                                <img
                                    src={
                                        activeRoom.image
                                    }
                                    alt={
                                        activeRoom.name
                                    }
                                    className="artevora-room-background"
                                />


                               {activeArtworkView === 'Replica' && artwork?.replicaImage && (

                                    <div
                                        className="artevora-wall-art"
                                        style={{
                                            top:
                                                activeRoom.artworkTop,

                                            left:
                                                activeRoom.artworkLeft,

                                            width:
                                                `calc(${activeRoom.wallWidth} * ${activeVisualizeSize.previewScale})`,

                                            maxHeight:
                                                activeRoom.wallHeight
                                        }}
                                    >

                                        <div
                                            className="artevora-wall-frame"
                                            style={{
                                                aspectRatio:
                                                    `${activeVisualizeSize.widthRatio} / ${activeVisualizeSize.heightRatio}`
                                            }}
                                        >

                                            <div className="artevora-wall-mat">

                                                <img
                                                    src={
                                                        selectedImage ||
                                                        displayedImage
                                                    }
                                                    alt={
                                                        artwork.title
                                                    }
                                                    className="artevora-wall-art-image"
                                                />

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* RIGHT ROOM THUMBNAILS */}

                        <div className="artevora-room-thumbnails">

                            {ROOM_PREVIEWS.map(
                                (
                                    room,
                                    index
                                ) => (

                                    <button
                                        type="button"
                                        key={
                                            room.name
                                        }
                                        className={
                                            selectedRoomIndex ===
                                            index
                                                ? 'active'
                                                : ''
                                        }
                                        onClick={() =>
                                            setSelectedRoomIndex(
                                                index
                                            )
                                        }
                                    >

                                        <img
                                            src={
                                                room.image
                                            }
                                            alt={
                                                room.name
                                            }
                                        />

                                        <span>
                                            {
                                                room.name
                                            }
                                        </span>

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </section>

            )}


            {/* =========================================================
                COMMENTS
            ========================================================= */}

            <section className="artevora-comments-section">

                <div className="artevora-comments-header">

                    <div>

                        <h2>
                            COMMENTS & REVIEWS
                        </h2>

                        <span className="artevora-comments-line" />

                    </div>


                    <div className="artevora-comments-actions">

                        <span className="artevora-comments-count">

                            {comments.length}{' '}

                            {
                                comments.length ===
                                1
                                    ? 'Comment'
                                    : 'Comments'
                            }

                        </span>

                    </div>

                </div>


                {/* COMMENT FORM */}

                <div
                    id="artevora-comment-form"
                    className="artevora-comment-form"
                >

                    <div className="artevora-comment-input-row">

                        <div className="artevora-comment-input-avatar">
                            U
                        </div>


                        <textarea
                            value={
                                newComment
                            }
                            onChange={(
                                event
                            ) =>
                                setNewComment(
                                    event.target.value
                                )
                            }
                            placeholder="Write a comment..."
                            rows="1"
                            maxLength="500"
                        />


                        <button
                            type="button"
                            onClick={
                                handlePostComment
                            }
                            disabled={
                                postingComment ||
                                !newComment.trim()
                            }
                        >

                            {
                                postingComment
                                    ? 'Posting...'
                                    : 'Post'
                            }

                        </button>

                    </div>


                    {newComment.length >
                        0 && (

                        <div className="artevora-comment-character-count">

                            {
                                newComment.length
                            }/500

                        </div>

                    )}

                </div>


                {/* COMMENTS */}

                {comments.length ===
                    0 ? (

                    <div className="artevora-no-comments">

                        <h3>
                            No comments yet
                        </h3>

                        <p>
                            Be the first to share your
                            thoughts about this artwork.
                        </p>

                    </div>

                ) : (

                    <div className="artevora-comments-list">

                        {comments.map(
                            (
                                comment,
                                index
                            ) => (

                                <div
                                    className="artevora-comment-card"
                                    key={
                                        comment._id ||
                                        index
                                    }
                                >

                                    <div className="artevora-comment-user">

                                        <div className="artevora-comment-avatar">
                                            U
                                        </div>


                                        <div>

                                            <strong>
                                                {
                                                    comment.user?.name ||
                                                    'User'
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <p className="artevora-comment-text">

                                        {
                                            comment.comment ||
                                            comment.text ||
                                            comment.content ||
                                            'No comment text available.'
                                        }

                                    </p>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            {/* =========================================================
                RELATED ARTWORKS
            ========================================================= */}

            <section className="artevora-related-section">

                <div className="artevora-related-header">

                    <div>

                        <h2>
                            MORE ARTWORKS YOU MAY LIKE
                        </h2>

                        <span className="artevora-related-line" />

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                '/gallery'
                            )
                        }
                    >

                        View All Artworks →

                    </button>

                </div>


                {relatedArtworks.length >
                    0 ? (

                    <div className="artevora-related-grid">

                        {relatedArtworks.map(
                            (
                                relatedArtwork
                            ) => (

                                <article
                                    className="artevora-related-card"
                                    key={
                                        relatedArtwork._id
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/artwork/${relatedArtwork._id}`
                                        )
                                    }
                                >

                                    <div className="artevora-related-image">

                                        <img
                                            src={
                                                relatedArtwork.image
                                            }
                                            alt={
                                                relatedArtwork.title ||
                                                'Artwork'
                                            }
                                        />

                                    </div>


                                    <div className="artevora-related-info">

                                        <h3>

                                            {
                                                relatedArtwork.title ||
                                                'Untitled Artwork'
                                            }

                                        </h3>


                                        <p>

                                            {
                                                relatedArtwork.artistName ||
                                                'Artist'
                                            }

                                        </p>


                                        <span>

                                            {
                                                Number(
                                                    relatedArtwork.price
                                                ) > 0
                                                    ? `₹${Number(
                                                        relatedArtwork.price
                                                    ).toLocaleString(
                                                        'en-IN'
                                                    )}`
                                                    : 'Price on request'
                                            }

                                        </span>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                ) : (

                    <div className="artevora-related-empty">

                        <p>
                            Explore more artworks from
                            our collection.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/gallery'
                                )
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