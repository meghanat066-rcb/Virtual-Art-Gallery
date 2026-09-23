import { useEffect, useState } from 'react'
import {
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    FaArrowLeft,
    FaCheckCircle,
    FaCreditCard,
    FaEnvelope,
    FaHome,
    FaLock,
    FaMobileAlt,
    FaMoneyBillWave,
    FaPhoneAlt,
    FaShieldAlt,
    FaUniversity,
    FaUser,
    FaWallet
} from 'react-icons/fa'

import api from '../services/api'
import './Payment.css'

function Payment() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [artwork, setArtwork] = useState(null)

    const selectedDimensions =
    location.state?.selectedDimensions || 'Not specified'

const selectedPrice =
    Number(location.state?.selectedPrice) ||
    Number(artwork?.price) ||
    0

    const [phoneNumber, setPhoneNumber] = useState('')
    const [shippingAddress, setShippingAddress] = useState('')

    const [paymentMethod, setPaymentMethod] = useState('upi')
    const [upiId, setUpiId] = useState('')

    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')

    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState(false)
    const [error, setError] = useState('')

    const [user] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    )

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (user.role !== 'user') {
            navigate('/gallery')
            return
        }

        const fetchArtwork = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await api.get(`/artworks/${id}`)

                const fetchedArtwork = response.data?.artwork

                if (!fetchedArtwork) {
                    setError('Artwork not found.')
                    return
                }

                if (
                    !fetchedArtwork.price ||
                    Number(fetchedArtwork.price) <= 0
                ) {
                    setError('Artwork price is not available.')
                    return
                }

                if (
                    fetchedArtwork.availability &&
                    fetchedArtwork.availability !== 'Available'
                ) {
                    setError(
                        `This artwork is currently ${fetchedArtwork.availability.toLowerCase()}.`
                    )
                    return
                }

                setArtwork(fetchedArtwork)
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load artwork.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchArtwork()
    }, [id, navigate, user])

    const handlePhoneChange = (event) => {
        const numbersOnly = event.target.value
            .replace(/\D/g, '')
            .slice(0, 10)

        setPhoneNumber(numbersOnly)
    }

    const handleCardNumberChange = (event) => {
        const numbersOnly = event.target.value
            .replace(/\D/g, '')
            .slice(0, 16)

        setCardNumber(numbersOnly)
    }

    const handleExpiryChange = (event) => {
        let value = event.target.value
            .replace(/\D/g, '')
            .slice(0, 4)

        if (value.length > 2) {
            value =
                value.substring(0, 2) +
                '/' +
                value.substring(2)
        }

        setExpiryDate(value)
    }

    const handleCvvChange = (event) => {
        const numbersOnly = event.target.value
            .replace(/\D/g, '')
            .slice(0, 3)

        setCvv(numbersOnly)
    }

    const validatePayment = () => {
        if (paymentMethod === 'upi') {
            if (!upiId.trim()) {
                return 'Please enter your UPI ID.'
            }
        }

        if (paymentMethod === 'card') {
            if (cardNumber.length !== 16) {
                return 'Please enter a valid 16-digit card number.'
            }

            if (!cardName.trim()) {
                return 'Please enter the name on the card.'
            }

            if (expiryDate.length !== 5) {
                return 'Please enter a valid expiry date.'
            }

            if (cvv.length !== 3) {
                return 'Please enter a valid CVV.'
            }
        }

        return ''
    }

    const handlePurchase = async (event) => {
        event.preventDefault()

        if (phoneNumber.length !== 10) {
            setError(
                'Please enter a valid 10-digit phone number.'
            )
            return
        }

        if (!shippingAddress.trim()) {
            setError(
                'Please enter your complete shipping address.'
            )
            return
        }

        const paymentError = validatePayment()

        if (paymentError) {
            setError(paymentError)
            return
        }

        try {
            setPurchasing(true)
            setError('')

            const response = await api.post('/purchases', {
                artworkId: id,
                phoneNumber,
                shippingAddress: shippingAddress.trim()
            })

            toast.success(
                response.data.message ||
                'Purchase completed successfully!'
            )

            setTimeout(() => {
                navigate('/my-purchases')
            }, 1200)
        } catch (err) {
            const message =
                err.response?.data?.message ||
                'Unable to complete purchase.'

            setError(message)
            toast.error(message)
        } finally {
            setPurchasing(false)
        }
    }

    if (loading) {
        return (
            <main className="purchase-state-page">
                <div className="purchase-loader" />

                <h1>Preparing Your Purchase</h1>

                <p>
                    Loading artwork and buyer information...
                </p>
            </main>
        )
    }

    if (error && !artwork) {
        return (
            <main className="purchase-state-page">
                <h1>Purchase Unavailable</h1>

                <p className="purchase-error">
                    {error}
                </p>

                <button
                    type="button"
                    className="purchase-dark-button"
                    onClick={() => navigate('/gallery')}
                >
                    <FaArrowLeft />
                    Back to Artworks
                </button>
            </main>
        )
    }

    const formattedPrice = `₹${selectedPrice.toLocaleString('en-IN')}`

    return (
        <main className="artevora-payment-page">

            {/* BACK BUTTON */}

            <button
                type="button"
                className="artevora-payment-back"
                onClick={() =>
                    navigate(`/artwork/${artwork._id}`)
                }
            >
                <FaArrowLeft />
                Back to Artwork
            </button>


            {/* HEADER */}

            <header className="artevora-payment-header">

                <span>SECURE CHECKOUT</span>

                <h1>Complete Your Purchase</h1>

                <p>
                    Choose your preferred payment method and
                    complete your order securely.
                </p>

            </header>


            {/* MAIN CHECKOUT */}

            <div className="artevora-checkout-layout">


                {/* LEFT SIDE */}

                <section className="artevora-payment-main">

                    <div className="artevora-payment-title">

                        <div>
                            <span>PAYMENT</span>

                            <h2>
                                Select a payment method
                            </h2>

                            <p>
                                All payments are simulated for
                                project demonstration.
                            </p>
                        </div>

                        <FaLock />

                    </div>


                    {/* PAYMENT METHODS */}

                    <div className="artevora-payment-methods">

                        <button
                            type="button"
                            className={
                                paymentMethod === 'upi'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setPaymentMethod('upi')
                            }
                        >
                            <FaMobileAlt />

                            <div>
                                <strong>UPI</strong>

                                <span>
                                    Google Pay, PhonePe, Paytm
                                </span>
                            </div>

                            {paymentMethod === 'upi' && (
                                <FaCheckCircle />
                            )}
                        </button>


                        <button
                            type="button"
                            className={
                                paymentMethod === 'card'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setPaymentMethod('card')
                            }
                        >
                            <FaCreditCard />

                            <div>
                                <strong>
                                    Credit / Debit Card
                                </strong>

                                <span>
                                    Visa, Mastercard, RuPay
                                </span>
                            </div>

                            {paymentMethod === 'card' && (
                                <FaCheckCircle />
                            )}
                        </button>


                        <button
                            type="button"
                            className={
                                paymentMethod === 'netbanking'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setPaymentMethod('netbanking')
                            }
                        >
                            <FaUniversity />

                            <div>
                                <strong>Net Banking</strong>

                                <span>
                                    All major banks
                                </span>
                            </div>

                            {paymentMethod === 'netbanking' && (
                                <FaCheckCircle />
                            )}
                        </button>


                        <button
                            type="button"
                            className={
                                paymentMethod === 'wallet'
                                    ? 'active'
                                    : ''
                            }
                            onClick={() =>
                                setPaymentMethod('wallet')
                            }
                        >
                            <FaWallet />

                            <div>
                                <strong>Wallet</strong>

                                <span>
                                    Paytm and other wallets
                                </span>
                            </div>

                            {paymentMethod === 'wallet' && (
                                <FaCheckCircle />
                            )}
                        </button>

                    </div>


                    {/* PAYMENT FORM */}

                    <form
                        className="artevora-payment-form"
                        onSubmit={handlePurchase}
                    >

                        <div className="artevora-form-section">

                            <div className="artevora-form-heading">
                                <span>01</span>

                                <div>
                                    <h3>Buyer Information</h3>

                                    <p>
                                        Your registered account details
                                    </p>
                                </div>
                            </div>


                            <div className="artevora-buyer-grid">

                                <div className="artevora-readonly-field">

                                    <FaUser />

                                    <div>
                                        <span>Name</span>

                                        <strong>
                                            {user?.name ||
                                                'Registered User'}
                                        </strong>
                                    </div>

                                </div>


                                <div className="artevora-readonly-field">

                                    <FaEnvelope />

                                    <div>
                                        <span>Email</span>

                                        <strong>
                                            {user?.email ||
                                                'Not available'}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="artevora-field">

                                <label>
                                    Phone Number
                                </label>

                                <div className="artevora-input">

                                    <FaPhoneAlt />

                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="10-digit phone number"
                                        value={phoneNumber}
                                        onChange={
                                            handlePhoneChange
                                        }
                                        disabled={purchasing}
                                    />

                                </div>

                            </div>


                            <div className="artevora-field">

                                <label>
                                    Shipping Address
                                </label>

                                <div className="artevora-textarea">

                                    <FaHome />

                                    <textarea
                                        placeholder="House number, street, area, city, state and PIN code"
                                        value={shippingAddress}
                                        onChange={(event) =>
                                            setShippingAddress(
                                                event.target.value
                                            )
                                        }
                                        maxLength={500}
                                        disabled={purchasing}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* UPI */}

                        {paymentMethod === 'upi' && (

                            <div className="artevora-form-section">

                                <div className="artevora-form-heading">
                                    <span>02</span>

                                    <div>
                                        <h3>UPI Payment</h3>

                                        <p>
                                            Enter your UPI ID
                                        </p>
                                    </div>
                                </div>

                                <div className="artevora-field">

                                    <label>
                                        UPI ID
                                    </label>

                                    <div className="artevora-input">

                                        <FaMobileAlt />

                                        <input
                                            type="text"
                                            placeholder="example@upi"
                                            value={upiId}
                                            onChange={(event) =>
                                                setUpiId(
                                                    event.target.value
                                                )
                                            }
                                            disabled={purchasing}
                                        />

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* CARD */}

                        {paymentMethod === 'card' && (

                            <div className="artevora-form-section">

                                <div className="artevora-form-heading">
                                    <span>02</span>

                                    <div>
                                        <h3>Card Details</h3>

                                        <p>
                                            Enter your card information
                                        </p>
                                    </div>
                                </div>


                                <div className="artevora-field">

                                    <label>
                                        Card Number
                                    </label>

                                    <div className="artevora-input">

                                        <FaCreditCard />

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardNumber}
                                            onChange={
                                                handleCardNumberChange
                                            }
                                            disabled={purchasing}
                                        />

                                    </div>

                                </div>


                                <div className="artevora-card-grid">

                                    <div className="artevora-field">

                                        <label>
                                            Name on Card
                                        </label>

                                        <input
                                            className="artevora-simple-input"
                                            type="text"
                                            placeholder="Card holder name"
                                            value={cardName}
                                            onChange={(event) =>
                                                setCardName(
                                                    event.target.value
                                                )
                                            }
                                            disabled={purchasing}
                                        />

                                    </div>


                                    <div className="artevora-field">

                                        <label>
                                            Expiry
                                        </label>

                                        <input
                                            className="artevora-simple-input"
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiryDate}
                                            onChange={
                                                handleExpiryChange
                                            }
                                            disabled={purchasing}
                                        />

                                    </div>


                                    <div className="artevora-field">

                                        <label>
                                            CVV
                                        </label>

                                        <input
                                            className="artevora-simple-input"
                                            type="password"
                                            placeholder="123"
                                            value={cvv}
                                            onChange={
                                                handleCvvChange
                                            }
                                            disabled={purchasing}
                                        />

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* OTHER METHODS */}

                        {(paymentMethod === 'netbanking' ||
                            paymentMethod === 'wallet') && (

                            <div className="artevora-demo-payment">

                                <FaMoneyBillWave />

                                <div>

                                    <strong>
                                        Demo Payment
                                    </strong>

                                    <p>
                                        This payment method is
                                        simulated for the ArteVora
                                        project. No real money is
                                        charged.
                                    </p>

                                </div>

                                <FaCheckCircle />

                            </div>

                        )}


                        {error && (

                            <p className="artevora-payment-error">
                                {error}
                            </p>

                        )}


                        <button
                            type="submit"
                            className="artevora-pay-button"
                            disabled={purchasing}
                        >

                            <FaLock />

                            {purchasing
                                ? 'Processing Payment...'
                                : `Pay ${formattedPrice}`}

                        </button>


                        <div className="artevora-payment-security">

                            <FaShieldAlt />

                            <span>
                                Secure demo checkout • Your card
                                details are not stored
                            </span>

                        </div>

                    </form>

                </section>


                {/* RIGHT SIDE — ORDER SUMMARY */}

                <aside className="artevora-order-summary">

                    <span className="summary-label">
                        ORDER SUMMARY
                    </span>


                    <div className="summary-artwork">

                        <img
                            src={artwork.image}
                            alt={artwork.title}
                        />

                    </div>


                    <h2>
                        {artwork.title}
                    </h2>


                    <p className="summary-artist">
                        By {artwork.artistName}
                    </p>


                    <div className="summary-divider" />


                    <div className="summary-row">
    <span>Artwork</span>
    <strong>
        {selectedDimensions}
    </strong>
</div>


                    <div className="summary-row">

                        <span>Delivery</span>

                        <strong>
                            Free
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>Taxes</span>

                        <strong>
                            Included
                        </strong>

                    </div>


                    <div className="summary-divider" />


                    <div className="summary-total">

                        <span>Total</span>

                        <strong>
                            {formattedPrice}
                        </strong>

                    </div>


                    <div className="summary-note">

                        <FaCheckCircle />

                        <span>
                            Your artwork will be reserved
                            after successful confirmation.
                        </span>

                    </div>

                </aside>

            </div>

        </main>
    )
}

export default Payment