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
    `/exhibitions/admin/${id}`
)
                setExhibition(
                    response.data.exhibition
                )
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

                    <h2>
                        Exhibition unavailable
                    </h2>

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

    return (
        <main className="artevora-exhibition-details-page">


            {/* EXHIBITION SECTION NAVIGATION */}

<nav className="artevora-exhibition-section-nav">

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


{/* EXHIBITION INFORMATION */}

<section className="artevora-exhibition-introduction">

    <div className="artevora-exhibition-introduction-label">
        <span>
            EXHIBITION
        </span>
    </div>

    <div className="artevora-exhibition-introduction-content">

        <h1>
            {exhibition.title}
        </h1>

        {exhibition.subtitle && (
            <p className="artevora-exhibition-subtitle">
                {exhibition.subtitle}
            </p>
        )}

        <div className="artevora-exhibition-meta">

            <div>
                <span>DATES</span>

                <strong>
                    {formatDate(exhibition.startDate)}
                    {' — '}
                    {formatDate(exhibition.endDate)}
                </strong>
            </div>

            {exhibition.location && (
                <div>
                    <span>VENUE</span>

                    <strong>
                        {exhibition.location}
                    </strong>
                </div>
            )}

        </div>

    </div>

</section>

{/* OVERVIEW */}

<section
    id="exhibition-overview"
    className="artevora-exhibition-overview"
>
    <div className="artevora-exhibition-section-inner">

        <div className="artevora-exhibition-section-label">
            <span>01</span>
            <p>OVERVIEW</p>
        </div>

        <div className="artevora-exhibition-overview-content">

            <div className="artevora-exhibition-overview-block">
                <h2>
                    What is this exhibition about?
                </h2>

                <p>
                    {exhibition.description ||
                        'This exhibition brings together a selected group of works presented as part of the ArteVora Gallery programme.'}
                </p>
            </div>


            <div className="artevora-exhibition-overview-block">
                <h2>
                    Why does this exhibition exist?
                </h2>

                <p>
                    This exhibition creates a space for artists
                    and audiences to experience a shared artistic
                    theme through a carefully selected presentation
                    of works.
                </p>
            </div>

        </div>

    </div>
</section>

{/* INSTALLATION VIEWS */}

<section
    id="exhibition-installation"
    className="artevora-exhibition-installation"
>
    <div className="artevora-exhibition-section-inner">

        <div className="artevora-exhibition-section-label">
            <span>02</span>
            <p>INSTALLATION VIEWS</p>
        </div>

        <div className="artevora-installation-content">

            {exhibition.installationShots &&
            exhibition.installationShots.length > 0 ? (

                <div className="artevora-installation-gallery">

                    <div className="artevora-installation-viewer">

                        <button
                            type="button"
                            className="artevora-installation-arrow artevora-installation-arrow-left"
                            onClick={() =>
                                setInstallationIndex(
                                    (currentIndex) =>
                                        currentIndex === 0
                                            ? exhibition.installationShots.length - 1
                                            : currentIndex - 1
                                )
                            }
                            aria-label="Previous installation view"
                        >
                            ←
                        </button>


                        <div className="artevora-installation-image-wrap">

                            <img
                                src={
                                    exhibition
                                        .installationShots[
                                        installationIndex
                                    ].image
                                }
                                alt={`${exhibition.title} installation view ${
                                    installationIndex + 1
                                }`}
                            />

                        </div>


                        <button
                            type="button"
                            className="artevora-installation-arrow artevora-installation-arrow-right"
                            onClick={() =>
                                setInstallationIndex(
                                    (currentIndex) =>
                                        currentIndex ===
                                        exhibition.installationShots.length - 1
                                            ? 0
                                            : currentIndex + 1
                                )
                            }
                            aria-label="Next installation view"
                        >
                            →
                        </button>

                    </div>


                    <div className="artevora-installation-indicators">

                        {exhibition.installationShots.map(
                            (_, index) => (

                                <button
                                    type="button"
                                    key={index}
                                    className={
                                        index ===
                                        installationIndex
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setInstallationIndex(
                                            index
                                        )
                                    }
                                    aria-label={`View installation image ${
                                        index + 1
                                    }`}
                                />

                            )
                        )}

                    </div>

                </div>

            ) : (

                <div className="artevora-installation-empty">

                    <p>
                        Installation views will be available
                        soon.
                    </p>

                </div>

            )}

        </div>

    </div>
</section>


{/* WORKS */}

<section
    id="exhibition-works"
    className="artevora-exhibition-works"
>
    <div className="artevora-exhibition-section-inner">

        <div className="artevora-exhibition-section-label">
            <span>03</span>
            <p>WORKS</p>
        </div>

        <div className="artevora-exhibition-works-content">

            <div className="artevora-exhibition-works-intro">
                <h2>
                    Selected Works
                </h2>

                <p>
                    Works presented as part of this exhibition.
                </p>
            </div>


            {exhibitionArtworks.length > 0 ? (

                <div className="artevora-exhibition-works-grid">

                    {exhibitionArtworks.map((artwork) => (

                        <article
                            className="artevora-exhibition-work"
                            key={artwork._id}
                        >

                            <div className="artevora-exhibition-work-image">

                                {artwork.image ? (

                                    <img
                                        src={artwork.image}
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

                    ))}

                </div>

            ) : (

                <div className="artevora-exhibition-works-empty">

                    <p>
                        No works have been added to this
                        exhibition yet.
                    </p>

                </div>

            )}

        </div>

    </div>
</section>


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