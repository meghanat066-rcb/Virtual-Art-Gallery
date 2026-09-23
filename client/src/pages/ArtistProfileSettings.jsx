import { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaSave, FaCamera } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../services/api'
import './ArtistProfileSettings.css'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

function ArtistProfileSettings() {

    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [profileImageFile, setProfileImageFile] = useState(null)
    const [imageUploading, setImageUploading] = useState(false)

    const navigate = useNavigate()

    const [saving, setSaving] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value
        }))
    }
const handleProfileImageChange = (event) => {
    const file = event.target.files[0]

    if (!file) {
        setProfileImageFile(null)
        return
    }

    if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image.')
        event.target.value = ''
        return
    }

    if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile image must be less than 5 MB.')
        event.target.value = ''
        return
    }

    setProfileImageFile(file)
}
const removeSelectedProfileImage = () => {
    setProfileImageFile(null)

    const fileInput = document.getElementById('profileImage')

    if (fileInput) {
        fileInput.value = ''
    }
}
const handleProfileImageUpload = async () => {
    if (!profileImageFile) {
        toast.error('Please select a profile image first.')
        return
    }

    try {
        setImageUploading(true)

        const imageFormData = new FormData()

        imageFormData.append(
            'profileImage',
            profileImageFile
        )

        const response = await api.patch(
            '/auth/profile-image',
            imageFormData
        )

        if (response.data?.success) {
            const updatedUser = response.data.user

            setUser(updatedUser)

            localStorage.setItem(
                'user',
                JSON.stringify(updatedUser)
            )

            setProfileImageFile(null)

            toast.success(
                'Profile picture updated successfully!'
            )
        }

    } catch (error) {
        console.error(
            'Error uploading profile image:',
            error
        )

        toast.error(
            error.response?.data?.message ||
            'Unable to upload profile picture.'
        )
    } finally {
        setImageUploading(false)
    }
}
    const handleSubmit = async (event) => {
        event.preventDefault()

        if (form.newPassword !== form.confirmPassword) {
            toast.error(
                'New password and confirm password do not match.'
            )
            return
        }

        if (
            form.newPassword &&
            !form.currentPassword
        ) {
            toast.error(
                'Please enter your current password.'
            )
            return
        }

        try {
            setSaving(true)

            const response = await api.put(
                '/auth/profile',
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                }
            )

            if (response.data?.success) {

                const updatedUser = response.data.user

                // Update React state
                setUser(updatedUser)

                // Update localStorage
                localStorage.setItem(
                    'user',
                    JSON.stringify(updatedUser)
                )

                // Update displayed form values
                setForm((currentForm) => ({
                    ...currentForm,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }))

                toast.success(
                    response.data.message ||
                    'Profile updated successfully!'
                )
            }

        } catch (error) {

            console.error(
                'Error updating profile:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to update profile.'
            )

        } finally {
            setSaving(false)
        }
    }

    if (!user || user.role !== 'artist') {
        return null
    }

    return (
        <div className="artist-settings-page">
            <button
    type="button"
    className="dashboard-back-button"
    onClick={() => navigate('/artist-dashboard')}
>
    <FaArrowLeft />
    Back to Dashboard
</button>

            <div className="artist-settings-header">

                <span>
                    ARTIST STUDIO
                </span>

                <h1>
                    Profile Settings
                </h1>

                <p>
                    Manage your account information and password
                    settings.
                </p>

            </div>


            <form
    className="artist-settings-layout"
    onSubmit={handleSubmit}
>

    <section className="artist-settings-card">

        {/* =========================================
            PROFILE PICTURE
        ========================================= */}

        <div className="settings-section">

            <div className="settings-section-heading">

                <div className="settings-heading-icon">
                    <FaUser />
                </div>

                <div>
                    <span>ARTIST PROFILE</span>
                    <h2>Profile Picture</h2>
                </div>

            </div>


            <div className="profile-image-settings">

                <div className="profile-image-preview">

                    {profileImageFile ? (
                        <img
                            src={URL.createObjectURL(
                                profileImageFile
                            )}
                            alt="Selected profile"
                        />
                    ) : user?.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.name}
                        />
                    ) : (
                        <FaUser />
                    )}

                </div>


                <div className="profile-image-controls">

                    <label
                        htmlFor="profileImage"
                        className="profile-image-select"
                    >
                        Choose Image
                    </label>

                    <input
                        type="file"
                        id="profileImage"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleProfileImageChange}
                        disabled={imageUploading}
                        hidden
                    />


                    {profileImageFile && (
                        <>

                            <p className="profile-image-selected">
                                Selected: {profileImageFile.name}
                            </p>

                            <button
                                type="button"
                                className="profile-image-remove-button"
                                onClick={
                                    removeSelectedProfileImage
                                }
                                disabled={imageUploading}
                            >
                                Remove Selected
                            </button>

                        </>
                    )}


                    <button
                        type="button"
                        className="profile-image-upload-button"
                        onClick={handleProfileImageUpload}
                        disabled={
                            !profileImageFile ||
                            imageUploading
                        }
                    >
                        <FaSave />

                        {imageUploading
                            ? 'Uploading...'
                            : 'Upload Profile Picture'}
                    </button>


                    <small>
                        JPG, PNG or WebP. Maximum size: 5 MB.
                    </small>

                </div>

            </div>

        </div>


        {/* =========================================
            PROFILE INFORMATION
        ========================================= */}

        <div className="settings-section">

            <div className="settings-section-heading">

                <div className="settings-heading-icon">
                    <FaUser />
                </div>

                <div>
                    <span>ACCOUNT</span>
                    <h2>Profile Information</h2>
                </div>

            </div>


            <div className="settings-field">

                <label>
                    Artist Name
                </label>

                <div className="settings-input-wrapper">

                    <FaUser />

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={saving}
                        required
                    />

                </div>

            </div>


            <div className="settings-field">

                <label>
                    Email Address
                </label>

                <div className="settings-input-wrapper">

                    <FaEnvelope />

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={saving}
                        required
                    />

                </div>

            </div>

        </div>


        {/* =========================================
            PASSWORD
        ========================================= */}

        <div className="settings-section">

            <div className="settings-section-heading">

                <div className="settings-heading-icon">
                    <FaLock />
                </div>

                <div>
                    <span>SECURITY</span>
                    <h2>Change Password</h2>
                </div>

            </div>


            <div className="settings-field">

                <label>
                    Current Password
                </label>

                <div className="settings-input-wrapper">

                    <FaLock />

                    <input
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        disabled={saving}
                    />

                </div>

            </div>


            <div className="settings-field">

                <label>
                    New Password
                </label>

                <div className="settings-input-wrapper">

                    <FaLock />

                    <input
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        disabled={saving}
                    />

                </div>

            </div>


            <div className="settings-field">

                <label>
                    Confirm New Password
                </label>

                <div className="settings-input-wrapper">

                    <FaLock />

                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        disabled={saving}
                    />

                </div>

            </div>

        </div>


        {/* =========================================
            SAVE ACCOUNT CHANGES
        ========================================= */}

        <div className="settings-actions">

            <button
                type="submit"
                className="settings-save-button"
                disabled={saving}
            >

                <FaSave />

                {saving
                    ? 'Saving...'
                    : 'Save Changes'}

            </button>

        </div>

    </section>

</form>

        </div>
    )
}

export default ArtistProfileSettings