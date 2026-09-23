import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './AdminDashboard.css'
import { toast } from 'react-toastify'

function AdminDashboard() {
    const navigate = useNavigate()
    const location = useLocation()

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const [artworks, setArtworks] = useState([])

    const [enquiries, setEnquiries] = useState([]);
    const [sales, setSales] = useState([]);
    const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalRevenue: 0,
    completedSales: 0,
   });
    const [salesLoading, setSalesLoading] = useState(false);
    const [salesError, setSalesError] = useState('');

    const [analytics, setAnalytics] = useState({
  totalUsers: 0,
  totalArtists: 0,
  totalArtworks: 0,
  approvedArtworks: 0,
  pendingArtworks: 0,
  totalSales: 0,
  totalRevenue: 0,
  totalEnquiries: 0,
});

const [analyticsLoading, setAnalyticsLoading] = useState(false);
const [analyticsError, setAnalyticsError] = useState('');

    const [enquiriesLoading, setEnquiriesLoading] = useState(false);
    const [enquiriesError, setEnquiriesError] = useState('');
 
    const [activeTab, setActiveTab] = useState('approved')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [activeSection, setActiveSection] = useState(
        location.state?.activeSection || 'dashboard'
    )

    const [artists, setArtists] = useState([])
    const [artistsLoading, setArtistsLoading] = useState(false)
    const [artistsError, setArtistsError] = useState('')

    const [exhibitions, setExhibitions] = useState([])
    const [exhibitionsLoading, setExhibitionsLoading] =
        useState(false)
    const [exhibitionsError, setExhibitionsError] =
        useState('')

        const [virtualRooms, setVirtualRooms] = useState([])
const [virtualRoomsLoading, setVirtualRoomsLoading] =
    useState(false)
const [virtualRoomsError, setVirtualRoomsError] =
    useState('')
    /*
     * =====================================================
     * ADMIN AUTHENTICATION
     * =====================================================
     */

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
        }
    }, [navigate])
useEffect(() => {
    if (activeSection === 'enquiries') {
        loadEnquiries();
    }
}, [activeSection]);

