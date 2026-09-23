import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaCamera,
    FaTimes,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../services/api'
import './UserProfileEdit.css'

function UserProfileEdit() {
    const navigate = useNavigate()

    const storedUser = JSON.parse(
        localStorage.getItem('user') || 'null'
    )

    const user = storedUser

    const [name, setName] = useState(
        storedUser?.name || ''
    )

    const [email, setEmail] = useState(
        storedUser?.email || ''
    )

    const [profileImage, setProfileImage] = useState(
        storedUser?.userProfileImage || ''
    )

    const [selectedFile, setSelectedFile] = useState(null)

    const [saving, setSaving] = useState(false)

    if (!storedUser) {
        navigate('/login')
        return null
    }

    const firstLetter = name
        ? name.charAt(0).toUpperCase()
        : 'U'


    // =========================
    // SELECT PROFILE IMAGE
    // =========================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) {
            return
        }

        // Basic image validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image.')
            return
        }

        // Limit image size to 5 MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error(
                'Profile image must be smaller than 5 MB.'
            )
            return
        }

        setSelectedFile(file)

        // Temporary preview
        setProfileImage(
            URL.createObjectURL(file)
        )
    }


    // =========================
    // REMOVE PROFILE IMAGE
    // =========================

    const handleRemovePhoto = async () => {
    try {
        setSaving(true)

        const response = await api.patch(
            '/auth/user-profile-image/remove'
        )

        const updatedUser =
            response.data?.user

        if (updatedUser) {
            const currentUser =
                JSON.parse(
                    localStorage.getItem('user') || 'null'
                )

            const finalUser = {
                ...currentUser,
                ...updatedUser,
                userProfileImage: '',
            }

            localStorage.setItem(
                'user',
                JSON.stringify(finalUser)
            )
        }

        setSelectedFile(null)
        setProfileImage('')

        toast.success(
            'Profile photo removed successfully.'
        )

    } catch (error) {

        console.error(
            'Remove profile image error:',
            error
        )

        toast.error(
            error.response?.data?.message ||
            'Unable to remove profile photo.'
        )

    } finally {
        setSaving(false)
    }
}

    // =========================
    // SAVE PROFILE
    // =========================

    const handleSave = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Name is required.')
            return
        }

        if (!email.trim()) {
            toast.error('Email is required.')
            return
        }

        try {
            setSaving(true)

            // -------------------------
            // UPDATE NAME + EMAIL
            // -------------------------

            const profileResponse = await api.put(
                '/auth/profile',
                {
                    name: name.trim(),
                    email: email.trim(),
                }
            )

            let updatedUser =
                profileResponse.data?.user ||
                storedUser


            // -------------------------
            // UPLOAD NEW IMAGE
            // -------------------------

            if (selectedFile) {

                const formData = new FormData()

                formData.append(
                    'profileImage',
                    selectedFile
                )

                const imageResponse =
                    await api.patch(
                        '/auth/user-profile-image',
                        formData
                    )
                    console.log(
    'IMAGE UPLOAD RESPONSE:',
    JSON.stringify(imageResponse.data, null, 2)
)

                updatedUser =
                    imageResponse.data?.user ||
                    updatedUser
            }


            // -------------------------
            // REMOVE IMAGE
            // -------------------------

            /*
             * If the user removed an existing image
             * and did not select a replacement, we
             * will handle removal through the backend
             * in the next backend step.
             */


            // Keep user information in localStorage
            const finalUser = {
                ...storedUser,
                ...updatedUser,
                name: name.trim(),
                email: email.trim(),
                userProfileImage:
                    selectedFile
                        ? updatedUser.userProfileImage
                        : profileImage,
            }
console.log(
    'FINAL USER SAVED:',
    JSON.stringify(finalUser, null, 2)
)
            localStorage.setItem(
                'user',
                JSON.stringify(finalUser)
            )
window.dispatchEvent(
    new Event('artevora-profile-updated')
)
            toast.success(
                'Profile updated successfully!'
            )

            navigate('/user-profile')

        } catch (error) {

            console.error(
                'Profile update error:',
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


    return (
        <main className="artevora-edit-profile-page">

            <div className="artevora-edit-profile-container">

                {/* BACK */}

                <button
                    type="button"
                    className="artevora-edit-back"
                    onClick={() =>
                        navigate('/user-profile')
                    }
                    disabled={saving}
                >
                    <FaArrowLeft />
                    Back to Profile
                </button>


                {/* HEADER */}

                <div className="artevora-edit-profile-header">

                    <span>
                        ACCOUNT SETTINGS
                    </span>

                    <h1>
                        Edit Profile
                    </h1>

                    <p>
                        Update your ArteVora account
                        information.
                    </p>

                </div>


                {/* PROFILE CARD */}

                <section className="artevora-edit-profile-card">

                    {/* PROFILE PHOTO */}

                    <div className="artevora-edit-profile-photo-section">

                        <div className="artevora-profile-avatar">
    {profileImage ? (
        <img
            src={profileImage}
            alt="Profile"
        />
    ) : (
        firstLetter
    )}
</div>


                        <div className="artevora-photo-actions">

                            <label
                                htmlFor="profile-image"
                                className="artevora-change-photo"
                            >
                                <FaCamera />
                                Change Photo
                            </label>

                            {profileImage && (
                                <button
                                    type="button"
                                    className="artevora-remove-photo"
                                    onClick={
                                        handleRemovePhoto
                                    }
                                    disabled={saving}
                                >
                                    <FaTimes />
                                    Remove Photo
                                </button>
                            )}

                        </div>


                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={
                                handleImageChange
                            }
                            hidden
                        />

                        <small className="artevora-photo-help">
                            JPG, PNG or WEBP. Maximum
                            5 MB.
                        </small>

                    </div>


                    {/* FORM */}

                    <form onSubmit={handleSave}>

                        {/* NAME */}

                        <div className="artevora-edit-field">

                            <label>
                                Name
                            </label>

                            <div className="artevora-edit-input">

                                <FaUser />

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your name"
                                    disabled={saving}
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="artevora-edit-field">

                            <label>
                                Email Address
                            </label>

                            <div className="artevora-edit-input">

                                <FaEnvelope />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    disabled={saving}
                                />

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="artevora-edit-actions">

                            <button
                                type="button"
                                className="artevora-edit-cancel"
                                onClick={() =>
                                    navigate(
                                        '/user-profile'
                                    )
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="artevora-edit-save"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </main>
    )
}

export default UserProfileEdit