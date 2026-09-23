import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './ExhibitionDetails.css'

function ExhibitionDetails() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [exhibition, setExhibition] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [installationIndex, setInstallationIndex] = useState(0)

    useEffect(() => {
        const fetchExhibition = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    `/exhibitions/${id}`
                )

                setExhibition(response.data.exhibition)
            } catch (err) {
                console.error(
                    'Error loading exhibition:',
                    err
                )

                setError(
                    err.response?.data?.message ||
                    'Unable to load exhibition.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchExhibition()
    }, [id])

    const formatDate = (date) => {
        if (!date) return ''

        return new Date(date).toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        )
    }

    if (loading) {
        return (
            <main className="artevora-exhibition-details-page">
                <div className="artevora-exhibition-details-message">
                    Loading exhibition...
                </div>
            </main>
        )
    }

    if (error || !exhibition) {
        return (
            <main className="artevora-exhibition-details-page">
                <div className="artevora-exhibition-details-message">
                    <h2>Exhibition unavailable</h2>

                    <p>
                        {error ||
                            'This exhibition could not be found.'}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate('/exhibitions')
                        }
                    >
                        Back to Exhibitions
                    </button>
                </div>
            </main>
        )
    }

    const exhibitionArtworks =
        exhibition.artworks || []

    const exhibitionArtists =
        exhibition.artists || []

    const installationShots =
        exhibition.installationShots || []

    return (
        <main className="artevora-exhibition-details-page">

{/* EXHIBITION HERO IMAGE */}

<section className="artevora-exhibition-hero">

    {exhibition.coverImage && (
        <img
            src={exhibition.coverImage}
            alt={exhibition.title}
            className="artevora-exhibition-hero-image"
        />
    )}

</section>


{/* EXHIBITION SECTION NAVIGATION */}

<nav
    className="artevora-exhibition-section-nav"
    aria-label="Exhibition sections"
>

    <div className="artevora-exhibition-section-nav-inner">

        <button
            type="button"
            onClick={() =>
                document
                    .getElementById('exhibition-overview')
                    ?.scrollIntoView({
                        behavior: 'smooth'
                    })
            }
        >
            Overview
        </button>

        <button
            type="button"
            onClick={() =>
                document
                    .getElementById('exhibition-installation')
                    ?.scrollIntoView({
                        behavior: 'smooth'
                    })
            }
        >
            Installation Views
        </button>

        <button
            type="button"
            onClick={() =>
                document
                    .getElementById('exhibition-works')
                    ?.scrollIntoView({
                        behavior: 'smooth'
                    })
            }
        >
            Works
        </button>

    </div>

</nav>


           {/* =========================================
    OVERVIEW
========================================= */}

<section className="artevora-exhibition-overview">

    <div className="artevora-exhibition-overview-container">

        {/* LEFT — EXHIBITION INFORMATION */}

        <div className="artevora-exhibition-overview-text">

            <span className="artevora-exhibition-overview-label">
                OVERVIEW
            </span>

            <h2>
                {exhibition.title}
            </h2>

            {exhibition.subtitle && (
                <h3 className="artevora-exhibition-overview-subtitle">
                    {exhibition.subtitle}
                </h3>
            )}

            <div className="artevora-exhibition-overview-date">

    <span>
        {new Date(
            exhibition.startDate
        ).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })}

        {' — '}

        {new Date(
            exhibition.endDate
        ).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })}
    </span>

</div>
            <div className="artevora-exhibition-overview-line"></div>

            {exhibition.exhibitionPurpose && (
                <p className="artevora-exhibition-overview-purpose">
                    {exhibition.exhibitionPurpose}
                </p>
            )}

            {exhibition.description && (
                <p className="artevora-exhibition-overview-description">
                    {exhibition.description}
                </p>
            )}

        </div>


        {/* RIGHT — SEPARATE OVERVIEW IMAGE */}

        <div className="artevora-exhibition-overview-image">

    {exhibition.overviewImage ? (
        <img
            src={exhibition.overviewImage}
            alt={`${exhibition.title} overview`}
        />
    ) : (
        <div className="artevora-exhibition-overview-image-placeholder">
            Overview Image
        </div>
    )}

</div>
    </div>

</section>
            
{/* 03 — INSTALLATION VIEWS */}

<section
    id="exhibition-installation"
    className="artevora-exhibition-installation"