useEffect(() => {
    if (activeSection === 'sales') {
        loadSales();
    }
}, [activeSection]);
useEffect(() => {
  if (activeSection === 'analytics') {
    loadAnalytics()
  }
}, [activeSection])

    /*
     * =====================================================
     * LOAD ARTWORKS
     * =====================================================
     */

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            return
        }

        const fetchArtworks = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    '/artworks/admin/all'
                )

                setArtworks(
                    response.data.artworks || []
                )
            } catch (err) {
                console.error(
                    'Error loading artworks:',
                    err
                )

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

    /*
     * =====================================================
     * LOAD ARTISTS
     * =====================================================
     */

    useEffect(() => {
        if (activeSection !== 'artists') {
            return
        }

        const fetchArtists = async () => {
            try {
                setArtistsLoading(true)
                setArtistsError('')

                const response = await api.get(
                    '/artists'
                )

                setArtists(
                    response.data.artists || []
                )
            } catch (err) {
                console.error(
                    'Error loading artists:',
                    err
                )

                setArtistsError(
                    err.response?.data?.message ||
                    'Unable to load artists.'
                )
            } finally {
                setArtistsLoading(false)
            }
        }

        fetchArtists()
    }, [activeSection])

const loadEnquiries = async () => {
    try {
        setEnquiriesLoading(true);
        setEnquiriesError('');

        const response = await api.get('/enquiries/admin/all');

        setEnquiries(
            response.data?.enquiries || []
        );
    } catch (error) {
        console.error('Error loading enquiries:', error);

        setEnquiriesError(
            error.response?.data?.message ||
            'Failed to load enquiries.'
        );
    } finally {
        setEnquiriesLoading(false);
    }
};

const loadSales = async () => {
    try {
        setSalesLoading(true);
        setSalesError('');

        const response = await api.get(
            '/purchases/admin/all-sales'
        );

        setSales(
            response.data?.sales || []
        );

        setSalesSummary(
            response.data?.summary || {
                totalSales: 0,
                totalRevenue: 0,
                completedSales: 0,
            }
        );
    } catch (error) {
        console.error(
            'Error loading sales:',
            error
        );

        setSalesError(
            error.response?.data?.message ||
            'Failed to load sales.'
        );
    } finally {
        setSalesLoading(false);
    }
};
const loadAnalytics = async () => {
  try {
    setAnalyticsLoading(true)
    setAnalyticsError('')

    const [
  artistsResponse,
  artworksResponse,
  enquiriesResponse,
  salesResponse,
] = await Promise.all([
  api.get('/artists'),
  api.get('/artworks/admin/all'),
  api.get('/enquiries/admin/all'),
  api.get('/purchases/admin/all-sales'),
])

    
    const artists =
      artistsResponse.data?.artists || artistsResponse.data || []
    const artworks =
      artworksResponse.data?.artworks || artworksResponse.data || []
    const enquiries =
      enquiriesResponse.data?.enquiries ||
      enquiriesResponse.data ||
      []
    const sales =
      salesResponse.data?.sales || salesResponse.data || []

    setAnalytics({
       totalUsers: 0,

      totalArtists: artists.length,

      totalArtworks: artworks.length,

      approvedArtworks: artworks.filter(
        (item) =>
          item.status === 'approved' ||
          item.status === 'Approved'
      ).length,

      pendingArtworks: artworks.filter(
        (item) =>
          item.status === 'pending' ||
          item.status === 'Pending'
      ).length,

      totalSales: sales.length,

      totalRevenue: sales.reduce(
        (total, sale) =>
          total + Number(sale.amount || 0),
        0
      ),

      totalEnquiries: enquiries.length,
    })
  } catch (error) {
    console.error('Analytics loading error:', error)

    setAnalyticsError(
      error.response?.data?.message ||
        'Unable to load analytics'
    )
  } finally {
    setAnalyticsLoading(false)
  }
}
const handleDeleteSale = async (saleId) => {
    const confirmed = window.confirm(
        'Are you sure you want to delete this sale record?'
    );

    if (!confirmed) {
        return;
    }

    try {
        await api.delete(
            `/purchases/admin/all-sales/${saleId}`
        );

        setSales((currentSales) =>
            currentSales.filter(
                (sale) => sale._id !== saleId
            )
        );

        const deletedSale = sales.find(
    (sale) => sale._id === saleId
);

const deletedAmount = Number(
    deletedSale?.amount || 0
);

setSalesSummary((currentSummary) => ({
    ...currentSummary,
    totalSales: Math.max(
        0,
        currentSummary.totalSales - 1
    ),
    totalRevenue: Math.max(
        0,
        currentSummary.totalRevenue - deletedAmount
    ),
    completedSales:
        deletedSale?.orderStatus === 'Confirmed'
            ? Math.max(
                  0,
                  currentSummary.completedSales - 1
              )
            : currentSummary.completedSales,
}));

        toast.success('Sale deleted successfully.');
    } catch (error) {
        console.error(
            'Error deleting sale:',
            error
        );

        toast.error(
            error.response?.data?.message ||
            'Failed to delete sale.'
        );
    }
};
    /*
     * =====================================================
     * LOAD EXHIBITIONS
     * =====================================================
     */

    useEffect(() => {
        if (activeSection !== 'exhibitions') {
            return
        }

        const fetchExhibitions = async () => {
            try {
                setExhibitionsLoading(true)
                setExhibitionsError('')

                const response = await api.get(
                    '/exhibitions/admin/all'
                )

                setExhibitions(
                    response.data.exhibitions || []
                )
            } catch (err) {
                console.error(
                    'Error loading exhibitions:',
                    err
                )

                setExhibitionsError(
                    err.response?.data?.message ||
                    'Unable to load exhibitions.'
                )
            } finally {
                setExhibitionsLoading(false)
            }
        }

        fetchExhibitions()
    }, [activeSection])

    /*
 * =====================================================
 * LOAD VIRTUAL ROOMS
 * =====================================================
 */

useEffect(() => {
    if (activeSection !== 'virtualRooms') {
        return
    }

    const fetchVirtualRooms = async () => {
        try {
            setVirtualRoomsLoading(true)
            setVirtualRoomsError('')

            const response = await api.get(
                '/virtual-rooms/admin/all'
            )

            setVirtualRooms(
                response.data.virtualRooms || []
            )
        } catch (err) {
            console.error(
                'Error loading virtual rooms:',
                err
            )

            setVirtualRoomsError(
                err.response?.data?.message ||
                'Unable to load virtual rooms.'
            )
        } finally {
            setVirtualRoomsLoading(false)
        }
    }

    fetchVirtualRooms()
}, [activeSection])

    /*
     * =====================================================
     * ARTWORK COUNTS
     * =====================================================
     */

    const counts = useMemo(() => {
        return {
            pending: artworks.filter(
                (artwork) =>
                    artwork.status === 'pending'
            ).length,

            approved: artworks.filter(
                (artwork) =>
                    artwork.status === 'approved'
            ).length,

            rejected: artworks.filter(
                (artwork) =>
                    artwork.status === 'rejected'
            ).length
        }
    }, [artworks])

    const filteredArtworks = artworks.filter(
        (artwork) =>
            artwork.status === activeTab
    )

    /*
     * =====================================================
     * UPDATE ARTWORK STATUS
     * =====================================================
     */

    const updateStatus = async (
        artworkId,
        status
    ) => {
        try {
            const response = await api.patch(
                `/artworks/${artworkId}/status`,
                { status }
            )

            setArtworks(
                (currentArtworks) =>
                    currentArtworks.map(
                        (artwork) =>
                            artwork._id === artworkId
                                ? response.data.artwork
                                : artwork
                    )
            )

            toast.success(
                status === 'approved'
                    ? 'Artwork approved successfully!'
                    : 'Artwork rejected successfully!'
            )
        } catch (err) {
            console.error(
                'Error updating artwork:',
                err
            )

            toast.error(
                err.response?.data?.message ||
                `Unable to ${status} artwork.`
            )
        }
    }

    /*
     * =====================================================
     * DELETE EXHIBITION
     * =====================================================
     */

    const handleDeleteExhibition = async (
        exhibitionId
    ) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this exhibition?'
        )

        if (!confirmed) {
            return
        }

        try {
            await api.delete(
                `/exhibitions/admin/${exhibitionId}`
            )

            setExhibitions(
                (currentExhibitions) =>
                    currentExhibitions.filter(
                        (exhibition) =>
                            exhibition._id !==
                            exhibitionId
                    )
            )

            toast.success(
                'Exhibition deleted successfully!'
            )
        } catch (err) {
            console.error(
                'Error deleting exhibition:',
                err
            )

            toast.error(
                err.response?.data?.message ||
                'Unable to delete exhibition.'
            )
        }
    }

    /*
     * =====================================================
     * DATE FORMATTER
     * =====================================================
     */

    const formatExhibitionDate = (date) => {
        if (!date) {
            return ''
        }

        return date.split('T')[0]
    }

    /*
     * =====================================================
     * NAVIGATION
     * =====================================================
     */
const handleRemoveArtist = async (artistId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this artist?"
    )

    if (!confirmed) {
        return
    }

    try {
        await api.delete(
            `/artists/${artistId}`
        )

        setArtists((currentArtists) =>
            currentArtists.filter(
                (artist) => artist._id !== artistId
            )
        )

        toast.success(
            "Artist deleted successfully."
        )
    } catch (error) {
        console.error(
            "Error deleting artist:",
            error
        )

        toast.error(
            error.response?.data?.message ||
            "Unable to delete artist."
        )
    }
}
    const goToSection = (section) => {
        setActiveSection(section)

        if (section === 'artworks') {
            setActiveTab('approved')
        }
    }
