import { useEffect, useState } from 'react'
import { FaEnvelope, FaUser, FaClock, FaCheck,  FaTrash } from 'react-icons/fa'
import api from '../services/api'
import './ArtistEnquiries.css'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

function ArtistEnquiries() {

    const [enquiries, setEnquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [replyText, setReplyText] = useState({})
const [replyingId, setReplyingId] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetchEnquiries()
    }, [])

    const fetchEnquiries = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await api.get(
                '/enquiries/my-enquiries'
            )

            setEnquiries(
                response.data.enquiries || []
            )

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load enquiries.'
            )
        } finally {
            setLoading(false)
        }
    }


    const markAsRead = async (id) => {
        try {

            await api.put(
                `/enquiries/${id}/read`
            )

            setEnquiries((current) =>
                current.map((enquiry) =>
                    enquiry._id === id
                        ? { ...enquiry, isRead: true }
                        : enquiry
                )
            )

        } catch (err) {
            console.error(
                'Error marking enquiry as read:',
                err
            )
        }
    }


    const markAllAsRead = async () => {
        try {

            await api.put(
                '/enquiries/read-all'
            )

            setEnquiries((current) =>
                current.map((enquiry) => ({
                    ...enquiry,
                    isRead: true
                }))
            )

        } catch (err) {
            console.error(
                'Error marking enquiries as read:',
                err
            )
        }
    }

const deleteEnquiry = async (id) => {
    try {
        await api.delete(`/enquiries/${id}`)

        setEnquiries((current) =>
            current.filter(
                (enquiry) => enquiry._id !== id
            )
        )

    } catch (err) {
        console.error(
            'Error deleting enquiry:',
            err
        )
    }
}
const sendReply = async (id) => {
    const reply = replyText[id]?.trim()

    if (!reply) {
        return
    }

    try {
        setReplyingId(id)

        const response = await api.put(
            `/enquiries/${id}/reply`,
            {
                reply
            }
        )

        const updatedEnquiry =
            response.data.enquiry

        setEnquiries((current) =>
            current.map((enquiry) =>
                enquiry._id === id
                    ? updatedEnquiry
                    : enquiry
            )
        )

        setReplyText((current) => ({
            ...current,
            [id]: ''
        }))

    } catch (err) {
        console.error(
            'Error sending enquiry reply:',
            err
        )
    } finally {
        setReplyingId(null)
    }
}
    const unreadCount = enquiries.filter(
        (enquiry) => !enquiry.isRead
    ).length


    const formatDate = (date) => {

        if (!date) return 'Recently'

        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        )
    }


    return (
        <div className="artist-enquiries-page">

            <button
    type="button"
    className="dashboard-back-button"
    onClick={() => navigate('/artist-dashboard')}
>
    <FaArrowLeft />
    Back to Dashboard
</button>

            <div className="enquiries-header">

                <span>
                    ARTIST STUDIO
                </span>

                <h1>
                    Enquiries
                </h1>

                <p>
                    View and manage enquiries received from
                    visitors interested in your artworks.
                </p>

            </div>


            <div className="enquiries-content">

                <div className="enquiries-title-row">

                    <div>

                        <span>
                            YOUR INBOX
                        </span>

                        <h2>
                            Artwork Enquiries
                        </h2>

                    </div>


                    <div className="enquiry-header-actions">

                        <div className="enquiry-count">

                            {enquiries.length}{' '}
                            {enquiries.length === 1
                                ? 'Enquiry'
                                : 'Enquiries'}

                        </div>


                        {unreadCount > 0 && (

                            <button
                                className="mark-all-read-button"
                                onClick={markAllAsRead}
                            >
                                <FaCheck />
                                Mark All Read
                            </button>

                        )}

                    </div>

                </div>


                {loading ? (

                    <div className="enquiries-state">

                        <FaClock />

                        <p>
                            Loading enquiries...
                        </p>

                    </div>

                ) : error ? (

                    <div className="enquiries-state enquiries-error">

                        <FaEnvelope />

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={fetchEnquiries}
                        >
                            Try Again
                        </button>

                    </div>

                ) : enquiries.length === 0 ? (

                    <div className="empty-enquiries">

                        <div className="empty-enquiries-icon">
                            <FaEnvelope />
                        </div>

                        <h2>
                            No enquiries yet
                        </h2>

                        <p>
                            When visitors send enquiries about
                            your published artworks, they will
                            appear here.
                        </p>

                    </div>

                ) : (

                    <div className="enquiries-list">

                        {enquiries.map((enquiry) => (

                            <article
                                className={`enquiry-item ${
                                    enquiry.isRead
                                        ? 'read'
                                        : 'unread'
                                }`}
                                key={enquiry._id}
                            >

                                <div className="enquiry-item-icon">

                                    <FaEnvelope />

                                </div>


                                <div className="enquiry-item-main">

                                    <div className="enquiry-item-top">

                                        <div>

                                            <h3>
                                                {enquiry.artwork?.title ||
                                                    'Artwork Enquiry'}
                                            </h3>

                                            <span>
                                                {formatDate(
                                                    enquiry.createdAt
                                                )}
                                            </span>

                                        </div>


                                        {!enquiry.isRead && (

                                            <span className="unread-label">
                                                NEW
                                            </span>

                                        )}

                                    </div>


                                    <div className="enquiry-visitor">

                                        <FaUser />

                                        <span>
                                            {enquiry.visitor?.name ||
                                                'Visitor'}
                                        </span>

                                        {enquiry.visitor?.email && (
                                            <small>
                                                {enquiry.visitor.email}
                                            </small>
                                        )}

                                    </div>


                                    <p className="enquiry-message">
                                        {enquiry.message}
                                    </p>


                                   <div className="enquiry-actions">

    {!enquiry.isRead && (

        <button
            className="mark-read-button"
            onClick={() =>
                markAsRead(enquiry._id)
            }
        >
            <FaCheck />
            Mark as Read
        </button>

    )}

    <button
        className="delete-enquiry-button"
        onClick={() =>
            deleteEnquiry(enquiry._id)
        }
    >
        <FaTrash />
        Delete
    </button>

</div>


{/* ARTIST REPLY */}

<div className="enquiry-reply-section">

    <label>
        {enquiry.reply
            ? 'YOUR REPLY'
            : 'REPLY TO VISITOR'}
    </label>

    {enquiry.reply && (
        <div className="existing-enquiry-reply">
            <p>
                {enquiry.reply}
            </p>

            {enquiry.repliedAt && (
                <small>
                    Replied on {formatDate(enquiry.repliedAt)}
                </small>
            )}
        </div>
    )}

    <textarea
    value={
        replyText[enquiry._id] !== undefined
            ? replyText[enquiry._id]
            : enquiry.reply || ''
    }
        onChange={(event) =>
            setReplyText((current) => ({
                ...current,
                [enquiry._id]: event.target.value
            }))
        }
        placeholder={
            enquiry.reply
                ? 'Write a new reply...'
                : 'Write your reply to this visitor...'
        }
        rows="3"
    />

    <button
        type="button"
        className="send-enquiry-reply-button"
        onClick={() =>
            sendReply(enquiry._id)
        }
        disabled={
            replyingId === enquiry._id ||
            !replyText[enquiry._id]?.trim()
        }
    >
        {replyingId === enquiry._id
            ? 'Sending...'
            : enquiry.reply
                ? 'Update Reply'
                : 'Send Reply'}
    </button>

</div>
                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </div>

        </div>
    )
}

export default ArtistEnquiries