import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function EditExhibition() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [exhibition, setExhibition] = useState(null)
    const [saving, setSaving] = useState(false)
    const [newCoverImage, setNewCoverImage] = useState(null)
    const [newOverviewImage, setNewOverviewImage] = useState(null)

    const [form, setForm] = useState({
    title: '',
    subtitle: '',
    exhibitionPurpose: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    address: '',
    openingTimes: '',
    visitorInformation: '',
    status: 'draft',
    featured: false
})

    useEffect(() => {
        const fetchExhibition = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
    '/exhibitions/admin/all'
)

const selectedExhibition =
    response.data.exhibitions?.find(
        (exhibition) => exhibition._id === id
    )

if (!selectedExhibition) {
    throw new Error('Exhibition not found')
}

setExhibition(selectedExhibition)

setForm({
    title: selectedExhibition.title || '',
    subtitle: selectedExhibition.subtitle || '',
    exhibitionPurpose:
    selectedExhibition.exhibitionPurpose || '',
    description: selectedExhibition.description || '',
    startDate: selectedExhibition.startDate
        ? selectedExhibition.startDate.substring(0, 10)
        : '',
    endDate: selectedExhibition.endDate
        ? selectedExhibition.endDate.substring(0, 10)
        : '',
    location: selectedExhibition.location || '',
    address: selectedExhibition.address || '',
    openingTimes: selectedExhibition.openingTimes || '',
    visitorInformation:
        selectedExhibition.visitorInformation || '',
    status: selectedExhibition.status || 'draft',
    featured: Boolean(selectedExhibition.featured)
})

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

    if (loading) {
    return <p>Loading exhibition...</p>
}

if (error) {
    return <p>{error}</p>
}

if (!exhibition) {
    return <p>Exhibition not found.</p>
}
const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((currentForm) => ({
        ...currentForm,
        [name]:
            type === 'checkbox'
                ? checked
                : value
    }))
}
const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
        alert('Exhibition title is required.')
        return
    }

    if (!form.startDate || !form.endDate) {
        alert('Please select exhibition dates.')
        return
    }

    if (
        new Date(form.endDate) <
        new Date(form.startDate)
    ) {
        alert(
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
    form.subtitle
)
formData.append(
    'exhibitionPurpose',
    form.exhibitionPurpose
)
formData.append(
    'description',
    form.description
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
    form.location
)

formData.append(
    'address',
    form.address
)

formData.append(
    'openingTimes',
    form.openingTimes
)

formData.append(
    'visitorInformation',
    form.visitorInformation
)

formData.append(
    'status',
    form.status
)

formData.append(
    'featured',
    String(form.featured)
)

if (newCoverImage) {
    formData.append(
        'coverImage',
        newCoverImage
    )
}
if (newOverviewImage) {
    formData.append(
        'overviewImage',
        newOverviewImage
    )
}

const response = await api.put(
    `/exhibitions/admin/${id}`,
    formData
)

        if (response.data?.success) {
            setExhibition(response.data.exhibition)

            alert(
                'Exhibition updated successfully!'
            )

            navigate('/admin', {
    state: {
        activeSection: 'exhibitions'
    }
})
        }

    } catch (err) {
        console.error(
            'Error updating exhibition:',
            err
        )

        alert(
            err.response?.data?.message ||
            'Unable to update exhibition.'
        )
    } finally {
        setSaving(false)
    }
}
return (
    <div className="admin-dashboard">

        {/* =========================
            ADMIN SIDEBAR
        ========================= */}

        <aside className="admin-sidebar">

            <div className="admin-sidebar-brand">
                <h1>ARTEVORA</h1>
                <span>ADMIN STUDIO</span>
            </div>


            <nav className="admin-sidebar-navigation">

                {/* MAIN */}

                <div className="admin-sidebar-section">

                    <span className="admin-sidebar-label">
                        MAIN
                    </span>

                    <button
                        className="admin-sidebar-button"
                        onClick={() =>
                            navigate('/admin')
                        }
                    >
                        Dashboard
                    </button>

                </div>


                {/* ARTWORKS */}

                <div className="admin-sidebar-section">

                    <span className="admin-sidebar-label">
                        ARTWORKS
                    </span>

                    <button
                        className="admin-sidebar-button"
                        onClick={() =>
                            navigate('/admin')
                        }
                    >
                        Artwork Review
                    </button>

                </div>


                {/* MANAGEMENT */}

                <div className="admin-sidebar-section">

                    <span className="admin-sidebar-label">
                        MANAGEMENT
                    </span>

                    <button
                        className="admin-sidebar-button"
                        onClick={() =>
                            navigate('/admin')
                        }
                    >
                        Artists
                    </button>


                    <button
                        className="admin-sidebar-button active"
                        onClick={() =>
                            navigate('/admin/exhibitions')
                        }
                    >
                        Exhibitions
                    </button>

                </div>


                {/* ACTIVITY */}

                <div className="admin-sidebar-section">

                    <span className="admin-sidebar-label">
                        ACTIVITY
                    </span>

                    <button className="admin-sidebar-button">
                        Enquiries
                    </button>

                    <button className="admin-sidebar-button">
                        Purchases
                    </button>

                    <button className="admin-sidebar-button">
                        Analytics
                    </button>

                </div>

            </nav>


            {/* LOGOUT */}

            <div className="admin-sidebar-bottom">

                <button
                    className="admin-sidebar-button"
                    onClick={() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('user')
                        navigate('/login')
                    }}
                >
                    Logout
                </button>

            </div>

        </aside>


        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="admin-main-content">

            <section className="edit-exhibition-page">

                <div className="edit-exhibition-heading">

                    <div>

                        <span className="admin-section-eyebrow">
                            EXHIBITIONS
                        </span>

                        <h1>
                            Edit Exhibition
                        </h1>

                        <p>
                            Update the exhibition information
                            and manage its publishing status.
                        </p>

                    </div>


                    <button
                        className="edit-exhibition-back-button"
                        onClick={() =>
    navigate('/admin', {
        state: {
            activeSection: 'exhibitions'
        }
    })
}
                    >
                        Back to Exhibitions
                    </button>

                </div>


                {/* FORM */}

                <form
    className="edit-exhibition-form"
    onSubmit={handleSubmit}