const handleDeleteArtwork = async (artworkId) => {
    const confirmed = window.confirm(
        "Are you sure you want to permanently delete this artwork?"
    )

    if (!confirmed) {
        return
    }

    try {
        await api.delete(
            `/artworks/${artworkId}`
        )

        setArtworks((currentArtworks) =>
            currentArtworks.filter(
                (artwork) =>
                    artwork._id !== artworkId
            )
        )

        toast.success(
            "Artwork deleted successfully."
        )
    } catch (error) {
        console.error(
            "Error deleting artwork:",
            error
        )

        toast.error(
            error.response?.data?.message ||
            "Unable to delete artwork."
        )
    }
}
    /*
     * =====================================================
     * PROTECT PAGE
     * =====================================================
     */

    if (!user || user.role !== 'admin') {
        return null
    }

    return (
        <div className="admin-dashboard">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">

                <div className="admin-sidebar-brand">

                    <div className="admin-brand-mark">
                        AV
                    </div>

                    <div>
                        <h1>ARTEVORA</h1>

                        <span>
                            ADMIN STUDIO
                        </span>
                    </div>

                </div>


                <nav className="admin-sidebar-navigation">

                    {/* MAIN */}

                    <div className="admin-sidebar-section">

                        <span className="admin-sidebar-label">
                            MAIN
                        </span>

                        <button
                            className={`admin-sidebar-button ${
                                activeSection ===
                                'dashboard'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                goToSection(
                                    'dashboard'
                                )
                            }
                        >
                            <span className="admin-nav-icon">
                                ▦
                            </span>

                            Dashboard
                        </button>

                    </div>


                    {/* ARTWORKS */}

                    <div className="admin-sidebar-section">

                        <span className="admin-sidebar-label">
                            ARTWORKS
                        </span>

                        <button
                            className={`admin-sidebar-button ${
                                activeSection ===
                                'artworks'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                goToSection(
                                    'artworks'
                                )
                            }
                        >
                            <span className="admin-nav-icon">
                                ◈
                            </span>

                            Artwork Review

                            {counts.pending > 0 && (
                                <span className="admin-nav-count">
                                    {counts.pending}
                                </span>
                            )}
                        </button>

                    </div>


                    {/* MANAGEMENT */}

                    <div className="admin-sidebar-section">

                        <span className="admin-sidebar-label">
                            MANAGEMENT
                        </span>

                        <button
                            className={`admin-sidebar-button ${
                                activeSection ===
                                'artists'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                goToSection(
                                    'artists'
                                )
                            }
                        >
                            <span className="admin-nav-icon">
                                ◎
                            </span>

                            Artists
                        </button>


                        <button
                            className={`admin-sidebar-button ${
                                activeSection ===
                                'exhibitions'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                goToSection(
                                    'exhibitions'
                                )
                            }
                        >
                            <span className="admin-nav-icon">
                                ◫
                            </span>

                            Exhibitions
                        </button>
<button
    className={`admin-sidebar-button ${
        activeSection ===
        'virtualRooms'
            ? 'active'
            : ''
    }`}
    onClick={() =>
        goToSection(
            'virtualRooms'
        )
    }
>
    <span className="admin-nav-icon">
        ◇
    </span>

    Virtual Rooms
</button>
                    </div>


                    {/* ACTIVITY */}

                    <div className="admin-sidebar-section">

                        <span className="admin-sidebar-label">
                            ACTIVITY
                        </span>

                        <button
    className="admin-sidebar-button"
    onClick={() => goToSection('enquiries')}
>
    <span className="admin-nav-icon">◌</span>
    Enquiries
</button>

<button
    className="admin-sidebar-button"
    onClick={() => goToSection('sales')}
>
    <span className="admin-nav-icon">◈</span>
    Sales
</button>

                    
                        <button
                            className="admin-sidebar-button"
                            onClick={() => goToSection('analytics')}
                        >
                            <span className="admin-nav-icon">
                                ◒
                            </span>

                            Analytics
                        </button>

                    </div>

                </nav>


                {/* SIDEBAR BOTTOM */}

                <div className="admin-sidebar-bottom">

                    <div className="admin-sidebar-user">

                        <div className="admin-user-avatar">
                            {user.name
                                ?.charAt(0)
                                ?.toUpperCase() || 'A'}
                        </div>

                        <div>
                            <strong>
                                {user.name ||
                                    'Administrator'}
                            </strong>

                            <span>
                                Administrator
                            </span>
                        </div>

                    </div>


                    <button
                        className="admin-sidebar-logout"
                        onClick={() => {
                            localStorage.removeItem(
                                'token'
                            )

                            localStorage.removeItem(
                                'user'
                            )

                            navigate('/login')
                        }}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="admin-main-content">

                {/* =================================================
                    DASHBOARD OVERVIEW
                ================================================= */}

                {activeSection ===
                    'dashboard' && (

                    <section className="admin-overview">

                        <div className="admin-topbar">

                            <div>
                                <span className="admin-section-eyebrow">
                                    ARTEVORA ADMINISTRATION
                                </span>

                                <h2>
                                    Welcome back, Admin
                                </h2>

                                <p>
                                    Manage your gallery,
                                    artists, artworks and
                                    exhibitions from one place.
                                </p>
                            </div>


                            <div className="admin-topbar-status">
                                <span className="admin-status-dot" />
                                System Active
                            </div>

                        </div>


                        {/* KPI CARDS */}

                        <div className="admin-stat-grid">

                            <div className="admin-stat-card">

                                <div className="admin-stat-top">
                                    <span>
                                        ARTWORKS
                                    </span>

                                    <small>
                                        01
                                    </small>
                                </div>

                                <strong>
                                    {artworks.length}
                                </strong>

                                <p>
                                    Total submissions
                                </p>

                            </div>


                            <div className="admin-stat-card admin-stat-highlight">

                                <div className="admin-stat-top">
                                    <span>
                                        PENDING
                                    </span>

                                    <small>
                                        02
                                    </small>
                                </div>

                                <strong>
                                    {counts.pending}
                                </strong>

                                <p>
                                    Awaiting review
                                </p>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-top">
                                    <span>
                                        APPROVED
                                    </span>

                                    <small>
                                        03
                                    </small>
                                </div>

                                <strong>
                                    {counts.approved}
                                </strong>

                                <p>
                                    Published artworks
                                </p>

                            </div>


                            <div className="admin-stat-card">

                                <div className="admin-stat-top">
                                    <span>
                                        REJECTED
                                    </span>

                                    <small>
                                        04
                                    </small>
                                </div>

                                <strong>
                                    {counts.rejected}
                                </strong>

                                <p>
                                    Reviewed submissions
                                </p>

                            </div>

                        </div>


                        {/* MANAGEMENT OVERVIEW */}

                        <div className="admin-overview-panels">

                            <div className="admin-overview-panel">

                                <div className="admin-panel-heading">

                                    <div>
                                        <span>
                                            ARTWORK MANAGEMENT
                                        </span>

                                        <h3>
                                            Review submissions
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() =>
                                            goToSection(
                                                'artworks'
                                            )
                                        }
                                    >
                                        Open
                                    </button>

                                </div>

                                <p>
                                    Review pending artwork
                                    submissions and approve
                                    or reject them before they
                                    become visible in the
                                    public gallery.
                                </p>


                                <div className="admin-panel-metric">

                                    <strong>
                                        {counts.pending}
                                    </strong>

                                    <span>
                                        pending submissions
                                    </span>

                                </div>

                            </div>


                            <div className="admin-overview-panel">

                                <div className="admin-panel-heading">

                                    <div>
                                        <span>
                                            EXHIBITIONS
                                        </span>

                                        <h3>
                                            Curated experiences
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() =>
                                            goToSection(
                                                'exhibitions'
                                            )
                                        }
                                    >
                                        Manage
                                    </button>

                                </div>

                                <p>
                                    Create and manage curated
                                    exhibitions featuring
                                    ArteVora artists and
                                    artworks.
                                </p>


                                <div className="admin-panel-metric">

                                    <strong>
                                        {exhibitions.length}
                                    </strong>

                                    <span>
                                        loaded exhibitions
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* QUICK ACTIONS */}

                        <div className="admin-quick-actions">

                            <div className="admin-content-header">

                                <div>
                                    <span>
                                        QUICK ACTIONS
                                    </span>

                                    <h3>
                                        Gallery Management
                                    </h3>
                                </div>

                            </div>


                            <div className="admin-quick-action-grid">

                                <button
                                    onClick={() =>
                                        goToSection(
                                            'artworks'
                                        )
                                    }
                                >
                                    <span>
                                        ◈
                                    </span>

                                    <strong>
                                        Review Artwork
                                    </strong>

                                    <small>
                                        Manage submissions
                                    </small>
                                </button>


                                <button
                                    onClick={() =>
                                        goToSection(
                                            'artists'
                                        )
                                    }
                                >
                                    <span>
                                        ◎
                                    </span>

                                    <strong>
                                        Manage Artists
                                    </strong>

                                    <small>
                                        View artist profiles
                                    </small>
                                </button>


                                <button
                                    onClick={() =>
                                        goToSection(
                                            'exhibitions'
                                        )
                                    }
                                >
                                    <span>
                                        ◫
                                    </span>

                                    <strong>
                                        Manage Exhibitions
                                    </strong>

                                    <small>
                                        Curate exhibitions
                                    </small>
                                </button>

                            </div>

                        </div>

                    </section>
                )}


                {/* =================================================
                    ARTWORK REVIEW
                ================================================= */}

                {activeSection ===
                    'artworks' && (

                    <section className="admin-artwork-review">

                        <div className="admin-content-header">

                            <div>
                                <span>
                                    ARTWORKS
                                </span>

                                <h2>
                                    Artwork Review
                                </h2>

                                <p>
                                    Review submitted artworks
                                    and manage their approval
                                    status.
                                </p>
                            </div>

                        </div>


                        <div className="admin-tabs">

                            <button
                                className={
                                    activeTab ===
                                    'pending'
                                        ? 'active-tab'
                                        : ''
                                }
                                onClick={() =>
                                    setActiveTab(
                                        'pending'
                                    )
                                }
                            >
                                Pending
                                <span>
                                    {counts.pending}
                                </span>
                            </button>


                            <button
                                className={
                                    activeTab ===
                                    'approved'
                                        ? 'active-tab'
                                        : ''
                                }
                                onClick={() =>
                                    setActiveTab(
                                        'approved'
                                    )
                                }
                            >
                                Approved
                                <span>
                                    {counts.approved}
                                </span>
                            </button>


                            <button
                                className={
                                    activeTab ===
                                    'rejected'
                                        ? 'active-tab'
                                        : ''
                                }
                                onClick={() =>
                                    setActiveTab(
                                        'rejected'
                                    )
                                }
                            >
                                Rejected
                                <span>
                                    {counts.rejected}
                                </span>
                            </button>

                        </div>


                        {loading && (
                            <p className="admin-message">
                                Loading artworks...
                            </p>
                        )}


                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}


                        {!loading &&
                            !error &&
                            filteredArtworks.length ===
                                0 && (
                                <p className="admin-message">
                                    No {activeTab}{' '}
                                    artworks found.
                                </p>
                            )}


                        {!loading &&
                            !error &&
                            filteredArtworks.length >
                                0 && (

                                <div className="admin-artwork-table-wrapper">

    <table className="admin-artwork-table">

        <thead>
            <tr>
                <th>Artwork</th>
                <th>Artist</th>
                <th>Category</th>
                <th>Uploaded By</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>

            {filteredArtworks.map((artwork) => (

                <tr key={artwork._id}>

                    {/* ARTWORK */}

                    <td>

                        <div className="admin-table-artwork">

                            <div className="admin-table-artwork-image">

                                {artwork.image ? (
                                    <img
                                        src={artwork.image}
                                        alt={artwork.title}
                                    />
                                ) : (
                                    <div className="admin-table-image-placeholder">
                                        AV
                                    </div>
                                )}

                            </div>

                            <div className="admin-table-artwork-details">

                                <strong>
                                    {artwork.title}
                                </strong>

                                <span>
                                    {artwork.description
                                        ? artwork.description.length > 55
                                            ? `${artwork.description.substring(0, 55)}...`
                                            : artwork.description
                                        : 'No description available'}
                                </span>

                            </div>

                        </div>

                    </td>


                    {/* ARTIST */}

                    <td>

                        <span className="admin-table-primary-text">
                            {artwork.artistName || 'Unknown'}
                        </span>

                    </td>


                    {/* CATEGORY */}

                    <td>

                        <span className="admin-table-secondary-text">
                            {artwork.category || 'Not specified'}
                        </span>

                    </td>


                    {/* UPLOADED BY */}

                    <td>

                        <span className="admin-table-secondary-text">
                            {artwork.uploadedBy?.name || 'Unknown'}
                        </span>

                    </td>


                    {/* STATUS */}

                    <td>

                        <span
                            className={`admin-table-status ${artwork.status}`}
                        >
                            {artwork.status}
                        </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                   <div className="admin-table-actions">

    {artwork.status === 'pending' && (
        <>
            <button
                type="button"
                className="admin-table-approve"
                onClick={() =>
                    updateStatus(
                        artwork._id,
                        'approved'
                    )
                }
            >
                Approve
            </button>

            <button
                type="button"
                className="admin-table-reject"
                onClick={() =>
                    updateStatus(
                        artwork._id,
                        'rejected'
                    )
                }
            >
                Reject
            </button>
        </>
    )}

    <button
        type="button"
        className="admin-table-delete"
        onClick={() =>
            handleDeleteArtwork(artwork._id)
        }
    >
        Delete
    </button>

</div>

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>
                            )}

                    </section>
                )}


                {/* =================================================
                    ARTISTS
                ================================================= */}

                {activeSection ===
                    'artists' && (

                    <section className="admin-artists-section">

                        <div className="admin-content-header">

                            <div>
                                <span>
                                    MANAGEMENT
                                </span>

                                <h2>
                                    Artists
                                </h2>

                                <p>
                                    View and manage artists
                                    registered with the
                                    ArteVora gallery.
                                </p>
                            </div>

                        </div>


                        {artistsLoading && (
                            <p className="admin-message">
                                Loading artists...
                            </p>
                        )}


                        {artistsError && (
                            <p className="error-message">
                                {artistsError}
                            </p>
                        )}


                        {!artistsLoading &&
                            !artistsError &&
                            artists.length ===
                                0 && (
                                <p className="admin-message">
                                    No artists found.
                                </p>
                            )}


                        {!artistsLoading &&
                            !artistsError &&
                            artists.length >
                                0 && (

                             <div className="admin-artist-table-wrapper">

    <table className="admin-artist-table">

        <thead>
            <tr>
                <th>Artist</th>
                <th>Email</th>
                <th>Artist Statement</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>

            {artists.map((artist) => (

                <tr key={artist._id}>

                    {/* ARTIST */}

                    <td>

                        <div className="admin-table-artist">

                            <div className="admin-table-artist-image">

                                {artist.profileImage ? (
                                    <img
                                        src={artist.profileImage}
                                        alt={artist.name}
                                    />
                                ) : (
                                    <div className="admin-table-artist-placeholder">
                                        {artist.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || 'A'}
                                    </div>
                                )}

                            </div>

                            <div className="admin-table-artist-details">

                                <strong>
                                    {artist.name}
                                </strong>

                                <span>
                                    ARTIST
                                </span>

                            </div>

                        </div>

                    </td>


                    {/* EMAIL */}

                    <td>

                        <span className="admin-table-artist-email">
                            {artist.email || 'No email available'}
                        </span>

                    </td>


                    {/* STATEMENT */}

                    <td>

                        <div className="admin-table-artist-statement">

                            {artist.artistStatement
                                ? artist.artistStatement.length > 100
                                    ? `${artist.artistStatement.substring(0, 100)}...`
                                    : artist.artistStatement
                                : 'No artist statement available.'}

                        </div>

                    </td>


                    {/* ACTIONS */}

                    <td>

                        <div className="admin-table-artist-actions">

    <button
        type="button"
        onClick={() =>
            navigate(
                `/artists/${artist._id}`
            )
        }
    >
        View Profile
    </button>


</div>
                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>   
                            )}

                    </section>
                )}
{activeSection === 'enquiries' && (
    <section className="admin-section">
        <div className="admin-section-header">
            <div>
                <h2>Enquiries</h2>
                <p>
                    View enquiries submitted by users about artworks.
                </p>
            </div>

            <div className="admin-section-count">
                {enquiries.length} Enquiries
            </div>
        </div>

        {enquiriesLoading ? (
            <div className="admin-empty-state">
                Loading enquiries...
            </div>
        ) : enquiriesError ? (
            <div className="admin-error-message">
                {enquiriesError}
            </div>
        ) : enquiries.length === 0 ? (
            <div className="admin-empty-state">
                No enquiries found.
            </div>
        ) : (
            <div className="admin-enquiries-list">
                {enquiries.map((enquiry) => (
                    <div
                        key={enquiry._id}
                        className="admin-enquiry-card"
                    >
                        <div className="admin-enquiry-header">
                            <div>
                                <h3>
                                    {enquiry.artwork?.title ||
                                        'Artwork'}
                                </h3>

                                <p>
                                    From:{' '}
                                    {enquiry.visitor?.name ||
                                        'Unknown User'}
                                </p>
                            </div>

                            <span
                                className={
                                    enquiry.reply
                                        ? 'admin-enquiry-status replied'
                                        : 'admin-enquiry-status pending'
                                }
                            >
                                {enquiry.reply
                                    ? 'Replied'
                                    : 'Pending'}
                            </span>
                        </div>

                        <div className="admin-enquiry-details">
                            <p>
                                <strong>Artist:</strong>{' '}
                                {enquiry.artist?.name ||
                                    'Unknown Artist'}
                            </p>

                            <p>
                                <strong>User Email:</strong>{' '}
                                {enquiry.visitor?.email ||
                                    'Not available'}
                            </p>

                            <p>
                                <strong>Date:</strong>{' '}
                                {enquiry.createdAt
                                    ? new Date(
                                          enquiry.createdAt
                                      ).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>

                        <div className="admin-enquiry-message">
                            <strong>Enquiry:</strong>
                            <p>{enquiry.message}</p>
                        </div>

                        {enquiry.reply && (
                            <div className="admin-enquiry-reply">
                                <strong>Artist Reply:</strong>
                                <p>{enquiry.reply}</p>

                                {enquiry.repliedAt && (
                                    <small>
                                        Replied on{' '}
                                        {new Date(
                                            enquiry.repliedAt
                                        ).toLocaleDateString()}
                                    </small>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </section>
)}

{activeSection === 'sales' && (
    <section className="admin-section">
        <div className="admin-section-header">
            <div>
                <h2>Sales</h2>
                <p>
                    View all successful artwork sales.
                </p>
            </div>

            <div className="admin-section-count">
                {sales.length} Sales
            </div>
        </div>

        {salesLoading ? (
            <div className="admin-empty-state">
                Loading sales...
            </div>
        ) : salesError ? (
            <div className="admin-error-message">
                {salesError}
            </div>
        ) : (
            <>
                {/* Sales Summary */}
                <div className="admin-sales-summary">
                    <div className="admin-sales-summary-card">
                        <span>Total Sales</span>
                        <strong>
                            {salesSummary.totalSales}
                        </strong>
                    </div>

                    <div className="admin-sales-summary-card">
                        <span>Total Revenue</span>
                        <strong>
                            ₹
                            {Number(
                                salesSummary.totalRevenue || 0
                            ).toLocaleString('en-IN')}
                        </strong>
                    </div>

                    <div className="admin-sales-summary-card">
                        <span>Completed Sales</span>
                        <strong>
                            {salesSummary.completedSales}
                        </strong>
                    </div>
                </div>

                {sales.length === 0 ? (
                    <div className="admin-empty-state">
                        No sales found.
                    </div>
                ) : (
                    <div className="admin-sales-list">
                        {sales.map((sale) => (
                            <div
                                key={sale._id}
                                className="admin-sale-card"
                            >
                                <div className="admin-sale-image">
                                    {sale.artwork?.image ? (
                                        <img
                                            src={sale.artwork.image}
                                            alt={
                                                sale.artwork.title ||
                                                'Artwork'
                                            }
                                        />
                                    ) : (
                                        <div>
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="admin-sale-content">
                                    <div className="admin-sale-header">
                                        <div>
                                            <h3>
                                                {sale.artwork?.title ||
                                                    'Artwork'}
                                            </h3>

                                            <p>
                                                Artist:{' '}
                                                {sale.artist?.name ||
                                                    sale.artwork
                                                        ?.artistName ||
                                                    'Unknown'}
                                            </p>
                                        </div>

                                        <span className="admin-sale-status">
                                            {sale.orderStatus ||
                                                'Confirmed'}
                                        </span>
                                    </div>

                                    <div className="admin-sale-details">
                                        <p>
                                            <strong>
                                                Buyer:
                                            </strong>{' '}
                                            {sale.buyer?.name ||
                                                'Unknown'}
                                        </p>

                                        <p>
                                            <strong>
                                                Buyer Email:
                                            </strong>{' '}
                                            {sale.buyer?.email ||
                                                'Not available'}
                                        </p>

                                        <p>
                                            <strong>
                                                Amount:
                                            </strong>{' '}
                                            ₹
                                            {Number(
                                                sale.amount || 0
                                            ).toLocaleString(
                                                'en-IN'
                                            )}
                                        </p>

                                        <p>
                                            <strong>
                                                Payment:
                                            </strong>{' '}
                                            {sale.paymentStatus ||
                                                'Successful'}
                                        </p>

                                        <p>
                                            <strong>
                                                Transaction ID:
                                            </strong>{' '}
                                            {sale.transactionId ||
                                                'N/A'}
                                        </p>

                                        <p>
                                            <strong>
                                                Date:
                                            </strong>{' '}
                                            {sale.createdAt
                                                ? new Date(
                                                      sale.createdAt
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="admin-sale-actions">
   
</div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
    </section>
)}
{activeSection === 'analytics' && (
  <div className="admin-section-content analytics-section">

    <div className="analytics-page-header">
      <div>
        <span className="analytics-eyebrow">GALLERY INSIGHTS</span>
        <h2>Analytics</h2>
        <p>
          A clear overview of your gallery performance and activity.
        </p>
      </div>
    </div>

    {analyticsLoading ? (
      <div className="admin-loading">
        Loading analytics...
      </div>
    ) : analyticsError ? (
      <div className="admin-error">
        {analyticsError}
      </div>
    ) : (
      <>
        <div className="analytics-kpi-grid">

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-icon">🎨</div>
            <div className="analytics-kpi-content">
              <span>Total Artists</span>
              <strong>{analytics.totalArtists}</strong>
              <small>Artists registered</small>
            </div>
          </div>

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-icon">🖼️</div>
            <div className="analytics-kpi-content">
              <span>Total Artworks</span>
              <strong>{analytics.totalArtworks}</strong>
              <small>Works in the gallery</small>
            </div>
          </div>

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-icon">🛍️</div>
            <div className="analytics-kpi-content">
              <span>Total Sales</span>
              <strong>{analytics.totalSales}</strong>
              <small>Completed purchases</small>
            </div>
          </div>

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-icon">₹</div>
            <div className="analytics-kpi-content">
              <span>Total Revenue</span>
              <strong>
                ₹{analytics.totalRevenue.toLocaleString()}
              </strong>
              <small>Gallery earnings</small>
            </div>
          </div>

        </div>

        <div className="analytics-secondary-grid">

          <div className="analytics-secondary-card">
            <div className="analytics-secondary-top">
              <div>
                <span className="analytics-card-label">
                  ARTWORK STATUS
                </span>
                <h3>Collection Overview</h3>
              </div>

              <div className="analytics-round-icon">
                🖼️
              </div>
            </div>

            <div className="analytics-stat-row">
              <div>
                <span>Approved</span>
                <strong>{analytics.approvedArtworks}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>{analytics.pendingArtworks}</strong>
              </div>

              <div>
                <span>Total</span>
                <strong>{analytics.totalArtworks}</strong>
              </div>
            </div>

            <div className="analytics-progress">
              <div
                className="analytics-progress-fill"
                style={{
                  width: analytics.totalArtworks
                    ? `${(
                        (analytics.approvedArtworks /
                          analytics.totalArtworks) *
                        100
                      ).toFixed(0)}%`
                    : '0%'
                }}
              />
            </div>

            <p className="analytics-progress-text">
              {analytics.totalArtworks
                ? `${(
                    (analytics.approvedArtworks /
                      analytics.totalArtworks) *
                    100
                  ).toFixed(0)}% of artworks are approved`
                : 'No artworks available'}
            </p>
          </div>


          <div className="analytics-secondary-card">
            <div className="analytics-secondary-top">
              <div>
                <span className="analytics-card-label">
                  GALLERY ACTIVITY
                </span>
                <h3>Engagement Overview</h3>
              </div>

              <div className="analytics-round-icon">
                💬
              </div>
            </div>

            <div className="analytics-activity-list">

              <div className="analytics-activity-item">
                <div className="analytics-activity-left">
                  <span className="analytics-mini-icon">👥</span>
                  <div>
                    <strong>Visitors & Users</strong>
                    <small>Registered gallery users</small>
                  </div>
                </div>

                <strong>{analytics.totalUsers}</strong>
              </div>

              <div className="analytics-activity-item">
                <div className="analytics-activity-left">
                  <span className="analytics-mini-icon">💬</span>
                  <div>
                    <strong>Enquiries</strong>
                    <small>Artwork enquiries received</small>
                  </div>
                </div>

                <strong>{analytics.totalEnquiries}</strong>
              </div>

              <div className="analytics-activity-item">
                <div className="analytics-activity-left">
                  <span className="analytics-mini-icon">🛒</span>
                  <div>
                    <strong>Purchases</strong>
                    <small>Successful artwork sales</small>
                  </div>
                </div>

                <strong>{analytics.totalSales}</strong>
              </div>

            </div>
          </div>

<div className="analytics-wide-card analytics-performance-card">

  <div className="analytics-performance-header">
    <div>
      <span className="analytics-card-label">
        GALLERY PERFORMANCE
      </span>
      <h3>Gallery at a Glance</h3>
      <p>
        A visual snapshot of the gallery's current content and activity.
      </p>
    </div>

    <div className="analytics-performance-badge">
      <span>APPROVAL RATE</span>
      <strong>
        {analytics.totalArtworks
          ? `${Math.round(
              (analytics.approvedArtworks /
                analytics.totalArtworks) *
                100
            )}%`
          : '0%'}
      </strong>
    </div>
  </div>


  <div className="analytics-performance-body">

    <div className="analytics-performance-chart">

      <div className="analytics-performance-row">
        <div className="analytics-performance-label">
          <div className="analytics-performance-icon">
            🖼️
          </div>

          <div>
            <strong>Artworks</strong>
            <span>Works in the gallery</span>
          </div>
        </div>

        <div className="analytics-performance-bar-area">
          <div className="analytics-performance-bar">
            <span
              style={{
                width: analytics.totalArtworks
                  ? `${Math.min(
                      (analytics.totalArtworks /
                        Math.max(
                          analytics.totalArtworks,
                          analytics.totalArtists,
                          analytics.totalEnquiries,
                          1
                        )) *
                        100,
                      100
                    )}%`
                  : '0%'
              }}
            />
          </div>

          <strong>{analytics.totalArtworks}</strong>
        </div>
      </div>


      <div className="analytics-performance-row">
        <div className="analytics-performance-label">
          <div className="analytics-performance-icon">
            🎨
          </div>

          <div>
            <strong>Artists</strong>
            <span>Artists represented</span>
          </div>
        </div>

        <div className="analytics-performance-bar-area">
          <div className="analytics-performance-bar">
            <span
              style={{
                width: analytics.totalArtists
                  ? `${Math.min(
                      (analytics.totalArtists /
                        Math.max(
                          analytics.totalArtworks,
                          analytics.totalArtists,
                          analytics.totalEnquiries,
                          1
                        )) *
                        100,
                      100
                    )}%`
                  : '0%'
              }}
            />
          </div>

          <strong>{analytics.totalArtists}</strong>
        </div>
      </div>


      <div className="analytics-performance-row">
        <div className="analytics-performance-label">
          <div className="analytics-performance-icon">
            💬
          </div>

          <div>
            <strong>Enquiries</strong>
            <span>Artwork enquiries received</span>
          </div>
        </div>

        <div className="analytics-performance-bar-area">
          <div className="analytics-performance-bar">
            <span
              style={{
                width: analytics.totalEnquiries
                  ? `${Math.min(
                      (analytics.totalEnquiries /
                        Math.max(
                          analytics.totalArtworks,
                          analytics.totalArtists,
                          analytics.totalEnquiries,
                          1
                        )) *
                        100,
                      100
                    )}%`
                  : '0%'
              }}
            />
          </div>

          <strong>{analytics.totalEnquiries}</strong>
        </div>
      </div>

    </div>


    <div className="analytics-performance-summary">

      <div className="analytics-summary-box">
        <span>APPROVED WORKS</span>
        <strong>{analytics.approvedArtworks}</strong>
        <small>Ready for display</small>
      </div>

      <div className="analytics-summary-box">
        <span>PENDING REVIEW</span>
        <strong>{analytics.pendingArtworks}</strong>
        <small>Awaiting approval</small>
      </div>

    </div>

  </div>

</div>
          
          </div>

        
      </>
    )}

  </div>
)}
                {/* =================================================
                    EXHIBITIONS
                ================================================= */}

                {activeSection ===
                    'exhibitions' && (

                    <section className="admin-exhibitions-section">

                        <div className="admin-content-header">

                            <div>
                                <span>
                                    MANAGEMENT
                                </span>

                                <h2>
                                    Exhibitions
                                </h2>

                                <p>
                                    Create and manage curated
                                    exhibitions for the
                                    ArteVora gallery.
                                </p>
                            </div>


                            <button
                                className="admin-primary-button"
                                onClick={() =>
                                    navigate(
                                        '/admin/exhibitions/create'
                                    )
                                }
                            >
                                + Create Exhibition
                            </button>

                        </div>


                        {exhibitionsLoading && (
                            <p className="admin-message">
                                Loading exhibitions...
                            </p>
                        )}


                        {exhibitionsError && (
                            <p className="error-message">
                                {exhibitionsError}
                            </p>
                        )}


                        {!exhibitionsLoading &&
                            !exhibitionsError &&
                            exhibitions.length ===
                                0 && (
                                <p className="admin-message">
                                    No exhibitions found.
                                </p>
                            )}


                        {!exhibitionsLoading &&
                            !exhibitionsError &&
                            exhibitions.length >
                                0 && (

                                <div className="admin-exhibition-table-wrapper">

    <table className="admin-exhibition-table">

        <thead>
            <tr>
                <th>Exhibition</th>
                <th>Status</th>
                <th>Dates</th>
                <th>Location</th>
                <th>Actions</th>
            </tr>
        </thead>

        <tbody>

            {exhibitions.map((exhibition) => (

                <tr key={exhibition._id}>

                    {/* EXHIBITION */}

                    <td>

                        <div className="admin-table-exhibition">

                            <div className="admin-table-exhibition-image">

                                {exhibition.coverImage ? (
                                    <img
                                        src={exhibition.coverImage}
                                        alt={exhibition.title}
                                    />
                                ) : (
                                    <div className="admin-table-exhibition-placeholder">
                                        AV
                                    </div>
                                )}

                            </div>

                            <div className="admin-table-exhibition-details">

                                <strong>
                                    {exhibition.title}
                                </strong>

                                {exhibition.subtitle && (
                                    <span>
                                        {exhibition.subtitle}
                                    </span>
                                )}

                            </div>

                        </div>

                    </td>


                    {/* STATUS */}

                    <td>

                        <div className="admin-table-exhibition-status">

                            <span
                                className={
                                    exhibition.status === 'published'
                                        ? 'published'
                                        : 'draft'
                                }
                            >
                                {exhibition.status?.toUpperCase()}
                            </span>

                            {exhibition.featured && (
                                <small>
                                    FEATURED
                                </small>
                            )}

                        </div>

                    </td>


                    {/* DATES */}

                    <td>

                        <span className="admin-table-exhibition-date">

                            {formatExhibitionDate(
                                exhibition.startDate
                            )}

                            {' — '}

                            {formatExhibitionDate(
                                exhibition.endDate
                            )}

                        </span>

                    </td>


                    {/* LOCATION */}

                    <td>

                        <span className="admin-table-exhibition-location">

                            {exhibition.location ||
                                'Not specified'}

                        </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                        <div className="admin-table-exhibition-actions">

                            <button
                                type="button"
                                className="admin-exhibition-edit-button"
                                onClick={() =>
                                    navigate(
                                        `/admin/exhibitions/edit/${exhibition._id}`
                                    )
                                }
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="admin-exhibition-delete-button"
                                onClick={() =>
                                    handleDeleteExhibition(
                                        exhibition._id
                                    )
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>
                            )}

                    </section>
                )}
{/* =================================================
    VIRTUAL ROOMS
================================================= */}

{activeSection ===
    'virtualRooms' && (

    <section className="admin-virtual-rooms-section">

        <div className="admin-content-header">

            <div>
                <span>
                    VIRTUAL EXPERIENCE
                </span>

                <h2>
                    Virtual Rooms
                </h2>

                <p>
                    Create and manage independent
                    3D virtual gallery rooms.
                </p>
            </div>

            <button
                className="admin-primary-button"
                onClick={() =>
                    navigate(
                        '/admin/virtual-rooms/create'
                    )
                }
            >
                + Create Virtual Room
            </button>

        </div>


        {virtualRoomsLoading && (
            <p className="admin-message">
                Loading virtual rooms...
            </p>
        )}


        {virtualRoomsError && (
            <p className="error-message">
                {virtualRoomsError}
            </p>
        )}


        {!virtualRoomsLoading &&
            !virtualRoomsError &&
            virtualRooms.length === 0 && (

            <p className="admin-message">
                No virtual rooms found.
            </p>
        )}


        {!virtualRoomsLoading &&
            !virtualRoomsError &&
            virtualRooms.length > 0 && (

            <div className="admin-exhibition-table-wrapper">

                <table className="admin-exhibition-table">

                    <thead>
                        <tr>
                            <th>Virtual Room</th>
                            <th>Artists</th>
                            <th>Artworks</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {virtualRooms.map(
                            (room) => (

                            <tr key={room._id}>

                                {/* ROOM */}

                                <td>

                                    <div className="admin-table-exhibition">

                                        <div className="admin-table-exhibition-image">

                                            {room.coverImage ? (
                                                <img
                                                    src={
                                                        room.coverImage
                                                    }
                                                    alt={
                                                        room.title
                                                    }
                                                />
                                            ) : (
                                                <div className="admin-table-exhibition-placeholder">
                                                    AV
                                                </div>
                                            )}

                                        </div>

                                        <div className="admin-table-exhibition-details">

                                            <strong>
                                                {room.title}
                                            </strong>

                                            {room.description && (
                                                <span>
                                                    {room.description.length >
                                                    70
                                                        ? `${room.description.substring(
                                                              0,
                                                              70
                                                          )}...`
                                                        : room.description}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </td>


                                {/* ARTISTS */}

                                <td>

                                    <span className="admin-table-secondary-text">
                                        {room.artists?.length ||
                                            0}
                                    </span>

                                </td>


                                {/* ARTWORKS */}

                                <td>

                                    <span className="admin-table-secondary-text">
                                        {room.artworks?.length ||
                                            0}
                                    </span>

                                </td>


                                {/* STATUS */}

                                <td>

                                    <div className="admin-table-exhibition-status">

                                        <span
                                            className={
                                                room.status ===
                                                'published'
                                                    ? 'published'
                                                    : 'draft'
                                            }
                                        >
                                            {room.status?.toUpperCase()}
                                        </span>

                                    </div>

                                </td>


                                {/* ACTIONS */}

                                <td>

                                    <div className="admin-table-exhibition-actions">

                                        <button
                                            type="button"
                                            className="admin-exhibition-edit-button"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/virtual-rooms/edit/${room._id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-exhibition-delete-button"
                                            onClick={async () => {

                                                const confirmed =
                                                    window.confirm(
                                                        'Are you sure you want to delete this virtual room?'
                                                    )

                                                if (!confirmed) {
                                                    return
                                                }

                                                try {

                                                    await api.delete(
                                                        `/virtual-rooms/admin/${room._id}`
                                                    )

                                                    setVirtualRooms(
                                                        (
                                                            currentRooms
                                                        ) =>
                                                            currentRooms.filter(
                                                                (
                                                                    currentRoom
                                                                ) =>
                                                                    currentRoom._id !==
                                                                    room._id
                                                            )
                                                    )

                                                    toast.success(
                                                        'Virtual room deleted successfully!'
                                                    )

                                                } catch (err) {

                                                    console.error(
                                                        'Error deleting virtual room:',
                                                        err
                                                    )

                                                    toast.error(
                                                        err.response?.data?.message ||
                                                        'Unable to delete virtual room.'
                                                    )
                                                }

                                            }}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        )}

    </section>
)}
            </main>

        </div>
    )
}

export default AdminDashboard