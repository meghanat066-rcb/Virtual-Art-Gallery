import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    FaArrowLeft,
    FaSave,
    FaImage
} from 'react-icons/fa'

import api from '../services/api'
import './EditArtwork.css'

function EditArtwork() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
    title: '',
    description: '',
    story: '',
    category: '',
    medium: '',
    year: '',
    dimensions: '',
    orientation: 'Portrait',
    framed: 'Yes',
    shipsFrom: 'India',
    availability: 'Available',
    artistName: '',
    price: ''
})

    const [image, setImage] = useState('')
const [newImage, setNewImage] = useState(null)
const [imagePreview, setImagePreview] = useState('')

const [replicaAvailable, setReplicaAvailable] =
    useState(false)

const [replicaPrices, setReplicaPrices] = useState({
    small: '',
    medium: '',
    large: '',
    xl: ''
})

const [replicaSelected, setReplicaSelected] =
    useState({
        small: false,
        medium: false,
        large: false,
        xl: false
    })

const [replicaImage, setReplicaImage] = useState('')
const [newReplicaImage, setNewReplicaImage] = useState(null)
const [replicaPreview, setReplicaPreview] = useState('')
    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )


    useEffect(() => {

        if (!user || user.role !== 'artist') {
            navigate('/login')
            return
        }

        fetchArtwork()

    }, [id, navigate, user])


    const fetchArtwork = async () => {

        try {

            setLoading(true)

            /*
             * My Artworks contains both pending and approved
             * artworks, so we use the artist's artwork list
             * instead of /artworks/:id because that route only
             * returns approved artworks.
             */

            const response = await api.get(
                '/artworks/my-artworks'
            )

            if (!response.data?.success) {
                throw new Error('Unable to load artwork')
            }

            const artwork = response.data.artworks.find(
                (item) => item._id === id
            )

            if (!artwork) {
                toast.error('Artwork not found.')
                navigate('/my-artworks')
                return
            }

            setForm({
    title: artwork.title || '',
    description: artwork.description || '',
    story: artwork.story || '',
    category: artwork.category || '',
    medium: artwork.medium || '',
    year: artwork.year || '',
    dimensions: artwork.dimensions || '',
    orientation: artwork.orientation || 'Portrait',
    framed: artwork.framed || 'Yes',
    shipsFrom: artwork.shipsFrom || 'India',
    availability: artwork.availability || 'Available',
    artistName: artwork.artistName || '',
    price:
        artwork.price !== null &&
        artwork.price !== undefined
            ? artwork.price
            : ''
})

           setImage(artwork.image || '')
setImagePreview(artwork.image || '')

setReplicaAvailable(artwork.replicaAvailable || false)

setReplicaPrices({
    small: artwork.replicaPrices?.small?.price || '',
    medium: artwork.replicaPrices?.medium?.price || '',
    large: artwork.replicaPrices?.large?.price || '',
    xl: artwork.replicaPrices?.xl?.price || ''
})

setReplicaSelected({
    small: artwork.replicaPrices?.small?.available || false,
    medium: artwork.replicaPrices?.medium?.available || false,
    large: artwork.replicaPrices?.large?.available || false,
    xl: artwork.replicaPrices?.xl?.available || false
})

setReplicaImage(artwork.replicaImage || '')
setReplicaPreview(artwork.replicaImage || '')

        } catch (error) {

            console.error(
                'Error loading artwork:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to load artwork.'
            )

        } finally {

            setLoading(false)

        }
    }


    const handleChange = (event) => {

        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }

    const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid artwork image file.')
        return
    }

    if (file.size > 10 * 1024 * 1024) {
        toast.error('Artwork image must be less than 10 MB.')
        return
    }

    setNewImage(file)

    const imageUrl = URL.createObjectURL(file)
    setImagePreview(imageUrl)
}

    const handleReplicaImageChange = (event) => {

    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid replica image file.')
        return
    }

    if (file.size > 10 * 1024 * 1024) {
        toast.error('Replica image must be less than 10 MB.')
        return
    }

    setNewReplicaImage(file)

    const imageUrl = URL.createObjectURL(file)

    setReplicaPreview(imageUrl)
}


    const handleSubmit = async (event) => {

        event.preventDefault()

        try {

            setSaving(true)

            const formData = new FormData()

formData.append('title', form.title)
formData.append('description', form.description)
formData.append('story', form.story)
formData.append('category', form.category)
formData.append('medium', form.medium)
formData.append('year', form.year)
formData.append('dimensions', form.dimensions)
formData.append('orientation', form.orientation)
formData.append('framed', form.framed)
formData.append('shipsFrom', form.shipsFrom)
formData.append('availability', form.availability)
formData.append('artistName', form.artistName)

formData.append('price', form.price)

/* REPLICA DETAILS */

formData.append(
    'replicaAvailable',
    replicaAvailable
)

const replicaData = {
    small: replicaSelected.small
        ? {
            price: Number(replicaPrices.small),
            available: true
        }
        : {
            price: null,
            available: false
        },

    medium: replicaSelected.medium
        ? {
            price: Number(replicaPrices.medium),
            available: true
        }
        : {
            price: null,
            available: false
        },

    large: replicaSelected.large
        ? {
            price: Number(replicaPrices.large),
            available: true
        }
        : {
            price: null,
            available: false
        },

    xl: replicaSelected.xl
        ? {
            price: Number(replicaPrices.xl),
            available: true
        }
        : {
            price: null,
            available: false
        }
}

formData.append(
    'replicaPrices',
    JSON.stringify(replicaData)
)

if (newImage) {
    formData.append('image', newImage)
}

if (newReplicaImage) {
    formData.append('replicaImage', newReplicaImage)
}

const response = await api.patch(
    `/artworks/${id}`,
    formData
)

            if (response.data?.success) {

                toast.success(
                    response.data.message ||
                    'Artwork updated successfully.'
                )

                setTimeout(() => {
                    navigate('/my-artworks')
                }, 800)
            }

        } catch (error) {

            console.error(
                'Error updating artwork:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to update artwork.'
            )

        } finally {

            setSaving(false)

        }
    }


    if (loading) {

        return (
            <div className="edit-artwork-page">

                <div className="edit-artwork-loading">

                    <div className="edit-artwork-loader" />

                    <h2>
                        Loading Artwork
                    </h2>

                    <p>
                        Preparing your artwork details...
                    </p>

                </div>

            </div>
        )
    }


    return (
        <div className="edit-artwork-page">

            {/* TOP BAR */}

            <div className="edit-artwork-topbar">

                <button
                    type="button"
                    className="edit-artwork-back-button"
                    onClick={() =>
                        navigate('/my-artworks')
                    }
                >
                    <FaArrowLeft />
                    Back to My Artworks
                </button>

                <span>
                    ARTIST STUDIO
                </span>

            </div>


            {/* HEADER */}

            <div className="edit-artwork-header">

                <span>
                    ARTWORK MANAGEMENT
                </span>

                <h1>
                    Edit Artwork
                </h1>

                <p>
                    Update the information and details of
                    your submitted artwork.
                </p>

            </div>


            {/* FORM */}

            <form
                className="edit-artwork-form"
                onSubmit={handleSubmit}
            >

                {/* REPLICA OPTIONS */}

<section className="edit-artwork-section">

    <div className="edit-section-heading">

        <span>
            03
        </span>

        <div>
            <h2>
                Replica Options
            </h2>

            <p>
                Manage replica availability, sizes and selling prices
            </p>
        </div>

    </div>

    {/* REPLICA AVAILABILITY */}

    <div className="edit-artwork-field">

        <label>
            Replica Availability
        </label>

        <div className="edit-artwork-replica-toggle">

            <button
                type="button"
                className={!replicaAvailable ? 'active' : ''}
                onClick={() => {
                    setReplicaAvailable(false)

                    setReplicaSelected({
                        small: false,
                        medium: false,
                        large: false,
                        xl: false
                    })

                    setReplicaPrices({
                        small: '',
                        medium: '',
                        large: '',
                        xl: ''
                    })
                }}
            >
                No
            </button>

            <button
                type="button"
                className={replicaAvailable ? 'active' : ''}
                onClick={() =>
                    setReplicaAvailable(true)
                }
            >
                Yes
            </button>

        </div>

        <small>
            Choose whether customers can purchase replicas of this artwork.
        </small>

    </div>


    {/* REPLICA SIZES */}

    {replicaAvailable && (

        <div className="edit-artwork-replica-options">

            <div className="edit-artwork-replica-heading">

                <h3>
                    Available Replica Sizes
                </h3>

                <p>
                    Select the sizes customers can purchase and set their prices.
                </p>

            </div>


            {[
                {
                    key: 'small',
                    name: 'Small',
                    dimensions: '40 × 30 cm'
                },
                {
                    key: 'medium',
                    name: 'Medium',
                    dimensions: '60 × 45 cm'
                },
                {
                    key: 'large',
                    name: 'Large',
                    dimensions: '90 × 60 cm'
                },
                {
                    key: 'xl',
                    name: 'XL',
                    dimensions: '120 × 90 cm'
                }
            ].map((size) => {

                const selected =
                    replicaSelected[size.key]

                return (

                    <div
                        key={size.key}
                        className={`edit-artwork-replica-option ${
                            selected ? 'selected' : ''
                        }`}
                    >

                        <label className="edit-artwork-replica-check">

                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => {

                                    setReplicaSelected(
                                        (current) => ({
                                            ...current,
                                            [size.key]:
                                                !current[size.key]
                                        })
                                    )

                                    if (selected) {
                                        setReplicaPrices(
                                            (current) => ({
                                                ...current,
                                                [size.key]: ''
                                            })
                                        )
                                    }

                                }}
                            />

                            <span>
                                Select
                            </span>

                        </label>


                        <div className="edit-artwork-replica-info">

                            <strong>
                                {size.name}
                            </strong>

                            <span>
                                {size.dimensions}
                            </span>

                        </div>


                        <div className="edit-artwork-replica-price">

                            <label
                                htmlFor={`edit-replica-${size.key}`}
                            >
                                Price (₹)
                            </label>

                            <input
                                id={`edit-replica-${size.key}`}
                                type="number"
                                min="1"
                                value={
                                    replicaPrices[size.key]
                                }
                                onChange={(event) =>
                                    setReplicaPrices(
                                        (current) => ({
                                            ...current,
                                            [size.key]:
                                                event.target.value
                                        })
                                    )
                                }
                                disabled={!selected}
                                placeholder="Enter price"
                            />

                        </div>

                    </div>

                )
            })}

        </div>

    )}

