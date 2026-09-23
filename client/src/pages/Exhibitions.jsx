import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Exhibitions.css'

function Exhibitions() {
    const navigate = useNavigate()

    const [exhibitions, setExhibitions] = useState([])
    const [activeFilter, setActiveFilter] = useState('current')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    '/exhibitions'
                )

                setExhibitions(
                    response.data.exhibitions || []
                )
            } catch (err) {
                console.error(
                    'Error loading exhibitions:',
                    err
                )

                setError(
                    err.response?.data?.message ||
                    'Unable to load exhibitions.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchExhibitions()
    }, [])

    const getExhibitionCategory = (exhibition) => {
    if (
        exhibition.exhibitionType === 'virtual'
    ) {
        return 'virtual'
    }

    const today = new Date()

    const startDate = exhibition.startDate
        ? new Date(exhibition.startDate)
        : null

    const endDate = exhibition.endDate
        ? new Date(exhibition.endDate)
        : null

    if (
        startDate &&
        endDate &&
        today >= startDate &&
        today <= endDate
    ) {
        return 'current'
    }

    if (
        startDate &&
        today < startDate
    ) {
        return 'upcoming'
    }

    if (
        endDate &&
        today > endDate
    ) {
        return 'past'
    }

    return 'upcoming'
}

    const filteredExhibitions =
        exhibitions.filter((exhibition) => {
            if (activeFilter === 'virtual') {
    return (
        exhibition.exhibitionType === 'virtual'
    )
}
            return (
                getExhibitionCategory(
                    exhibition
                ) === activeFilter
            )
        })

    const formatDate = (date) => {
        if (!date) {
            return ''
        }

        return new Date(date).toLocaleDateString(
            'en-GB',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        )
    }

    const getShortDescription = (
        description
    ) => {
        if (!description) {
            return ''
        }

        if (description.length <= 150) {
            return description
        }

        return `${description.substring(
            0,
            150
        )}...`
    }

    return (
        <main className="artevora-exhibitions-page">

            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <section className="artevora-exhibitions-header">

                <span>
                    ARTEVORA GALLERY
                </span>

                <h1>
                    EXHIBITIONS
                </h1>

            </section>


            {/* =========================================
                FILTER NAVIGATION
            ========================================= */}

            <nav className="artevora-exhibition-filters">

                {[
                    {
                        key: 'current',
                        label: 'Current'
                    },
                    {
                        key: 'upcoming',
                        label: 'Upcoming'
                    },
                    {
                        key: 'past',
                        label: 'Past'
                    },
                    {
                        key: 'virtual',
                        label: 'Virtual'
                    }
                ].map((filter) => (

                    <button
                        key={filter.key}
                        type="button"
                        className={
                            activeFilter ===
                            filter.key
                                ? 'active'
                                : ''
                        }
                        onClick={() =>
                            setActiveFilter(
                                filter.key
                            )
                        }
                    >
                        {filter.label}
                    </button>

                ))}

            </nav>


            {/* =========================================
                LOADING
            ========================================= */}

            {loading && (
                <div className="artevora-exhibitions-message">
                    Loading exhibitions...
                </div>
            )}


            {/* =========================================
                ERROR
            ========================================= */}

            {!loading && error && (
                <div className="artevora-exhibitions-message error">
                    {error}
                </div>
            )}


            {/* =========================================
                EMPTY
            ========================================= */}

            {!loading &&
                !error &&
                filteredExhibitions.length ===
                    0 && (

                <div className="artevora-exhibitions-empty">

                    <h2>
                        No exhibitions found
                    </h2>

                    <p>
                        There are no exhibitions in
                        this category at the moment.
                    </p>

                </div>
            )}


            {/* =========================================
                EXHIBITION GRID
            ========================================= */}

            {!loading &&
                !error &&
                filteredExhibitions.length >
                    0 && (

                <section className="artevora-exhibitions-grid">

                    {filteredExhibitions.map(
                        (exhibition) => (

                        <article
                            key={exhibition._id}
                            className="artevora-exhibition-card"
                        >

                            {/* COVER */}

                            <div className="artevora-exhibition-card-image">

                                {exhibition.coverImage ? (
                                    <img
                                        src={
                                            exhibition.coverImage
                                        }
                                        alt={
                                            exhibition.title
                                        }
                                    />
                                ) : (
                                    <div className="artevora-exhibition-card-placeholder">
                                        ARTEVORA
                                    </div>
                                )}

                            </div>


                            {/* INFORMATION */}

                            <div className="artevora-exhibition-card-content">

                                <h2>
                                    {exhibition.title}
                                </h2>

                                <div className="artevora-exhibition-card-dates">

                                    {formatDate(
                                        exhibition.startDate
                                    )}

                                    <span>
                                        —
                                    </span>

                                    {formatDate(
                                        exhibition.endDate
                                    )}

                                </div>


                                {exhibition.location && (
                                    <p className="artevora-exhibition-card-location">
                                        {exhibition.location}
                                    </p>
                                )}


                                {exhibition.description && (
                                    <p className="artevora-exhibition-card-description">
                                        {getShortDescription(
                                            exhibition.description
                                        )}
                                    </p>
                                )}


                                <button
                                    type="button"
                                    className="artevora-view-exhibition-button"
                                    onClick={() =>
                                        navigate(
                                            `/exhibitions/${exhibition._id}`
                                        )
                                    }
                                >
                                    VIEW EXHIBITION
                                </button>

                            </div>

                        </article>

                    ))}
                </section>
            )}

        </main>
    )
}

export default Exhibitions