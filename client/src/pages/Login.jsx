import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../services/api'
import PageLayout from '../components/PageLayout'
import loginBg from '../assets/Login-bg.jpg'
import { toast } from 'react-toastify'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!email.trim() || !password) {
            setError('Please enter email and password.')
            return
        }

        try {
            setLoading(true)
            setError('')

            const response = await api.post('/auth/login', {
                email: email.trim(),
                password
            })

            const { token, user } = response.data

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))

            setIsLoggedIn(true)
toast.success('Login successful!')

const redirectTo =
    location.state?.redirectTo || '/'

navigate(redirectTo, {
    replace: true
})

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageLayout background={loginBg}>
            <div className="auth-page">
                <div className="auth-brand">
                    <h1>Artevora Gallery</h1>
                    <p>Explore. Inspire. Create.</p>
                </div>

                <div className="auth-card">
                    <div className="auth-heading">
                        <h2>Welcome Back</h2>
                        <p>Login to continue your art journey.</p>
                    </div>

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <form onSubmit={handleLogin}>
                        <label>Email Address</label>

                        <div className="auth-input">
                            <FaEnvelope />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

                        <label>Password</label>

                        <div className="auth-input">
                            <FaLock />

                            <input
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Logging in...'
                                : 'Login'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{' '}
                        <Link to="/register">Register</Link>
                    </p>
                </div>

                <p className="auth-quote">
                    “Art enables us to find ourselves and lose
                    ourselves at the same time.”
                </p>
            </div>
        </PageLayout>
    )
}

export default Login