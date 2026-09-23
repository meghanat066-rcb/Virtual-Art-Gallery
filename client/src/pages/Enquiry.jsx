import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa'
import api from '../services/api'
import PageLayout from '../components/PageLayout'
import './Enquiry.css'

function Enquiry() {
    const { artworkId } = useParams()
    const navigate = useNavigate()

    const [artwork, setArtwork] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    `/artworks/${artworkId}`
                )

                if (response.data.success) {
                    setArtwork(response.data.artwork)
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load artwork.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchArtwork()
    }, [artworkId])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message.trim()) {
            setError('Please enter your enquiry message.')
            return
        }

        try {
            setSubmitting(true)
            setError('')
            setSuccess('')

            const response = await api.post(
                '/enquiries',
                {
                    artworkId,
                    message: message.trim()
                }
            )

            if (response.data.success) {
                setSuccess(
                    'Your enquiry has been sent successfully.'
                )

                setMessage('')
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to send enquiry.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (!user || user.role !== 'user') {
        return (
            <PageLayout>
                <div className="enquiry-access-error">
                    <h2>
                        Please login as a user to send an enquiry.
                    </h2>

                    <button
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </div>
            </PageLayout>
        )
    }

    if (loading) {
        return (
            <PageLayout>
                <div className="enquiry-loading">
                    Loading artwork...
                </div>
            </PageLayout>
        )
    }

    if (!artwork) {
        return (
            <PageLayout>
                <div className="enquiry-access-error">
                    <h2>Artwork not found</h2>

                    <button
                        onClick={() => navigate('/gallery')}
                    >
                        Back to Gallery
                    </button>
                </div>
            </PageLayout>
        )
    }

    const getImageUrl = (image) => {
        if (!image) return ''

        if (image.startsWith('http')) {
            return image
        }

        return `http://localhost:8000${image}`
    }

    return (
        <PageLayout>

            <main className="enquiry-page">

                <button
                    className="enquiry-back-button"
                    onClick={() =>
                        navigate(`/artwork/${artworkId}`)
                    }
                >
                    <FaArrowLeft />
                    Back to Artwork
                </button>


                <section className="enquiry-container">

                    <div className="enquiry-artwork">

                        <div className="enquiry-artwork-image">

                            <img
                                src={getImageUrl(artwork.image)}
                                alt={artwork.title}
                            />

                        </div>

                        <div className="enquiry-artwork-info">

                            <span>
                                ARTWORK ENQUIRY
                            </span>

                            <h1>
                                {artwork.title}
                            </h1>

                            <p>
                                Send an enquiry to the artist
                                about this artwork.
                            </p>

                        </div>

                    </div>


                    <div className="enquiry-form-section">

                        <div className="enquiry-form-heading">

                            <div className="enquiry-icon">
                                <FaEnvelope />
                            </div>

                            <span>
                                CONTACT ARTIST
                            </span>

                            <h2>
                                Send Your Enquiry
                            </h2>

                            <p>
                                Ask the artist about the artwork,
                                availability, pricing or anything
                                else you would like to know.
                            </p>

                        </div>


                        <form
                            className="enquiry-form"
                            onSubmit={handleSubmit}
                        >

                            <label>
                                Your Message
                            </label>

                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Write your enquiry here..."
                                rows="7"
                            />


                            {error && (
                                <p className="enquiry-error">
                                    {error}
                                </p>
                            )}


                            {success && (
                                <p className="enquiry-success">
                                    {success}
                                </p>
                            )}


                            <button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Sending...'
                                    : 'Send Enquiry'
                                }
                            </button>

                        </form>

                    </div>

                </section>

            </main>

        </PageLayout>
    )
}

export default Enquiry