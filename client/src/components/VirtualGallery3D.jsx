import React, { useEffect, useMemo, useRef, useState } from 'react'
import api from '../services/api'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import './VirtualGallery3D.css'
import { createPortal } from 'react-dom'


function GalleryMovement() {

    const camera = useRef(null)

    const keys = useRef({})

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase()

            if (
                key === 'w' ||
                key === 'a' ||
                key === 's' ||
                key === 'd' ||
                key === 'arrowup' ||
                key === 'arrowdown' ||
                key === 'arrowleft' ||
                key === 'arrowright'
            ) {
                event.preventDefault()
                keys.current[key] = true
            }
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

    // Mobile touch controls
    useEffect(() => {

        const handleMobileControlStart = (event) => {
            keys.current[event.detail] = true
        }

        const handleMobileControlStop = (event) => {
            keys.current[event.detail] = false
        }

        window.addEventListener(
            'artevora-mobile-control-start',
            handleMobileControlStart
        )

        window.addEventListener(
            'artevora-mobile-control-stop',
            handleMobileControlStop
        )

        return () => {
            window.removeEventListener(
                'artevora-mobile-control-start',
                handleMobileControlStart
            )

            window.removeEventListener(
                'artevora-mobile-control-stop',
                handleMobileControlStop
            )
        }

    }, [])

    useEffect(() => {
        let animationFrame
        const clock = new THREE.Clock()

        const move = () => {

            const delta = Math.min(
                clock.getDelta(),
                0.05
            )

            if (camera.current) {

                const speed = 45

                if (keys.current['w']) {
                    camera.current.position.z -=
                        speed * delta
                }

                if (keys.current['s']) {
                    camera.current.position.z +=
                        speed * delta
                }

                if (keys.current['a']) {
                    camera.current.position.x -=
                        speed * delta
                }

                if (keys.current['d']) {
                    camera.current.position.x +=
                        speed * delta
                }

                if (keys.current['arrowleft']) {
                    camera.current.rotation.y +=
                        4.5 * delta
                }

                if (keys.current['arrowright']) {
                    camera.current.rotation.y -=
                        4.5 * delta
                }

                camera.current.rotation.x =
                    Math.max(
                        -0.5,
                        Math.min(
                            0.5,
                            camera.current.rotation.x
                        )
                    )

                camera.current.position.x =
                    Math.max(
                        -19,
                        Math.min(
                            19,
                            camera.current.position.x
                        )
                    )

                camera.current.position.z =
                    Math.max(
                        -18,
                        Math.min(
                            24,
                            camera.current.position.z
                        )
                    )

                camera.current.position.y = 3.25
            }

            animationFrame =
                requestAnimationFrame(move)
        }

        move()

        return () => {
            cancelAnimationFrame(animationFrame)
        }

    }, [])

    return camera
}

