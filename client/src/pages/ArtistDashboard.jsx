import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import PageLayout from '../components/PageLayout'

import {
    FaHome,
    FaImages,
    FaUpload,
    FaUser,
    FaBell,
    FaEnvelope,
    FaShoppingBag,
    FaCog,
    FaSignOutAlt,
    FaCheck,
    FaClock,
    FaHeart,
    FaComment,
    FaEye,
    FaEdit
} from 'react-icons/fa'
import './ArtistDashboard.css'

function ArtistDashboard() {
    const navigate = useNavigate()

    const [artworks, setArtworks] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAllArtworks, setShowAllArtworks] = useState(false)
    const [artistProfile, setArtistProfile] = useState(null)
    const [comments, setComments] = useState([])
    const [enquiries, setEnquiries] = useState([])
    const [sales, setSales] = useState([])

    const [user] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
)

useEffect(() => {
    if (!user || user.role !== 'artist') {
        setLoading(false)
        return
    }

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const [
    artworksResponse,
    biographyResponse,
    commentsResponse,
    enquiriesResponse,
    salesResponse
] = await Promise.all([
    api.get('/artworks/my-artworks'),
    api.get('/artists/profile/biography'),
    api.get('/comments/my-artwork-comments'),
    api.get('/enquiries/my-enquiries'),
    api.get('/purchases/my-sales')
])

            console.log(
    "MY ARTWORKS FULL:",
    JSON.stringify(
        artworksResponse.data.artworks,
        null,
        2
    )
)
setArtworks(artworksResponse.data.artworks || [])

const commentsData =
    commentsResponse.data.comments || []

console.log(
    "MY ARTWORK COMMENTS:",
    commentsData
)

setComments(commentsData)

const enquiriesData =
    enquiriesResponse.data.enquiries || []

console.log(
    "MY ENQUIRIES:",
    enquiriesData
)

setEnquiries(enquiriesData)

const salesData =
    salesResponse.data.sales || []

console.log(
    "MY SALES:",
    salesData
)

setSales(salesData)

            if (artworksResponse.data?.success) {
                setArtworks(
                    artworksResponse.data.artworks || []
                )
            }

            if (biographyResponse.data?.success) {
                setArtistProfile(
                    biographyResponse.data.artist || null
                )
            }

        } catch (error) {
            console.error(
                'Error loading artist dashboard:',
                error
            )
        } finally {
            setLoading(false)
        }
    }

    fetchDashboardData()

}, [user])
    const statistics = useMemo(() => {
        return {
            total: artworks.length,

            approved: artworks.filter(
                artwork =>
                    artwork.status === 'approved'
            ).length,

            pending: artworks.filter(
                artwork =>
                    artwork.status === 'pending'
            ).length,

            rejected: artworks.filter(
                artwork =>
                    artwork.status === 'rejected'
            ).length
        }
    }, [artworks])
    
const hasBiography = Boolean(
    artistProfile?.biography?.trim() ||
    artistProfile?.artistStatement?.trim()
)

const hasSubmittedArtwork =
    artworks.length > 0

const hasPendingArtwork =
    artworks.some(
        artwork => artwork.status === 'pending'
    )

const hasApprovedArtwork =
    artworks.some(
        artwork => artwork.status === 'approved'
    )

const hasRejectedArtwork =
    artworks.some(
        artwork => artwork.status === 'rejected'
    )

    if (!user) {
        return null
    }

    if (user.role !== 'artist') {
        return null
    }
const totalLikes = artworks.reduce(
    (total, artwork) =>
        total + (artwork.likes?.length || 0),
    0
)
const totalComments = comments.length
const totalEnquiries = enquiries.length
const totalSales = sales.length

    return (
        <PageLayout>

            <div className="artist-studio-dashboard">

                {/* SIDEBAR */}

                <aside className="artist-sidebar">

                    <nav className="artist-sidebar-nav">

                        <button className="active">
                            <FaHome />
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                navigate('/my-artworks')
                            }
                        >
                            <FaImages />
                            My Artworks
                        </button>

                        <button
                            onClick={() =>
                                navigate('/upload-artwork')
                            }
                        >
                            <FaUpload />
                            Upload Artwork
                        </button>

                        <button
    onClick={() =>
        navigate('/artist/biography')
    }