>

    <div className="artevora-exhibition-installation-container">

        <div className="artevora-installation-carousel">

            {/* SECTION LABEL */}

            <div className="artevora-installation-title">
                INSTALLATION SHOTS
            </div>


            {/* PREVIOUS BUTTON */}

            <button
                type="button"
                className="artevora-installation-carousel-arrow artevora-installation-carousel-arrow-left"
                onClick={() =>
                    setInstallationIndex(
                        (currentIndex) =>
                            currentIndex === 0
                                ? installationShots.length - 1
                                : currentIndex - 1
                    )
                }
                aria-label="Previous installation view"
            >
                ←
            </button>


            {/* IMAGES */}

            <div className="artevora-installation-carousel-track">

                {installationShots.length > 0 && (
                    <>
                        {installationShots.map(
                            (installation, index) => {

                                const position =
                                    index -
                                    installationIndex

                                const total =
                                    installationShots.length

                                let normalizedPosition =
                                    position

                                if (
                                    position >
                                    total / 2
                                ) {
                                    normalizedPosition =
                                        position - total
                                }

                                if (
                                    position <
                                    -total / 2
                                ) {
                                    normalizedPosition =
                                        position + total
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`artevora-installation-carousel-slide ${
                                            normalizedPosition === 0
                                                ? 'active'
                                                : ''
                                        }`}
                                        style={{
                                            '--installation-position':
                                                normalizedPosition
                                        }}
                                    >

                                        <img
                                            src={
                                                installation.image
                                            }
                                            alt={`${exhibition.title} installation view ${
                                                index + 1
                                            }`}
                                        />

                                    </div>
                                )
                            }
                        )}
                    </>
                )}

            </div>


            {/* NEXT BUTTON */}

            <button
                type="button"
                className="artevora-installation-carousel-arrow artevora-installation-carousel-arrow-right"
                onClick={() =>
                    setInstallationIndex(
                        (currentIndex) =>
                            currentIndex ===
                            installationShots.length - 1
                                ? 0
                                : currentIndex + 1
                    )
                }
                aria-label="Next installation view"
            >
                →
            </button>


            {/* EMPTY STATE */}

            {installationShots.length === 0 && (
                <div className="artevora-installation-empty">

                    <p>
                        Installation views have not
                        been added yet.
                    </p>

                </div>
            )}

        </div>

    </div>

</section>
            {/* 04 — WORKS */}

            <section
                id="exhibition-works"
                className="artevora-exhibition-works"
            >

                <div className="artevora-exhibition-section-inner">

                    <div className="artevora-exhibition-section-label">
                        <span>04</span>
                        <p>WORKS</p>
                    </div>


                    <div className="artevora-exhibition-works-content">

                        <div className="artevora-exhibition-works-intro">

                            <h2>
                                Selected Works
                            </h2>

                            <p>
                                Works selected for this
                                exhibition.
                            </p>

                        </div>


                        {exhibitionArtworks.length > 0 ? (

                            <div className="artevora-exhibition-works-grid">

                                {exhibitionArtworks.map(
                                    (artwork) => (

                                        <article
                                            className="artevora-exhibition-work"
                                            key={artwork._id}
                                        >

                                            <div className="artevora-exhibition-work-image">

                                                {artwork.image ? (

                                                    <img
                                                        src={
                                                            artwork.image
                                                        }
                                                        alt={
                                                            artwork.title ||
                                                            'Artwork'
                                                        }
                                                    />

                                                ) : (

                                                    <div className="artevora-exhibition-work-placeholder">
                                                        AV
                                                    </div>

                                                )}

                                            </div>


                                            <div className="artevora-exhibition-work-information">

                                                <h3>
                                                    {artwork.title ||
                                                        'Untitled'}
                                                </h3>

                                                <p>
                                                    {artwork.artistName ||
                                                        'Unknown Artist'}
                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="artevora-exhibition-works-empty">

                                <p>
                                    No works have been added to
                                    this exhibition yet.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </section>


            {/* 05 — VISITOR INFORMATION */}

            <section className="artevora-exhibition-visitor-information">

                <div className="artevora-exhibition-section-inner">

                    <div className="artevora-exhibition-section-label">
                        <p>VISITOR INFORMATION</p>
                    </div>


                    <div className="artevora-exhibition-visitor-content">

                        {exhibition.address && (
                            <div>
                                <span>ADDRESS</span>

                                <p>
                                    {exhibition.address}
                                </p>
                            </div>
                        )}


                        {exhibition.openingTimes && (
                            <div>
                                <span>OPENING TIMES</span>

                                <p>
                                    {exhibition.openingTimes}
                                </p>
                            </div>
                        )}


                        {exhibition.visitorInformation && (
                            <div>
                                <span>VISITOR INFORMATION</span>

                                <p>
                                    {exhibition.visitorInformation}
                                </p>
                            </div>
                        )}

                    </div>

                </div>

            </section>


            {/* 06 — VIDEO */}

            {exhibition.video?.url && (
                <section className="artevora-exhibition-video">

                    <div className="artevora-exhibition-section-inner">

                        <div className="artevora-exhibition-section-label">
                            <span>06</span>
                            <p>EXHIBITION VIDEO</p>
                        </div>


                        <div className="artevora-exhibition-video-content">

                            {exhibition.video.title && (
                                <h2>
                                    {exhibition.video.title}
                                </h2>
                            )}

                            <div className="artevora-exhibition-video-frame">

                                <iframe
                                    src={
                                        exhibition.video.url
                                    }
                                    title={
                                        exhibition.video.title ||
                                        exhibition.title
                                    }
                                    allowFullScreen
                                />

                            </div>

                        </div>

                    </div>

                </section>
            )}
{/* VIRTUAL TOUR ENTRY */}



            {/* BOTTOM NAVIGATION */}

            <section className="artevora-exhibition-bottom-navigation">

                <button
                    type="button"
                    onClick={() =>
                        navigate('/exhibitions')
                    }
                >
                    ← Back to Exhibitions
                </button>

            </section>

        </main>
    )
}

export default ExhibitionDetails