function ArtworkOnWall({
    artwork,
    position,
    rotation,
    infoSide,
    onArtworkClick,
    onInfoClick
}) {
    if (!artwork?.image) {
        return null
    }

    const artworkLightRef = useRef(null)

useEffect(() => {
    if (!artworkLightRef.current) return

    artworkLightRef.current.target.position.set(
    infoSide === 'right' ? 0.55 : -0.55,
    -0.25,
    0.05
)

    artworkLightRef.current.target.updateMatrixWorld()
}, [infoSide])

    const texture = useMemo(() => {
    if (!artwork?.image) return null

    const loader = new THREE.TextureLoader()

    loader.setCrossOrigin('anonymous')

    const texture = loader.load(
        artwork.image,
        (loadedTexture) => {
            loadedTexture.colorSpace =
                THREE.SRGBColorSpace

            loadedTexture.needsUpdate = true

            console.log(
                'ARTWORK TEXTURE LOADED:',
                artwork.title,
                artwork.image
            )
        },
        undefined,
        (error) => {
            console.error(
                'ARTWORK TEXTURE FAILED:',
                artwork.title,
                artwork.image,
                error
            )
        }
    )

    texture.colorSpace =
        THREE.SRGBColorSpace

    return texture
}, [artwork?.image])

    const story =
        artwork.story ||
        artwork.description ||
        'No story available.'

    const artist =
        artwork.artistName ||
        artwork.artist?.name ||
        'Artist'

    const year =
        artwork.year ||
        'Year not available'

        const medium =
    artwork.medium ||
    'Medium not available'

const dimensions =
    artwork.dimensions ||
    'Dimensions not available'

    const title =
        artwork.title ||
        'Untitled'

    const artworkWidth = 2.45
    const artworkHeight = 3.15

    const infoX =
        infoSide === 'right'
            ? 1.65
            : -1.65

    const infoAlign =
        infoSide === 'right'
            ? 'left'
            : 'right'


            const { camera } = useThree()

const textScale = Math.min(
    1.45,
    Math.max(
        1,
        camera.position.distanceTo(
            new THREE.Vector3(...position)
        ) / 10
    )
)

console.log('ARTIST WALL DATA:', {
    name: artist.name,
    year: artist.year,
    foundedYear: artist.foundedYear,
    establishedYear: artist.establishedYear
})
    return (
        <group
            position={position}
            rotation={rotation}
            
        >
            <spotLight
    ref={artworkLightRef}
    position={[
        infoSide === 'right' ? 0.35 : -0.35,
        3.2,
        1.8
    ]}
    intensity={22}
    distance={8}
    angle={0.62}
    penumbra={0.68}
    decay={1.5}
    color="#D6A85C"
/>
            <mesh
                position={[0, 0, -0.03]}
                onClick={(event) => {
                    event.stopPropagation()
                    onArtworkClick(artwork)
                }}
            >
                <boxGeometry
                    args={[
                        artworkWidth + 0.16,
                        artworkHeight + 0.16,
                        0.12
                    ]}
                />

                <meshStandardMaterial
                    color="#242321"
                    roughness={0.62}
                />
            </mesh>

            <mesh
                position={[0, 0, 0.045]}
                onClick={(event) => {
                    event.stopPropagation()
                    onArtworkClick(artwork)
                }}
            >
                <planeGeometry
                    args={[
                        artworkWidth,
                        artworkHeight
                    ]}
                />

                <meshStandardMaterial
    map={texture}
    color="#ffffff"
    roughness={0.5}
    metalness={0}
    toneMapped={false}
/>
            </mesh>

            <group
                position={[
                    infoX,
                    0,
                    0.035
                ]}
                 scale={textScale}
                onClick={(event) => {
                    event.stopPropagation()
                    onInfoClick(artwork)
                }}
            >
                <Text
                    position={[
                        0,
                        1.10,
                        0
                    ]}
                    fontSize={0.20}
                    maxWidth={1.55}
                    lineHeight={1.08}
                    anchorX={infoAlign}
                    anchorY="middle"
                   color="#0b0b0b"
                   sdfGlyphSize={128}
                >
                    {title}
                </Text>

                <Text
                    position={[
                        0,
                        0.70,
                        0
                    ]}
                    fontSize={0.082}
                    maxWidth={1.55}
                    lineHeight={1.38}
                    anchorX={infoAlign}
                    anchorY="top"
                    color="#151515"
                    material-toneMapped={false}
                    strokeWidth={0.014}
                    strokeColor="#000000"
                    sdfGlyphSize={256}
                >
                    {story}
                </Text>
{/* Artwork Medium */}
<Text
    position={[
        0,
        -0.58,
        0
    ]}
    fontSize={0.075}
    maxWidth={1.55}
    lineHeight={1.2}
    anchorX={infoAlign}
    anchorY="top"
    color="#151515"
>
    {medium}
</Text>

{/* Artwork Dimensions */}
<Text
    position={[
        0,
        -0.88,
        0
    ]}
    fontSize={0.075}
    maxWidth={1.55}
    lineHeight={1.2}
    anchorX={infoAlign}
    anchorY="top"
    color="#151515"
>
    {dimensions}
</Text>
                <Text
                    position={[
                        0,
                        -1.10,
                        0
                    ]}
                    fontSize={0.085}
                    maxWidth={1.55}
                    lineHeight={1.2}
                    anchorX={infoAlign}
                    anchorY="top"
                    color="#0a0a0a"
                    sdfGlyphSize={128}
                >
                    {artist}
                </Text>

                <Text
                    position={[
                        0,
                        -1.30,
                        0
                    ]}
                    fontSize={0.075}
                    maxWidth={1.55}
                    lineHeight={1.2}
                    anchorX={infoAlign}
                    anchorY="top"
                    color="#1c1c1c"
                    sdfGlyphSize={128}
                >
                    {String(year)}
                </Text>
            </group>
        </group>
    )
}
function ArtistOnWall({
    artist,
    position,
    rotation,
    onArtistClick,
}) {
    if (!artist?.profileImage) {
        return null
    }

    const texture = useMemo(() => {
        if (!artist?.profileImage) return null

        const loader = new THREE.TextureLoader()

        loader.setCrossOrigin('anonymous')

        const loadedTexture = loader.load(
            artist.profileImage,
            (loaded) => {
                loaded.colorSpace = THREE.SRGBColorSpace
                loaded.needsUpdate = true
            },
            undefined,
            (error) => {
                console.error(
                    'Virtual gallery artist image failed to load:',
                    artist.profileImage,
                    error
                )
            }
        )

        loadedTexture.colorSpace = THREE.SRGBColorSpace

        return loadedTexture
    }, [artist?.profileImage])

    const fullBiography =
        artist.biography?.trim() ||
        'No biography available.'

    const biography = fullBiography

    const artistName =
        artist.name ||
        'Artist'

    const artistYear =
        artist.year ||
        artist.foundedYear ||
        artist.establishedYear ||
        ''

    return (
        <group
            position={position}
            rotation={rotation}
        >

            {/* =================================
                WARM ARTIST LIGHT
               ================================= */}

            <pointLight
                position={[0, 2.8, 1.8]}
                intensity={1.4}
                distance={7}
                decay={2}
                color="#fff0c7"
            />

            <pointLight
                position={[0, -0.5, 1.5]}
                intensity={0.65}
                distance={6}
                decay={2}
                color="#ffe5ad"
            />


            {/* =================================
                LARGER ARTIST FRAME
               ================================= */}

            <mesh
                position={[-1.05, 0.25, 0.045]}
                onClick={(event) => {
                    event.stopPropagation()
                    onArtistClick(artist)
                }}
            >
                <boxGeometry
                    args={[
                        3.15,
                        3.45,
                        0.12
                    ]}
                />

                <meshStandardMaterial
                    color="#242321"
                    roughness={0.62}
                    metalness={0.08}
                />
            </mesh>


            {/* =================================
                LARGER ARTIST PROFILE IMAGE
               ================================= */}

            <mesh
                position={[-1.05, 0.25, 0.13]}
                onClick={(event) => {
                    event.stopPropagation()
                    onArtistClick(artist)
                }}
            >
                <planeGeometry
                    args={[
                        3.15,
                        3.45
                    ]}
                />

                <meshStandardMaterial
                    map={texture}
                    roughness={0.72}
                    metalness={0}
                    toneMapped={true}
                />
            </mesh>


            {/* =================================
                ARTIST NAME — RIGHT OF IMAGE
               ================================= */}

            <Text
                position={[
                    0.82,
                    1.52,
                    0.07
                ]}
                
                fontSize={0.24}
                maxWidth={2.85}
                lineHeight={1.1}
                anchorX="left"
                anchorY="middle"
                color="#050505"
                material-toneMapped={false}
                sdfGlyphSize={128}
            >
                {artistName}
            </Text>


            {/* =================================
                ARTIST YEAR — RIGHT OF IMAGE
               ================================= */}

            {artistYear && (
                <Text
                    position={[
                        0.82,
                        1.15,
                        0.07
                    ]}
                    fontSize={0.11}
                    maxWidth={2.85}
                    lineHeight={1.2}
                    anchorX="left"
                    anchorY="middle"
                    color="#111111"
                    material-toneMapped={false}
                    sdfGlyphSize={128}
                >
                    {String(artistYear)}
                </Text>
            )}


            {/* =================================
                ARTIST BIOGRAPHY — RIGHT OF IMAGE
               ================================= */}

            <Text
                position={[
                    0.82,
                    0.92,
                    0.07
                ]}
                fontSize={0.090}
                maxWidth={2.85}
                lineHeight={1.28}
                anchorX="left"
                anchorY="top"
                textAlign="left"
                color="#080808"
                material-toneMapped={false}
                sdfGlyphSize={256}
            >
               {[artist.biography?.trim(), artist.artistStatement?.trim()]
    .filter(Boolean)
    .join('\n\n')}
            </Text>

        </group>
    )
}
function WarmCornerLight({
    position,
    target,
    intensity = 12
}) {
    const lightRef = useRef(null)

    useEffect(() => {
        if (!lightRef.current) return

        lightRef.current.target.position.set(
            target[0],
            target[1],
            target[2]
        )

        lightRef.current.target.updateMatrixWorld()
    }, [target])

    return (
        <spotLight
    ref={lightRef}
    position={position}
    color="#B77A32"
    intensity={intensity}
    distance={30}
    angle={0.72}
    penumbra={0.78}
    decay={1.5}
    
/>
    )
}
function GalleryRoom({
    virtualRoom,
    onArtworkClick,
    onInfoClick,
    onArtistClick
}) {
    const camera = GalleryMovement()

    
    /*
     * =========================================================
     * LUXURY GALLERY PALETTE
     * =========================================================
     */

    const WALL_COLOR = '#eee4d3'
const CEILING_COLOR = '#c4a47b'
const FLOOR_COLOR = '#d8c5a6'
const PILLAR_COLOR = '#4a301c'
const FEATURE_WALL_COLOR = '#f1e5d2'
const GOLD_LIGHT = '#f2c46f'
const SOFT_GOLD = '#d9a653'

    /*
     * =========================================================
     * ARTWORK POSITIONS
     * =========================================================
     */

    const leftPositions = [
        [-21.72, 4.05, -11.0],
        [-21.72, 4.05, -5.0],
        [-21.72, 4.05, 1.0],
        [-21.72, 4.05, 7.0]
    ]

    const rightPositions = [
        [21.72, 4.05, -11.0],
        [21.72, 4.05, -5.0],
        [21.72, 4.05, 1.0],
        [21.72, 4.05, 7.0]
    ]

    const leftArtworkLights = [
    [-19.0, 9.0, -10.2],
    [-19.0, 9.0, -4.2],
    [-19.0, 9.0, 1.8],
    [-19.0, 9.0, 7.8]
]

const rightArtworkLights = [
    [19.0, 9.0, -10.2],
    [19.0, 9.0, -4.2],
    [19.0, 9.0, 1.8],
    [19.0, 9.0, 7.8]
]
const leftWallCeilingLights = [
    [-20.0, 11.5, -14.0],
    [-20.0, 11.5, -8.0],
    [-20.0, 11.5, -2.0],
    [-20.0, 11.5, 4.0],
    [-20.0, 11.5, 10.0]
]

const rightWallCeilingLights = [
    [20.0, 11.5, -14.0],
    [20.0, 11.5, -8.0],
    [20.0, 11.5, -2.0],
    [20.0, 11.5, 4.0],
    [20.0, 11.5, 10.0]
]
const backArtistLights = [
    [-10.2, 11.2, -13.8],
    [-3.4, 11.2, -13.8],
    [3.4, 11.2, -13.8],
    [10.2, 11.2, -13.8]
]
console.log(
    "LANGUAGE OF SILENCE ARTWORKS:",
    virtualRoom?.artworks
)

virtualRoom?.artworks?.forEach((artwork, index) => {
    console.log(
        `ARTWORK ${index + 1}:`,
        {
            title: artwork.title,
            image: artwork.image,
            cloudinaryId: artwork.cloudinaryId,
            artistName: artwork.artistName
        }
    )
})
    /*
     * =========================================================
     * CAMERA
     * =========================================================
     */

    return (
        <>
            <PerspectiveCamera
                ref={camera}
                makeDefault
                position={[
                    0,
                    3.25,
                    16.5
                ]}
                fov={72}
                near={0.1}
                far={120}
            />


            {/* =================================================
                BASE AMBIENT LIGHT
               ================================================= */}

            <ambientLight
                intensity={0.55}
                color="#fff8ed"
            />

            <hemisphereLight
                skyColor="#fff8ec"
                groundColor="#8f806f"
                intensity={0.5}
            />


            {/* =================================================
                SOFT GENERAL GALLERY LIGHT
               ================================================= */}

            <directionalLight
                position={[
                    0,
                    12,
                    6
                ]}
                intensity={0.55}
                color="#fff3dc"
                castShadow
            />


            {/* =================================================
                LEFT FRONT GOLDEN WALL WASH
               ================================================= */}

            <pointLight
                position={[
                    -17.5,
                    5.0,
                    8.0
                ]}
                intensity={2}
                distance={18}
                decay={2}
                color={GOLD_LIGHT}
            />

            <pointLight
                position={[
                    -18.5,
                    4.5,
                    -8.0
                ]}
                intensity={4}
                distance={18}
                decay={2}
                color={SOFT_GOLD}
            />


            {/* =================================================
                RIGHT FRONT GOLDEN WALL WASH
               ================================================= */}

            <pointLight
                position={[
                    17.5,
                    5.0,
                    8.0
                ]}
                intensity={3.5}
                distance={18}
                decay={2}
                color={GOLD_LIGHT}
            />

            <pointLight
                position={[
                    18.5,
                    4.5,
                    -8.0
                ]}
                intensity={4}
                distance={18}
                decay={2}
                color={SOFT_GOLD}
            />


            {/* =================================================
                LEFT BACK CORNER LIGHT
               ================================================= */}

            <pointLight
                position={[
                    -19.0,
                    4.8,
                    -11.5
                ]}
                intensity={22}
                distance={15}
                decay={2}
                color="#d7ad6d"
            />


            {/* =================================================
                RIGHT BACK CORNER LIGHT
               ================================================= */}

            <pointLight
                position={[
                    19.0,
                    4.8,
                    -11.5
                ]}
                intensity={22}
                distance={15}
                decay={2}
                color="#d7ad6d"
            />


            {/* =================================================
                LEFT ARTWORK WALL LIGHT
               ================================================= */}

            <pointLight
                position={[
                    -16.5,
                    5.5,
                    -5.0
                ]}
                intensity={4}
                distance={13}
                decay={2}
                color="#e0bd82"
            />


            {/* =================================================
                RIGHT ARTWORK WALL LIGHT
               ================================================= */}

            <pointLight
                position={[
                    16.5,
                    5.5,
                    -5.0
                ]}
                intensity={4}
                distance={13}
                decay={2}
                color="#e0bd82"
            />


            {/* =================================================
                CENTER FEATURE WALL LIGHT
               ================================================= */}

            <pointLight
                position={[
                    0,
                    7.0,
                    -11.0
                ]}
                intensity={4}
                distance={18}
                decay={2}
                color="#e0bd82"
            />

            <pointLight
                position={[
                    0,
                    3.5,
                    -8.0
                ]}
                intensity={7}
                distance={14}
                decay={2}
                color="#cba875"
            />


            {/* =================================================
                WARM FLOOR LIGHTING
               ================================================= */}

            <pointLight
                position={[
                    -10,
                    0.8,
                    -3
                ]}
                intensity={4}
                distance={12}
                decay={2}
                color="#d8b47a"
            />

            <pointLight
                position={[
                    10,
                    0.8,
                    -3
                ]}
                intensity={4}
                distance={12}
                decay={2}
                color="#d8b47a"
            />


            {/* =================================================
                FLOOR
               ================================================= */}

            <mesh
                position={[
                    0,
                    0,
                    0
                ]}
                rotation={[
                    -Math.PI / 2,
                    0,
                    0
                ]}
                receiveShadow
            >
                <planeGeometry
                    args={[
                        46,
                        38
                    ]}
                />

                <meshStandardMaterial
                    color={FLOOR_COLOR}
                    roughness={0.32}
                    metalness={0.05}
                />
            </mesh>


            {/* =================================================
                BACK WALL
               ================================================= */}

            <mesh
                position={[
                    0,
                    6,
                    -18
                ]}
                receiveShadow
            >
                <boxGeometry
                    args={[
                        44,
                        12,
                        0.3
                    ]}
                />

                <meshStandardMaterial
                    color={WALL_COLOR}
                    roughness={0.78}
                    metalness={0}
                />
            </mesh>


            {/* =================================================
                LEFT WALL
               ================================================= */}

            <mesh
                position={[
                    -22,
                    6,
                    0
                ]}
                rotation={[
                    0,
                    Math.PI / 2,
                    0
                ]}
                receiveShadow
            >
                <boxGeometry
                    args={[
                        36,
                        12,
                        0.3
                    ]}
                />

                <meshStandardMaterial
                    color={WALL_COLOR}
                    roughness={0.78}
                    metalness={0}
                />
            </mesh>


            {/* =================================================
                RIGHT WALL
               ================================================= */}

            <mesh
                position={[
                    22,
                    6,
                    0
                ]}
                rotation={[
                    0,
                    Math.PI / 2,
                    0
                ]}
                receiveShadow
            >
                <boxGeometry
                    args={[
                        36,
                        12,
                        0.3
                    ]}
                />

                <meshStandardMaterial
                    color={WALL_COLOR}
                    roughness={0.78}
                    metalness={0}
                />
            </mesh>


            {/* =================================================
                CEILING
               ================================================= */}

            <mesh
                position={[
                    0,
                    12,
                    0
                ]}
                rotation={[
                    Math.PI / 2,
                    0,
                    0
                ]}
            >
                <planeGeometry
                    args={[
                        46,
                        38
                    ]}
                />

                <meshStandardMaterial
                    color={CEILING_COLOR}
                    roughness={0.86}
                    metalness={0}
                    side={THREE.DoubleSide}
                />
            </mesh>


{/* =================================================
    CENTRAL FEATURE WALL
   ================================================= */}

{/* Main front architectural wall */}
<mesh
    position={[0, 5.1, -5.2]}
    receiveShadow
>
    <boxGeometry args={[18, 10.2, 0.28]} />
    <meshStandardMaterial
        color="#cdbda8"
        roughness={0.72}
        metalness={0}
    />
</mesh>

{/* Large lighter inset panel */}
<mesh
    position={[0, 5.15, -5.035]}
    receiveShadow
>
    <boxGeometry args={[16.9, 9.25, 0.08]} />
    <meshStandardMaterial
        color="#e5d7c3"
        roughness={0.76}
        metalness={0}
    />
</mesh>

{/* Inner gold border - top */}
<mesh position={[0, 9.55, -4.965]}>
    <boxGeometry args={[16.35, 0.035, 0.025]} />
    <meshStandardMaterial
        color="#b68b4c"
        roughness={0.38}
        metalness={0.35}
    />
</mesh>

{/* Inner gold border - bottom */}
<mesh position={[0, 0.75, -4.965]}>
    <boxGeometry args={[16.35, 0.035, 0.025]} />
    <meshStandardMaterial
        color="#b68b4c"
        roughness={0.38}
        metalness={0.35}
    />
</mesh>

{/* Inner gold border - left */}
<mesh position={[-8.15, 5.15, -4.965]}>
    <boxGeometry args={[0.035, 8.8, 0.025]} />
    <meshStandardMaterial
        color="#b68b4c"
        roughness={0.38}
        metalness={0.35}
    />
</mesh>

{/* Inner gold border - right */}
<mesh position={[8.15, 5.15, -4.965]}>
    <boxGeometry args={[0.035, 8.8, 0.025]} />
    <meshStandardMaterial
        color="#b68b4c"
        roughness={0.38}
        metalness={0.35}
    />
</mesh>

{/* LEFT DARK ARCHITECTURAL COLUMN */}
<mesh
    position={[-8.85, 5.1, -4.92]}
    receiveShadow
>
    <boxGeometry args={[0.72, 10.35, 0.42]} />
    <meshStandardMaterial
        color="#604a35"
        roughness={0.55}
        metalness={0.08}
    />
</mesh>

{/* RIGHT DARK ARCHITECTURAL COLUMN */}
<mesh
    position={[8.85, 5.1, -4.92]}
    receiveShadow
>
    <boxGeometry args={[0.72, 10.35, 0.42]} />
    <meshStandardMaterial
        color="#604a35"
        roughness={0.55}
        metalness={0.08}
    />
</mesh>

{/* LEFT GOLD LIGHT ACCENT */}
<mesh position={[-8.84, 5.1, -4.68]}>
    <boxGeometry args={[0.055, 8.8, 0.035]} />
    <meshStandardMaterial
        color="#d8ad62"
        emissive="#9b6c2d"
        emissiveIntensity={0.8}
        roughness={0.35}
        metalness={0.3}
    />
</mesh>

{/* RIGHT GOLD LIGHT ACCENT */}
<mesh position={[8.84, 5.1, -4.68]}>
    <boxGeometry args={[0.055, 8.8, 0.035]} />
    <meshStandardMaterial
        color="#d8ad62"
        emissive="#9b6c2d"
        emissiveIntensity={0.8}
        roughness={0.35}
        metalness={0.3}
    />
</mesh>

{/* TOP DARK HEADER TRIM */}
<mesh position={[0, 9.92, -4.92]}>
    <boxGeometry args={[17.65, 0.32, 0.42]} />
    <meshStandardMaterial
        color="#624b36"
        roughness={0.55}
        metalness={0.08}
    />
</mesh>

{/* BOTTOM DARK BASE */}
<mesh position={[0, 0.32, -4.92]}>
    <boxGeometry args={[17.65, 0.64, 0.42]} />
    <meshStandardMaterial
        color="#624b36"
        roughness={0.55}
        metalness={0.08}
    />
</mesh>

{/* GOLD BASE ACCENT */}
<mesh position={[0, 0.68, -4.68]}>
    <boxGeometry args={[16.25, 0.045, 0.035]} />
    <meshStandardMaterial
        color="#d3a55b"
        emissive="#8c6027"
        emissiveIntensity={0.7}
        roughness={0.35}
        metalness={0.3}
    />
</mesh>
{/* =================================================
    FRONT STANDING WALL CONTENT
   ================================================= */}

{/* Small exhibition label */}
<Text
    position={[0, 9.22, -4.88]}
    rotation={[0, 0, 0]}
    fontSize={0.16}
    color="#8A5A12"
    anchorX="center"
    anchorY="middle"
    letterSpacing={0.12}
>
    ARTEVORA GALLERY
</Text>

{/* Exhibition title */}
{virtualRoom?.title && (
    <Text
        position={[0, 8.72, -4.88]}
        rotation={[0, 0, 0]}
        fontSize={0.62}
        color="#35291f"
        anchorX="center"
        anchorY="middle"
        maxWidth={13}
        letterSpacing={0.025}
    >
        {virtualRoom.title}
    </Text>
)}

{/* Gold decorative divider */}
<mesh position={[0, 8.20, -4.86]}>
    <boxGeometry args={[2.7, 0.035, 0.025]} />
    <meshStandardMaterial
        color="#b68b4c"
        emissive="#7d5422"
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.3}
    />
</mesh>

{/* Center gold ornament */}
<mesh position={[0, 8.20, -4.84]}>
    <boxGeometry args={[0.20, 0.10, 0.035]} />
    <meshStandardMaterial
        color="#d1a45b"
        roughness={0.3}
        metalness={0.35}
    />
</mesh>

{/* Exhibition description */}
{virtualRoom?.description && (
    <Text
        position={[0, 7.72, -4.88]}
        rotation={[0, 0, 0]}
        fontSize={0.18}
        color="#0b0b0b"
        anchorX="center"
        anchorY="middle"
        maxWidth={11.8}
        lineHeight={1.45}
        textAlign="center"
    >
        {virtualRoom.description}
    </Text>
)}

{/* =================================================
    TWO FRONT ARTWORKS
   ================================================= */}


            {/* =================================================
                LEFT LUXURY PILLAR
               ================================================= */}

            <mesh
                position={[
                    -19,
                    5.5,
                    -11.5
                ]}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    args={[
                        0.85,
                        11,
                        0.85
                    ]}
                />

                <meshStandardMaterial
                    color={PILLAR_COLOR}
                    roughness={0.46}
                    metalness={0.08}
                />
            </mesh>


            {/* LEFT PILLAR LIGHT STRIP */}

            <mesh
                position={[
                    -18.54,
                    5.5,
                    -11.5
                ]}
            >
                <boxGeometry
                    args={[
                        0.035,
                        9.6,
                        0.06
                    ]}
                />

                <meshStandardMaterial
                    color="#D4AF37"
                    emissive="#D4AF37"
                    emissiveIntensity={2.2}
                    roughness={0.3}
                />
            </mesh>


            {/* =================================================
                RIGHT LUXURY PILLAR
               ================================================= */}

            <mesh
                position={[
                    19,
                    5.5,
                    -11.5
                ]}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    args={[
                        0.85,
                        11,
                        0.85
                    ]}
                />

                <meshStandardMaterial
                    color={PILLAR_COLOR}
                    roughness={0.46}
                    metalness={0.08}
                />
            </mesh>


            {/* RIGHT PILLAR LIGHT STRIP */}

            <mesh
                position={[
                    18.54,
                    5.5,
                    -11.5
                ]}
            >
                <boxGeometry
                    args={[
                        0.035,
                        9.6,
                        0.06
                    ]}
                />

                <meshStandardMaterial
                    color="#D4AF37"
                    emissive="#D4AF37"
                    emissiveIntensity={2.2}
                    roughness={0.3}
                />
            </mesh>


            {/* =================================================
                LEFT FRONT PILLAR
               ================================================= */}

            <mesh
                position={[
                    -19,
                    5.5,
                    7.5
                ]}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    args={[
                        0.85,
                        11,
                        0.85
                    ]}
                />

                <meshStandardMaterial
                    color={PILLAR_COLOR}
                    roughness={0.46}
                    metalness={0.08}
                />
            </mesh>


            {/* LEFT FRONT LIGHT */}

            <pointLight
                position={[
                    -18.2,
                    5.0,
                    7.0
                ]}
                intensity={2}
                distance={12}
                decay={2}
                color="#d8b47a"
            />


            {/* =================================================
                RIGHT FRONT PILLAR
               ================================================= */}

            <mesh
                position={[
                    19,
                    5.5,
                    7.5
                ]}
                castShadow
                receiveShadow
            >
                <boxGeometry
                    args={[
                        0.85,
                        11,
                        0.85
                    ]}
                />

                <meshStandardMaterial
                    color={PILLAR_COLOR}
                    roughness={0.46}
                    metalness={0.08}
                />
            </mesh>


            {/* RIGHT FRONT LIGHT */}

            <pointLight
                position={[
                    18.2,
                    5.0,
                    7.0
                ]}
                intensity={2}
                distance={12}
                decay={2}
                color="#d8b47a"
            />

            {/* =================================================
                TOP COVE POINT LIGHTS
               ================================================= */}

            <pointLight
                position={[
                    -13.5,
                    10.4,
                    -8
                ]}
                intensity={3}
                distance={13}
                decay={2}
                color="#d9b074"
            />

            <pointLight
                position={[
                    13.5,
                    10.4,
                    -8
                ]}
                intensity={3}
                distance={13}
                decay={2}
                color="#d9b074"
            />

            {/* =================================================
    DEDICATED GOLDEN SPOTLIGHTS — LEFT ARTWORK WALL
   ================================================= */}

{leftArtworkLights.map((lightPosition, index) => (
    <WarmCornerLight
        key={`left-artwork-light-${index}`}
        position={lightPosition}
        target={[
            -21.72,
            3.8,
            leftPositions[index][2] + 0.75
        ]}
        intensity={54}
    />
))}


{/* =================================================
    DEDICATED GOLDEN SPOTLIGHTS — RIGHT ARTWORK WALL
   ================================================= */}

{rightArtworkLights.map((lightPosition, index) => (
    <WarmCornerLight
        key={`right-artwork-light-${index}`}
        position={lightPosition}
        target={[
            21.72,
            3.8,
            rightPositions[index][2] + 0.75
        ]}
        intensity={54}
    />
))}
{/* =================================================
    FULL CEILING GOLDEN LIGHTING — LEFT WALL
   ================================================= */}

{leftWallCeilingLights.map((lightPosition, index) => (
    <WarmCornerLight
        key={`left-ceiling-light-${index}`}
        position={lightPosition}
        target={[
            -21.5,
            4.0,
            lightPosition[2]
        ]}
        intensity={20}
    />
))}


{/* =================================================
    FULL CEILING GOLDEN LIGHTING — RIGHT WALL
   ================================================= */}

{rightWallCeilingLights.map((lightPosition, index) => (
    <WarmCornerLight
        key={`right-ceiling-light-${index}`}
        position={lightPosition}
        target={[
            21.5,
            4.0,
            lightPosition[2]
        ]}
        intensity={20}
    />
))}

{/* =================================================
    LEFT WALL — ARTWORKS 1 TO 4
   ================================================= */}

{virtualRoom?.artworks
    ?.slice(0, 4)
    .map((artwork, index) => {
        const position =
            leftPositions[index]

        return (
            <ArtworkOnWall
                key={
                    artwork._id ||
                    `artwork-left-${index}`
                }
                artwork={artwork}
                position={position}
                rotation={[
                    0,
                    Math.PI / 2,
                    0
                ]}
                infoSide="right"
                onArtworkClick={
                    onArtworkClick
                }
                onInfoClick={
                    onInfoClick
                }
            />
        )
    })}


{/* =================================================
    RIGHT WALL — ARTWORKS 5 TO 8
   ================================================= */}

{virtualRoom?.artworks
    ?.slice(4, 8)
    .map((artwork, index) => {
        const position =
            rightPositions[index]

        return (
            <ArtworkOnWall
                key={
                    artwork._id ||
                    `artwork-right-${index}`
                }
                artwork={artwork}
                position={position}
                rotation={[
                    0,
                    -Math.PI / 2,
                    0
                ]}
                infoSide="left"
                onArtworkClick={
                    onArtworkClick
                }
                onInfoClick={
                    onInfoClick
                }
            />
        )
    })}
{/* =================================================
    FRONT STANDING WALL — GOLDEN CEILING SPOTLIGHTS
   ================================================= */}

<WarmCornerLight
    position={[-3.5, 11.2, -3.8]}
    target={[-3.5, 4.5, -4.72]}
    intensity={104}
/>

<WarmCornerLight
    position={[3.5, 11.2, -3.8]}
    target={[3.5, 4.5, -4.72]}
    intensity={104}
/>
{/* =================================================
    ARTISTS
   ================================================= */}

{/* FRONT STANDING WALL — ARTISTS 1 AND 2 */}

{virtualRoom?.artists
    ?.slice(0, 2)
    .map((artist, index) => {

        const frontArtistPositions = [
            [-3.5, 4.65, -4.72],
            [3.5, 4.65, -4.72]
        ]

        return (
            <ArtistOnWall
                key={
                    artist._id ||
                    `front-artist-${index}`
                }
                artist={artist}
                position={
                    frontArtistPositions[index]
                }
                rotation={[0, 0, 0]}
                onArtistClick={
        onArtistClick
                }
            />
        )
    })}


{/* =================================================
    BACK WALL — GOLDEN ARTIST SPOTLIGHTS
   ================================================= */}

{backArtistLights.map((lightPosition, index) => (
    <WarmCornerLight
        key={`back-artist-light-${index}`}
        position={lightPosition}
        target={[
            [-10.2, -3.4, 3.4, 10.2][index],
            5.0,
            -17.65
        ]}
        intensity={84}
    />
))}

{/* =================================================
    BACK WALL — ARTISTS 3 TO 6
   ================================================= */}

{virtualRoom?.artists
    ?.slice(2, 6)
    .map((artist, index) => {

        const backArtistPositions = [
    [-10.2, 5.0, -17.72],
    [-3.4, 5.0, -17.72],
    [3.4, 5.0, -17.72],
    [10.2, 5.0, -17.72]
]

        return (
            <ArtistOnWall
                key={
                    artist._id ||
                    `back-artist-${index}`
                }
                artist={artist}
                position={
                    backArtistPositions[index]
                }
                rotation={[0, 0, 0]}
                onArtistClick={
                    onArtistClick
                }
            />
        )
    })}
        </>
    )
}

