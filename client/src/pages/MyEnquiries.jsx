import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaArrowLeft,
    FaEnvelope,
    FaReply,
    FaClock,
    FaImage,
    FaTrash
} from 'react-icons/fa'
import api from '../services/api'
import PageLayout from '../components/PageLayout'
import './MyEnquiries.css'

function MyEnquiries() {
    const navigate = useNavigate()

    const [enquiries, setEnquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMyEnquiries()
    }, [])

    const fetchMyEnquiries = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await api.get('/enquiries/my-enquiries/user')

            setEnquiries(response.data.enquiries || [])
        } catch (err) {
            console.error('Error loading my enquiries:', err)

            setError(
                err.response?.data?.message ||
                'Unable to load your enquiries.'
            )
        } finally {
            setLoading(false)
        }
    }
const handleDeleteEnquiry = async (enquiryId) => {
    const confirmed = window.confirm(
        'Are you sure you want to delete this enquiry?'
    )

    if (!confirmed) return

    try {
        await api.delete(`/enquiries/my-enquiries/user/${enquiryId}`)

        setEnquiries((current) =>
            current.filter(
                (enquiry) => enquiry._id !== enquiryId
            )
        )
    } catch (err) {
        console.error('Error deleting enquiry:', err)

        setError(
            err.response?.data?.message ||
            'Unable to delete enquiry.'
        )
    }
}
    const formatDate = (date) => {
        if (!date) return 'Recently'

        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <PageLayout>
                <div className="my-enquiries-page">
                    <div className="my-enquiries-loading">
                        Loading your enquiries...
                    </div>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="my-enquiries-page">

                <div className="my-enquiries-header">

                    <button
                        type="button"
                        className="my-enquiries-back-button"
                        onClick={() => navigate('/user-profile')}
                    >
                        <FaArrowLeft />
                        Back to Profile
                    </button>

                    <div className="my-enquiries-title">
                        <span>COMMUNICATION</span>
                        <h1>My Enquiries</h1>
                        <p>
                            View your enquiries and responses from artists.
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="my-enquiries-error">
                        {error}
                    </div>
                )}

                {!error && enquiries.length === 0 && (
                    <div className="my-enquiries-empty">
                        <FaEnvelope />
                        <h2>No enquiries yet</h2>
                        <p>
                            Your enquiries to artists will appear here.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate('/gallery')}
                        >
                            Explore Gallery
                        </button>
                    </div>
                )}

                <div className="my-enquiries-list">

                    {enquiries.map((enquiry) => (

                        <article
                            className="my-enquiry-card"
                            key={enquiry._id}
                        >

                            <div className="my-enquiry-artwork">

                                {enquiry.artwork?.image ? (
                                    <img
                                        src={enquiry.artwork.image}
                                        alt={enquiry.artwork.title}
                                    />
                                ) : (
                                    <div className="my-enquiry-no-image">
                                        <FaImage />
                                    </div>
                                )}

                                <div>
                                    <span>ARTWORK</span>

                                    <h2>
                                        {enquiry.artwork?.title ||
                                            'Artwork'}
                                    </h2>

                                    <p>
                                        Enquiry sent on{' '}
                                        {formatDate(enquiry.createdAt)}
                                    </p>
                                </div>

                            </div>

                            <div className="my-enquiry-content">

                                <div className="my-enquiry-message">

                                    <div className="my-enquiry-section-title">
                                        <FaEnvelope />
                                        <span>YOUR ENQUIRY</span>
                                    </div>

                                    <p>
                                        {enquiry.message}
                                    </p>

                                </div>

                                <div
                                    className={
                                        enquiry.reply
                                            ? 'my-enquiry-reply has-reply'
                                            : 'my-enquiry-reply waiting-reply'
                                    }
                                >

                                    <div className="my-enquiry-section-title">

                                        {enquiry.reply ? (
                                            <FaReply />
                                        ) : (
                                            <FaClock />
                                        )}

                                        <span>
                                            {enquiry.reply
                                                ? 'ARTIST REPLY'
                                                : 'REPLY STATUS'}
                                        </span>

                                    </div>

                                    {enquiry.reply ? (
                                        <>
                                            <p>
                                                {enquiry.reply}
                                            </p>

                                            {enquiry.repliedAt && (
                                                <small>
                                                    Replied on{' '}
                                                    {formatDate(
                                                        enquiry.repliedAt
                                                    )}
                                                </small>
                                            )}
                                        </>
                                    ) : (
                                        <p>
                                            Waiting for the artist to
                                            reply to your enquiry.
                                        </p>
                                    )}

                                </div>

                            </div>

                            <div className="my-enquiry-actions">

    <button
        type="button"
        className="my-enquiry-view-artwork"
        onClick={() =>
            navigate(
                `/artwork/${enquiry.artwork?._id}`
            )
        }
    >
        View Artwork
    </button>

    <button
        type="button"
        className="my-enquiry-delete-button"
        onClick={() =>
            handleDeleteEnquiry(enquiry._id)
        }
    >
        <FaTrash />
        Delete
    </button>

</div>
                        </article>

                    ))}

                </div>

            </div>
        </PageLayout>
    )
}

export default MyEnquiries