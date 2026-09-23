import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import {
    FaArrowLeft,
    FaBell,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaTrash
} from 'react-icons/fa'
import './ArtistNotifications.css'
import { API_BASE_URL } from '../services/api'

function ArtistNotifications() {
    const navigate = useNavigate()

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    const [notifications, setNotifications] = useState([])

    useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token')

            if (!token) {
                return
            }

            const response = await fetch(
                `${API_BASE_URL}/notifications/my-notifications`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            console.log('NOTIFICATIONS:', data)

            if (data.success) {
                setNotifications(data.notifications || [])
            }

        } catch (error) {
            console.error(
                'Error fetching notifications:',
                error
            )
        }
    }

    fetchNotifications()
}, [])
const handleNotificationClick = async (notificationId) => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        const response = await fetch(
            `${API_BASE_URL}/notifications/${notificationId}/read`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await response.json()

        console.log('NOTIFICATION READ RESPONSE:', data)

        if (data.success) {
            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            )
        }

    } catch (error) {
        console.error(
            'Error marking notification as read:',
            error
        )
    }
}
const handleMarkAllAsRead = async () => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        const response = await fetch(
            `${API_BASE_URL}/notifications/read-all`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await response.json()

        console.log('MARK ALL READ RESPONSE:', data)

        if (data.success) {
            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            )
        }

    } catch (error) {
        console.error(
            'Error marking all notifications as read:',
            error
        )
    }
}
const handleDeleteNotification = async (notificationId) => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        const response = await fetch(
            `${API_BASE_URL}/notifications/${notificationId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await response.json()

        console.log('DELETE NOTIFICATION RESPONSE:', data)

        if (data.success) {
            setNotifications((currentNotifications) =>
                currentNotifications.filter(
                    (notification) =>
                        notification._id !== notificationId
                )
            )
        }

    } catch (error) {
        console.error(
            'Error deleting notification:',
            error
        )
    }
}
    if (!user || user.role !== 'artist') {
        return null
    }

    return (
        <PageLayout>

            <div className="artist-notifications-page">

                <div className="notifications-topbar">

                    <button
                        className="notifications-back-button"
                        onClick={() => navigate('/artist-dashboard')}
                    >
                        <FaArrowLeft />
                        Back to Dashboard
                    </button>

                    <span>
                        ARTIST STUDIO
                    </span>

                </div>


                <section className="notifications-intro">

                    <div className="notifications-icon">
                        <FaBell />
                    </div>

                    <span>
                        ARTIST ACTIVITY
                    </span>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Stay updated about your artwork submissions,
                        approvals and activity.
                    </p>

                </section>


                <section className="notifications-content">

                    <div className="notifications-heading">

    <div>
        <span>
            RECENT UPDATES
        </span>

        <h2>
            Your Notifications
        </h2>
    </div>

    <div className="notifications-heading-actions">

        <span className="notification-total">
            {notifications.length} Updates
        </span>

        {notifications.some(
            (notification) => !notification.isRead
        ) && (
            <button
                className="mark-all-read-button"
                onClick={handleMarkAllAsRead}
            >
                Mark All as Read
            </button>
        )}

    </div>

</div>

                    {notifications.length === 0 ? (

                        <div className="notifications-empty">

                            <div className="notifications-empty-icon">
                                <FaBell />
                            </div>

                            <h3>
                                No notifications yet
                            </h3>

                            <p>
                                When your artwork is reviewed or
                                receives activity, updates will
                                appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="notifications-list">

                            {notifications.map((notification) => (

                                <div
    className={`notification-item ${
        notification.isRead ? 'read' : 'unread'
    }`}
    key={notification._id}
    onClick={() =>
        handleNotificationClick(notification._id)
    }
>

                                    <div className="notification-item-icon">

                                        {notification.status === 'approved' ? (
                                            <FaCheckCircle />
                                        ) : notification.status === 'rejected' ? (
                                            <FaTimesCircle />
                                        ) : (
                                            <FaClock />
                                        )}

                                    </div>

                                    <div className="notification-item-content">

    <h3>
        {notification.message}
    </h3>

    <small>
        Recently
    </small>

    <button
        className="delete-notification-button"
        onClick={(event) => {
            event.stopPropagation()
            handleDeleteNotification(notification._id)
        }}
    >
        <FaTrash />
        Delete
    </button>

</div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </PageLayout>
    )
}

export default ArtistNotifications