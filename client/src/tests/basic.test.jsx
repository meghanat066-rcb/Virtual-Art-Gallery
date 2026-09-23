import { afterEach, describe, it, expect, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import {
    MemoryRouter,
    Routes,
    Route,
} from 'react-router-dom'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import Login from '../pages/Login'
import Register from '../pages/Register'
import UploadArtwork from '../pages/UploadArtwork'
import Gallery from '../pages/Gallery'
import Artists from '../pages/Artists'
import ArtistProfile from '../pages/ArtistProfile'
import ArtworkDetailsNew from '../pages/ArtworkDetailsNew'
import Favorites from '../pages/Favorites'
import ArtistMyArtworks from '../pages/ArtistMyArtworks'
import UserProfile from '../pages/UserProfile'
import MyPurchases from '../pages/MyPurchases'
import Payment from '../pages/Payment'
import Notifications from '../pages/Notifications'
import Home from '../pages/Home'
import Exhibitions from '../pages/Exhibitions'
import ExhibitionDetails from '../pages/ExhibitionDetails'
import VirtualTour from '../pages/VirtualTour'
import ArtistSales from '../pages/ArtistSales'
import ArtistDashboard from '../pages/ArtistDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import api from '../services/api'

global.fetch = vi.fn()

global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
}

vi.mock('../services/api')

afterEach(() => {
    cleanup()
})

