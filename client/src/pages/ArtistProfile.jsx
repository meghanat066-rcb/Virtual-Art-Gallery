import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPalette } from "react-icons/fa";
import "./ArtistProfile.css";

const getYouTubeEmbedUrl = (url) => {
    if (!url) {
        return ""
    }

    try {
        const videoUrl = new URL(url)

        if (videoUrl.hostname.includes("youtube.com")) {
            const videoId = videoUrl.searchParams.get("v")

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`
            }
        }

        if (videoUrl.hostname === "youtu.be") {
            const videoId = videoUrl.pathname.slice(1)

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`
            }
        }

        return url
    } catch {
        return url
    }
}

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = location.state?.from || "/artists";

  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/artists/${id}`,
        );

        const data = await response.json();

        console.log("ARTIST DATA:", data)

        console.log("ARTIST VIDEO:", data.artist?.artistJourneyVideo);
        console.log("BIOGRAPHY FROM ARTIST:", data.artist?.biography);

console.log("ARTIST STATEMENT FROM ARTIST:", data.artist?.artistStatement);

        if (data.success) {
          setArtist(data.artist);
          setArtworks(data.artworks || []);
        }
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="artevora-artist-profile-loading">
        Loading artist profile...
      \</div>
    );
  }

  if (!artist) {
    return (
      <div className="artevora-artist-profile-error">
        <h2>Artist not found\</h2>
        <button onClick={() => navigate(backPath)}>
          Back to Artists
        </button>
      </div>
    );
  }

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads")) {
      return`http://localhost:8000${image}`;
    }

    return image;
  };
  const getVideoUrl = (video) => {
    if (!video) return "";

    if (video.startsWith("http")) {
        return video;
    }

    return `http://localhost:8000${video}`;
};

  return (
    <div className="artevora-artist-profile-page">

      {/* =========================================
    BACK TO ARTISTS
========================================= */}
      <main className="artevora-artist-profile-container">

        <button
          className="artevora-back-artists"
          onClick={() => navigate("/artists")}
        >
          <FaArrowLeft />
          <span>Back to Artists</span>
        </button>

{/* =========================================
    ARTIST HERO
========================================= */}

<section className="artevora-artist-hero">

    {/* ARTIST PHOTO */}

<div className="artevora-artist-image-wrapper">

        {artist.profileImage ? (
            <img
                src={getImageUrl(artist.profileImage)}
                alt={artist.name}
                className="artevora-artist-main-image"
            />
        ) : (
            <div className="artevora-artist-image-placeholder">
                <FaPalette />
            </div>
        )}

    </div>


    {/* =========================================
    ARTIST INFORMATION
========================================= */}

<div className="artevora-artist-hero-content">

    <p className="artevora-hero-label">
        ARTIST PROFILE
    </p>

    <h1 className="artevora-artist-hero-name">
        {artist.name}
    </h1>

    <div className="artevora-hero-category">
        <FaPalette />
        <span>Paintings</span>
    </div>


    {/* ARTIST STATEMENT */}

    {artist.artistStatement && (

        <div className="artevora-hero-statement">

            <span className="artevora-statement-quote">
                “
            </span>

            <p>
                {artist.artistStatement}
            </p>

            <span className="artevora-statement-quote-end">
                ”
            </span>

        </div>

    )}

</div>

</section>
        {/* =========================================
            BIOGRAPHY
        ========================================= */}
        <section className="artevora-biography-section artevora-biography-heading">


            <p className="artevora-eyebrow">
              THE ARTIST
            </p>

            <h2>
              Biography
            </h2>

          <div className="artevora-biography-content">

            {artist.biography ? (
              <p>{artist.biography}</p>
            ) : (
              <p>
                Biography information will be added soon.
              </p>
            )}

          </div>

        </section>

{/* =========================================
    ARTIST JOURNEY VIDEO
========================================= */}

<section className="artevora-artist-video-section">

  <div className="artevora-video-heading">

    <p className="artevora-eyebrow">
      ARTIST JOURNEY
    </p>

    <h2>
      The Story Behind the Artist
    </h2>

    <p className="artevora-video-intro">
    Discover the journey, artistic development and story behind {artist.name}.
   </p>

  </div>

  <div className="artevora-video-player">

    {artist.artistJourneyVideo ? (
        <iframe
            className="artevora-artist-video"
            src={getYouTubeEmbedUrl(
                artist.artistJourneyVideo
            )}
            title={`${artist.name} Artist Journey`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        ></iframe>
    ) : (
        <div className="artevora-video-placeholder">
            <p>
                Artist journey video will be added soon.
            </p>
        </div>
    )}

</div>

</section>

        {/* =========================================
            PUBLISHED WORKS
        ========================================= */}
        <section className="artevora-published-section">

          <div className="artevora-section-heading">

            <p className="artevora-eyebrow">
              SELECTED WORKS
            </p>

            <h2>
              Published Works
            </h2>

          </div>


          <div className="artevora-works-count">
            {artworks.length}{" "}
            {artworks.length === 1 ? "artwork" : "artworks"}
          </div>


          {artworks.length > 0 ? (

            <div className="artevora-works-grid">

              {artworks.map((artwork) => (

                <article
                  className="artevora-work-item"
                  key={artwork._id}
                  onClick={() =>
                    navigate(`/artwork/${artwork._id}`)
                  }
                >

                  <div className="artevora-work-image-wrapper">

                    <img
                      src={getImageUrl(
                        artwork.image ||
                        artwork.artworkImage ||
                        artwork.imageUrl
                      )}
                      alt={artwork.title}
                      className="artevora-work-image"
                    />

                  </div>


                  <div className="artevora-work-info">

                    <h3>
                      {artwork.title}
                    </h3>

                    {artwork.category && (
                      <p>
                        {artwork.category}
                      </p>
                    )}

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="artevora-no-works">
            <p>
                No published works available yet.
              </p>
            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default ArtistProfile;