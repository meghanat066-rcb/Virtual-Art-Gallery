import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Text  } from '@react-three/drei'
import './VirtualGallery3D.css'

function GalleryMovement() {
    const camera = useRef(null)
    const keys = useRef({})

    useEffect(() => {
        const handleKeyDown = (event) => {
            keys.current[event.key.toLowerCase()] = true
        }

        const handleKeyUp = (event) => {
            keys.current[event.key.toLowerCase()] = false
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useEffect(() => {
        let animationFrame

        const move = () => {
            if (camera.current) {
                const speed = 0.08

                // W / S = walk forward / backward

if (keys.current['w']) {
    camera.current.position.z -= speed
}

if (keys.current['s']) {
    camera.current.position.z += speed
}


// A / D = walk left / right

if (keys.current['a']) {
    camera.current.position.x -= speed
}

if (keys.current['d']) {
    camera.current.position.x += speed
}


// Arrow Left / Right = look left / right

if (keys.current['arrowleft']) {
    camera.current.rotation.y += 0.025
}

if (keys.current['arrowright']) {
    camera.current.rotation.y -= 0.025
}


// Arrow Up / Down = look up / down

if (keys.current['arrowup']) {
    camera.current.rotation.x += 0.018
}

if (keys.current['arrowdown']) {
    camera.current.rotation.x -= 0.018
}
                
            }
            camera.current.rotation.x = Math.max(
    -0.8,
    Math.min(0.8, camera.current.rotation.x)
)

            animationFrame = requestAnimationFrame(move)
        }

        move()

        return () => {
            cancelAnimationFrame(animationFrame)
        }
    }, [])

    return camera
}
function GalleryRoom({ exhibition, onArtworkClick }) {
        const camera = GalleryMovement()
    return (
        <>
            {/* CAMERA */}

            <PerspectiveCamera
    ref={camera}
    makeDefault
    position={[0, 3.8, 10]}
    rotation={[0.08, 0, 0]}
    fov={68}
/>

            {/* LIGHTING */}

            <ambientLight intensity={1.2} />

            <directionalLight
                position={[0, 8, 5]}
                intensity={2}
            />
            {/* =========================================
    GALLERY SPOT LIGHTS
========================================= */}

<spotLight
    position={[-5, 8, -2]}
    angle={0.45}
    penumbra={0.6}
    intensity={15}
    distance={12}
    castShadow
/>

<spotLight
    position={[0, 8, -2]}
    angle={0.45}
    penumbra={0.6}
    intensity={15}
    distance={12}
    castShadow
/>

<spotLight
    position={[5, 8, -2]}
    angle={0.45}
    penumbra={0.6}
    intensity={15}
    distance={12}
    castShadow
/>

<spotLight
    position={[-4, 8, 3]}
    angle={0.45}
    penumbra={0.6}
    intensity={12}
    distance={10}
    castShadow
/>

<spotLight
    position={[4, 8, 3]}
    angle={0.45}
    penumbra={0.6}
    intensity={12}
    distance={10}
    castShadow
/>


            {/* FLOOR */}

            <mesh
                position={[0, 0, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[30, 30]} />

                <meshStandardMaterial
                    color="#b8b0a5"
                    roughness={0.8}
                />
            </mesh>


            {/* BACK WALL */}

            <mesh
                position={[0, 5, -8]}
            >
                <boxGeometry
                    args={[20, 10, 0.3]}
                />

                <meshStandardMaterial
                    color="#eeeae3"
                    roughness={0.85}
                />
            </mesh>
{/* =========================================
    EXHIBITION ARTWORKS
========================================= */}

{exhibition?.artworks?.map((artwork, index) => {

    const artworkPositions = [

        // BACK WALL
        {
            position: [0, 5.2, -7.75],
            rotation: [0, 0, 0]
        },

        // LEFT INTERIOR WALL
        {
            position: [-5.23, 5.2, -2],
            rotation: [0, Math.PI / 2, 0]
        },

        // RIGHT INTERIOR WALL
        {
            position: [5.23, 5.2, -2],
            rotation: [0, -Math.PI / 2, 0]
        },

        // FRONT INTERIOR WALL
        {
            position: [-3, 5.2, -9.75],
            rotation: [0, Math.PI, 0]
        },

        // FRONT INTERIOR WALL
        {
            position: [3, 5.2, -9.75],
            rotation: [0, Math.PI, 0]
        }

    ]

    const artworkLayout =
        artworkPositions[
            index % artworkPositions.length
        ]

    return (
        <ArtworkOnWall
            key={artwork._id || index}
            artwork={artwork}
            position={artworkLayout.position}
            rotation={artworkLayout.rotation}
            onClick={() => onArtworkClick(artwork)}
        />
    )
})}


            {/* LEFT WALL */}

            <mesh
                position={[-10, 5, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <boxGeometry
                    args={[16, 10, 0.3]}
                />

                <meshStandardMaterial
                    color="#e6e1d9"
                    roughness={0.85}
                />
            </mesh>


            {/* RIGHT WALL */}

            <mesh
                position={[10, 5, 0]}
                rotation={[0, Math.PI / 2, 0]}
            >
                <boxGeometry
                    args={[16, 10, 0.3]}
                />

                <meshStandardMaterial
                    color="#e6e1d9"
                    roughness={0.85}
                />
            </mesh>
{/* =========================================
    INTERIOR EXHIBITION WALL 1
========================================= */}

<mesh
    position={[-6, 3.5, -2]}
>
    <boxGeometry
        args={[0.25, 7, 8]}
    />

    <meshStandardMaterial
        color="#eeeae3"
        roughness={0.85}
    />
</mesh>


{/* =========================================
    INTERIOR EXHIBITION WALL 2
========================================= */}

<mesh
    position={[5.5, 4.5, -2]}
>
    <boxGeometry
        args={[0.25, 9, 8]}
    />

    <meshStandardMaterial
        color="#eeeae3"
        roughness={0.85}
    />
</mesh>


{/* =========================================
    INTERIOR EXHIBITION WALL 3
    Temporarily removed so the visitor has
    an open view into the gallery.
========================================= */}

            {/* CEILING */}

            <mesh
                position={[0, 10, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[30, 30]} />

                <meshStandardMaterial
                    color="#f5f2ed"
                    roughness={0.9}
                    side={2}
                />
            </mesh>
        </>
    )
}
function ArtworkOnWall({ artwork, position, rotation = [0, 0, 0], onClick }) {

    if (!artwork?.image) {
        return null
    }

    return (
        <group
            position={position}
            rotation={rotation}
            onClick={onClick} 
    
        >

            {/* ARTWORK FRAME */}

            <mesh>

                <boxGeometry
                args={[1.7, 2.4, 0.10]}
               />
                <meshStandardMaterial
                    color="#171512"
                    roughness={0.5}
                />

            </mesh>


            {/* ARTWORK IMAGE */}

            <mesh
                position={[0, 0, 0.08]}
            >

                <planeGeometry
                args={[1.5, 2.2]}
                />

                <meshBasicMaterial>

                    <primitive
                        attach="map"
                        object={
                            new THREE.TextureLoader().load(
                                artwork.image
                            )
                        }
                    />

                </meshBasicMaterial>

            </mesh>
            <Text
    position={[1.05, 0.65, 0.15]}
    fontSize={0.28}
    color="#222222"
    anchorX="left"
    anchorY="top"
    maxWidth={2.5}
>
    {artwork.title || 'Untitled'}
</Text>
<Text
    position={[1.05, 0.40, 0.15]}
    fontSize={0.18}
    color="#444444"
    anchorX="left"
    anchorY="top"
    maxWidth={1.45}
    lineHeight={1.3}
>
    {artwork.story || 'No story available.'}
</Text>

<Text
    position={[1.05, -0.55, 0.15]}
    fontSize={0.10}
    color="#222222"
    anchorX="left"
    anchorY="top"
    maxWidth={2.5}
>
    {`Artist: ${artwork.artistName || 'Unknown Artist'}`}
</Text>

<Text
    position={[1.05, -0.75, 0.15]}
    fontSize={0.10}
    color="#222222"
    anchorX="left"
    anchorY="top"
    maxWidth={2.5}
>
    {`Year: ${artwork.year || 'N/A'}`}
</Text>

        </group>
    )
}

export default function VirtualGallery3D({ exhibition }) {

    console.log('Virtual Gallery Exhibition:', exhibition)

    const [showInstructions, setShowInstructions] = useState(true)
    const [showMenu, setShowMenu] = useState(false)
    const [soundOn, setSoundOn] = useState(true)
    const [quality, setQuality] = useState('HIGH')
    const [selectedArtwork, setSelectedArtwork] = useState(null)
    const [showArtworkView, setShowArtworkView] = useState(false)
    return (
        <div className="artevora-virtual-gallery-3d">

            <Canvas
    shadows={quality !== 'LOW'}
    dpr={
        quality === 'HIGH'
            ? [1, 2]
            : quality === 'MEDIUM'
                ? [1, 1.5]
                : [0.75, 1]
    }
>
                <color
                    attach="background"
                    args={['#d8d2c8']}
                />

               <GalleryRoom
    exhibition={exhibition}
    onArtworkClick={(artwork) => {
        setSelectedArtwork(artwork)
        setShowArtworkView(true)
    }}
/>

            </Canvas>
            {showArtworkView && selectedArtwork && (
    <div className="artevora-artwork-view">

        <button
    type="button"
    onClick={() => {
        setShowArtworkView(false)
        setSelectedArtwork(null)
    }}
    aria-label="Close artwork"
    style={{
        position: 'fixed',
        top: '175px',
        right: '30px',
        width: '50px',
        height: '50px',
        zIndex: 99999,
        border: '2px solid white',
        borderRadius: '50%',
        background: '#111',
        color: 'white',
        fontSize: '36px',
        lineHeight: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0
    }}
>
    ×
</button>

        <img
            src={selectedArtwork.image}
            alt={selectedArtwork.title || 'Artwork'}
            className="artevora-artwork-view-image"
        />

        <h2>
            {selectedArtwork.title}
        </h2>

    </div>
)}

            <button
    type="button"
    className="artevora-virtual-menu-button"
    onClick={() => setShowMenu(prev => !prev)}
    aria-label="Open virtual gallery menu"
>
    ☰
</button>

{showMenu && (
    <div className="artevora-virtual-menu">

        <button
            type="button"
            className="artevora-virtual-menu-item"
            onClick={() => {
                setShowInstructions(true)
                setShowMenu(false)
            }}
        >
            <span>Instructions</span>
            <span className="artevora-menu-arrow">›</span>
        </button>


        <button
    type="button"
    className="artevora-virtual-menu-item"
    onClick={() => {
        setSoundOn(prev => !prev)
    }}
>
    <span>Sound</span>

    <span className="artevora-menu-status">
        {soundOn ? 'ON' : 'OFF'}
    </span>
</button>


        <button
    type="button"
    className="artevora-virtual-menu-item"
    onClick={() => {
        const galleryElement =
            document.querySelector(
                '.artevora-virtual-gallery-3d'
            )

        if (!document.fullscreenElement) {
            galleryElement?.requestFullscreen()
        } else {
            document.exitFullscreen()
        }

        setShowMenu(false)
    }}
>
    <span>Fullscreen</span>

    <span className="artevora-menu-arrow">
        ›
    </span>
</button>


        <button
    type="button"
    className="artevora-virtual-menu-item"
    onClick={() => {
        if (quality === 'HIGH') {
            setQuality('MEDIUM')
        } else if (quality === 'MEDIUM') {
            setQuality('LOW')
        } else {
            setQuality('HIGH')
        }
    }}
>
    <span>Quality</span>

    <span className="artevora-menu-status">
        {quality}
    </span>
</button>

    </div>
)}

{showInstructions && (
    <div className="artevora-instructions-overlay">

        <div className="artevora-instructions-panel">

            {/* HEADER */}

            <div className="artevora-instructions-header">

                <h2>Instructions</h2>

                <button
                    type="button"
                    className="artevora-instructions-close"
                    onClick={() => setShowInstructions(false)}
                    aria-label="Close instructions"
                >
                    ×
                </button>

            </div>


            {/* GALLERY MOVEMENT VISUAL */}

            <div className="artevora-instructions-visual">

                <div className="artevora-gallery-diagram">

                    <div className="artevora-gallery-back-wall">
                    </div>

                    <div className="artevora-gallery-left-wall">
                    </div>

                    <div className="artevora-gallery-right-wall">
                    </div>

                    <div className="artevora-gallery-perspective-line">
                    </div>

                    <div className="artevora-gallery-cursor">
                        ✦
                    </div>

                </div>

            </div>


            {/* KEYBOARD INSTRUCTIONS */}

            <div className="artevora-instructions-controls">

                {/* W A S D */}

                <div className="artevora-control-section">

                    <h3>Move</h3>

                    <div className="artevora-wasd-keys">

                        <div className="artevora-key-row">

                            <span className="artevora-control-key">
                                W
                            </span>

                        </div>

                        <div className="artevora-key-row">

                            <span className="artevora-control-key">
                                A
                            </span>

                            <span className="artevora-control-key">
                                S
                            </span>

                            <span className="artevora-control-key">
                                D
                            </span>

                        </div>

                    </div>

                    <p>
                        Move through the gallery
                    </p>

                </div>


                {/* ARROW KEYS */}

                <div className="artevora-control-section">

                    <h3>Look around</h3>

                    <div className="artevora-arrow-keys">

                        <div className="artevora-key-row">

                            <span className="artevora-control-key">
                                ↑
                            </span>

                        </div>

                        <div className="artevora-key-row">

                            <span className="artevora-control-key">
                                ←
                            </span>

                            <span className="artevora-control-key">
                                ↓
                            </span>

                            <span className="artevora-control-key">
                                →
                            </span>

                        </div>

                    </div>

                    <p>
                        Look around the exhibition
                    </p>

                </div>

            </div>


            {/* CLOSE / START */}

            <button
                type="button"
                className="artevora-instructions-start"
                onClick={() => setShowInstructions(false)}
            >
                Start Exploring
            </button>

        </div>

    </div>
)}

        </div>
    )
}