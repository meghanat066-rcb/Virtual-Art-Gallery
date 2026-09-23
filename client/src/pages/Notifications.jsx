import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FaBell,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '../services/api'
import PageLayout from '../components/PageLayout'
import galleryBg from '../assets/notification-bg.jpg'

function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (user.role !== 'artist') {
            navigate('/gallery')
            return
        }

        const fetchNotifications = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(
                    '/notifications/my-notifications'
                )

                setNotifications(
                    response.data.notifications || []
                )
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load notifications.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [navigate, user])

    const markAsRead = async (notificationId) => {
        try {
            await api.put(
                `/notifications/${notificationId}/read`
            )

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification._id === notificationId
                        ? {
                            ...notification,
                            isRead: true
                        }
                        : notification
                )
            )
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Unable to update notification.'
            )
        }
    }

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all')

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            )

            toast.success('All notifications marked as read.')
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Unable to update notifications.'
            )
        }
    }

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length

    return (
        <PageLayout background={galleryBg}>
            <div className="notifications-page">
                <div className="page-heading">
                    <h1>
                        <FaBell /> Notifications
                    </h1>

                    <p>
                        View updates about your artwork submissions.
                    </p>
                </div>

                {!loading && unreadCount > 0 && (
                    <button
                        type="button"
                        className="mark-all-read-btn"
                        onClick={markAllAsRead}
                    >
                        Mark All as Read
                    </button>
                )}

                {loading && (
                    <p className="notifications-message">
                        Loading notifications...
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {!loading &&
                    !error &&
                    notifications.length === 0 && (
                        <p className="notifications-message">
                            You have no notifications yet.
                        </p>
                    )}

                <div className="notifications-list">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-card ${
                                notification.isRead
                                    ? 'notification-read'
                                    : 'notification-unread'
                            }`}
                            onClick={() => {
                                if (!notification.isRead) {
                                    markAsRead(notification._id)
                                }
                            }}
                        >
                            <div className="notification-status-icon">
                                {notification.status === 'approved'
                                    ? (
                                        <FaCheckCircle className="approved-notification-icon" />
                                    )
                                    : (
                                        <FaTimesCircle className="rejected-notification-icon" />
                                    )}
                            </div>

                            <div className="notification-content">
                                <p>{notification.message}</p>

                                <small>
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </small>
                            </div>

                            {!notification.isRead && (
                                <span className="unread-dot" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    )
}

export default Notifications