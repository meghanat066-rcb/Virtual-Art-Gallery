import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaHeart,
    FaStar,
    FaComment,
    FaShoppingBag,
    FaUser,
    FaEnvelope
} from 'react-icons/fa'
import api from '../services/api'
import './UserProfile.css'

function UserProfile() {
    const navigate = useNavigate()

    const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
)

    const [favorites, setFavorites] = useState([])
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
useEffect(() => {
    const handleProfileUpdate = () => {
        const updatedUser = JSON.parse(
            localStorage.getItem('user') || 'null'
        )

        setUser(updatedUser)
    }

    window.addEventListener(
        'artevora-profile-updated',
        handleProfileUpdate
    )

    return () => {
        window.removeEventListener(
            'artevora-profile-updated',
            handleProfileUpdate
        )
    }
}, [])
    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (user.role !== 'user') {
            navigate('/gallery')
            return
        }

        const loadProfileData = async () => {
            try {
                setLoading(true)

                const favoritesResponse =
                    await api.get('/favorites')

                setFavorites(
                    favoritesResponse.data?.favorites || []
                )

                const commentsResponse =
                    await api.get('/comments/my-comments')

                setComments(
                    commentsResponse.data?.comments || []
            )
            } catch (error) {
                console.error(
                    'Unable to load profile data:',
                    error
                )
            } finally {
                setLoading(false)
            }
        }

        loadProfileData()
    }, [navigate, user])

    if (!user) {
        return null
    }

    const firstLetter = user.name
        ? user.name.charAt(0).toUpperCase()
        : 'U'

    return (
        <main className="artevora-user-profile">

            <div className="artevora-profile-layout">

                {/* =====================================================
                    LEFT ACCOUNT SIDEBAR
                ====================================================== */}

                <aside className="artevora-profile-sidebar">

                    

                    {/* SIDEBAR NAVIGATION */}
<nav className="artevora-profile-navigation">

    <span className="artevora-nav-label">
        MY ACCOUNT
    </span>

    {/* PROFILE */}
    <button
        type="button"
        className="artevora-profile-nav-item active"
        onClick={() =>
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    >
        <FaUser />
        <span>Profile</span>
    </button>


    {/* LIKED ARTWORKS */}
    <button
        type="button"
        className="artevora-profile-nav-item"
        onClick={() =>
            document
                .getElementById('artevora-liked-artworks')
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
        }
    >
        <FaHeart />
        <span>Liked Artworks</span>
    </button>


    {/* MY COMMENTS */}
    <button
        type="button"
        className="artevora-profile-nav-item"
        onClick={() =>
            document
                .getElementById('artevora-comments')
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
        }
    >
        <FaComment />
        <span>My Comments</span>
    </button>


    {/* PURCHASES */}
    <button
        type="button"
        className="artevora-profile-nav-item"
        onClick={() =>
            navigate('/my-purchases')
        }
    >
        <FaShoppingBag />
        <span>Purchases</span>
    </button>

{/* MY ENQUIRIES */}
<button
    type="button"
    className="artevora-profile-nav-item"
    onClick={() =>
        navigate('/my-enquiries')
    }
>
    <FaEnvelope />
    <span>My Enquiries</span>
</button>
    {/* FAVORITES PAGE */}
    <button
        type="button"
        className="artevora-profile-nav-item"
        onClick={() =>
            navigate('/favorites')
        }
    >
        <FaStar />
        <span>Favorites</span>
    </button>


    {/* EDIT PROFILE */}
    <button
        type="button"
        className="artevora-profile-nav-item"
        onClick={() =>
            navigate('/user-profile/edit')
        }
    >
        <FaUser />
        <span>Edit Profile</span>
    </button>

</nav>

                </aside>


                {/* =====================================================
                    RIGHT MAIN PROFILE AREA
                ====================================================== */}

                <div className="artevora-profile-main">


                    {/* =================================================
                        PROFILE INTRODUCTION
                    ================================================== */}

                    <section className="artevora-profile-hero">

                        <div className="artevora-profile-heading">

                            <span>
                                MY ARTEVORA PROFILE
                            </span>

                        </div>


                        <div className="artevora-profile-identity">

                            {/* PROFILE AVATAR */}

                            <div className="artevora-profile-avatar">
    {user.userProfileImage ? (
        <img
            src={user.userProfileImage}
            alt="Profile"
        />
    ) : (
        firstLetter
    )}
</div>

                            {/* PROFILE INFORMATION */}

                            <div className="artevora-profile-intro">

                                <span>
                                    ART ENTHUSIAST
                                </span>

                                <h1>
                                    {user.name || 'Art Lover'}
                                </h1>

                                <p>
                                    {user.email}
                                </p>

                                <small>
                                    Discover, save and collect
                                    artworks from the ArteVora
                                    gallery.
                                </small>

                            </div>


                            {/* EDIT PROFILE */}

                            <button
                                type="button"
                                className="artevora-edit-profile"
                                onClick={() =>
                                    navigate(
                                        '/user-profile/edit'
                                    )
                                }
                            >
                                Edit Profile
                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        PROFILE ACTIVITY
                        Plain indicators — NO BOXES
                    ================================================== */}

                    <section className="artevora-profile-stats">

                        {/* LIKED */}

                        <div className="artevora-profile-stat-item">

                            <FaHeart />

                            <strong>
                                {favorites.length}
                            </strong>

                            <span>
                                Liked Artworks
                            </span>

                        </div>


                        {/* COMMENTS */}

                        <div className="artevora-profile-stat-item">

                            <FaComment />

                            <strong>
                                {comments.length}
                            </strong>

                            <span>
                                Comments
                            </span>

                        </div>


                        {/* PURCHASES */}

                        <div className="artevora-profile-stat-item">

                            <FaShoppingBag />

                            <strong>
                                —
                            </strong>

                            <span>
                                Purchases
                            </span>

                        </div>

                    </section>


                    {/* =================================================
                        PROFILE CONTENT
                    ================================================== */}

                    <section className="artevora-profile-content">


                        {/* =================================================
                            LIKED ARTWORKS
                        ================================================== */}

                        <div
    id="artevora-liked-artworks"
    className="artevora-profile-section"
>

                            <div className="artevora-profile-section-heading">

                                <div>

                                    <span>
                                        YOUR COLLECTION
                                    </span>

                                    <h2>
                                        Liked Artworks
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/favorites')
                                    }
                                >
                                    View All
                                </button>

                            </div>


                            {/* LOADING */}

                            {loading ? (

                                <p className="artevora-profile-message">
                                    Loading your collection...
                                </p>

                            ) : favorites.length === 0 ? (

                                /* EMPTY STATE */

                                <div className="artevora-profile-empty">

                                    <FaHeart />

                                    <h3>
                                        No liked artworks yet
                                    </h3>

                                    <p>
                                        Save artworks you love
                                        and they will appear
                                        here.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate('/gallery')
                                        }
                                    >
                                        Explore Artworks
                                    </button>

                                </div>

                            ) : (

                                /* ARTWORK GRID */

                                <div className="artevora-profile-artworks">

                                    {favorites
                                        .slice(0, 4)
                                        .map((artwork) => (

                                            <article
                                                key={artwork._id}
                                                onClick={() =>
                                                    navigate(
                                                        `/artwork/${artwork._id}`
                                                    )
                                                }
                                            >

                                                <div className="artevora-profile-artwork-image">

                                                    <img
                                                        src={
                                                            artwork.image
                                                        }
                                                        alt={
                                                            artwork.title ||
                                                            'Artwork'
                                                        }
                                                    />

                                                    <FaHeart />

                                                </div>


                                                <h3>
                                                    {artwork.title ||
                                                        'Untitled Artwork'}
                                                </h3>


                                                <p>
                                                    {artwork.artistName ||
                                                        'Artist'}
                                                </p>

                                            </article>

                                        ))}

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            MY COMMENTS
                        ================================================== */}

                        <div
                            id="artevora-comments"
                            className="artevora-profile-section"
                        >

                            <div className="artevora-profile-section-heading">

                                <div>

                                    <span>
                                        YOUR ACTIVITY
                                    </span>

                                    <h2>
                                        My Comments
                                    </h2>

                                </div>

                            </div>


                            {comments.length === 0 ? (

                                /* EMPTY COMMENTS */

                                <div className="artevora-profile-empty">

                                    <FaComment />

                                    <h3>
                                        No comments yet
                                    </h3>

                                    <p>
                                        Your artwork comments
                                        will appear here.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate('/gallery')
                                        }
                                    >
                                        Explore Artworks
                                    </button>

                                </div>

                            ) : (

                                /* COMMENTS LIST */

                                <div className="artevora-profile-comments">

                                    {comments.map((comment) => (

                                        <article
                                            key={comment._id}
                                            onClick={() =>
                                                navigate(
                                                    `/artwork/${comment.artwork?._id}`
                                                )
                                            }
                                        >

                                            <FaComment />

                                            <div>

                                                <p>
                                                    "{comment.text}"
                                                </p>

                                                <span>
                                                    {
                                                        comment
                                                            .artwork
                                                            ?.title
                                                    }
                                                </span>

                                            </div>

                                        </article>

                                    ))}

                                </div>

                            )}

                        </div>


                        
                        

                    </section>

                </div>

            </div>

        </main>
    )
}

export default UserProfile