>
    <FaUser />
    Biography
</button>

                       <button
    onClick={() =>
        navigate('/artist/notifications')
    }
>
    <FaBell />
    Notifications
</button>

                        <button
    onClick={() =>
        navigate('/artist/enquiries')
    }
>
    <FaEnvelope />
    Enquiries
</button>

                        <button
    onClick={() =>
        navigate('/artist/sales')
    }
>
    <FaShoppingBag />
    Sales
</button>

                        <button
    onClick={() =>
        navigate('/artist/profile-settings')
    }
>
    <FaCog />
    Profile Settings
</button>

                        <button
    onClick={() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
        window.location.reload()
    }}
>
    <FaSignOutAlt />
    Logout
</button>

                    </nav>

                </aside>


                {/* MAIN CONTENT */}

                <main className="artist-dashboard-main">

                    {/* HERO */}

                    <section className="artist-dashboard-hero">

                        <div className="artist-hero-content">

                            <span className="artist-eyebrow">
                                ARTIST STUDIO
                            </span>

                            <h1>
                                Welcome back,{' '}
                                {user.name || 'Artist'}
                            </h1>

                            <div className="artist-hero-line" />

                            <p>
                                Your creative space to manage
                                your profile, artworks and
                                audience.
                            </p>

                        </div>

                        <div className="artist-hero-image">
    <div className="artist-hero-placeholder">
        <span>ARTIST STUDIO</span>
    </div>
</div>
                    </section>


                    {/* JOURNEY */}

                    <section className="artist-journey-card">

    <span className="section-label">
        YOUR ARTIST JOURNEY
    </span>

    <div className="artist-journey">

        {/* PROFILE CREATED */}

        <JourneyStep
    completed={
        hasApprovedArtwork &&
        (totalLikes > 0 ||
         totalComments > 0 ||
         totalEnquiries > 0 ||
         totalSales > 0)
    }
    active={
        hasApprovedArtwork &&
        totalLikes === 0 &&
        totalComments === 0 &&
        totalEnquiries === 0 &&
        totalSales === 0
    }
    icon={
        hasApprovedArtwork
            ? <FaUser />
            : <FaClock />
    }
    title="Audience & Sales"
    subtitle={
        !hasApprovedArtwork
            ? "Pending"
            : totalSales > 0
                ? `${totalSales} Sale${totalSales > 1 ? 's' : ''}`
                : totalEnquiries > 0
                    ? `${totalEnquiries} Enquir${totalEnquiries > 1 ? 'ies' : 'y'}`
                    : totalLikes > 0 || totalComments > 0
                        ? "Audience Growing"
                        : "Building Audience"
    }
/>


        {/* BIOGRAPHY */}

        <JourneyStep
            completed={hasBiography}
            active={!hasBiography}
            icon={
                hasBiography
                    ? <FaCheck />
                    : <FaUser />
            }
            title="Biography Added"
            subtitle={
                hasBiography
                    ? "Completed"
                    : "Not Started"
            }
        />


        {/* ARTWORK SUBMITTED */}

        <JourneyStep
            completed={hasSubmittedArtwork}
            active={
                !hasSubmittedArtwork
            }
            icon={
                hasSubmittedArtwork
                    ? <FaCheck />
                    : <FaUpload />
            }
            title="Artwork Submitted"
            subtitle={
                hasSubmittedArtwork
                    ? `${artworks.length} Submitted`
                    : "Not Started"
            }
        />


        {/* ADMIN REVIEW */}

        <JourneyStep
            completed={
                hasApprovedArtwork ||
                hasRejectedArtwork
            }
            active={
                hasPendingArtwork
            }
            icon={
                hasPendingArtwork
                    ? <FaClock />
                    : hasApprovedArtwork
                        ? <FaCheck />
                        : hasRejectedArtwork
                            ? <FaClock />
                            : <FaClock />
            }
            title="Admin Review"
            subtitle={
                hasPendingArtwork
                    ? "In Progress"
                    : hasApprovedArtwork
                        ? "Approved"
                        : hasRejectedArtwork
                            ? "Artwork Rejected"
                            : "Waiting"
            }
        />


        {/* PUBLISHED */}

        <JourneyStep
            completed={hasApprovedArtwork}
            active={
                !hasApprovedArtwork &&
                hasSubmittedArtwork
            }
            icon={
                hasApprovedArtwork
                    ? <FaCheck />
                    : <FaImages />
            }
            title="Published"
            subtitle={
                hasApprovedArtwork
                    ? "Published"
                    : hasSubmittedArtwork
                        ? "Waiting for Approval"
                        : "Pending"
            }
        />


        {/* AUDIENCE & SALES */}

        <JourneyStep
            completed={false}
            active={hasApprovedArtwork}
            icon={<FaUser />}
            title="Audience & Sales"
            subtitle={
                hasApprovedArtwork
                    ? "Building Audience"
                    : "Pending"
            }
        />

    </div>

