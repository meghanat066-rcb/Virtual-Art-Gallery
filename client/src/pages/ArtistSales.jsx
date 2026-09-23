import { useEffect, useState } from 'react'
import { FaShoppingBag, FaRupeeSign, FaCheckCircle, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../services/api'
import './ArtistSales.css'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

function ArtistSales() {

    const [sales, setSales] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchSales()
    }, [])

    const fetchSales = async () => {
        try {
            setLoading(true)

            const response = await api.get('/purchases/my-sales')

            if (response.data?.success) {
                setSales(response.data.sales || [])
            }

        } catch (error) {
            console.error('Error fetching artist sales:', error)

            toast.error(
                error.response?.data?.message ||
                'Unable to load sales.'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSale = async (saleId) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this sale from your sales history?'
        )

        if (!confirmed) {
            return
        }

        try {
            setDeletingId(saleId)

            const response = await api.delete(
                `/purchases/my-sales/${saleId}`
            )

            if (response.data?.success) {

                setSales((currentSales) =>
                    currentSales.filter(
                        (sale) => sale._id !== saleId
                    )
                )

                toast.success(
                    response.data.message ||
                    'Sale deleted successfully.'
                )
            }

        } catch (error) {

            console.error(
                'Error deleting sale:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to delete sale.'
            )

        } finally {
            setDeletingId(null)
        }
    }

    const totalRevenue = sales.reduce(
        (total, sale) =>
            total + Number(sale.amount || 0),
        0
    )

    const completedSales = sales.filter(
        (sale) => sale.orderStatus === 'Completed'
    ).length

    return (
        <div className="artist-sales-page">

            <button
    type="button"
    className="dashboard-back-button"
    onClick={() => navigate('/artist-dashboard')}
>
    <FaArrowLeft />
    Back to Dashboard
</button>

            <div className="sales-header">

                <span>
                    ARTIST STUDIO
                </span>

                <h1>
                    Sales
                </h1>

                <p>
                    Track your artwork purchases and keep an
                    overview of your sales activity.
                </p>

            </div>


            <div className="sales-summary">

                <div className="sales-summary-item">

                    <span>
                        <FaShoppingBag />
                    </span>

                    <div>
                        <strong>
                            {sales.length}
                        </strong>

                        <small>
                            Total Sales
                        </small>
                    </div>

                </div>


                <div className="sales-summary-item">

                    <span>
                        <FaRupeeSign />
                    </span>

                    <div>
                        <strong>
                            ₹{totalRevenue.toLocaleString('en-IN')}
                        </strong>

                        <small>
                            Total Revenue
                        </small>
                    </div>

                </div>


                <div className="sales-summary-item">

                    <span>
                        <FaCheckCircle />
                    </span>

                    <div>
                        <strong>
                            {completedSales}
                        </strong>

                        <small>
                            Completed
                        </small>
                    </div>

                </div>

            </div>


            <div className="sales-content">

                <div className="sales-title-row">

                    <div>

                        <span>
                            SALES HISTORY
                        </span>

                        <h2>
                            Your Artwork Sales
                        </h2>

                    </div>

                    <div className="sales-count">
                        {sales.length} Sales
                    </div>

                </div>


                {loading ? (

                    <div className="empty-sales">

                        <h2>
                            Loading sales...
                        </h2>

                    </div>

                ) : sales.length === 0 ? (

                    <div className="empty-sales">

                        <div className="empty-sales-icon">
                            <FaShoppingBag />
                        </div>

                        <h2>
                            No sales yet
                        </h2>

                        <p>
                            When one of your published artworks is
                            purchased, the transaction will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="sales-list">

                        {sales.map((sale) => (

                            <div
                                className="sale-item"
                                key={sale._id}
                            >

                                <div className="sale-artwork">

                                    {sale.artwork?.image && (
                                        <img
                                            src={sale.artwork.image}
                                            alt={sale.artwork.title}
                                        />
                                    )}

                                </div>


                                <div className="sale-details">

                                    <span className="sale-label">
                                        ARTWORK SOLD
                                    </span>

                                    <h3>
                                        {sale.artwork?.title ||
                                            'Artwork'}
                                    </h3>

                                    <p>
                                        Buyer:{' '}
                                        {sale.buyer?.name ||
                                            'Unknown buyer'}
                                    </p>

                                    <p>
                                        {sale.buyer?.email ||
                                            'Email unavailable'}
                                    </p>

                                    <small>
                                        Transaction ID:{' '}
                                        {sale.transactionId}
                                    </small>

                                </div>


                                <div className="sale-right">

                                    <strong className="sale-amount">
                                        ₹{Number(
                                            sale.amount || 0
                                        ).toLocaleString('en-IN')}
                                    </strong>

                                    <span className="sale-status">
                                        {sale.orderStatus}
                                    </span>

                                    <button
                                        type="button"
                                        className="delete-sale-button"
                                        onClick={() =>
                                            handleDeleteSale(
                                                sale._id
                                            )
                                        }
                                        disabled={
                                            deletingId === sale._id
                                        }
                                    >

                                        <FaTrash />

                                        {deletingId === sale._id
                                            ? 'Deleting...'
                                            : 'Delete'}

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    )
}

export default ArtistSales