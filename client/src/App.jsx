import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import './App.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Gallery from './pages/Gallery'
import Artists from './pages/Artists'
import ArtistProfile from './pages/ArtistProfile'
import UploadArtwork from './pages/UploadArtwork'
import ArtworkDetailsNew from './pages/ArtworkDetailsNew'
import Favorites from './pages/Favorites'
import AdminDashboard from './pages/AdminDashboard'
import ArtistDashboard from './pages/ArtistDashboard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Payment from './pages/Payment'
import MyPurchases from './pages/MyPurchases'
import UserProfile from './pages/UserProfile'
import ArtistBiography from './pages/ArtistBiography'
import ArtistNotifications from './pages/ArtistNotifications'
import ArtistEnquiries from './pages/ArtistEnquiries'
import ArtistSales from './pages/ArtistSales'
import ArtistProfileSettings from './pages/ArtistProfileSettings'
import Enquiry from './pages/Enquiry'
import ArtistMyArtworks from './pages/ArtistMyArtworks'
import EditArtwork from './pages/EditArtwork'
import ExhibitionAdmin from './pages/ExhibitionAdmin'
import EditExhibition from './pages/EditExhibition'
import Exhibitions from './pages/Exhibitions'
import ExhibitionDetails from './pages/ExhibitionDetails'
import VirtualTour from './pages/VirtualTour'
import UserProfileEdit from './pages/UserProfileEdit'
import AdminVirtualRoomCreate from './pages/AdminVirtualRoomCreate'
import MyEnquiries from './pages/MyEnquiries'



function App() {
    const [likes, setLikes] = useState(0)

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem('token'))
    )

    return (
        <BrowserRouter>
            <Navbar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            likes={likes}
                            setLikes={setLikes}
                        />
                    }
                />

                <Route
                    path="/login"
                    element={
                        <Login setIsLoggedIn={setIsLoggedIn} />
                    }
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/gallery"
                    element={<Gallery />}
                />
                <Route
    path="/exhibitions"
    element={<Exhibitions />}
/>
<Route
    path="/exhibitions/:id"
    element={<ExhibitionDetails />}
/>

<Route
    path="/exhibitions/:id/virtual-tour"
    element={<VirtualTour />}
/>
<Route
    path="/virtual-tour"
    element={<VirtualTour />}
/>
<Route
    path="/artists"
    element={<Artists />}
/>
                <Route
                    path="/artists/:id"
                    element={
                        <ArtistProfile
                            isLoggedIn={isLoggedIn}
                        />
                    }
                />

                <Route
                    path="/upload-artwork"
                    element={
                        <UploadArtwork
                            isLoggedIn={isLoggedIn}
                        />
                    }
                />
                <Route path="/artist-dashboard" element={<ArtistDashboard />} />

                <Route
                    path="/artwork/:id"
                    element={<ArtworkDetailsNew />}
                />
               <Route
    path="/payment/:id"
    element={<Payment />}
/>

                <Route
                    path="/favorites"
                    element={
                        <Favorites
                            isLoggedIn={isLoggedIn}
                        />
                    }
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
    path="/admin/exhibitions/create"
    element={<ExhibitionAdmin />}
/>
<Route
    path="/admin/exhibitions/edit/:id"
    element={<EditExhibition />}
/>
<Route
    path="/admin/virtual-rooms/create"
    element={<AdminVirtualRoomCreate />}
/>
<Route
    path="/admin/virtual-rooms/edit/:id"
    element={<AdminVirtualRoomCreate />}
/>

                <Route
    path="/my-purchases"
    element={<MyPurchases />}
/>

<Route
    path="/user-profile"
    element={
        <UserProfile
            isLoggedIn={isLoggedIn}
        />
    }
/>
<Route
    path="/user-profile/edit"
    element={<UserProfileEdit />}
/>
<Route
    path="/artist/biography"
    element={<ArtistBiography />}
/>
<Route
    path="/artist/notifications"
    element={<ArtistNotifications />}
/>
<Route
    path="/artist/enquiries"
    element={<ArtistEnquiries />}
/>
<Route
    path="/artist/sales"
    element={<ArtistSales />}
/>
<Route
    path="/artist/profile-settings"
    element={<ArtistProfileSettings />}
/>
<Route
    path="/enquiry/:artworkId"
    element={<Enquiry />}
/>
<Route path="/my-enquiries" element={<MyEnquiries />} />
<Route
    path="/my-artworks"
    element={<ArtistMyArtworks />}
/>
<Route
    path="/edit-artwork/:id"
    element={<EditArtwork />}
/>

            </Routes>
            
            <Footer />

            <ToastContainer
    position="top-right"
    autoClose={2500}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="colored"
/>
        </BrowserRouter>
    )
}

export default App