</section>


                    {/* THREE COLUMN AREA */}

                    <section className="artist-dashboard-columns">

                        <SubmissionsSection
    artworks={artworks}
    loading={loading}
    showAllArtworks={showAllArtworks}
    setShowAllArtworks={setShowAllArtworks}
/>

                        <ActivitySection
    artworks={artworks}
    comments={comments}
    enquiries={enquiries}
    sales={sales}
/>

                        <ProfileSection
    artistId={user.id}
    navigate={navigate}
/>

                    </section>


                    {/* AUDIENCE */}

                    <section className="artist-audience-card">

                        <div className="section-heading-row">

                            <span className="section-label">
                                YOUR AUDIENCE
                            </span>

                        </div>

                        <div className="audience-stat-grid">

                            <AudienceStat
                                icon={<FaHeart />}
                                value={totalLikes}
                                label="Likes"
                            />

                            <AudienceStat
                                icon={<FaComment />}
                                value={totalComments}
                                label="Comments"
                            />

                            <AudienceStat
                                icon={<FaEnvelope />}
                                value={totalEnquiries}
                                label="Enquiries"
                            />

                            <AudienceStat
                                icon={<FaShoppingBag />}
                                value={totalSales}
                                label="Sales"
                            />

                        </div>

                        <p className="audience-description">
                            These numbers reflect the total
                            engagement on your published
                            artworks.
                        </p>

                    </section>

                </main>

            </div>

        </PageLayout>
    )
}


/* JOURNEY STEP */

function JourneyStep({
    completed,
    active,
    icon,
    title,
    subtitle
}) {
    return (
        <div
            className={`journey-step
                ${completed ? 'completed' : ''}
                ${active ? 'active' : ''}
            `}
        >

            <div className="journey-icon">
                {icon}
            </div>

            <h4>{title}</h4>

            <span>{subtitle}</span>

        </div>
    )
}


/* SUBMISSIONS */

function SubmissionsSection({
    artworks,
    loading,
    showAllArtworks,
    setShowAllArtworks
}) {
    return (
        <div className="dashboard-panel submissions-panel">

            <div className="panel-heading">

                <span className="section-label">
                    YOUR SUBMISSIONS
                </span>

                {!showAllArtworks && artworks.length > 3 && (
    <button onClick={() => setShowAllArtworks(true)}>
        View All
    </button>
)}

            </div>

            {loading ? (
                <p>Loading...</p>
            ) : artworks.length === 0 ? (

                <p className="empty-dashboard-message">
                    No artworks submitted yet.
                </p>

            ) : (

                (showAllArtworks ? artworks : artworks.slice(0, 3)).map((artwork) => (

                        <div
                            className="submission-item"
                            key={artwork._id}
                        >

                            <img
                                src={artwork.image}
                                alt={artwork.title}
                            />

                            <div className="submission-details">

                                <h3>
                                    {artwork.title}
                                </h3>

                                <p>
                                    {artwork.category}
                                </p>

                                <small>
                                    Submitted artwork
                                </small>

                            </div>

                            <div
                                className={`submission-status
                                    status-${artwork.status}
                                `}
                            >
                                {artwork.status}
                            </div>

                        </div>

                    )
                )

            )}

        </div>
    )
}