</section>

                {/* IMAGE PREVIEW */}

                <section className="edit-artwork-section">

                    <div className="edit-section-heading">

                        <span>
                            01
                        </span>

                        <div>
                            <h2>
                                Artwork Preview
                            </h2>

                            <p>
                                Your current artwork image
                            </p>
                        </div>

                    </div>


                    <div className="edit-artwork-image-preview">
    {imagePreview ? (
        <img src={imagePreview} alt={form.title} />
    ) : (
        <div>
            <FaImage />
            <span>No image available</span>
        </div>
    )}
</div>

<div className="edit-artwork-field">
    <label htmlFor="original-image">Replace Original Artwork Image</label>
    <input
        id="original-image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
    />
    <small>
        Upload one JPG, JPEG, PNG or WEBP image. Maximum 10 MB.
    </small>
</div>
                </section>

                {/* REPLICA IMAGE */}

<section className="edit-artwork-section">

    <div className="edit-section-heading">

        <span>
            02
        </span>

        <div>
            <h2>
                Replica Image
            </h2>

            <p>
                Upload one replica image used for all available replica sizes
            </p>
        </div>

    </div>


    <div className="edit-artwork-replica-image">

        {replicaPreview ? (

            <img
                src={replicaPreview}
                alt="Replica artwork"
            />

        ) : (

            <div className="edit-artwork-no-replica">

                <FaImage />

                <span>
                    No replica image uploaded
                </span>

            </div>

        )}

    </div>


    <div className="edit-artwork-field">

        <label htmlFor="replica-image">
            Replace Replica Image
        </label>

        <input
            id="replica-image"
            type="file"
            accept="image/*"
            onChange={handleReplicaImageChange}
        />

        <small>
            Upload one JPG, JPEG, PNG or WEBP image. Maximum 10 MB.
        </small>

    </div>

