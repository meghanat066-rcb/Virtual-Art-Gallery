import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { useNavigate, } from 'react-router-dom'
import { FaSearch, FaTimes, FaHeart, FaShoppingBag } from 'react-icons/fa'

import api from '../services/api'
import './Gallery.css'

const CATEGORIES = [
    'All',
    'Paintings',
    'Sculptures',
    'Ceramics',
    'Digital Art',
    'Photography'
]

const ARTWORKS_PER_LOAD = 9

const getGalleryLikeBase = (artworkId) => {
    const values = [
        12400,
        18700,
        20500,
        24300,
        31800,
        47200,
        65900,
        78300,
        91600,
        125000
    ]

    const numericId =
        String(artworkId || '')
            .split('')
            .reduce(
                (total, character) =>
                    total + character.charCodeAt(0),
                0
            )

    return values[numericId % values.length]
}

function Gallery() {
    const navigate = useNavigate()

    const handleArtworkOpen = (artworkId) => {
    const token = localStorage.getItem('token')

    if (token) {
        navigate(`/artwork/${artworkId}`)
        return
    }

    navigate('/login', {
        state: {
            redirectTo: `/artwork/${artworkId}`
        }
    })
}

    const [artworks, setArtworks] = useState([])
    const [activeCategory, setActiveCategory] =
        useState('All')

    const [searchOpen, setSearchOpen] = useState(false)

    const [searchTerm, setSearchTerm] = useState('')


    const [visibleCount, setVisibleCount] =
        useState(ARTWORKS_PER_LOAD)

    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] =
        useState(false)

    const [error, setError] = useState('')

    const loadMoreRef = useRef(null)

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get('/artworks')

                setArtworks(
                    response.data.artworks || []
                )
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        'Unable to load artworks.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchArtworks()
    }, [])

    const filteredArtworks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return artworks.filter((artwork) => {
        const matchesCategory =
            activeCategory === 'All' ||
            artwork.category === activeCategory

        const matchesSearch =
            !search ||
            artwork.title
                ?.toLowerCase()
                .includes(search) ||
            artwork.artistName
                ?.toLowerCase()
                .includes(search) ||
            artwork.category
                ?.toLowerCase()
                .includes(search)

        return matchesCategory && matchesSearch
    })
}, [artworks, activeCategory, searchTerm])

    const visibleArtworks = useMemo(
        () =>
            filteredArtworks.slice(
                0,
                visibleCount
            ),
        [filteredArtworks, visibleCount]
    )

    const hasMoreArtworks =
        visibleCount < filteredArtworks.length

    const handleCategoryChange = (category) => {
        setActiveCategory(category)
        setVisibleCount(ARTWORKS_PER_LOAD)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        if (
            loading ||
            loadingMore ||
            !hasMoreArtworks
        ) {
            return
        }

        const target = loadMoreRef.current

        if (!target) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]

                if (!entry.isIntersecting) {
                    return
                }

                setLoadingMore(true)

                window.setTimeout(() => {
                    setVisibleCount(
                        (currentCount) =>
                            currentCount +
                            ARTWORKS_PER_LOAD
                    )

                    setLoadingMore(false)
                }, 350)
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px 220px 0px'
            }
        )

        observer.observe(target)

        return () => {
            observer.disconnect()
        }
    }, [
        loading,
        loadingMore,
        hasMoreArtworks
    ])

    if (loading) {
        return (
            <main className="museum-gallery-page">
                <div className="museum-gallery-state">
                    <div className="museum-gallery-loader" />

                    <p>Preparing the gallery...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="museum-gallery-page">
            <nav
                className="museum-category-navigation"
                aria-label="Artwork categories"
            >
               <div className="page-container museum-category-inner">

    <div className="museum-category-list">
        {CATEGORIES.map((category) => (
            <button
                type="button"
                key={category}
                className={
                    activeCategory === category
                        ? 'active'
                        : ''
                }
                onClick={() =>
                    handleCategoryChange(category)
                }
            >
                {category}
            </button>
        ))}
    </div>

    <div
        className={[
            'museum-search',
            searchOpen ? 'is-open' : ''
        ].join(' ')}
    >

        {searchOpen && (
            <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                    setSearchTerm(event.target.value)
                    setVisibleCount(
                        ARTWORKS_PER_LOAD
                    )
                }}
                placeholder="Search artworks"
                aria-label="Search artworks"
                autoFocus
            />
        )}

        <button
            type="button"
            className="museum-search-button"
            aria-label={
                searchOpen
                    ? 'Close search'
                    : 'Open search'
            }
            onClick={() => {
                setSearchOpen(
                    (current) => !current
                )

                if (searchOpen) {
                    setSearchTerm('')
                    setVisibleCount(
                        ARTWORKS_PER_LOAD
                    )
                }
            }}
        >
            {searchOpen ? (
                <FaTimes />
            ) : (
                <FaSearch />
            )}
        </button>

    </div>

