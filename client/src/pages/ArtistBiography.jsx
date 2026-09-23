import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import {
    FaArrowLeft,
    FaUser,
    FaSave,
    FaVideo
} from 'react-icons/fa'
import './ArtistBiography.css'
import { API_BASE_URL } from '../services/api'

function ArtistBiography() {
    const navigate = useNavigate()

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )
console.log("LOGGED IN USER:", user)
    const [form, setForm] = useState({
        biography: '',
        artisticJourney: '',
        artistJourneyVideo: ''
    })
    const [artistJourneyVideo, setArtistJourneyVideo] =
    useState("")
    const [saving, setSaving] = useState(false)

    if (!user || user.role !== 'artist') {
        return null
    }

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }

    

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (saving) return

        setSaving(true)

        try {
            const token = localStorage.getItem('token')

            if (!token) {
                throw new Error('Please login again.')
            }

            // =========================================
            // SAVE BIOGRAPHY + ARTIST STATEMENT
            // =========================================
if (form.biography.trim() || form.artisticJourney.trim()) {
console.log("BIOGRAPHY BEING SENT:", form.biography)
console.log("ARTISTIC JOURNEY BEING SENT:", form.artisticJourney)
    const biographyResponse = await fetch(
        `${API_BASE_URL}/artists/profile/biography`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                biography: form.biography,
                artisticJourney: form.artisticJourney
            })
        }
    )

    const biographyData = await biographyResponse.json()
    console.log("BIOGRAPHY SAVE RESPONSE:", biographyData)
    console.log(
    "SAVED BIOGRAPHY:",
    biographyData.artist?.biography
)

console.log(
    "SAVED ARTIST STATEMENT:",
    biographyData.artist?.artistStatement
)

    if (!biographyResponse.ok || !biographyData.success) {
        throw new Error(
            biographyData.message ||
            'Failed to save artist biography'
        )
    }
}
            // =========================================
// SAVE ARTIST JOURNEY VIDEO
// =========================================

if (artistJourneyVideo.trim()) {
    const videoResponse = await fetch(
        `${API_BASE_URL}/artists/profile/video`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                artistJourneyVideo:
                    artistJourneyVideo.trim(),
            }),
        }
    )

    const videoData = await videoResponse.json()

    console.log(
        "VIDEO SAVE RESPONSE:",
        videoData
    )

    if (
        !videoResponse.ok ||
        !videoData.success
    ) {
        throw new Error(
            videoData.message ||
            'Biography saved, but video URL could not be saved.'
        )
    }
}

            alert('Artist profile saved successfully!')

            console.log("PROFILE SAVE COMPLETE")

        } catch (error) {
            console.error(
                'Error saving artist profile:',
                error
            )

            alert(error.message)

        } finally {
            setSaving(false)
        }
    }

    return (
        <PageLayout>

            <div className="artist-biography-page">

                {/* =========================================
                    TOP BAR
                ========================================= */}

                <div className="biography-topbar">

                    <button
                        className="biography-back-button"
                        onClick={() => navigate('/artist-dashboard')}
                    >
                        <FaArrowLeft />
                        <span>Back to Dashboard</span>
                    </button>

                    <span className="biography-page-label">
                        ARTIST STUDIO
                    </span>

                </div>


                {/* =========================================
                    PAGE INTRO
                ========================================= */}

                <section className="biography-intro">

                    <div className="biography-intro-icon">
                        <FaUser />
                    </div>

                    <span>
                        ARTIST PROFILE
                    </span>

                    <h1>
                        Your Artistic Story
                    </h1>

                    <p>
                        Tell visitors about your creative journey,
                        inspiration and artistic identity.
                    </p>

                </section>


                {/* =========================================
                    BIOGRAPHY FORM
                ========================================= */}

                <form
                    className="biography-form"
                    onSubmit={handleSubmit}
                >

                    <div className="biography-form-header">

                        <div>
                            <span>
                                PROFILE INFORMATION
                            </span>

                            <h2>
                                Artist Biography
                            </h2>
                        </div>

                        <div className="biography-artist-name">

                            <small>
                                ARTIST
                            </small>

                            <strong>
                                {user.name || 'Artist'}
                            </strong>

                        </div>

                    </div>


                    {/* =========================================
                        BIOGRAPHY
                    ========================================= */}

                    <div className="biography-field">

                        <label htmlFor="biography">
                            Biography
                        </label>

                        <textarea
                            id="biography"
                            name="biography"
                            value={form.biography}
                            onChange={handleChange}
                            placeholder="Write your complete biography and tell visitors about your background, education, artistic development and career..."
                            rows="10"
                            
                        />

                    </div>


                    {/* =========================================
                        ARTISTIC JOURNEY / ARTIST STATEMENT
                    ========================================= */}

                    <div className="biography-field">

                        <label htmlFor="artisticJourney">
                            Artistic Journey / Artist Statement
                        </label>

                        <textarea
                            id="artisticJourney"
                            name="artisticJourney"
                            value={form.artisticJourney}
                            onChange={handleChange}
                            placeholder="Describe your artistic journey, creative vision and what inspires your work..."
                            rows="8"
                        
                        />

                    </div>


                    {/* =========================================
                        ARTIST JOURNEY VIDEO
                    ========================================= */}
<div className="biography-field">

    <label htmlFor="artistJourneyVideo">
        Artist Journey Video
    </label>

    <div className="artist-video-upload">

        <FaVideo />

        <input
            type="url"
            id="artistJourneyVideo"
            name="artistJourneyVideo"
            placeholder="Enter video URL"
            value={artistJourneyVideo}
            onChange={(e) =>
                setArtistJourneyVideo(e.target.value)
            }
        />

    </div>

    <p className="artist-form-help">
        Enter the URL of the artist's journey video.
    </p>

</div>


                    {/* =========================================
                        ACTIONS
                    ========================================= */}

                    <div className="biography-actions">

                        <button
                            type="button"
                            className="biography-cancel-button"
                            onClick={() =>
                                navigate('/artist-dashboard')
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="biography-save-button"
                            disabled={saving}
                        >
                            <FaSave />

                            {saving
                                ? 'Saving...'
                                : 'Save Biography'
                            }
                        </button>

                    </div>

                </form>

            </div>

        </PageLayout>
    )
}

export default ArtistBiography