>

                    <label>
                        Exhibition Title

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </label>


                    <label>
                        Subtitle

                        <input
                            type="text"
                            name="subtitle"
                            value={form.subtitle}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
    Why Does This Exhibition Exist?

    <textarea
        name="exhibitionPurpose"
        value={form.exhibitionPurpose}
        onChange={handleChange}
        placeholder="Explain the purpose, intention, or central idea behind this exhibition..."
        rows="5"
    />
</label>


<label>
    What is This Exhibition About?

    <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Explain what the exhibition explores, communicates, or presents..."
        rows="6"
    />
</label>

                    <div className="edit-exhibition-form-row">

                        <label>
                            Start Date

                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                            />
                        </label>


                        <label>
                            End Date

                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                            />
                        </label>

                    </div>


                    <label>
                        Location

                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                        />
                    </label>


                    <label>
                        Address

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </label>


                    <label>
                        Opening Times

                        <input
                            type="text"
                            name="openingTimes"
                            value={form.openingTimes}
                            onChange={handleChange}
                        />
                    </label>


                    <label>
                        Visitor Information

                        <textarea
                            name="visitorInformation"
                            value={form.visitorInformation}
                            onChange={handleChange}
                            rows="5"
                        />
                    </label>


                    <div className="edit-exhibition-status">

                        <strong>
                            PUBLISHING STATUS
                        </strong>

                        <label>

                            <input
                                type="radio"
                                name="status"
                                value="draft"
                                checked={
                                    form.status === 'draft'
                                }
                                onChange={handleChange}
                            />

                            Draft

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="status"
                                value="published"
                                checked={
                                    form.status === 'published'
                                }
                                onChange={handleChange}
                            />

                            Published

                        </label>

                    </div>


                    <label className="edit-exhibition-featured">

                        <input
                            type="checkbox"
                            name="featured"
                            checked={form.featured}
                            onChange={handleChange}
                        />

                        Feature this exhibition

                    </label>


                    {/* CURRENT COVER */}

                    {exhibition.coverImage && (
                        <div className="edit-exhibition-cover">

                            <strong>
                                CURRENT COVER IMAGE
                            </strong>

                            <img
                                src={exhibition.coverImage}
                                alt={exhibition.title}
                            />

                        </div>
                    )}
                    <div className="edit-exhibition-cover-upload">

    <label>
        Replace Cover Image

        <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={(event) =>
                setNewCoverImage(
                    event.target.files[0] || null
                )
            }
            disabled={saving}
        />
    </label>

    {newCoverImage && (
        <p className="edit-exhibition-selected-file">
            Selected: {newCoverImage.name}
        </p>
    )}

</div>
{exhibition.overviewImage && (
    <div className="edit-exhibition-cover">

        <strong>
            CURRENT OVERVIEW IMAGE
        </strong>

        <img
            src={exhibition.overviewImage}
            alt={`${exhibition.title} overview`}
        />

    </div>
)}

<div className="edit-exhibition-cover-upload">

    <label>
        Replace Overview Image

        <input
            type="file"
            name="overviewImage"
            accept="image/*"
            onChange={(event) =>
                setNewOverviewImage(
                    event.target.files[0] || null
                )
            }
            disabled={saving}
        />
    </label>

    {newOverviewImage && (
        <p className="edit-exhibition-selected-file">
            Selected: {newOverviewImage.name}
        </p>
    )}

</div>
                    <div className="edit-exhibition-actions">

    <button
        type="button"
        className="edit-exhibition-cancel-button"
        onClick={() =>
    navigate('/admin', {
        state: {
            activeSection: 'exhibitions'
        }
    })
}
        disabled={saving}
    >
        Cancel
    </button>

    <button
        type="submit"
        className="edit-exhibition-save-button"
        disabled={saving}
    >
        {saving
            ? 'Saving...'
            : 'Save Changes'}
    </button>

</div>

                </form>

            </section>

        </main>

    </div>
)
}

export default EditExhibition