</div>
            </nav>

            <section className="museum-gallery-collection">
                <div className="page-container">
                    {error && (
                        <div className="museum-gallery-state museum-gallery-error">
                            <h1>
                                Unable to Load Gallery
                            </h1>

                            <p>{error}</p>
                        </div>
                    )}

                    {!error &&
                        filteredArtworks.length ===
                            0 && (
                            <div className="museum-gallery-state">
                                <h1>
                                    Collection Coming Soon
                                </h1>

                                <p>
                                    No approved artworks are
                                    currently available in this
                                    category.
                                </p>
                            </div>
                        )}

                    {!error &&
                        visibleArtworks.length >
                            0 && (
                            <>
                                <div className="museum-artwork-masonry">
                                    {visibleArtworks.map(
                                        (
                                            artwork,
                                            index
                                        ) => (
                                            <GalleryArtwork
                                                key={
                                                    artwork._id
                                                }
                                                artwork={
                                                    artwork
                                                }
                                                index={
                                                    index
                                                }
                                                onOpen={() =>
                                                    handleArtworkOpen(artwork._id)
                                                }
                                            />
                                        )
                                    )}
                                </div>

                                {hasMoreArtworks && (
                                    <div
                                        ref={loadMoreRef}
                                        className="museum-load-more-trigger"
                                        aria-hidden="true"
                                    >
                                        {loadingMore && (
                                            <>
                                                <div className="museum-gallery-loader small" />

                                                <span>
                                                    Loading more
                                                    artworks...
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {!hasMoreArtworks &&
                                    filteredArtworks.length >
                                        ARTWORKS_PER_LOAD && (
                                        <p className="museum-gallery-end">
                                            You have reached the
                                            end of this collection.
                                        </p>
                                    )}
                            </>
                        )}
                </div>
            </section>
        </main>
    )
}

function GalleryArtwork({
    artwork,
    index,
    onOpen
}) {
    const cardRef = useRef(null)
    const [visible, setVisible] = useState(false)

    const [liked, setLiked] = useState(false)
const [likeCount, setLikeCount] = useState(
      100 + (artwork.likes?.length || 0)

)
const galleryLikeBase =
    getGalleryLikeBase(artwork._id)

const displayedLikeCount =
    galleryLikeBase + likeCount
const [liking, setLiking] = useState(false)

useEffect(() => {
    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const currentUserId =
        user?.id || user?._id

    const artworkLikes =
        artwork.likes || []

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
    setLikeCount(100 + artworkLikes.length)
}, [artwork])

    useEffect(() => {
        const card = cardRef.current

        if (!card) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setVisible(entry.isIntersecting)
                })
            },
            {
                threshold: 0.12,
                rootMargin:
                    '0px 0px -45px 0px'
            }
        )

        observer.observe(card)

        return () => {
            observer.disconnect()
        }
    }, [])

    const masonryStyle =
        index % 5 === 1
            ? 'museum-artwork-tall'
            : index % 5 === 3
              ? 'museum-artwork-wide'
              : 'museum-artwork-standard'

    const handleKeyDown = (event) => {
        if (
            event.key === 'Enter' ||
            event.key === ' '
        ) {
            event.preventDefault()
            onOpen()
        }
    }
const handleLike = async (event) => {
    event.stopPropagation()

    const token = localStorage.getItem('token')

    // Guest users can click, but their like
    // cannot be permanently saved without authentication.
    if (!token) {
        return
    }

    if (liking) {
        return
    }

    try {
        setLiking(true)

        const response = await api.patch(
            `/artworks/${artwork._id}/like`
        )

        setLiked(response.data.liked)
        setLikeCount(response.data.likeCount)

    } catch (err) {
        console.error(
            'Unable to update artwork like:',
            err
        )
    } finally {
        setLiking(false)
    }
}
    return (
        <article
    ref={cardRef}
    className={[
        'museum-artwork-card',
        masonryStyle,
        visible ? 'is-visible' : ''
    ].join(' ')}
>
           <div
    className="museum-artwork-image"
    onClick={onOpen}
    onKeyDown={handleKeyDown}
    role="button"
    tabIndex={0}
    aria-label={`View details for ${artwork.title}`}
>

    <img
        src={artwork.image}
        alt={artwork.title}
        loading="lazy"
    />

    {/* REPLICA BUY SYMBOL */}


    <div className="museum-image-overlay">

        <div className="museum-view-details">
            <span>View Details</span>
            <span className="museum-view-line"></span>
        </div>

    </div>

</div>

<div className="museum-artwork-info">

    <div className="museum-artwork-title-row">

        <h2>
            {artwork.title}
        </h2>

        <div className="museum-artwork-actions">

            <button
    type="button"
    className={[
        'museum-artwork-public-likes',
        liked ? 'liked' : ''
    ].join(' ')}
    aria-label={`${likeCount} likes`}
    onClick={handleLike}
    onKeyDown={(event) => {
        event.stopPropagation()
    }}
    disabled={liking}
>
    <FaHeart
    className={
        liked
            ? 'is-liked'
            : ''
    }
/>
<span>
    {displayedLikeCount >= 1000
        ? `${(displayedLikeCount / 1000).toFixed(1)}K`
        : displayedLikeCount}
</span>
</button>
            {artwork.artworkType === 'Replica' && (
                <div
                    className="museum-replica-buy-symbol"
                    aria-label="Replica available for purchase"
                >
                    <FaShoppingBag />
                </div>
            )}

        </div>

    </div>

    <p>
        {artwork.artistName || 'Unknown Artist'}
    </p>

</div>
                <div className="museum-view-details">
                    <span>View Details</span>

                    
                </div>
            
        </article>
    )
}

export default Gallery