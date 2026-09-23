import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaReceipt, FaEye, FaCheckCircle, FaTrash } from 'react-icons/fa'

import api from '../services/api'
import './MyPurchases.css'

function MyPurchases() {
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (user.role !== 'user') {
            navigate('/gallery')
            return
        }

        const fetchPurchases = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    '/purchases/my-purchases'
                )

                setPurchases(response.data.purchases || [])
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load your purchases.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchPurchases()
    }, [navigate, user])
const handleDeletePurchase = async (purchaseId) => {
    const confirmed = window.confirm(
        'Are you sure you want to remove this purchase from your purchase history?'
    )

    if (!confirmed) {
        return
    }

    try {
        await api.delete(`/purchases/my-purchases/${purchaseId}`)

        setPurchases((currentPurchases) =>
            currentPurchases.filter(
                (purchase) => purchase._id !== purchaseId
            )
        )
    } catch (err) {
        alert(
            err.response?.data?.message ||
            'Unable to delete this purchase.'
        )
    }
}
    return (
        <main className="artevora-purchases-page">

           <button
    type="button"
    className="artevora-back-dashboard"
    onClick={() => navigate('/user-profile')}
>
    ← Back to Profile
</button>
            {/* HEADER */}
            <header className="artevora-purchases-header">
                <span>YOUR COLLECTION</span>

                <h1>My Purchases</h1>

                <p>
                    A record of the artworks you have collected
                    through ArteVora.
                </p>
            </header>


            {/* LOADING */}
            {loading && (
                <div className="artevora-purchases-state">
                    <div className="artevora-purchases-loader" />

                    <p>
                        Loading your purchases...
                    </p>
                </div>
            )}


            {/* ERROR */}
            {!loading && error && (
                <div className="artevora-purchases-state">
                    <p className="artevora-purchases-error">
                        {error}
                    </p>
                </div>
            )}


            {/* EMPTY */}
            {!loading &&
                !error &&
                purchases.length === 0 && (
                    <div className="artevora-purchases-empty">

                        <FaReceipt />

                        <h2>No Purchases Yet</h2>

                        <p>
                            Your purchased artworks will appear
                            here once you complete an order.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/gallery')}
                        >
                            Explore Artworks
                        </button>

                    </div>
                )}


            {/* PURCHASE LIST */}
            {!loading &&
                !error &&
                purchases.length > 0 && (

                    <section className="artevora-purchases-list">

                        {purchases.map((purchase) => {

                            const artwork = purchase.artwork

                            const formattedAmount =
                                `₹${Number(
                                    purchase.amount
                                ).toLocaleString('en-IN')}`

                            return (
                                <article
                                    className="artevora-purchase-item"
                                    key={purchase._id}
                                >

                                    {/* ARTWORK IMAGE */}
                                    <div className="artevora-purchase-image">

                                        <img
                                            src={artwork?.image}
                                            alt={
                                                artwork?.title ||
                                                'Purchased Artwork'
                                            }
                                        />

                                    </div>


                                    {/* ARTWORK DETAILS */}
                                    <div className="artevora-purchase-details">

                                        <span className="artevora-purchase-label">
                                            ARTWORK
                                        </span>

                                        <h2>
                                            {artwork?.title ||
                                                'Untitled Artwork'}
                                        </h2>

                                        <p className="artevora-purchase-artist">
                                            By{' '}
                                            {artwork?.artistName ||
                                                'Artist'}
                                        </p>


                                        <div className="artevora-purchase-meta">

                                            <span>
                                                {artwork?.category ||
                                                    'Artwork'}
                                            </span>

                                            <span>
                                                Purchased{' '}
                                                {new Date(
                                                    purchase.createdAt
                                                ).toLocaleDateString(
                                                    'en-IN',
                                                    {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    }
                                                )}
                                            </span>

                                        </div>


                                        <div className="artevora-transaction">

                                            <FaReceipt />

                                            <span>
                                                Transaction ID:
                                            </span>

                                            <strong>
                                                {purchase.transactionId}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* PURCHASE SUMMARY */}
                                    <div className="artevora-purchase-summary">

                                        <span className="artevora-purchase-price">
                                            {formattedAmount}
                                        </span>


                                        <span
                                            className={`artevora-purchase-status ${
                                                purchase.paymentStatus
                                                    ?.toLowerCase()
                                                    .replace(
                                                        /\s+/g,
                                                        '-'
                                                    )
                                            }`}
                                        >
                                            <FaCheckCircle />

                                            {purchase.paymentStatus ||
                                                'Paid'}
                                        </span>
   <div className="artevora-purchase-action-row">
    <button
        type="button"
        className="artevora-view-purchase"
        onClick={() =>
            navigate(`/artwork/${artwork?._id}`)
        }
    >
        <FaEye />
        View Artwork
    </button>

    
</div>

</div>
                                    

                                </article>
                            )
                        })}

                    </section>
                )}

        </main>
    )
}

export default MyPurchases