export default function VirtualGallery3D() {
    const audioRef = useRef(null)

    const [virtualRooms, setVirtualRooms] = useState(null)
    const [selectedVirtualRoom, setSelectedVirtualRoom] = useState(null)
    const [virtualRoomLoading, setVirtualRoomLoading] = useState(true)
    const [virtualRoomError, setVirtualRoomError] = useState('')

    useEffect(() => {
    const loadVirtualRooms = async () => {
        try {
            setVirtualRoomLoading(true)
            setVirtualRoomError('')

            const response =
                await api.get('/virtual-rooms')
        
            const rooms =
                response.data?.virtualRooms || []

            setVirtualRooms(rooms)

            

        } catch (error) {
            console.error(
                'Error loading virtual rooms:',
                error
            )

            setVirtualRoomError(
                error.response?.data?.message ||
                'Unable to load virtual galleries.'
            )
        } finally {
            setVirtualRoomLoading(false)
        }
    }

    loadVirtualRooms()
}, [])
    const [
        showInstructions,
        setShowInstructions
    ] = useState(true)

    useEffect(() => {
    window.history.replaceState(
        { virtualRoomListing: true },
        '',
        window.location.href
    )

    const handleBrowserBack = (event) => {
        if (event.state?.virtualRoomListing) {
            setSelectedVirtualRoom(null)
            setShowInstructions(false)
        }
    }

    window.addEventListener(
        'popstate',
        handleBrowserBack
    )

    return () => {
        window.removeEventListener(
            'popstate',
            handleBrowserBack
        )
    }
}, [])

   
   const handleEnterVirtualRoom = (room) => {

    window.history.pushState(
        { virtualRoom: room._id },
        '',
        window.location.href
    )

    setSelectedVirtualRoom(room)

    setShowInstructions(true)

}

    const [
        showMenu,
        setShowMenu
    ] = useState(false)

    const [
        soundOn,
        setSoundOn
    ] = useState(true)

    const [
        quality,
        setQuality
    ] = useState('HIGH')

    const [
        selectedArtwork,
        setSelectedArtwork
    ] = useState(null)

    const [
    selectedArtist,
    setSelectedArtist
] = useState(null)

    const [
        selectedInfoArtwork,
        setSelectedInfoArtwork
    ] = useState(null)


    const handleArtworkClick = (
        artwork
    ) => {
        setSelectedArtwork(
            artwork
        )
    }
const handleArtistClick = (
    artist
) => {
    setSelectedArtist(
        artist
    )
}
    const handleInfoClick = (
        artwork
    ) => {
        setSelectedInfoArtwork(
            artwork
        )
    }
if (virtualRoomLoading) {
    return (
        <div className="artevora-virtual-room-selection">
            <div className="artevora-virtual-room-selection-loading">
                Loading virtual galleries...
            </div>
        </div>
    )
}

if (virtualRoomError) {
    return (
        <div className="artevora-virtual-room-selection">
            <div className="artevora-virtual-room-selection-error">
                {virtualRoomError}
            </div>
        </div>
    )
}

if (!selectedVirtualRoom) {
    return (
        <div className="artevora-virtual-room-selection">

            <div className="artevora-virtual-room-selection-header">
                <span>ARTEVORA GALLERY</span>

                <h1>
                    Virtual Tours
                </h1>

                <p>
                    Enter a virtual gallery and explore its
                    collection in an immersive 3D space.
                </p>
            </div>

            <div className="artevora-virtual-room-grid">


                {virtualRooms.map((room) => (
                    <div
                        key={room._id}
                        className="artevora-virtual-room-card"
                    >

                        <div className="artevora-virtual-room-card-image">

                            {room.coverImage ? (
                                <img
                                    src={room.coverImage}
                                    alt={room.title}
                                />
                            ) : (
                                <div className="artevora-virtual-room-card-placeholder">
                                    ARTEVORA
                                </div>
                            )}

                        </div>

                        <div className="artevora-virtual-room-card-content">

                            <span className="artevora-virtual-room-theme">
                                {room.theme || 'luxury'}
                            </span>

                            <h2>
                                {room.title}
                            </h2>

                            {room.description && (
                                <p>
                                    {room.description}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    handleEnterVirtualRoom(room)
                                }
                            >
                                Enter Virtual Tour
                                <span>→</span>
                            </button>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}
    return (
        <div className="artevora-virtual-gallery-3d">
            <audio
    ref={audioRef}
    src="/audio/gallery-ambient.mp3"
    loop
    preload="auto"
/>
            <Canvas
            frameloop={showInstructions || showMenu ? 'demand' : 'always'}
    shadows={quality === 'HIGH'}
    dpr={
        quality === 'HIGH'
            ? [1, 1.4]
            : quality === 'MEDIUM'
                ? [0.9, 1.2]
                : [0.7, 1]
    }
    gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.92
    }}
>
                <color
                    attach="background"
                    args={[
                         '#eeeae3'
                    ]}
                />
<GalleryRoom
    virtualRoom={selectedVirtualRoom}
    onArtworkClick={
        handleArtworkClick
    }
    onInfoClick={
        handleInfoClick
    }
     onArtistClick={
        handleArtistClick
    }
/>
            </Canvas>

            <div className="artevora-mobile-controls">

    <button
        className="artevora-mobile-control up"
        onPointerDown={() => {
            window.dispatchEvent(
                new CustomEvent(
                    'artevora-mobile-control-start',
                    { detail: 'w' }
                )
            )
        }}
        onPointerUp={() => {
            window.dispatchEvent(
                new CustomEvent(
                    'artevora-mobile-control-stop',
                    { detail: 'w' }
                )
            )
        }}
        onPointerLeave={() => {
            window.dispatchEvent(
                new CustomEvent(
                    'artevora-mobile-control-stop',
                    { detail: 'w' }
                )
            )
        }}
        onPointerCancel={() => {
            window.dispatchEvent(
                new CustomEvent(
                    'artevora-mobile-control-stop',
                    { detail: 'w' }
                )
            )
        }}
    >
        ↑
    </button>

    <div className="artevora-mobile-control-row">

        <button
            className="artevora-mobile-control"
            onPointerDown={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-start',
                        { detail: 'arrowleft' }
                    )
                )
            }}
            onPointerUp={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 'arrowleft' }
                    )
                )
            }}
            onPointerLeave={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 'arrowleft' }
                    )
                )
            }}
            onPointerCancel={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 'arrowleft' }
                    )
                )
            }}
        >
            ←
        </button>

        <button
            className="artevora-mobile-control"
            onPointerDown={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-start',
                        { detail: 's' }
                    )
                )
            }}
            onPointerUp={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 's' }
                    )
                )
            }}
            onPointerLeave={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 's' }
                    )
                )
            }}
            onPointerCancel={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 's' }
                    )
                )
            }}
        >
            ↓
        </button>

        <button
            className="artevora-mobile-control"
            onPointerDown={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-start',
                        { detail: 'arrowright' }
                    )
                )
            }}
            onPointerUp={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 'arrowright' }
                    )
                )
            }}
            onPointerLeave={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 'arrowright' }
                    )
                )
            }}
            onPointerCancel={() => {
                window.dispatchEvent(
                    new CustomEvent(
                        'artevora-mobile-control-stop',
                        { detail: 'arrowright' }
                    )
                )
            }}
        >
            →
        </button>

    </div>