</section>


                {/* BASIC INFORMATION */}

                <section className="edit-artwork-section">

                    <div className="edit-section-heading">

                        <span>
                            04
                        </span>

                        <div>
                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Update your artwork information
                            </p>
                        </div>

                    </div>


                    <div className="edit-artwork-grid">

                        <div className="edit-artwork-field full">

                            <label>
                                Artwork Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="edit-artwork-field full">

    <label htmlFor="artwork-description">
        Artwork Description
    </label>

    <textarea
        id="artwork-description"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Write a short description of the artwork..."
        rows="4"
        required
    />

</div>


                        <div className="edit-artwork-field">

                            <label>
                                Artist Name
                            </label>

                            <input
                                type="text"
                                name="artistName"
                                value={form.artistName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="edit-artwork-field">

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="edit-artwork-field">

                            <label>
                                Medium
                            </label>

                            <input
                                type="text"
                                name="medium"
                                value={form.medium}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="edit-artwork-field">

                            <label>
                                Year
                            </label>

                            <input
                                type="number"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                min="1000"
                                max={new Date().getFullYear()}
                                required
                            />

                        </div>


                        <div className="edit-artwork-field">

                            <label>
                                Dimensions
                            </label>

                            <input
                                type="text"
                                name="dimensions"
                                value={form.dimensions}
                                onChange={handleChange}
                                required
                            />

                        </div>

<div className="edit-artwork-field">

    <label>
        Orientation
    </label>

    <select
        name="orientation"
        value={form.orientation}
        onChange={handleChange}
    >
        <option value="Portrait">
            Portrait
        </option>

        <option value="Landscape">
            Landscape
        </option>

        <option value="Square">
            Square
        </option>
    </select>

</div>
<div className="edit-artwork-field">

    <label>
        Framed
    </label>

    <select
        name="framed"
        value={form.framed}
        onChange={handleChange}
    >
        <option value="Yes">
            Yes
        </option>

        <option value="No">
            No
        </option>
    </select>

</div>
<div className="edit-artwork-field">

    <label>
        Ships From
    </label>

    <input
        type="text"
        name="shipsFrom"
        value={form.shipsFrom}
        onChange={handleChange}
        required
    />

</div>
                        <div className="edit-artwork-field">

                            <label>
                                Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                min="1"
                                required
                            />

                        </div>


                        <div className="edit-artwork-field">

                            <label>
                                Availability
                            </label>

                            <select
                                name="availability"
                                value={form.availability}
                                onChange={handleChange}
                            >
                                <option value="Available">
                                    Available
                                </option>

                                <option value="Reserved">
                                    Reserved
                                </option>

                                <option value="Sold">
                                    Sold
                                </option>
                            </select>

                        </div>

                    </div>

                </section>

{/* ARTWORK STORY */}

<section className="edit-artwork-section">

    <div className="edit-section-heading">

        <span>
            05
        </span>

        <div>
            <h2>
                Story Behind the Artwork
            </h2>

            <p>
                Share the inspiration and story behind this artwork
            </p>
        </div>

    </div>

    <div className="edit-artwork-field">

        <label htmlFor="artwork-story">
            Artwork Story
        </label>

        <textarea
            id="artwork-story"
            name="story"
            value={form.story}
            onChange={handleChange}
            placeholder="Tell visitors the story or inspiration behind this artwork..."
            required
        />

    </div>

</section>
                {/* ACTIONS */}

                <div className="edit-artwork-actions">

                    <button
                        type="button"
                        className="edit-artwork-cancel-button"
                        onClick={() =>
                            navigate('/my-artworks')
                        }
                        disabled={saving}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="edit-artwork-save-button"
                        disabled={saving}
                    >
                        <FaSave />

                        {saving
                            ? 'Saving Changes...'
                            : 'Save Changes'}
                    </button>

                </div>

            </form>

        </div>
    )
}

export default EditArtwork