import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import './ExhibitionAdmin.css'

function ExhibitionAdmin() {
    const navigate = useNavigate()

    const user = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        exhibitionType: 'current',
        description: '',
        exhibitionPurpose: '',
        coverImage: null,
        overviewImage: null,
        startDate: '',
        endDate: '',
        location: '',
        address: '',
        openingTimes: '',
        visitorInformation: '',
        status: 'draft',
        featured: false
    })

    const [installationImages, setInstallationImages] =
        useState([])

    const [saving, setSaving] = useState(false)

    const [artworks, setArtworks] = useState([])
    const [artworksLoading, setArtworksLoading] =
        useState(false)

    const [selectedArtworks, setSelectedArtworks] =
        useState([])

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/')
        }
    }, [navigate, user])

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                setArtworksLoading(true)

                const response = await api.get(
                    '/artworks/admin/all'
                )

                const approvedArtworks =
                    (response.data.artworks || []).filter(
                        (artwork) =>
                            artwork.status === 'approved'
                    )

                setArtworks(approvedArtworks)
            } catch (error) {
                console.error(
                    'Error loading artworks:',
                    error
                )

                toast.error(
                    'Unable to load approved artworks.'
                )
            } finally {
                setArtworksLoading(false)
            }
        }

        if (user?.role === 'admin') {
            fetchArtworks()
        }
    }, [])

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
            files
        } = event.target

        if (type === 'file') {
            setForm((currentForm) => ({
                ...currentForm,
                [name]: files?.[0] || null
            }))

            return
        }

        setForm((currentForm) => ({
            ...currentForm,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value
        }))
    }

    const handleInstallationImagesChange = (
        event
    ) => {
        const files = Array.from(
            event.target.files || []
        )

        setInstallationImages(files)
    }

    const removeInstallationImage = (index) => {
        setInstallationImages(
            (currentImages) =>
                currentImages.filter(
                    (_, imageIndex) =>
                        imageIndex !== index
                )
        )
    }

    const toggleArtwork = (artworkId) => {
        setSelectedArtworks(
            (currentSelected) => {
                if (
                    currentSelected.includes(
                        artworkId
                    )
                ) {
                    return currentSelected.filter(
                        (id) =>
                            id !== artworkId
                    )
                }

                return [
                    ...currentSelected,
                    artworkId
                ]
            }
        )
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!form.title.trim()) {
            toast.error(
                'Exhibition title is required.'
            )
            return
        }

        if (
            !form.startDate ||
            !form.endDate
        ) {
            toast.error(
                'Please select exhibition dates.'
            )
            return
        }

        if (
            new Date(form.endDate) <
            new Date(form.startDate)
        ) {
            toast.error(
                'End date cannot be earlier than start date.'
            )
            return
        }

        try {
            setSaving(true)

            const formData = new FormData()

            formData.append(
                'title',
                form.title.trim()
            )

            formData.append(
                'subtitle',
                form.subtitle.trim()
            )

            formData.append(
                'exhibitionPurpose',
                form.exhibitionPurpose.trim()
            )

            formData.append(
                'description',
                form.description.trim()
            )

            formData.append(
                'startDate',
                form.startDate
            )

            formData.append(
                'endDate',
                form.endDate
            )

            formData.append(
                'location',
                form.location.trim()
            )

            formData.append(
                'address',
                form.address.trim()
            )

            formData.append(
                'openingTimes',
                form.openingTimes.trim()
            )

            formData.append(
                'visitorInformation',
                form.visitorInformation.trim()
            )

            formData.append(
                'status',
                form.status
            )

            formData.append(
                'exhibitionType',
                form.exhibitionType
            )

            formData.append(
                'featured',
                String(form.featured)
            )

            selectedArtworks.forEach(
                (artworkId) => {
                    formData.append(
                        'artworks',
                        artworkId
                    )
                }
            )

            if (form.coverImage) {
                formData.append(
                    'coverImage',
                    form.coverImage
                )
            }
if (form.overviewImage) {
    formData.append(
        'overviewImage',
        form.overviewImage
    )
}
            installationImages.forEach(
                (image) => {
                    formData.append(
                        'installationShots',
                        image
                    )
                }
            )

            const response = await api.post(
                '/exhibitions/admin',
                formData,
                {
                    headers: {
                        'Content-Type':
                            'multipart/form-data'
                    }
                }
            )

            if (response.data?.success) {
                toast.success(
                    'Exhibition created successfully!'
                )

                navigate('/admin', {
                    state: {
                        activeSection:
                            'exhibitions'
                    }
                })
            }
        } catch (error) {
            console.error(
                'Error creating exhibition:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                    'Unable to create exhibition.'
            )
        } finally {
            setSaving(false)
        }
    }

    if (!user || user.role !== 'admin') {
        return null
    }

    return (
        <main className="exhibition-admin-page">

            {/* =================================
                HEADER
            ================================= */}

            <div className="exhibition-admin-header">

                <div className="exhibition-admin-header-content">

                    <div>
                        <span>
                            ARTEVORA ADMINISTRATION
                        </span>

                        <h1>
                            Create Exhibition
                        </h1>

                        <p>
                            Create and publish curated
                            exhibitions featuring
                            ArteVora artists and artworks.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="exhibition-back-button"
                        onClick={() =>
                            navigate('/admin', {
                                state: {
                                    activeSection:
                                        'exhibitions'
                                }
                            })
                        }
                    >
                        Back to Exhibitions
                    </button>

                </div>

            </div>


            <form
                className="exhibition-admin-form"
                onSubmit={handleSubmit}
            >

                {/* =================================
                    01 — BASIC INFORMATION
                ================================= */}

                <section className="exhibition-form-section">

                    <div className="exhibition-form-heading">

                        <span>01</span>

                        <div>
                            <small>
                                EXHIBITION
                            </small>

                            <h2>
                                Basic Information
                            </h2>
                        </div>

                    </div>


                    {/* TITLE */}

                    <div className="exhibition-form-field">

                        <label>
                            Exhibition Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter exhibition title"
                            disabled={saving}
                            required
                        />

                    </div>


                    {/* SUBTITLE */}

                    <div className="exhibition-form-field">

                        <label>
                            Subtitle
                        </label>

                        <input
                            type="text"
                            name="subtitle"
                            value={form.subtitle}
                            onChange={handleChange}
                            placeholder="Short supporting title"
                            disabled={saving}
                        />

                    </div>

                    <div className="exhibition-form-field">
    <label>
        Exhibition Type
    </label>

    <select
        name="exhibitionType"
        value={form.exhibitionType}
        onChange={handleChange}
        disabled={saving}
        required
    >
        <option value="current">
            Current
        </option>

        <option value="upcoming">
            Upcoming
        </option>

        <option value="past">
            Past
        </option>

        <option value="virtual">
            Virtual
        </option>
    </select>

    <small>
        Choose Virtual for the exhibition that should open from the Virtual Tour menu.
    </small>
</div>


                    {/* COVER IMAGE */}

                    <div className="exhibition-form-field">

                        <label>
                            Exhibition Cover Image
                        </label>

                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <small>
                            Upload the main image that
                            represents this exhibition.
                        </small>

                    </div>
{/* OVERVIEW IMAGE */}

<div className="exhibition-form-field">

    <label>
        Exhibition Overview Image
    </label>

    <input
        type="file"
        name="overviewImage"
        accept="image/*"
        onChange={handleChange}
        disabled={saving}
    />

    <small>
        Upload a separate image to appear
        beside the exhibition overview.
    </small>

</div>

                    {/* PURPOSE */}

                    <div className="exhibition-form-field">

                        <label>
                            Why Does This Exhibition Exist?
                        </label>

                        <textarea
                            name="exhibitionPurpose"
                            value={
                                form.exhibitionPurpose
                            }
                            onChange={handleChange}
                            placeholder="Explain the purpose, intention, or central idea behind this exhibition..."
                            rows="5"
                            disabled={saving}
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="exhibition-form-field">

                        <label>
                            What is This Exhibition About?
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Explain what the exhibition explores, communicates, or presents..."
                            rows="6"
                            disabled={saving}
                        />

                    </div>

                </section>


                {/* =================================
                    02 — EXHIBITION PERIOD
                ================================= */}

                <section className="exhibition-form-section">

                    <div className="exhibition-form-heading">

                        <span>02</span>

                        <div>
                            <small>
                                DATES
                            </small>

                            <h2>
                                Exhibition Period
                            </h2>
                        </div>

                    </div>


                    <div className="exhibition-form-row">

                        <div className="exhibition-form-field">

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    form.startDate
                                }
                                onChange={handleChange}
                                disabled={saving}
                                required
                            />

                        </div>


                        <div className="exhibition-form-field">

                            <label>
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={
                                    form.endDate
                                }
                                onChange={handleChange}
                                disabled={saving}
                                required
                            />

                        </div>

                    </div>

                </section>


                {/* =================================
                    03 — LOCATION & VISITOR INFO
                ================================= */}

                <section className="exhibition-form-section">

                    <div className="exhibition-form-heading">

                        <span>03</span>

                        <div>
                            <small>
                                VENUE
                            </small>

                            <h2>
                                Location & Visitor
                                Information
                            </h2>
                        </div>

                    </div>


                    {/* LOCATION */}

                    <div className="exhibition-form-field">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="ArteVora Gallery"
                            disabled={saving}
                        />

                    </div>


                    {/* ADDRESS */}

                    <div className="exhibition-form-field">

                        <label>
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Gallery address"
                            disabled={saving}
                        />

                    </div>


                    {/* OPENING TIMES */}

                    <div className="exhibition-form-field">

                        <label>
                            Opening Times
                        </label>

                        <input
                            type="text"
                            name="openingTimes"
                            value={
                                form.openingTimes
                            }
                            onChange={handleChange}
                            placeholder="Monday – Saturday, 10 AM – 6 PM"
                            disabled={saving}
                        />

                    </div>


                    {/* VISITOR INFORMATION */}

                    <div className="exhibition-form-field">

                        <label>
                            Visitor Information
                        </label>

                        <textarea
                            name="visitorInformation"
                            value={
                                form.visitorInformation
                            }
                            onChange={handleChange}
                            placeholder="Additional information for visitors..."
                            rows="5"
                            disabled={saving}
                        />

                    </div>

                </section>


                {/* =================================
                    04 — EXHIBITION WORKS
                ================================= */}

                <section className="exhibition-form-section">

                    <div className="exhibition-form-heading">

                        <span>04</span>

                        <div>
                            <small>
                                EXHIBITION WORKS
                            </small>

                            <h2>
                                Select Artworks
                            </h2>
                        </div>

                    </div>


                    <p className="exhibition-form-section-description">
                        Select the approved artworks that
                        will be presented as part of this
                        exhibition.
                    </p>


                    {artworksLoading && (
                        <p className="exhibition-artwork-loading">
                            Loading approved artworks...
                        </p>
                    )}


                    {!artworksLoading &&
                        artworks.length === 0 && (
                            <p className="exhibition-artwork-empty">
                                No approved artworks are
                                available.
                            </p>
                        )}


                    {!artworksLoading &&
                        artworks.length > 0 && (

                            <div className="exhibition-artwork-selection">

                                {artworks.map(
                                    (artwork) => {

                                        const isSelected =
                                            selectedArtworks.includes(
                                                artwork._id
                                            )

                                        return (
                                            <button
                                                type="button"
                                                key={
                                                    artwork._id
                                                }
                                                className={`exhibition-artwork-option ${
                                                    isSelected
                                                        ? 'selected'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    toggleArtwork(
                                                        artwork._id
                                                    )
                                                }
                                            >

                                                <div className="exhibition-artwork-option-image">
    {artwork.image ? (
        <img
            src={artwork.image}
            alt={artwork.title}
        />
    ) : (
        <div>AV</div>
    )}
</div>

                                                <div className="exhibition-artwork-option-details">

                                                    <strong>
                                                        {
                                                            artwork.title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            artwork.artistName ||
                                                            artwork
                                                                .uploadedBy
                                                                ?.name ||
                                                            'Unknown Artist'
                                                        }
                                                    </span>

                                                </div>


                                                <div className="exhibition-artwork-option-check">

                                                    {isSelected
                                                        ? '✓'
                                                        : '+'}

                                                </div>

                                            </button>
                                        )
                                    }
                                )}

                            </div>
                        )}


                    <small className="exhibition-artwork-selection-count">

                        {selectedArtworks.length}{' '}
                        artwork
                        {selectedArtworks.length !==
                        1
                            ? 's'
                            : ''}{' '}
                        selected

                    </small>

                </section>


                {/* =================================
                    05 — INSTALLATION VIEWS
                ================================= */}

                <section className="exhibition-form-section">

                    <div className="exhibition-form-heading">

                        <span>05</span>

                        <div>
                            <small>
                                INSTALLATION VIEWS
                            </small>

                            <h2>
                                Installation Images
                            </h2>
                        </div>

                    </div>


                    <p className="exhibition-form-section-description">
                        Upload photographs showing the
                        physical installation of the
                        exhibition. These are separate from
                        the artworks selected above.
                    </p>


                    <div className="exhibition-form-field">

                        <label>
                            Upload Installation Views
                        </label>

                        <input
                            type="file"
                            name="installationShots"
                            accept="image/*"
                            multiple
                            onChange={
                                handleInstallationImagesChange
                            }
                            disabled={saving}
                        />

                        <small>
                            You can select multiple
                            installation photographs.
                        </small>

                    </div>


                    {/* SELECTED INSTALLATION IMAGES */}

                    {installationImages.length >
                        0 && (

                        <div className="exhibition-installation-preview">

                            <div className="exhibition-installation-preview-header">

                                <strong>
                                    {
                                        installationImages.length
                                    }{' '}
                                    image
                                    {
                                        installationImages.length !==
                                        1
                                            ? 's'
                                            : ''
                                    }{' '}
                                    selected
                                </strong>

                            </div>


                            <div className="exhibition-installation-preview-grid">

                                {installationImages.map(
                                    (
                                        image,
                                        index
                                    ) => (

                                        <div
                                            className="exhibition-installation-preview-item"
                                            key={`${image.name}-${index}`}
                                        >

                                            <img
                                                src={URL.createObjectURL(
                                                    image
                                                )}
                                                alt={`Installation view ${
                                                    index +
                                                    1
                                                }`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeInstallationImage(
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    saving
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </section>


                {/* =================================
                    06 — PUBLISHING
                ================================= */}

                <section className="exhibition-form-section">

                    <div className="exhibition-form-heading">

                        <span>06</span>

                        <div>
                            <small>
                                VISIBILITY
                            </small>

                            <h2>
                                Publishing
                            </h2>
                        </div>

                    </div>


                    <div className="exhibition-publishing-options">

                        {/* DRAFT */}

                        <label className="exhibition-radio-option">

                            <input
                                type="radio"
                                name="status"
                                value="draft"
                                checked={
                                    form.status ===
                                    'draft'
                                }
                                onChange={handleChange}
                                disabled={saving}
                            />

                            <span>

                                <strong>
                                    Draft
                                </strong>

                                <small>
                                    Keep the exhibition
                                    hidden until it is
                                    ready.
                                </small>

                            </span>

                        </label>


                        {/* PUBLISHED */}

                        <label className="exhibition-radio-option">

                            <input
                                type="radio"
                                name="status"
                                value="published"
                                checked={
                                    form.status ===
                                    'published'
                                }
                                onChange={handleChange}
                                disabled={saving}
                            />

                            <span>

                                <strong>
                                    Published
                                </strong>

                                <small>
                                    Make the exhibition
                                    visible to visitors.
                                </small>

                            </span>

                        </label>

                    </div>


                    {/* FEATURED */}

                    <label className="exhibition-featured-option">

                        <input
                            type="checkbox"
                            name="featured"
                            checked={
                                form.featured
                            }
                            onChange={handleChange}
                            disabled={saving}
                        />

                        <span>
                            Feature this exhibition
                            on the exhibitions page.
                        </span>

                    </label>


                    {/* CREATE */}

                    <button
                        type="submit"
                        className="exhibition-create-button"
                        disabled={saving}
                    >
                        {saving
                            ? 'Creating Exhibition...'
                            : 'Create Exhibition'}
                    </button>

                </section>

            </form>

        </main>
    )
}

export default ExhibitionAdmin