/* ACTIVITY */

function ActivitySection({
    artworks,
    comments,
    enquiries,
    sales
}) {
    const activities = []

    // Artwork activities
    artworks.forEach((artwork) => {
        activities.push({
            type: artwork.status === 'approved'
                ? 'approved'
                : artwork.status === 'rejected'
                    ? 'rejected'
                    : 'pending',
            icon: artwork.status === 'approved'
                ? <FaCheck />
                : artwork.status === 'rejected'
                    ? <FaClock />
                    : <FaClock />,
            message:
                artwork.status === 'approved'
                    ? `Your artwork "${artwork.title}" was approved.`
                    : artwork.status === 'rejected'
                        ? `Your artwork "${artwork.title}" was rejected.`
                        : `Your artwork "${artwork.title}" is waiting for review.`,
            date: artwork.updatedAt || artwork.createdAt
        })
    })

    // Comments
    comments.forEach((comment) => {
        activities.push({
            type: 'liked',
            icon: <FaComment />,
            message: `You received a comment on your artwork.`,
            date: comment.createdAt
        })
    })

    // Enquiries
    enquiries.forEach((enquiry) => {
        activities.push({
            type: 'enquiry',
            icon: <FaEnvelope />,
            message: `You received a new enquiry.`,
            date: enquiry.createdAt
        })
    })

    // Sales
    sales.forEach((sale) => {
        activities.push({
            type: 'sale',
            icon: <FaShoppingBag />,
            message: `Your artwork "${sale.artwork?.title || 'Artwork'}" was sold.`,
            date: sale.createdAt
        })
    })

    // Newest activities first
    activities.sort(
        (a, b) =>
            new Date(b.date) - new Date(a.date)
    )

    // Show only latest 5
    const recentActivities =
        activities.slice(0, 5)

    return (
        <div className="dashboard-panel activity-panel">

            <div className="panel-heading">

                <span className="section-label">
                    RECENT ACTIVITY
                </span>

                <button>
                    View All
                </button>

            </div>

            {recentActivities.length === 0 ? (

                <p className="empty-dashboard-message">
                    No recent activity yet.
                </p>

            ) : (

                recentActivities.map(
                    (activity, index) => (

                        <div
                            className="activity-item"
                            key={index}
                        >

                            <span
                                className={`activity-icon ${activity.type}`}
                            >
                                {activity.icon}
                            </span>

                            <div>

                                <p>
                                    {activity.message}
                                </p>

                                <small>
                                    {new Date(
                                        activity.date
                                    ).toLocaleDateString()}
                                </small>

                            </div>

                        </div>
                    )
                )

            )}

        </div>
    )
}


/* PROFILE */

function ProfileSection({ artistId, navigate }) {
    return (
        <div className="dashboard-panel profile-panel">

            <span className="section-label">
                YOUR ARTIST PROFILE
            </span>

            <div className="profile-panel-content">

                <div className="profile-placeholder">
                    <FaUser />
                </div>

                <div>

                    <p>
                        Your biography helps visitors
                        understand your artistic
                        journey and inspiration.
                    </p>

                    <span className="profile-complete">
                        ● Your profile is complete
                    </span>

                </div>

            </div>

            <div className="profile-buttons">

                <button
    onClick={() => navigate(`/artists/${artistId}`)}
>
    <FaEye />
    View Profile
</button>

                

            </div>

        </div>
    )
}


/* AUDIENCE STAT */

function AudienceStat({
    icon,
    value,
    label
}) {
    return (
        <div className="audience-stat">

            <span>
                {icon}
            </span>

            <strong>
                {value}
            </strong>

            <small>
                {label}
            </small>

        </div>
    )
}

export default ArtistDashboard