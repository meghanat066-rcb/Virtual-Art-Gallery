import axios from 'axios'

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
export const API_BASE_URL = rawBaseURL.endsWith('/api')
    ? rawBaseURL
    : `${rawBaseURL.replace(/\/+$/, '')}/api`

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '')

export const getImageUrl = (image) => {
    if (!image) return ''
    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image
    }
    const clean = image.startsWith('/') ? image : `/${image}`
    return `${SERVER_BASE_URL}${clean}`
}

const api = axios.create({
    baseURL: API_BASE_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api