</div>

            {selectedArtwork &&
     createPortal(
        <div className="artevora-artwork-fullscreen">
            <button
                type="button"
                className="artevora-artwork-back"
                onClick={() => setSelectedArtwork(null)}
            >
                ×
            </button>

            <div className="artevora-artwork-fullscreen-content">
                <img
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title || 'Artwork'}
                />

                <h2>
                    {selectedArtwork.title || 'Untitled'}
                </h2>
            </div>
        </div>,
        document.body
    )
}
{selectedArtist &&
     createPortal(
        <div className="artevora-artist-fullscreen">

            <button
                type="button"
                className="artevora-artist-fullscreen-back"
                onClick={() =>
                    setSelectedArtist(null)
                }
            >
                ×
            </button>

            <div className="artevora-artist-fullscreen-content">

                <img
                    src={selectedArtist.profileImage}
                    alt={
                        selectedArtist.name ||
                        'Artist'
                    }
                />

                <div className="artevora-artist-fullscreen-details">

                    <h2>
                        {selectedArtist.name ||
                            'Artist'}
                    </h2>

                    {selectedArtist.biography && (
                        <p>
                            {selectedArtist.biography}
                        </p>
                    )}

                </div>

            </div>

        </div>,
        document.body
    )
}
    {selectedInfoArtwork &&
     createPortal(
        <div className="artevora-artwork-info-fullscreen">
            <button
                type="button"
                className="artevora-artwork-info-back"
                onClick={() => setSelectedInfoArtwork(null)}
            >
                ×
            </button>

            <div className="artevora-artwork-info-content">
                <img
                    src={selectedInfoArtwork.image}
                    alt={selectedInfoArtwork.title || 'Artwork'}
                />

                <div className="artevora-artwork-info-text">
                    <h1>
                        {selectedInfoArtwork.title || 'Untitled'}
                    </h1>

                    <div className="artevora-artwork-info-line"></div>

                    <span className="artevora-artwork-info-label">
                        STORY
                    </span>

                    <p>
                        {selectedInfoArtwork.story ||
                            selectedInfoArtwork.description ||
                            'No story available.'}
                    </p>

                    <span className="artevora-artwork-info-label">
                        ARTIST
                    </span>

                    <p>
                        {selectedInfoArtwork.artistName ||
                            selectedInfoArtwork.artist?.name ||
                            'Artist'}
                    </p>

                    <span className="artevora-artwork-info-label">
                        YEAR
                    </span>

                    <p>
                        {selectedInfoArtwork.year ||
                            'Year not available'}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    )
}

            <button
                type="button"
                className="artevora-virtual-menu-button"
                onClick={() =>
                    setShowMenu(
                        (prev) => !prev
                    )
                }
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
                            setShowInstructions(
                                true
                            )

                            setShowMenu(
                                false
                            )
                        }}
                    >
                        <span>
                            Instructions
                        </span>

                        <span className="artevora-menu-arrow">
                            ›
                        </span>
                    </button>

                   <button
    type="button"
    className="artevora-virtual-menu-item"
    onClick={() => {
        setSoundOn((prev) => {
            const next = !prev

            if (audioRef.current) {
                if (next) {
                    audioRef.current
                        .play()
                        .catch(() => {})
                } else {
                    audioRef.current.pause()
                }
            }

            return next
        })
    }}
