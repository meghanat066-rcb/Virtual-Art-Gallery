import { useEffect, useState } from 'react'
import {
    useNavigate,
    useParams,
} from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'
import './AdminVirtualRoom.css'

function AdminVirtualRoomCreate() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditMode = Boolean(id)

    const [title, setTitle] = useState('')
    
    const [description, setDescription] = useState('')
    const [coverImage, setCoverImage] = useState(null)
    const [welcomeBackgroundImage, setWelcomeBackgroundImage] = useState(null)
    const [status, setStatus] = useState('draft')

    const [existingCoverImage, setExistingCoverImage] = useState('')
    const [existingWelcomeBackgroundImage, setExistingWelcomeBackgroundImage] = useState('')

    const [artists, setArtists] = useState([
        {
            name: '',
            profileImage: '',
            biography: '',
            artistStatement: '',
            year: '',
        },
    ])

    const [artworks, setArtworks] = useState([
        {
            title: '',
            image: '',
            story: '',
            artistName: '',
            year: '',
            medium: '',
            dimensions: '',
        },
    ])

    const [loading, setLoading] = useState(false)
const [loadingRoom, setLoadingRoom] = useState(
    Boolean(id)
)
useEffect(() => {
    if (!isEditMode) {
        return
    }

    const fetchVirtualRoom = async () => {
        try {
            const response = await api.get(
    `/virtual-rooms/admin/${id}`
)
const room = response.data.virtualRoom
            if (!room) {
                toast.error('Virtual room not found.')
                navigate('/admin', {
                    state: {
                        activeSection: 'virtualRooms',
                    },
                })
                return
            }

            setTitle(room.title || '')
            setDescription(room.description || '')
            setStatus(room.status || 'draft')

            setExistingCoverImage(
                room.coverImage || ''
            )

            setExistingWelcomeBackgroundImage(
                room.welcomeBackgroundImage || ''
            )

            setArtists(
                room.artists?.length
                    ? room.artists
                    : [
                          {
                              name: '',
                              profileImage: '',
                              biography: '',
                              artistStatement: '',
                              year: '',
                          },
                      ]
            )

            setArtworks(
                room.artworks?.length
                    ? room.artworks
                    : [
                          {
                              title: '',
                              image: '',
                              story: '',
                              artistName: '',
                              year: '',
                              medium: '',
                              dimensions: '',
                          },
                      ]
            )
        } catch (error) {
            console.error(
                'Error loading virtual room:',
                error
            )

            toast.error(
                'Failed to load virtual room.'
            )
        } finally {
            setLoadingRoom(false)
        }
    }

    fetchVirtualRoom()
}, [id, isEditMode, navigate])
    // -----------------------------
    // Artist handlers
    // -----------------------------

    const addArtist = () => {
        setArtists([
            ...artists,
            {
                name: '',
                profileImage: '',
                biography: '',
                artistStatement: '',
                year: '',
            },
        ])
    }

    const removeArtist = (index) => {
        if (artists.length === 1) {
            return
        }

        setArtists(
            artists.filter((_, artistIndex) => artistIndex !== index)
        )
    }

    const updateArtist = (index, field, value) => {
        setArtists(
            artists.map((artist, artistIndex) =>
                artistIndex === index
                    ? {
                          ...artist,
                          [field]: value,
                      }
                    : artist
            )
        )
    }

    // -----------------------------
    // Artwork handlers
    // -----------------------------

    const addArtwork = () => {
        setArtworks([
            ...artworks,
            {
                title: '',
                image: '',
                story: '',
                artistName: '',
                year: '',
                medium: '',
                dimensions: '',
            },
        ])
    }

    const removeArtwork = (index) => {
        if (artworks.length === 1) {
            return
        }

        setArtworks(
            artworks.filter(
                (_, artworkIndex) => artworkIndex !== index
            )
        )
    }

    const updateArtwork = (index, field, value) => {
        setArtworks(
            artworks.map((artwork, artworkIndex) =>
                artworkIndex === index
                    ? {
                          ...artwork,
                          [field]: value,
                      }
                    : artwork
            )
        )
    }

    // -----------------------------
    // Submit
    // -----------------------------

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!title.trim()) {
            toast.error('Please enter a virtual room title.')
            return
        }

        const validArtists = artists.filter(
            (artist) => artist.name.trim()
        )

        const validArtworks = artworks.filter(
            (artwork) =>
                artwork.title.trim() &&
                artwork.image.trim() &&
                artwork.artistName.trim()
        )

        if (validArtists.length === 0) {
            toast.error(
                'Please add at least one virtual room artist.'
            )
            return
        }

        if (validArtworks.length === 0) {
            toast.error(
                'Please add at least one virtual room artwork.'
            )
            return
        }

        try {
            setLoading(true)

            const formData = new FormData()

            formData.append('title', title.trim())
            formData.append(
                'description',
                description.trim()
            )
            formData.append('status', status)

            formData.append(
    'artists',
    JSON.stringify(
        validArtists.map((artist) => ({
            ...artist,
            biography: [
                artist.biography?.trim(),
                artist.artistStatement?.trim(),
            ]
                .filter(Boolean)
                .join('\n\n'),
            year: artist.year
                ? Number(artist.year)
                : '',
        }))
    )
)

            formData.append(
                'artworks',
                JSON.stringify(
                    validArtworks.map((artwork) => ({
                        ...artwork,
                        year: artwork.year
                            ? Number(artwork.year)
                            : undefined,
                    }))
                )
            )

            if (coverImage) {
                formData.append(
                    'coverImage',
                    coverImage
                )
            }
if (welcomeBackgroundImage) {
    formData.append(
        'welcomeBackgroundImage',
        welcomeBackgroundImage
    )
}
            if (isEditMode) {
    await api.put(
        `/virtual-rooms/admin/${id}`,
        formData,
        {
            headers: {
                'Content-Type':
                    'multipart/form-data',
            },
        }
    )
} else {
    await api.post(
        '/virtual-rooms/admin',
        formData,
        {
            headers: {
                'Content-Type':
                    'multipart/form-data',
            },
        }
    )
}

            toast.success(
                'Virtual room created successfully.'
            )

            navigate('/admin', {
                state: {
                    activeSection: 'virtualRooms',
                },
            })
        } catch (error) {
            console.error(
                'Error creating virtual room:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                    'Unable to create virtual room.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-virtual-room-page">
            <div className="admin-virtual-room-container">

                {/* Page Header */}
                <div className="admin-virtual-room-header">
                    <div>
                        <span className="admin-virtual-room-eyebrow">
                            VIRTUAL EXPERIENCE
                        </span>

                        <h1>
    {isEditMode
        ? 'Edit Virtual Room'
        : 'Create Virtual Room'}
</h1>

                        <p>
                            Build an independent virtual gallery
                            environment with its own artists and
                            artworks.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-virtual-room-back"
                        onClick={() =>
                            navigate('/admin', {
                                state: {
                                    activeSection:
                                        'virtualRooms',
                                },
                            })
                        }
                    >
                        ← Back to Virtual Rooms
                    </button>
                </div>

                <form
                    className="admin-virtual-room-form"
                    onSubmit={handleSubmit}
                >

                    {/* -------------------------------- */}
                    {/* Basic Information */}
                    {/* -------------------------------- */}

                    <section className="admin-virtual-room-section">

                        <div className="admin-virtual-room-section-heading">
                            <div>
                                <span>
                                    01
                                </span>

                                <h2>
                                    Room Information
                                </h2>
                            </div>

                            <p>
                                Define the identity and
                                presentation of this virtual
                                room.
                            </p>
                        </div>

                        <div className="admin-virtual-room-fields">

                            <div className="admin-virtual-room-field full">
                                <label>
                                    Virtual Room Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Enter virtual room title"
                                />
                            </div>

                            <div className="admin-virtual-room-field full">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Describe the virtual room experience..."
                                    rows="5"
                                />
                            </div>

                            <div className="admin-virtual-room-field">
    <label>Cover Image</label>

    {isEditMode && existingCoverImage && (
        <div className="admin-virtual-room-existing-image">
            <img
                src={existingCoverImage}
                alt="Current cover"
            />
            <small>Current cover image</small>
        </div>
    )}

    <input
        type="file"
        accept="image/*"
        onChange={(event) =>
            setCoverImage(
                event.target.files?.[0] || null
            )
        }
    />

    {isEditMode && (
        <small>
            Choose a new image only if you want to replace
            the current cover image.
        </small>
    )}
</div>
<div className="admin-virtual-room-field">
    <label>Welcome Background Image</label>

    {isEditMode && existingWelcomeBackgroundImage && (
        <div className="admin-virtual-room-existing-image">
            <img
                src={existingWelcomeBackgroundImage}
                alt="Current welcome background"
            />
            <small>Current welcome background</small>
        </div>
    )}

    <input
        type="file"
        accept="image/*"
        onChange={(event) =>
            setWelcomeBackgroundImage(
                event.target.files?.[0] || null
            )
        }
    />

    {isEditMode && (
        <small>
            Choose a new image only if you want to replace
            the current welcome background.
        </small>
    )}
</div>
                            <div className="admin-virtual-room-field">
                                <label>
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="published">
                                        Published
                                    </option>
                                </select>
                            </div>

                        </div>
                    </section>

                    {/* -------------------------------- */}
                    {/* Artists */}
                    {/* -------------------------------- */}

                    <section className="admin-virtual-room-section">

                        <div className="admin-virtual-room-section-heading">
                            <div>
                                <span>
                                    02
                                </span>

                                <h2>
                                    Virtual Room Artists
                                </h2>
                            </div>

                            <p>
                                These artists belong only to this
                                virtual room.
                            </p>
                        </div>

                        <div className="admin-virtual-room-repeatable">

                            {artists.map(
                                (artist, index) => (
                                    <div
                                        className="admin-virtual-room-card"
                                        key={index}
                                    >

                                        <div className="admin-virtual-room-card-header">

                                            <div>
                                                <span>
                                                    Artist{' '}
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}
                                                </span>

                                                <h3>
                                                    Artist
                                                    Information
                                                </h3>
                                            </div>

                                            {artists.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    className="admin-virtual-room-remove"
                                                    onClick={() =>
                                                        removeArtist(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            )}

                                        </div>

                                        <div className="admin-virtual-room-fields">

                                            <div className="admin-virtual-room-field">
                                                <label>
                                                    Artist Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artist.name
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtist(
                                                            index,
                                                            'name',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                     placeholder="Write the complete artist biography, including background, artistic journey, style, themes, influences, career, and legacy..."
    rows="8"
                                                />
                                            </div>
<div className="admin-virtual-room-field">
    <label>
        Year
    </label>

    <input
        type="number"
        value={
            artist.year
        }
        onChange={(
            event
        ) =>
            updateArtist(
                index,
                'year',
                event
                    .target
                    .value
            )
        }
        placeholder="1954"
    />
</div>
                                            <div className="admin-virtual-room-field">
                                                <label>
                                                    Profile Image URL
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artist.profileImage
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtist(
                                                            index,
                                                            'profileImage',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Paste profile image URL"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field full">
                                                <label>
                                                    Biography
                                                </label>

                                                <textarea
                                                    value={
                                                        artist.biography
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtist(
                                                            index,
                                                            'biography',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Write the artist biography..."
                                                    rows="4"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field full">
                                                <label>
                                                    Artist Statement
                                                </label>

                                                <textarea
                                                    value={
                                                        artist.artistStatement
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtist(
                                                            index,
                                                            'artistStatement',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Add an artist statement..."
                                                    rows="4"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                        <button
                            type="button"
                            className="admin-virtual-room-add"
                            onClick={addArtist}
                        >
                            + Add Another Artist
                        </button>

                    </section>

                    {/* -------------------------------- */}
                    {/* Artworks */}
                    {/* -------------------------------- */}

                    <section className="admin-virtual-room-section">

                        <div className="admin-virtual-room-section-heading">
                            <div>
                                <span>
                                    03
                                </span>

                                <h2>
                                    Virtual Room Artworks
                                </h2>
                            </div>

                            <p>
                                Add artworks specifically created
                                for this virtual experience.
                            </p>
                        </div>

                        <div className="admin-virtual-room-repeatable">

                            {artworks.map(
                                (artwork, index) => (
                                    <div
                                        className="admin-virtual-room-card"
                                        key={index}
                                    >

                                        <div className="admin-virtual-room-card-header">

                                            <div>
                                                <span>
                                                    Artwork{' '}
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}
                                                </span>

                                                <h3>
                                                    Artwork
                                                    Information
                                                </h3>
                                            </div>

                                            {artworks.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    className="admin-virtual-room-remove"
                                                    onClick={() =>
                                                        removeArtwork(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            )}

                                        </div>

                                        <div className="admin-virtual-room-fields">

                                            <div className="admin-virtual-room-field">
                                                <label>
                                                    Artwork Title
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artwork.title
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'title',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter artwork title"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field">
                                                <label>
                                                    Artist Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artwork.artistName
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'artistName',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Enter artist name"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field full">
                                                <label>
                                                    Artwork Image URL
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artwork.image
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'image',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Paste artwork image URL"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field">
                                                <label>
                                                    Year
                                                </label>

                                                <input
                                                    type="number"
                                                    value={
                                                        artwork.year
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'year',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="2026"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field">
                                                <label>
                                                    Medium
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artwork.medium
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'medium',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Oil on canvas"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field full">
                                                <label>
                                                    Dimensions
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        artwork.dimensions
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'dimensions',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="100 × 80 cm"
                                                />
                                            </div>

                                            <div className="admin-virtual-room-field full">
                                                <label>
                                                    Artwork Story
                                                </label>

                                                <textarea
                                                    value={
                                                        artwork.story
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArtwork(
                                                            index,
                                                            'story',
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Tell the story behind this artwork..."
                                                    rows="5"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                        <button
                            type="button"
                            className="admin-virtual-room-add"
                            onClick={addArtwork}
                        >
                            + Add Another Artwork
                        </button>

                    </section>

                    {/* -------------------------------- */}
                    {/* Actions */}
                    {/* -------------------------------- */}

                    <div className="admin-virtual-room-actions">

                        <button
                            type="button"
                            className="admin-virtual-room-cancel"
                            onClick={() =>
                                navigate('/admin', {
                                    state: {
                                        activeSection:
                                            'virtualRooms',
                                    },
                                })
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="admin-virtual-room-submit"
                            disabled={loading}
                        >
                            {loading
    ? isEditMode
        ? 'Saving Changes...'
        : 'Creating Virtual Room...'
    : isEditMode
        ? 'Save Changes'
        : 'Create Virtual Room'}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default AdminVirtualRoomCreate