describe('Login page', () => {
    it('should render the login page correctly', () => {
        render(
            <MemoryRouter>
                <Login setIsLoggedIn={() => {}} />
            </MemoryRouter>
        )

        expect(
            screen.getByText('Welcome Back')
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText('Enter your email')
        ).toBeInTheDocument()

        expect(
            screen.getByPlaceholderText('Enter your password')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: 'Login' })
        ).toBeInTheDocument()

        expect(
            screen.getByText('Register')
        ).toBeInTheDocument()
    })
        it('should show validation error when fields are empty', async () => {
        render(
            <MemoryRouter>
                <Login setIsLoggedIn={() => {}} />
            </MemoryRouter>
        )

        const loginButton = screen.getByRole('button', {
            name: 'Login'
        })

        loginButton.click()

        expect(
            await screen.findByText(
                'Please enter email and password.'
            )
        ).toBeInTheDocument()
    })
    it('should toggle password visibility', async () => {
    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Login setIsLoggedIn={() => {}} />
        </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText(
        'Enter your password'
    )

    expect(passwordInput).toHaveAttribute(
        'type',
        'password'
    )

    const toggleButton = passwordInput.parentElement.querySelector(
        '.password-toggle'
    )

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute(
        'type',
        'text'
    )

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute(
        'type',
        'password'
    )
})
it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup()

    api.post.mockResolvedValue({
        data: {
            token: 'test-token',
            user: {
                name: 'Test User',
                email: 'test@example.com'
            }
        }
    })

    render(
        <MemoryRouter>
            <Login setIsLoggedIn={() => {}} />
        </MemoryRouter>
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com'
    )

    await user.type(
        screen.getByPlaceholderText('Enter your password'),
        'password123'
    )

    await user.click(
        screen.getByRole('button', { name: 'Login' })
    )

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
    })

    expect(localStorage.getItem('token')).toBe('test-token')
    expect(localStorage.getItem('user')).toBe(
        JSON.stringify({
            name: 'Test User',
            email: 'test@example.com'
        })
    )
})
it('should render the register page correctly', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    expect(
    screen.getByRole('heading', {
        name: 'Create Account'
    })
).toBeInTheDocument()

    expect(
        screen.getByPlaceholderText('Enter your full name')
    ).toBeInTheDocument()

    expect(
        screen.getByPlaceholderText('Enter your email')
    ).toBeInTheDocument()

    expect(
        screen.getByPlaceholderText('Create a password')
    ).toBeInTheDocument()

    expect(
        screen.getByRole('combobox')
    ).toBeInTheDocument()

    expect(
        screen.getByRole('button', {
            name: 'Create Account'
        })
    ).toBeInTheDocument()

    expect(
        screen.getByText('Login')
    ).toBeInTheDocument()
})
it('should show validation error when register fields are empty', async () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    const createAccountButton = screen.getByRole('button', {
        name: 'Create Account'
    })

    await userEvent.click(createAccountButton)

    expect(
        await screen.findByText(
            'Please fill in all the fields.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when password is too short', async () => {
    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    await user.type(
        screen.getByPlaceholderText('Enter your full name'),
        'Test User'
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com'
    )

    await user.type(
        screen.getByPlaceholderText('Create a password'),
        '12345'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account'
        })
    )

    expect(
        await screen.findByText(
            'Password must contain at least 6 characters.'
        )
    ).toBeInTheDocument()
})
it('should register successfully with valid details', async () => {
    const user = userEvent.setup()

    api.post.mockResolvedValue({
        data: {
            message: 'Registration successful!'
        }
    })

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    await user.type(
        screen.getByPlaceholderText('Enter your full name'),
        'Test User'
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com'
    )

    await user.type(
        screen.getByPlaceholderText('Create a password'),
        'password123'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account'
        })
    )

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
    })
})
it('should render the upload artwork page correctly', () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    expect(
        screen.getByRole('heading', {
            name: 'Submit Your Artwork'
        })
    ).toBeInTheDocument()

    expect(
        screen.getByLabelText('Artwork Title')
    ).toBeInTheDocument()

    expect(
        screen.getByLabelText('Category')
    ).toBeInTheDocument()

    expect(
        screen.getByLabelText('Story Behind the Artwork')
    ).toBeInTheDocument()

    expect(
        screen.getByLabelText('Medium')
    ).toBeInTheDocument()

    expect(
        screen.getByLabelText('Year Created')
    ).toBeInTheDocument()

    expect(
        screen.getByLabelText('Original Artwork Size')
    ).toBeInTheDocument()

    expect(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    ).toBeInTheDocument()
})
it('should show validation error when artwork title is empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please enter the artwork title.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork category is empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please select a category.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork story is empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please enter the story behind the artwork.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork medium is empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.type(
        screen.getByLabelText('Story Behind the Artwork'),
        'Test artwork story'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please enter the artwork medium.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork year is empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.type(
        screen.getByLabelText('Story Behind the Artwork'),
        'Test artwork story'
    )

    await user.type(
        screen.getByLabelText('Medium'),
        'Oil on Canvas'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please enter the artwork year.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork dimensions are empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.type(
        screen.getByLabelText('Story Behind the Artwork'),
        'Test artwork story'
    )

    await user.type(
        screen.getByLabelText('Medium'),
        'Oil on Canvas'
    )

    await user.type(
        screen.getByLabelText('Year Created'),
        '2025'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please enter the original artwork dimensions.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork price is empty', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.type(
        screen.getByLabelText('Story Behind the Artwork'),
        'Test artwork story'
    )

    await user.type(
        screen.getByLabelText('Medium'),
        'Oil on Canvas'
    )

    await user.type(
        screen.getByLabelText('Year Created'),
        '2025'
    )

    await user.type(
        screen.getByLabelText('Original Artwork Size'),
        '60 × 45 cm'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please enter the original artwork price.'
        )
    ).toBeInTheDocument()
})
it('should show validation error when artwork image is missing', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.type(
        screen.getByLabelText('Story Behind the Artwork'),
        'Test artwork story'
    )

    await user.type(
        screen.getByLabelText('Medium'),
        'Oil on Canvas'
    )

    await user.type(
        screen.getByLabelText('Year Created'),
        '2025'
    )

    await user.type(
        screen.getByLabelText('Original Artwork Size'),
        '60 × 45 cm'
    )

    await user.type(
        screen.getByLabelText('Original Artwork Price (₹)'),
        '50000'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(
        await screen.findByText(
            'Please upload an artwork image.'
        )
    ).toBeInTheDocument()
})
it('should submit artwork successfully with valid details', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Test Artist',
            role: 'artist'
        })
    )

    localStorage.setItem('token', 'test-token')

    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            success: true,
            message: 'Artwork submitted for admin approval'
        })
    })

    render(
        <MemoryRouter>
            <UploadArtwork />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Submit Artwork'
    }).closest('form')

    form.noValidate = true

    await user.type(
        screen.getByLabelText('Artwork Title'),
        'Test Artwork'
    )

    await user.selectOptions(
        screen.getByLabelText('Category'),
        'Paintings'
    )

    await user.type(
        screen.getByLabelText('Story Behind the Artwork'),
        'Test artwork story'
    )

    await user.type(
        screen.getByLabelText('Medium'),
        'Oil on Canvas'
    )

    await user.type(
        screen.getByLabelText('Year Created'),
        '2025'
    )

    await user.type(
        screen.getByLabelText('Original Artwork Size'),
        '60 × 45 cm'
    )

    await user.type(
        screen.getByLabelText('Original Artwork Price (₹)'),
        '50000'
    )

    const imageFile = new File(
        ['test image'],
        'artwork.jpg',
        { type: 'image/jpeg' }
    )

    await user.upload(
        screen.getByLabelText(/Upload your artwork/i),
        imageFile
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Submit Artwork'
        })
    )

    expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/artworks/upload',
        expect.objectContaining({
            method: 'POST',
            headers: {
                Authorization: 'Bearer test-token'
            }
        })
    )
})
it('should render the gallery page correctly', async () => {
    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByRole('heading', {
            name: /gallery/i
        })
    ).toBeInTheDocument()
})
it('should display artworks when gallery data is loaded', async () => {
    api.get.mockResolvedValue({
    data: {
        artworks: [
            {
                _id: '1',
                title: 'Test Artwork',
                artistName: 'Test Artist',
                category: 'Paintings',
            },
        ],
    },
})

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Test Artwork')
    ).toBeInTheDocument()
})
it('should filter artworks by selected category', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Painting Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                },
                {
                    _id: '2',
                    title: 'Sculpture Artwork',
                    artistName: 'Another Artist',
                    category: 'Sculptures',
                },
            ],
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Painting Artwork')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Sculpture Artwork')
    ).toBeInTheDocument()

    await user.click(
        screen.getByRole('button', {
            name: 'Paintings',
        })
    )

    expect(
        screen.getByText('Painting Artwork')
    ).toBeInTheDocument()

    expect(
        screen.queryByText('Sculpture Artwork')
    ).not.toBeInTheDocument()
})
it('should search artworks by title', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                },
                {
                    _id: '2',
                    title: 'Mountain Sculpture',
                    artistName: 'Another Artist',
                    category: 'Sculptures',
                },
            ],
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Sunset Painting')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Mountain Sculpture')
    ).toBeInTheDocument()

    await user.click(
        screen.getByRole('button', {
            name: 'Open search',
        })
    )

    await user.type(
        screen.getByRole('textbox', {
            name: 'Search artworks',
        }),
        'Sunset'
    )

    expect(
        screen.getByText('Sunset Painting')
    ).toBeInTheDocument()

    expect(
        screen.queryByText('Mountain Sculpture')
    ).not.toBeInTheDocument()
})
it('should search artworks by artist name', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Artwork One',
                    artistName: 'Raja Ravi Varma',
                    category: 'Paintings',
                },
                {
                    _id: '2',
                    title: 'Artwork Two',
                    artistName: 'Test Artist',
                    category: 'Sculptures',
                },
            ],
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Artwork One')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Artwork Two')
    ).toBeInTheDocument()

    await user.click(
        screen.getByRole('button', {
            name: 'Open search',
        })
    )

    await user.type(
        screen.getByRole('textbox', {
            name: 'Search artworks',
        }),
        'Raja Ravi Varma'
    )

    expect(
        screen.getByText('Artwork One')
    ).toBeInTheDocument()

    expect(
        screen.queryByText('Artwork Two')
    ).not.toBeInTheDocument()
})
it('should search artworks by category', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Artwork One',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                },
                {
                    _id: '2',
                    title: 'Artwork Two',
                    artistName: 'Another Artist',
                    category: 'Sculptures',
                },
            ],
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Artwork One')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Artwork Two')
    ).toBeInTheDocument()

    await user.click(
        screen.getByRole('button', {
            name: 'Open search',
        })
    )

    await user.type(
        screen.getByRole('textbox', {
            name: 'Search artworks',
        }),
        'Sculptures'
    )

    expect(
        screen.getByText('Artwork Two')
    ).toBeInTheDocument()

    expect(
        screen.queryByText('Artwork One')
    ).not.toBeInTheDocument()
})
it('should close the search field when close search is clicked', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Test Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                },
            ],
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Test Artwork')

    await user.click(
        screen.getByRole('button', {
            name: 'Open search',
        })
    )

    const searchInput = screen.getByRole('textbox', {
        name: 'Search artworks',
    })

    expect(searchInput).toBeInTheDocument()

    await user.type(searchInput, 'Test')

    await user.click(
        screen.getByRole('button', {
            name: 'Close search',
        })
    )

    expect(
        screen.queryByRole('textbox', {
            name: 'Search artworks',
        })
    ).not.toBeInTheDocument()

    expect(
        screen.getByRole('button', {
            name: 'Open search',
        })
    ).toBeInTheDocument()
})
it('should redirect guests to login when an artwork is opened', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: 'art123',
                    title: 'Test Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                },
            ],
        },
    })

    localStorage.removeItem('token')

    const user = userEvent.setup()

    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="/"
                    element={<Gallery />}
                />

                <Route
                    path="/login"
                    element={<div>Login Page</div>}
                />
            </Routes>
        </MemoryRouter>
    )

    await user.click(
        await screen.findByRole('button', {
            name: 'View details for Test Artwork',
        })
    )

    expect(
        await screen.findByText('Login Page')
    ).toBeInTheDocument()
})
it('should show an error message when artworks cannot be loaded', async () => {
    api.get.mockRejectedValue(new Error('Failed to load artworks'))

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
    await screen.findByText('Unable to load artworks.')
).toBeInTheDocument()
})
it('should show loading state while artworks are being loaded', () => {
    api.get.mockReturnValue(new Promise(() => {}))

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        screen.getByText('Preparing the gallery...')
    ).toBeInTheDocument()
})
it('should navigate logged-in users to artwork details when an artwork is opened', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: 'art456',
                    title: 'Test Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                },
            ],
        },
    })

    localStorage.setItem('token', 'test-token')

    const user = userEvent.setup()

    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="/"
                    element={<Gallery />}
                />

                <Route
                    path="/artwork/:id"
                    element={<div>Artwork Details Page</div>}
                />
            </Routes>
        </MemoryRouter>
    )

    await user.click(
        await screen.findByRole('button', {
            name: 'View details for Test Artwork',
        })
    )

    expect(
        await screen.findByText('Artwork Details Page')
    ).toBeInTheDocument()
})
it('should like an artwork when a logged-in user clicks the like button', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: 'art789',
                    title: 'Test Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    likes: [],
                },
            ],
        },
    })

    api.patch.mockResolvedValue({
        data: {
            liked: true,
            likeCount: 1,
        },
    })

    localStorage.setItem('token', 'test-token')
    localStorage.setItem(
        'user',
        JSON.stringify({
            id: 'user123',
            name: 'Test User',
        })
    )

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Test Artwork')

    const likeButton = screen.getByRole('button', {
        name: '0 likes',
    })

    await user.click(likeButton)

    expect(api.patch).toHaveBeenCalledWith(
        '/artworks/art789/like'
    )

    expect(
        await screen.findByRole('button', {
            name: '1 likes',
        })
    ).toBeInTheDocument()
})
it('should not send a like request when a guest clicks the like button', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: 'art999',
                    title: 'Guest Test Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    likes: [],
                },
            ],
        },
    })

    api.patch.mockResolvedValue({
        data: {
            liked: true,
            likeCount: 1,
        },
    })

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Guest Test Artwork')

    const likeButton = screen.getByRole('button', {
        name: '0 likes',
    })

    await user.click(likeButton)

    expect(api.patch).not.toHaveBeenCalled()

    expect(
        screen.getByRole('button', {
            name: '0 likes',
        })
    ).toBeInTheDocument()
})
it('should unlike an already liked artwork when the like button is clicked', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: 'art111',
                    title: 'Already Liked Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    likes: ['user123'],
                },
            ],
        },
    })

    api.patch.mockResolvedValue({
        data: {
            liked: false,
            likeCount: 0,
        },
    })

    localStorage.setItem('token', 'test-token')
    localStorage.setItem(
        'user',
        JSON.stringify({
            id: 'user123',
            name: 'Test User',
        })
    )

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Already Liked Artwork')

    const likeButton = screen.getByRole('button', {
        name: '1 likes',
    })

   expect(likeButton).toBeInTheDocument()

    await user.click(likeButton)

    expect(api.patch).toHaveBeenCalledWith(
        '/artworks/art111/like'
    )

    expect(
        await screen.findByRole('button', {
            name: '0 likes',
        })
    ).not.toHaveClass('liked')
})
it('should keep the like unchanged when the like request fails', async () => {
    api.get.mockResolvedValue({
        data: {
            artworks: [
                {
                    _id: 'art222',
                    title: 'Like Failure Artwork',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    likes: [],
                },
            ],
        },
    })

    api.patch.mockRejectedValue(
        new Error('Like request failed')
    )

    localStorage.setItem('token', 'test-token')
    localStorage.setItem(
        'user',
        JSON.stringify({
            id: 'user123',
            name: 'Test User',
        })
    )

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Like Failure Artwork')

    const likeButton = screen.getByRole('button', {
        name: '0 likes',
    })

    await user.click(likeButton)

    expect(api.patch).toHaveBeenCalledWith(
        '/artworks/art222/like'
    )

    expect(
        await screen.findByRole('button', {
            name: '0 likes',
        })
    ).toBeInTheDocument()
})
it('should navigate to login after successful registration', async () => {
    api.post.mockResolvedValue({
        data: {
            message: 'Registration successful',
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter initialEntries={['/register']}>
            <Routes>
                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<div>Login Page</div>}
                />
            </Routes>
        </MemoryRouter>
    )

    await user.type(
    screen.getByPlaceholderText('Enter your full name'),
    'Test User'
)

await user.type(
    screen.getByPlaceholderText('Enter your email'),
    'test@example.com'
)

await user.type(
    screen.getByPlaceholderText('Create a password'),
    'password123'
)

    await user.selectOptions(
        screen.getByRole('combobox'),
        'user'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account',
        })
    )

    expect(
        await screen.findByText('Login Page', {}, {
            timeout: 2000,
        })
    ).toBeInTheDocument()
})
it('should show an error when the registration password is too short', async () => {
    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    await user.type(
        screen.getByPlaceholderText('Enter your full name'),
        'Test User'
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com'
    )

    await user.type(
        screen.getByPlaceholderText('Create a password'),
        '12345'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account',
        })
    )

    expect(
        screen.getByText('Password must contain at least 6 characters.')
    ).toBeInTheDocument()

    expect(api.post).not.toHaveBeenCalled()
})
it('should register a user as an artist when Artist role is selected', async () => {
    api.post.mockResolvedValue({
        data: {
            message: 'Registration successful',
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    await user.type(
        screen.getByPlaceholderText('Enter your full name'),
        'Test Artist'
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        'artist@example.com'
    )

    await user.type(
        screen.getByPlaceholderText('Create a password'),
        'password123'
    )

    await user.selectOptions(
        screen.getByRole('combobox'),
        'artist'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account',
        })
    )

    expect(api.post).toHaveBeenCalledWith(
        '/auth/register',
        {
            name: 'Test Artist',
            email: 'artist@example.com',
            password: 'password123',
            role: 'artist',
        }
    )
})
it('should trim whitespace from name and email during registration', async () => {
    api.post.mockResolvedValue({
        data: {
            message: 'Registration successful',
        },
    })

    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    await user.type(
        screen.getByPlaceholderText('Enter your full name'),
        '  Test User  '
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        '  test@example.com  '
    )

    await user.type(
        screen.getByPlaceholderText('Create a password'),
        'password123'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account',
        })
    )

    expect(api.post).toHaveBeenCalledWith(
        '/auth/register',
        {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user',
        }
    )
})
it('should show an error when registration fields are empty', async () => {
    const user = userEvent.setup()

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
        name: 'Create Account',
    }).closest('form')

    form.noValidate = true

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account',
        })
    )

    expect(
        screen.getByText('Please fill in all the fields.')
    ).toBeInTheDocument()

    expect(api.post).not.toHaveBeenCalled()
})
it('should submit registration with the entered email', async () => {
    const user = userEvent.setup()

    api.post.mockResolvedValueOnce({
        data: {
            message: 'Registration successful',
        },
    })

    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    const form = screen.getByRole('button', {
    name: 'Create Account',
}).closest('form')

form.noValidate = true

    await user.type(
        screen.getByPlaceholderText('Enter your full name'),
        'Test User'
    )

    await user.type(
        screen.getByPlaceholderText('Enter your email'),
        'invalid-email'
    )

    await user.type(
        screen.getByPlaceholderText('Create a password'),
        'password123'
    )

    await user.click(
        screen.getByRole('button', {
            name: 'Create Account',
        })
    )

    await vi.waitFor(() => {
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'user',
    })
})
})
it('should hide the password by default', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    expect(
        screen.getByPlaceholderText('Create a password')
    ).toHaveAttribute('type', 'password')
})
it('should select user as the default registration role', () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )

    expect(
       screen.getByRole('combobox')
    ).toHaveValue('user')
})
it('should show the empty gallery message when no artworks are available', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Collection Coming Soon')
    ).toBeInTheDocument()

    expect(
        screen.getByText(
            'No approved artworks are currently available in this category.'
        )
    ).toBeInTheDocument()
})
it('should show an error message when artworks fail to load', async () => {
    api.get.mockRejectedValueOnce({
        response: {
            data: {
                message: 'Failed to load artworks',
            },
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Unable to Load Gallery')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Failed to load artworks')
    ).toBeInTheDocument()
})
it('should filter artworks by title search', async () => {
    const artworks = [
        {
            _id: '1',
            title: 'Sunset Landscape',
            artistName: 'Ravi',
            category: 'Paintings',
            likes: [],
        },
        {
            _id: '2',
            title: 'Blue Ocean',
            artistName: 'Anita',
            category: 'Paintings',
            likes: [],
        },
    ]

    api.get.mockResolvedValueOnce({
        data: { artworks },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(await screen.findByText('Sunset Landscape')).toBeInTheDocument()
    expect(screen.getByText('Blue Ocean')).toBeInTheDocument()

    const user = userEvent.setup()

await user.click(
    screen.getByRole('button', {
        name: 'Open search',
    })
)

const searchInput = screen.getByPlaceholderText(/search/i)

await user.type(searchInput, 'Sunset')
    expect(screen.getByText('Sunset Landscape')).toBeInTheDocument()
    expect(screen.queryByText('Blue Ocean')).not.toBeInTheDocument()
})
it('should filter artworks by category', async () => {
    const artworks = [
        {
            _id: '1',
            title: 'Mountain Painting',
            artistName: 'Ravi',
            category: 'Paintings',
            likes: [],
        },
        {
            _id: '2',
            title: 'Stone Sculpture',
            artistName: 'Anita',
            category: 'Sculptures',
            likes: [],
        },
    ]

    api.get.mockResolvedValueOnce({
        data: { artworks },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(await screen.findByText('Mountain Painting')).toBeInTheDocument()
    expect(screen.getByText('Stone Sculpture')).toBeInTheDocument()

    await userEvent.setup().click(
        screen.getByRole('button', {
            name: 'Sculptures',
        })
    )

    expect(screen.getByText('Stone Sculpture')).toBeInTheDocument()
    expect(screen.queryByText('Mountain Painting')).not.toBeInTheDocument()
})
it('should filter artworks by artist search', async () => {
    const artworks = [
        {
            _id: '1',
            title: 'Golden Temple',
            artistName: 'Raja Ravi Varma',
            category: 'Paintings',
            likes: [],
        },
        {
            _id: '2',
            title: 'Blue Ocean',
            artistName: 'Anita',
            category: 'Paintings',
            likes: [],
        },
    ]

    api.get.mockResolvedValueOnce({
        data: { artworks },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(await screen.findByText('Golden Temple')).toBeInTheDocument()
    expect(screen.getByText('Blue Ocean')).toBeInTheDocument()

    const user = userEvent.setup()

    await user.click(
        screen.getByRole('button', {
            name: 'Open search',
        })
    )

    const searchInput = screen.getByPlaceholderText(/search/i)

    await user.type(searchInput, 'Raja Ravi Varma')

    expect(screen.getByText('Golden Temple')).toBeInTheDocument()
    expect(screen.queryByText('Blue Ocean')).not.toBeInTheDocument()
})
it('should filter artworks by category search', async () => {
    const artworks = [
        {
            _id: '1',
            title: 'Digital Dreams',
            artistName: 'Ravi',
            category: 'Digital Art',
            likes: [],
        },
        {
            _id: '2',
            title: 'Clay Pot',
            artistName: 'Anita',
            category: 'Ceramics',
            likes: [],
        },
    ]

    api.get.mockResolvedValueOnce({
        data: { artworks },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(await screen.findByText('Digital Dreams')).toBeInTheDocument()
    expect(screen.getByText('Clay Pot')).toBeInTheDocument()

    const user = userEvent.setup()

    await user.click(
        screen.getByRole('button', {
            name: 'Open search',
        })
    )

    const searchInput = screen.getByPlaceholderText(/search/i)

    await user.type(searchInput, 'Digital Art')

    expect(screen.getByText('Digital Dreams')).toBeInTheDocument()
    expect(screen.queryByText('Clay Pot')).not.toBeInTheDocument()
})
it('should close the search input when the close button is clicked', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const user = userEvent.setup()

    await user.click(
    await screen.findByRole('button', {
        name: 'Open search',
    })
)

    const searchInput = screen.getByPlaceholderText(/search/i)

    expect(searchInput).toBeInTheDocument()

    await user.click(
    await screen.findByRole('button', {
        name: 'Close search',
    })
)

expect(
    screen.queryByPlaceholderText(/search/i)
).not.toBeInTheDocument()
})
it('should display artwork image with the correct alt text', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-1',
                    title: 'Sunset Painting',
                    artistName: 'Ravi Kumar',
                    category: 'Paintings',
                    image: '/uploads/sunset.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const artworkImage = await screen.findByAltText('Sunset Painting')

    expect(artworkImage).toBeInTheDocument()
    expect(artworkImage).toHaveAttribute(
        'src',
        '/uploads/sunset.jpg'
    )
})
it('should display the artwork artist name', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-2',
                    title: 'Royal Portrait',
                    artistName: 'Raja Ravi Varma',
                    category: 'Paintings',
                    image: '/uploads/portrait.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const artistName = await screen.findByText('Raja Ravi Varma')

    expect(artistName).toBeInTheDocument()
})
it('should display the correct artwork like count', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-3',
                    title: 'Mountain Landscape',
                    artistName: 'Anita Rao',
                    category: 'Paintings',
                    image: '/uploads/mountain.jpg',
                    likes: ['user1', 'user2', 'user3'],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const likeButton = await screen.findByRole('button', {
        name: '3 likes',
    })

    expect(likeButton).toBeInTheDocument()
})
it('should provide an accessible label for artwork details', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-4',
                    title: 'Royal Portrait',
                    artistName: 'Raja Ravi Varma',
                    category: 'Paintings',
                    image: '/uploads/royal-portrait.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const artworkCard = await screen.findByRole('button', {
        name: 'View details for Royal Portrait',
    })

    expect(artworkCard).toBeInTheDocument()
})
it('should display the artwork category', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-5',
                    title: 'Blue Horizon',
                    artistName: 'Anita Rao',
                    category: 'Paintings',
                    image: '/uploads/blue-horizon.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const category = await screen.findByText('Paintings')

    expect(category).toBeInTheDocument()
})
it('should update the search input when the user types', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const user = userEvent.setup()

    await user.click(
        await screen.findByRole('button', {
            name: 'Open search',
        })
    )

    const searchInput = screen.getByPlaceholderText('Search artworks')

    await user.type(searchInput, 'Ravi')

    expect(searchInput).toHaveValue('Ravi')
})
it('should clear the search input and restore the gallery results', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-6',
                    title: 'Sunset Painting',
                    artistName: 'Ravi Kumar',
                    category: 'Paintings',
                    image: '/uploads/sunset.jpg',
                    likes: [],
                },
                {
                    _id: 'artwork-7',
                    title: 'Mountain View',
                    artistName: 'Anita Rao',
                    category: 'Paintings',
                    image: '/uploads/mountain.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const user = userEvent.setup()

    await user.click(
        await screen.findByRole('button', {
            name: 'Open search',
        })
    )

    const searchInput = screen.getByPlaceholderText('Search artworks')

    await user.type(searchInput, 'Sunset')

    expect(searchInput).toHaveValue('Sunset')
    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
    expect(screen.queryByText('Mountain View')).not.toBeInTheDocument()

    await user.clear(searchInput)

    expect(searchInput).toHaveValue('')
    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
    expect(screen.getByText('Mountain View')).toBeInTheDocument()
})
it('should update the active category when a category is clicked', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-8',
                    title: 'Stone Sculpture',
                    artistName: 'Ravi Kumar',
                    category: 'Sculptures',
                    image: '/uploads/sculpture.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const user = userEvent.setup()

    const sculpturesButton = await screen.findByRole('button', {
        name: 'Sculptures',
    })

    expect(
        screen.getByRole('button', { name: 'All' })
    ).toHaveClass('active')

    await user.click(sculpturesButton)

    expect(sculpturesButton).toHaveClass('active')
    expect(
        screen.getByRole('button', { name: 'All' })
    ).not.toHaveClass('active')
})
it('should restore the All category when All is clicked', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-9',
                    title: 'Portrait',
                    artistName: 'Ravi Kumar',
                    category: 'Paintings',
                    image: '/uploads/portrait.jpg',
                    likes: [],
                },
                {
                    _id: 'artwork-10',
                    title: 'Stone Figure',
                    artistName: 'Anita Rao',
                    category: 'Sculptures',
                    image: '/uploads/figure.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    const user = userEvent.setup()

    await user.click(
        await screen.findByRole('button', {
            name: 'Sculptures',
        })
    )

    expect(
        screen.getByRole('button', { name: 'Sculptures' })
    ).toHaveClass('active')

    await user.click(
        screen.getByRole('button', { name: 'All' })
    )

    expect(
        screen.getByRole('button', { name: 'All' })
    ).toHaveClass('active')

    expect(
        screen.getByRole('button', { name: 'Sculptures' })
    ).not.toHaveClass('active')
})
it('should initially display only 9 artworks', async () => {
    const artworks = Array.from({ length: 10 }, (_, index) => ({
        _id: `artwork-${index + 1}`,
        title: `Artwork ${index + 1}`,
        artistName: 'Test Artist',
        category: 'Paintings',
        image: `/uploads/artwork-${index + 1}.jpg`,
        likes: [],
    }))

    api.get.mockResolvedValueOnce({
        data: {
            artworks,
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Artwork 1')

    expect(screen.getByText('Artwork 9')).toBeInTheDocument()
    expect(screen.queryByText('Artwork 10')).not.toBeInTheDocument()
})
it('should load more artworks when the gallery observer is triggered', async () => {
    const artworks = Array.from({ length: 10 }, (_, index) => ({
        _id: `artwork-${index + 1}`,
        title: `Artwork ${index + 1}`,
        artistName: 'Test Artist',
        category: 'Paintings',
        image: `/uploads/artwork-${index + 1}.jpg`,
        likes: [],
    }))

    api.get.mockResolvedValueOnce({
        data: {
            artworks,
        },
    })

    global.IntersectionObserver = class {
        constructor(callback) {
            this.callback = callback
        }

        observe() {
            this.callback([{ isIntersecting: true }])
        }

        unobserve() {}

        disconnect() {}
    }

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Artwork 1')

    expect(
        screen.queryByText('Artwork 10')
    ).not.toBeInTheDocument()

    await new Promise((resolve) => setTimeout(resolve, 400))

    expect(
        screen.getByText('Artwork 10')
    ).toBeInTheDocument()
})
it('should display all artworks when fewer than 9 are available', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: 'artwork-small-1',
                    title: 'Small Collection 1',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    image: '/uploads/one.jpg',
                    likes: [],
                },
                {
                    _id: 'artwork-small-2',
                    title: 'Small Collection 2',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    image: '/uploads/two.jpg',
                    likes: [],
                },
                {
                    _id: 'artwork-small-3',
                    title: 'Small Collection 3',
                    artistName: 'Test Artist',
                    category: 'Paintings',
                    image: '/uploads/three.jpg',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Small Collection 1')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Small Collection 2')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Small Collection 3')
    ).toBeInTheDocument()
})
it('should display the API error message when artwork loading fails', async () => {
    api.get.mockRejectedValueOnce({
        response: {
            data: {
                message: 'Server is temporarily unavailable.',
            },
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Server is temporarily unavailable.')
    ).toBeInTheDocument()
})
it('should display the default error message when no API message is provided', async () => {
    api.get.mockRejectedValueOnce({
        response: {
            data: {},
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Unable to load artworks.')
    ).toBeInTheDocument()
})
it('should display the loading message while artworks are loading', () => {
    api.get.mockReturnValueOnce(new Promise(() => {}))

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(screen.getByText('Preparing the gallery...')).toBeInTheDocument()
})
it('should display the empty gallery message when no artworks are available', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Collection Coming Soon')
    ).toBeInTheDocument()

    expect(
        screen.getByText(
            'No approved artworks are currently available in this category.'
        )
    ).toBeInTheDocument()
})
it('should handle a successful API response with no artworks field', async () => {
    api.get.mockResolvedValueOnce({
        data: {},
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Collection Coming Soon')
    ).toBeInTheDocument()
})
it('should display the empty message when a category has no matching artworks', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Oil Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Oil Painting')

    const sculpturesButton = screen.getByRole('button', {
        name: 'Sculptures',
    })

    await userEvent.click(sculpturesButton)

    expect(
        screen.getByText('Collection Coming Soon')
    ).toBeInTheDocument()

    expect(
        screen.getByText(
            'No approved artworks are currently available in this category.'
        )
    ).toBeInTheDocument()
})
it('should display the empty message when search has no matching artworks', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Nonexistent Artwork')

    expect(
        screen.getByText('Collection Coming Soon')
    ).toBeInTheDocument()
})
it('should search artworks without being case-sensitive', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Raja Ravi Varma',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'SUNSET PAINTING')

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
})
it('should handle search text with leading and trailing spaces', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, '  Sunset Painting  ')

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
})
it('should show all artworks when the search text is empty', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
                {
                    _id: '2',
                    title: 'Mountain Sculpture',
                    category: 'Sculptures',
                    artistName: 'Another Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Sunset')

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
    expect(screen.queryByText('Mountain Sculpture')).not.toBeInTheDocument()

    await userEvent.clear(searchInput)

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
    expect(screen.getByText('Mountain Sculpture')).toBeInTheDocument()
})
it('should filter artworks without being case-sensitive', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Modern Art',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
                {
                    _id: '2',
                    title: 'Stone Work',
                    category: 'Sculptures',
                    artistName: 'Another Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Modern Art')

    const paintingsButton = screen.getByRole('button', {
        name: 'Paintings',
    })

    await userEvent.click(paintingsButton)

    expect(screen.getByText('Modern Art')).toBeInTheDocument()
    expect(screen.queryByText('Stone Work')).not.toBeInTheDocument()
})
it('should find an artwork when searching by part of its title', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Beautiful Sunset Landscape',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Beautiful Sunset Landscape')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Sunset')

    expect(
        screen.getByText('Beautiful Sunset Landscape')
    ).toBeInTheDocument()
})
it('should find artworks when searching by part of the artist name', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Royal Portrait',
                    category: 'Paintings',
                    artistName: 'Raja Ravi Varma',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Royal Portrait')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Ravi')

    expect(screen.getByText('Royal Portrait')).toBeInTheDocument()
})
it('should find artworks when searching by part of the category', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Digital Dreams',
                    category: 'Digital Art',
                    artistName: 'Test Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Digital Dreams')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Digital')

    expect(screen.getByText('Digital Dreams')).toBeInTheDocument()
})
it('should remove an artwork when the search term no longer matches', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
                {
                    _id: '2',
                    title: 'Mountain Sculpture',
                    category: 'Sculptures',
                    artistName: 'Another Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Sunset')

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
    expect(screen.queryByText('Mountain Sculpture')).not.toBeInTheDocument()

    await userEvent.clear(searchInput)
    await userEvent.type(searchInput, 'Mountain')

    expect(screen.queryByText('Sunset Painting')).not.toBeInTheDocument()
    expect(screen.getByText('Mountain Sculpture')).toBeInTheDocument()
})
it('should restore matching artworks when switching back to their category', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
                {
                    _id: '2',
                    title: 'Stone Sculpture',
                    category: 'Sculptures',
                    artistName: 'Another Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Sculptures' })
    )

    expect(screen.getByText('Stone Sculpture')).toBeInTheDocument()
    expect(screen.queryByText('Sunset Painting')).not.toBeInTheDocument()

    await userEvent.click(
        screen.getByRole('button', { name: 'Paintings' })
    )

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument()
    expect(screen.queryByText('Stone Sculpture')).not.toBeInTheDocument()
})
it('should apply search correctly after changing category', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artworks: [
                {
                    _id: '1',
                    title: 'Sunset Painting',
                    category: 'Paintings',
                    artistName: 'Test Artist',
                    likes: [],
                },
                {
                    _id: '2',
                    title: 'Sunset Sculpture',
                    category: 'Sculptures',
                    artistName: 'Another Artist',
                    likes: [],
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Gallery />
        </MemoryRouter>
    )

    await screen.findByText('Sunset Painting')

    await userEvent.click(
        screen.getByRole('button', { name: 'Sculptures' })
    )

    await userEvent.click(
        screen.getByRole('button', { name: 'Open search' })
    )

    const searchInput = screen.getByPlaceholderText(/search artworks/i)

    await userEvent.type(searchInput, 'Sunset')

    expect(screen.getByText('Sunset Sculpture')).toBeInTheDocument()
    expect(screen.queryByText('Sunset Painting')).not.toBeInTheDocument()
})
it('should render the Artists page successfully', () => {
    render(
        <MemoryRouter>
            <Artists />
        </MemoryRouter>
    )

    expect(
        screen.getByRole('heading', { name: /the artists behind/i })
    ).toBeInTheDocument()
})
it('should display artists returned by the API', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artists: [
                {
                    _id: 'artist1',
                    name: 'Raja Ravi Varma',
                    profileImage: '/uploads/raja-ravi-varma.jpg',
                    bio: 'Indian painter and artist.',
                },
            ],
        },
    })

    render(
        <MemoryRouter>
            <Artists />
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Raja Ravi Varma')
    ).toBeInTheDocument()
})
it('should navigate to an artist profile when an artist is selected', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            artists: [
                {
                    _id: 'artist1',
                    name: 'Raja Ravi Varma',
                    profileImage: '/uploads/raja-ravi-varma.jpg',
                    bio: 'Indian painter and artist.',
                },
            ],
        },
    })

    render(
        <MemoryRouter
            initialEntries={['/artists']}
        >
            <Routes>
                <Route path="/artists" element={<Artists />} />
                <Route
                    path="/artists/:id"
                    element={<div>Artist Profile Page</div>}
                />
            </Routes>
        </MemoryRouter>
    )

    const artist = await screen.findByText('Raja Ravi Varma')
    await userEvent.click(artist)

    expect(
        await screen.findByText('Artist Profile Page')
    ).toBeInTheDocument()
})
it('should render the Artist Profile page successfully', async () => {
    global.fetch.mockResolvedValueOnce({
        json: async () => ({
            success: true,
            artist: {
                _id: 'artist1',
                name: 'Raja Ravi Varma',
                profileImage: '/uploads/raja-ravi-varma.jpg',
                biography: 'Indian painter and artist.',
                artistStatement: 'Art is a reflection of life.',
            },
            artworks: [],
        }),
    })

    render(
        <MemoryRouter initialEntries={['/artists/artist1']}>
            <Routes>
                <Route path="/artists/:id" element={<ArtistProfile />} />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Raja Ravi Varma')
    ).toBeInTheDocument()
})
it('should display published artworks on the Artist Profile page', async () => {
    global.fetch.mockResolvedValueOnce({
        json: async () => ({
            success: true,
            artist: {
                _id: 'artist1',
                name: 'Raja Ravi Varma',
                biography: 'Indian painter and artist.',
                artistStatement: 'Art is a reflection of life.',
            },
            artworks: [
                {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    category: 'Paintings',
                    image: '/uploads/shakuntala.jpg',
                },
            ],
        }),
    })

    render(
        <MemoryRouter initialEntries={['/artists/artist1']}>
            <Routes>
                <Route path="/artists/:id" element={<ArtistProfile />} />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()
})
it('should render the Artwork Details page successfully', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artwork: {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    image: '/uploads/shakuntala.jpg',
                    story: 'A beautiful artwork inspired by Indian mythology.',
                    medium: 'Oil on Canvas',
                    year: '1899',
                    dimensions: '60 × 45 cm',
                    orientation: 'Portrait',
                    framed: 'Yes',
                    availability: 'Available',
                    price: 50000,
                    likes: [],
                },
                replicas: [],
            },
        })
        .mockResolvedValueOnce({
            data: {
                comments: [],
            },
        })
        .mockResolvedValueOnce({
            data: {
                artworks: [],
            },
        })

    render(
        <MemoryRouter initialEntries={['/artwork/artwork1']}>
            <Routes>
                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()
})
it('should display artwork information on the Artwork Details page', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artwork: {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    image: '/uploads/shakuntala.jpg',
                    story: 'A beautiful artwork inspired by Indian mythology.',
                    medium: 'Oil on Canvas',
                    year: '1899',
                    dimensions: '60 × 45 cm',
                    orientation: 'Portrait',
                    framed: 'Yes',
                    availability: 'Available',
                    price: 50000,
                    likes: [],
                },
                replicas: [],
            },
        })
        .mockResolvedValueOnce({
            data: {
                comments: [],
            },
        })
        .mockResolvedValueOnce({
            data: {
                artworks: [],
            },
        })

    render(
        <MemoryRouter initialEntries={['/artwork/artwork1']}>
            <Routes>
                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(await screen.findAllByText('Oil on Canvas')).not.toHaveLength(0)
    expect(screen.getAllByText('1899')).not.toHaveLength(0)
    expect(screen.getByText('60 × 45 cm')).toBeInTheDocument()
   expect(screen.getAllByText('Portrait')).not.toHaveLength(0)
})
it('should display the artwork story on the Artwork Details page', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artwork: {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    image: '/uploads/shakuntala.jpg',
                    story: 'A beautiful artwork inspired by Indian mythology.',
                    medium: 'Oil on Canvas',
                    year: '1899',
                    dimensions: '60 × 45 cm',
                    orientation: 'Portrait',
                    framed: 'Yes',
                    availability: 'Available',
                    price: 50000,
                    likes: [],
                },
                replicas: [],
            },
        })
        .mockResolvedValueOnce({
            data: { comments: [] },
        })
        .mockResolvedValueOnce({
            data: { artworks: [] },
        })

    render(
        <MemoryRouter initialEntries={['/artwork/artwork1']}>
            <Routes>
                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText(
            'A beautiful artwork inspired by Indian mythology.'
        )
    ).toBeInTheDocument()
})
it('should display the artist name on the Artwork Details page', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artwork: {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    image: '/uploads/shakuntala.jpg',
                    story: 'A beautiful artwork inspired by Indian mythology.',
                    medium: 'Oil on Canvas',
                    year: '1899',
                    dimensions: '60 × 45 cm',
                    orientation: 'Portrait',
                    framed: 'Yes',
                    availability: 'Available',
                    price: 50000,
                    likes: [],
                },
                replicas: [],
            },
        })
        .mockResolvedValueOnce({
            data: { comments: [] },
        })
        .mockResolvedValueOnce({
            data: { artworks: [] },
        })

    render(
        <MemoryRouter initialEntries={['/artwork/artwork1']}>
            <Routes>
                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
    await screen.findAllByText('Raja Ravi Varma')
).not.toHaveLength(0)
})
it('should display the artwork image on the Artwork Details page', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artwork: {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    image: '/uploads/shakuntala.jpg',
                    story: 'A beautiful artwork inspired by Indian mythology.',
                    medium: 'Oil on Canvas',
                    year: '1899',
                    dimensions: '60 × 45 cm',
                    orientation: 'Portrait',
                    framed: 'Yes',
                    availability: 'Available',
                    price: 50000,
                    likes: [],
                },
                replicas: [],
            },
        })
        .mockResolvedValueOnce({
            data: { comments: [] },
        })
        .mockResolvedValueOnce({
            data: { artworks: [] },
        })

    render(
        <MemoryRouter initialEntries={['/artwork/artwork1']}>
            <Routes>
                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
            </Routes>
        </MemoryRouter>
    )

    const artworkImages = await screen.findAllByAltText('Shakuntala')

    expect(artworkImages.length).toBeGreaterThan(0)
    expect(artworkImages[0]).toHaveAttribute(
        'src',
        '/uploads/shakuntala.jpg'
    )
})
it('should display comments on the Artwork Details page', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artwork: {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    image: '/uploads/shakuntala.jpg',
                    story: 'A beautiful artwork inspired by Indian mythology.',
                    medium: 'Oil on Canvas',
                    year: '1899',
                    dimensions: '60 × 45 cm',
                    orientation: 'Portrait',
                    framed: 'Yes',
                    availability: 'Available',
                    price: 50000,
                    likes: [],
                },
                replicas: [],
            },
        })
        .mockResolvedValueOnce({
            data: {
                comments: [
                    {
                        _id: 'comment1',
                        text: 'Beautiful artwork!',
                        user: {
                            name: 'Meghana',
                        },
                    },
                ],
            },
        })
        .mockResolvedValueOnce({
            data: { artworks: [] },
        })

    render(
        <MemoryRouter initialEntries={['/artwork/artwork1']}>
            <Routes>
                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Beautiful artwork!')
    ).toBeInTheDocument()
})
it('should display favorite artworks returned by the API', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            favorites: [
                {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    category: 'Paintings',
                    image: '/uploads/shakuntala.jpg',
                },
            ],
        },
    })

    render(
        <MemoryRouter initialEntries={['/favorites']}>
            <Routes>
                <Route
                    path="/favorites"
                    element={<Favorites isLoggedIn={true} />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Raja Ravi Varma')
    ).toBeInTheDocument()
})
it('should display the artist artworks returned by the API', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            role: 'artist',
            name: 'Raja Ravi Varma'
        })
    )

    api.get.mockResolvedValueOnce({
        data: {
            success: true,
            artworks: [
                {
                    _id: 'artwork1',
                    title: 'Shakuntala',
                    artistName: 'Raja Ravi Varma',
                    category: 'Painting',
                    status: 'approved',
                    image: '/uploads/shakuntala.jpg',
                    availability: 'Available',
                    replicaPrices: {}
                }
            ]
        }
    })

    render(
        <MemoryRouter initialEntries={['/my-artworks']}>
            <Routes>
                <Route
                    path="/my-artworks"
                    element={<ArtistMyArtworks />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Raja Ravi Varma')
    ).toBeInTheDocument()
})
it('should display the user profile and liked artworks', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Meghana',
            email: 'meghana@example.com',
            role: 'user'
        })
    )

    api.get
        .mockResolvedValueOnce({
            data: {
                favorites: [
                    {
                        _id: 'artwork1',
                        title: 'Shakuntala',
                        artistName: 'Raja Ravi Varma',
                        image: '/uploads/shakuntala.jpg'
                    }
                ]
            }
        })
        .mockResolvedValueOnce({
            data: {
                comments: []
            }
        })

    render(
        <MemoryRouter initialEntries={['/user-profile']}>
            <Routes>
                <Route
                    path="/user-profile"
                    element={<UserProfile />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        screen.getByRole('heading', { name: 'Meghana' })
    ).toBeInTheDocument()

    expect(
        screen.getByText('meghana@example.com')
    ).toBeInTheDocument()

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()
})
it('should display purchased artworks returned by the API', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Meghana',
            email: 'meghana@example.com',
            role: 'user'
        })
    )

    api.get.mockResolvedValueOnce({
        data: {
            purchases: [
                {
                    _id: 'purchase1',
                    amount: 25000,
                    transactionId: 'TXN12345',
                    paymentStatus: 'Paid',
                    createdAt: '2026-08-01T10:00:00.000Z',
                    artwork: {
                        _id: 'artwork1',
                        title: 'Shakuntala',
                        artistName: 'Raja Ravi Varma',
                        category: 'Painting',
                        image: '/uploads/shakuntala.jpg'
                    }
                }
            ]
        }
    })

    render(
        <MemoryRouter initialEntries={['/my-purchases']}>
            <Routes>
                <Route
                    path="/my-purchases"
                    element={<MyPurchases />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
    screen.getByText(/Raja Ravi Varma/)
).toBeInTheDocument()

    expect(
        screen.getByText('TXN12345')
    ).toBeInTheDocument()
})
it('should display the artwork details on the payment page', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Meghana',
            email: 'meghana@example.com',
            role: 'user'
        })
    )

    api.get.mockResolvedValueOnce({
        data: {
            artwork: {
                _id: 'artwork1',
                title: 'Shakuntala',
                artistName: 'Raja Ravi Varma',
                price: 50000,
                availability: 'Available',
                image: '/uploads/shakuntala.jpg'
            }
        }
    })

    render(
        <MemoryRouter initialEntries={['/payment/artwork1']}>
            <Routes>
                <Route
                    path="/payment/:id"
                    element={<Payment />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
        screen.getByText(/Raja Ravi Varma/)
    ).toBeInTheDocument()

    expect(
        screen.getAllByText('₹50,000').length
    ).toBeGreaterThan(0)
})
it('should display notifications returned by the API', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            name: 'Raja Ravi Varma',
            email: 'artist@example.com',
            role: 'artist'
        })
    )

    api.get.mockResolvedValueOnce({
        data: {
            notifications: [
                {
                    _id: 'notification1',
                    message: 'Your artwork "Shakuntala" has been approved.',
                    status: 'approved',
                    isRead: false,
                    createdAt: '2026-08-01T10:00:00.000Z'
                }
            ]
        }
    })

    render(
        <MemoryRouter initialEntries={['/notifications']}>
            <Routes>
                <Route
                    path="/notifications"
                    element={<Notifications />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText(
            'Your artwork "Shakuntala" has been approved.'
        )
    ).toBeInTheDocument()

    expect(
        screen.getByRole('heading', { name: /notifications/i })
    ).toBeInTheDocument()
})
it('should render the Home page with featured artist and artwork', async () => {
    api.get
        .mockResolvedValueOnce({
            data: {
                artworks: [
                    {
                        _id: 'artwork1',
                        title: 'Shakuntala',
                        artistName: 'Raja Ravi Varma',
                        category: 'Painting',
                        year: 1899,
                        image: '/uploads/shakuntala.jpg'
                    }
                ]
            }
        })
        .mockResolvedValueOnce({
            data: {
                artists: [
                    {
                        _id: 'artist1',
                        name: 'Raja Ravi Varma',
                        profileImage: '/uploads/raja-ravi-varma.jpg',
                        artistStatement:
                            'An artist known for combining Indian traditions with European techniques.'
                    }
                ]
            }
        })

    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </MemoryRouter>
    )

    expect(
    (await screen.findAllByText('Raja Ravi Varma')).length
).toBeGreaterThan(0)

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
        screen.getByRole('heading', { name: /selected artworks/i })
    ).toBeInTheDocument()
})
it('should display exhibitions returned by the API', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            exhibitions: [
                {
                    _id: 'exhibition1',
                    title: 'Echoes of Time',
                    startDate: '2026-08-15T00:00:00.000Z',
                    endDate: '2026-09-30T00:00:00.000Z',
                    location: 'ArteVora Gallery',
                    description:
                        'A curated exhibition celebrating craftsmanship, culture and artistic expression.',
                    coverImage: '/uploads/echoes-of-time.jpg',
                    exhibitionType: 'physical'
                }
            ]
        }
    })

    render(
        <MemoryRouter initialEntries={['/exhibitions']}>
            <Routes>
                <Route
                    path="/exhibitions"
                    element={<Exhibitions />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Echoes of Time')
    ).toBeInTheDocument()

    expect(
        screen.getByText('ArteVora Gallery')
    ).toBeInTheDocument()

    expect(
        screen.getByRole('button', {
            name: /view exhibition/i
        })
    ).toBeInTheDocument()
})
it('should display exhibition details returned by the API', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            exhibition: {
                _id: 'exhibition1',
                title: 'Echoes of Time',
                subtitle: 'A Celebration of Artistic Expression',
                startDate: '2026-08-15T00:00:00.000Z',
                endDate: '2026-09-30T00:00:00.000Z',
                coverImage: '/uploads/echoes-of-time.jpg',
                overviewImage: '/uploads/echoes-overview.jpg',
                exhibitionPurpose:
                    'A curated exhibition celebrating craftsmanship and culture.',
                description:
                    'Discover contemporary paintings and sculptures celebrating artistic expression.',
                artworks: [
                    {
                        _id: 'artwork1',
                        title: 'Shakuntala',
                        artistName: 'Raja Ravi Varma',
                        image: '/uploads/shakuntala.jpg'
                    }
                ],
                artists: [],
                installationShots: []
            }
        }
    })

    render(
        <MemoryRouter initialEntries={['/exhibitions/exhibition1']}>
            <Routes>
                <Route
                    path="/exhibitions/:id"
                    element={<ExhibitionDetails />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByRole('heading', {
            name: 'Echoes of Time'
        })
    ).toBeInTheDocument()

    expect(
        screen.getByText('A Celebration of Artistic Expression')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Raja Ravi Varma')
    ).toBeInTheDocument()
})
it('should display the Virtual Tour entrance after loading', async () => {
    api.get.mockImplementation((url) => {
        if (url === '/exhibitions') {
            return Promise.resolve({
                data: {
                    exhibitions: [
                        {
                            _id: 'exhibition1',
                            title: 'Echoes of Time',
                            exhibitionType: 'virtual'
                        }
                    ]
                }
            })
        }

        if (url === '/exhibitions/exhibition1') {
            return Promise.resolve({
                data: {
                    exhibition: {
                        _id: 'exhibition1',
                        title: 'Echoes of Time',
                        exhibitionType: 'virtual'
                    }
                }
            })
        }

        if (url === '/virtual-rooms') {
            return Promise.resolve({
                data: {
                    virtualRoom: {
                        welcomeBackgroundImage:
                            '/uploads/virtual-room.jpg'
                    }
                }
            })
        }

        return Promise.reject(new Error('Unexpected API request'))
    })

    render(
        <MemoryRouter initialEntries={['/virtual-tour']}>
            <Routes>
                <Route
                    path="/virtual-tour"
                    element={<VirtualTour />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        screen.getByText('Preparing Your Visit')
    ).toBeInTheDocument()

    expect(
        await screen.findByText(
            'Welcome to the Exhibition',
            {},
            { timeout: 3000 }
        )
    ).toBeInTheDocument()

    expect(
        screen.getByRole('button', {
            name: /enter exhibition/i
        })
    ).toBeInTheDocument()
})
it('should display sales returned by the API', async () => {
    api.get.mockResolvedValueOnce({
        data: {
            success: true,
            sales: [
                {
                    _id: 'sale1',
                    amount: 50000,
                    orderStatus: 'Completed',
                    transactionId: 'TXN12345',
                    artwork: {
                        title: 'Shakuntala',
                        image: '/uploads/shakuntala.jpg'
                    },
                    buyer: {
                        name: 'Meghana',
                        email: 'meghana@example.com'
                    }
                }
            ]
        }
    })

    render(
        <MemoryRouter initialEntries={['/artist-sales']}>
            <Routes>
                <Route
                    path="/artist-sales"
                    element={<ArtistSales />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Shakuntala')
    ).toBeInTheDocument()
expect(
    screen.getByText(/Buyer:\s*Meghana/i)
).toBeInTheDocument()
    expect(
        screen.getByText('meghana@example.com')
    ).toBeInTheDocument()

    expect(
    screen.getByText(/Transaction ID:\s*TXN12345/i)
).toBeInTheDocument()
    expect(
        screen.getAllByText('₹50,000').length
    ).toBeGreaterThan(0)

   expect(
    screen.getAllByText('Completed').length
).toBeGreaterThan(0)
})
it('should display the artist dashboard with artwork data', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            id: 'artist1',
            name: 'Raja Ravi Varma',
            email: 'artist@example.com',
            role: 'artist'
        })
    )

    api.get.mockImplementation((url) => {
        if (url === '/artworks/my-artworks') {
            return Promise.resolve({
                data: {
                    success: true,
                    artworks: [
                        {
                            _id: 'artwork1',
                            title: 'Shakuntala',
                            category: 'Painting',
                            status: 'approved',
                            image: '/uploads/shakuntala.jpg',
                            likes: []
                        }
                    ]
                }
            })
        }

        if (url === '/artists/profile/biography') {
            return Promise.resolve({
                data: {
                    success: true,
                    artist: {
                        biography:
                            'A renowned artist known for his Indian paintings.',
                        artistStatement:
                            'Combining Indian traditions with European techniques.'
                    }
                }
            })
        }

        if (url === '/comments/my-artwork-comments') {
            return Promise.resolve({
                data: {
                    comments: []
                }
            })
        }

        if (url === '/enquiries/my-enquiries') {
            return Promise.resolve({
                data: {
                    enquiries: []
                }
            })
        }

        if (url === '/purchases/my-sales') {
            return Promise.resolve({
                data: {
                    sales: []
                }
            })
        }

        return Promise.reject(
            new Error(`Unexpected API request: ${url}`)
        )
    })

    render(
        <MemoryRouter initialEntries={['/artist-dashboard']}>
            <Routes>
                <Route
                    path="/artist-dashboard"
                    element={<ArtistDashboard />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText(
            'Welcome back, Raja Ravi Varma'
        )
    ).toBeInTheDocument()

    expect(
        screen.getByText('Shakuntala')
    ).toBeInTheDocument()

    expect(
        screen.getByText('Painting')
    ).toBeInTheDocument()
})
it('should display the admin dashboard with artwork data', async () => {
    localStorage.setItem(
        'user',
        JSON.stringify({
            id: 'admin1',
            name: 'Admin',
            email: 'admin@example.com',
            role: 'admin'
        })
    )

    api.get.mockImplementation((url) => {
        if (url === '/artworks/admin/all') {
            return Promise.resolve({
                data: {
                    success: true,
                    artworks: [
                        {
                            _id: 'artwork1',
                            title: 'Shakuntala',
                            artistName: 'Raja Ravi Varma',
                            category: 'Painting',
                            status: 'pending',
                            image: '/uploads/shakuntala.jpg',
                            description:
                                'A famous Indian painting.'
                        }
                    ]
                }
            })
        }

        return Promise.reject(
            new Error(`Unexpected API request: ${url}`)
        )
    })

    render(
        <MemoryRouter initialEntries={['/admin-dashboard']}>
            <Routes>
                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />
            </Routes>
        </MemoryRouter>
    )

    expect(
        await screen.findByText('Welcome back, Admin')
    ).toBeInTheDocument()

    expect(
    await screen.findByText('Welcome back, Admin')
).toBeInTheDocument()

expect(
    screen.getByText('PENDING')
).toBeInTheDocument()

expect(
    screen.getByText('Awaiting review')
).toBeInTheDocument()

expect(
    screen.getByText('pending submissions')
).toBeInTheDocument()
    expect(
        screen.getByText('PENDING')
    ).toBeInTheDocument()
})
})