>
    <span>
        Sound
    </span>

    <span className="artevora-menu-status">
        {
            soundOn
                ? 'ON'
                : 'OFF'
        }
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

                            if (
                                !document.fullscreenElement
                            ) {
                                galleryElement?.requestFullscreen()
                            }

                            else {
                                document.exitFullscreen()
                            }

                            setShowMenu(
                                false
                            )
                        }}
                    >
                        <span>
                            Fullscreen
                        </span>

                        <span className="artevora-menu-arrow">
                            ›
                        </span>
                    </button>

                    <button
                        type="button"
                        className="artevora-virtual-menu-item"
                        onClick={() => {
                            if (
                                quality === 'HIGH'
                            ) {
                                setQuality(
                                    'MEDIUM'
                                )
                            }

                            else if (
                                quality === 'MEDIUM'
                            ) {
                                setQuality(
                                    'LOW'
                                )
                            }

                            else {
                                setQuality(
                                    'HIGH'
                                )
                            }
                        }}
                    >
                        <span>
                            Quality
                        </span>

                        <span className="artevora-menu-status">
                            {quality}
                        </span>
                    </button>
                </div>
            )}

            {showInstructions && (
                <div className="artevora-instructions-overlay">
                    <div className="artevora-instructions-panel">
                        <div className="artevora-instructions-header">
                            <h2>
                                Instructions
                            </h2>

                            <button
                                type="button"
                                className="artevora-instructions-close"
                                onClick={() =>
                                    setShowInstructions(
                                        false
                                    )
                                }
                                aria-label="Close instructions"
                            >
                                ×
                            </button>
                        </div>

                        <div className="artevora-instructions-visual">
                            <div className="artevora-gallery-diagram">
                                <div className="artevora-gallery-back-wall" />
                                <div className="artevora-gallery-left-wall" />
                                <div className="artevora-gallery-right-wall" />
                                <div className="artevora-gallery-perspective-line" />

                                <div className="artevora-gallery-cursor">
                                    ✦
                                </div>
                            </div>
                        </div>

                        <div className="artevora-instructions-controls">
                            <div className="artevora-control-section">
                                <h3>
                                    Move
                                </h3>

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

                            <div className="artevora-control-section">
                                <h3>
                                    Look around
                                </h3>

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

                        <button
    type="button"
    className="artevora-instructions-start"
    onClick={() => {
        setShowInstructions(false)

        if (audioRef.current) {
            audioRef.current
                .play()
                .catch(() => {})
        }
    }}
>
    Start Exploring
</button>
                    </div>
                </div>
            )}
        </div>
    )
}