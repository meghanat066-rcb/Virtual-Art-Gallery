import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import './VirtualTour.css'
import VirtualGallery3D from '../components/VirtualGallery3D'
function VirtualTour() {
    const { id } = useParams()

    const [loading, setLoading] = useState(true)
    const [tourStage, setTourStage] = useState('entrance')
    const [exhibition, setExhibition] = useState(null)
    const [virtualRoom, setVirtualRoom] = useState(null)
    const [showArtworkInfo, setShowArtworkInfo] = useState(false)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1800)

        return () => clearTimeout(timer)
    }, [])
useEffect(() => {
    const fetchExhibition = async () => {
        try {
            if (id) {
                const response = await api.get(
                    `/exhibitions/${id}`
                )

                setExhibition(
                    response.data.exhibition
                )

                return
            }

            const response = await api.get(
                '/exhibitions'
            )

            const exhibitions =
                response.data.exhibitions || []

            const virtualExhibition =
                exhibitions.find(
                    (exhibition) =>
                        exhibition.exhibitionType ===
                        'virtual'
                )

            if (virtualExhibition?._id) {
                const virtualResponse =
                    await api.get(
                        `/exhibitions/${virtualExhibition._id}`
                    )

                setExhibition(
                    virtualResponse.data.exhibition
                )
            } else {
                console.error(
                    'No virtual exhibition found.'
                )
            }
        } catch (error) {
            console.error(
                'Error loading virtual tour exhibition:',
                error
            )
        }
    }
    fetchExhibition()
        const fetchVirtualRoom = async () => {
        try {
            const response = await api.get(
                '/virtual-rooms'
            )

            setVirtualRoom(
                response.data.virtualRoom
            )
        } catch (error) {
            console.error(
                'Error loading virtual room:',
                error
            )
        }
    }

    fetchVirtualRoom()
}, [id])
    if (loading) {
        return (
            <main className="artevora-virtual-tour-page">

                <section className="artevora-virtual-tour-loading">

                    <div className="artevora-virtual-tour-loading-content">

                        <span>
                            ARTEVORA GALLERY
                        </span>

                        <h1>
                            Preparing Your Visit
                        </h1>

                        <p>
                            The exhibition space is being prepared
                            for your virtual experience.
                        </p>

                        <div className="artevora-virtual-tour-loader"></div>

                    </div>

                </section>

            </main>
        )
    }

    return (
        <main className="artevora-virtual-tour-page">

            {tourStage === 'entrance' && (
    <section
        className="artevora-virtual-tour-museum"
        
    >
        <video
    className="artevora-virtual-tour-background-video"
    autoPlay
    muted
    loop
    playsInline
>
    <source
        src="/videos/11145280-hd_1920_1080_30fps.mp4"
        type="video/mp4"
    />
</video>

                    <div className="artevora-virtual-tour-museum-content">

                        <span>
                            VIRTUAL EXHIBITION
                        </span>

                        <h1>
                            Welcome to the Exhibition
                        </h1>

                        <p>
                            Step inside and explore the exhibition
                            at your own space.
                        </p>

                        <button
                            type="button"
                            className="artevora-virtual-tour-enter-button"
                            onClick={() =>
                                setTourStage('museum')
                            }
                        >
                            ENTER EXHIBITION →
                        </button>

                    </div>

                </section>
            )}

            {tourStage === 'museum' && (
    <section className="artevora-virtual-tour-3d">

        <VirtualGallery3D exhibition={exhibition} />

    </section>
)}

        </main>
    )
}

export default VirtualTour