import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import PageLayout from '../components/PageLayout'
import registerBg from '../assets/register-bg.jpg'
import { toast } from 'react-toastify'
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaUsers,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        if (
            !name.trim() ||
            !email.trim() ||
            !password ||
            !role
        ) {
            setError('Please fill in all the fields.')
            return
        }

        if (password.length < 6) {
            setError(
                'Password must contain at least 6 characters.'
            )
            return
        }

        try {
            setLoading(true)
            setError('')

            const response = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim(),
                password,
                role
            })

            toast.success(
                response.data.message ||
                'Registration successful!'
            )

            setTimeout(() => {
                navigate('/login')
            }, 1200)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageLayout background={registerBg}>
            <div className="auth-page register-auth-page">
                <div className="auth-brand">
                    <h1>Artevora Gallery</h1>
                    <p>Join our creative community.</p>
                </div>

                <div className="auth-card register-card">
                    <div className="auth-heading">
                        <h2>Create Account</h2>
                        <p>
                            Sign up to showcase and discover
                            beautiful artworks.
                        </p>
                    </div>

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <form onSubmit={handleRegister}>
                        <label>Full Name</label>

                        <div className="auth-input">
                            <FaUser />

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                disabled={loading}
                            />
                        </div>

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
                                placeholder="Create a password"
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

                        <label>Register As</label>

                        <div className="auth-input">
                            <FaUsers />

                            <select
                                value={role}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                                disabled={loading}
                            >
                                <option value="user">
                                    User
                                </option>

                                <option value="artist">
                                    Artist
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? 'Registering...'
                                : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </PageLayout>
    )
}

export default Register