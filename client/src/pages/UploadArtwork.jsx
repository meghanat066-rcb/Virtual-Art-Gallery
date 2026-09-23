import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaCloudUploadAlt,
} from "react-icons/fa";
import "./UploadArtwork.css";
import { API_BASE_URL } from "../services/api";

const ARTWORK_CATEGORIES = [
    "Paintings",
    "Sculptures",
    "Ceramics",
    "Digital Art",
    "Photography",
];

const REPLICA_SIZES = [
    {
        key: "small",
        name: "Small",
        dimensions: "40 × 30 cm",
    },
    {
        key: "medium",
        name: "Medium",
        dimensions: "60 × 45 cm",
    },
    {
        key: "large",
        name: "Large",
        dimensions: "90 × 60 cm",
    },
    {
        key: "xl",
        name: "XL",
        dimensions: "120 × 90 cm",
    },
];

const UploadArtwork = () => {

    const navigate = useNavigate();

    // =========================================
    // BASIC ARTWORK INFORMATION
    // =========================================

    const [title, setTitle] = useState("");
    const [artistName, setArtistName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    const [story, setStory] = useState("");
    const [medium, setMedium] = useState("");
    const [year, setYear] = useState("");
    const [dimensions, setDimensions] = useState("");

    const [orientation, setOrientation] =
        useState("Portrait");

    const [framed, setFramed] =
        useState("Yes");

    const [shipsFrom, setShipsFrom] =
        useState("India");

    // =========================================
    // ORIGINAL SELLING INFORMATION
    // =========================================

    const [price, setPrice] = useState("");

    const [availability, setAvailability] =
        useState("Available");

    // =========================================
    // REPLICA INFORMATION
    // =========================================

    const [replicaAvailable, setReplicaAvailable] =
        useState(false);

   const [replicaPrices, setReplicaPrices] = useState({
    small: "",
    medium: "",
    large: "",
    xl: "",
});
    const [replicaSelected, setReplicaSelected] =
        useState({
            small: false,
            medium: false,
            large: false,
            xl: false,
        });

    // =========================================
    // IMAGE
    // =========================================

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

        const [replicaImage, setReplicaImage] =
    useState(null);

const [replicaPreview, setReplicaPreview] =
    useState("");

    // =========================================
    // SUBMISSION
    // =========================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================
    // CHECK ARTIST LOGIN
    // =========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        try {

            const user =
                JSON.parse(storedUser);

            if (user.role !== "artist") {
                navigate("/");
                return;
            }

            setArtistName(
                user.name || ""
            );

        } catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

            navigate("/login");
        }

    }, [navigate]);


    // =========================================
    // IMAGE SELECTION
    // =========================================

    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) return;

        setError("");
        setSuccess("");

        if (!file.type.startsWith("image/")) {

            setError(
                "Please select a valid image file."
            );

            return;
        }

        if (file.size > 10 * 1024 * 1024) {

            setError(
                "Image size must be less than 10 MB."
            );

            return;
        }

        setImage(file);

        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);
    };

const handleReplicaImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
        setError("Please select a valid replica image file.");
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        setError("Replica image size must be less than 10 MB.");
        return;
    }

    setReplicaImage(file);

    const imageUrl = URL.createObjectURL(file);
    setReplicaPreview(imageUrl);
};
    // =========================================
    // REMOVE IMAGE
    // =========================================

    const handleRemoveImage = () => {

        setImage(null);
        setPreview("");

        const input =
            document.getElementById(
                "artwork-image"
            );

        if (input) {
            input.value = "";
        }
    };

    // =========================================
// REPLICA AVAILABILITY
// =========================================

const handleReplicaAvailability = (value) => {
    setReplicaAvailable(value);

    if (!value) {
        setReplicaSelected({
            small: false,
            medium: false,
            large: false,
            xl: false,
        });

        setReplicaPrices({
            small: "",
            medium: "",
            large: "",
            xl: "",
        });
    }
};


// =========================================
// REPLICA SIZE TOGGLE
// =========================================

const handleReplicaSizeToggle = (size) => {
    setReplicaSelected((previous) => {
        const newSelectedValue = !previous[size];

        // If the size is being deselected,
        // clear its price.
        if (!newSelectedValue) {
            setReplicaPrices((previousPrices) => ({
                ...previousPrices,
                [size]: "",
            }));
        }

        return {
            ...previous,
            [size]: newSelectedValue,
        };
    });
};


// =========================================
// REPLICA PRICE CHANGE
// =========================================

const handleReplicaPriceChange = (size, value) => {
    setReplicaPrices((previous) => ({
        ...previous,
        [size]: value,
    }));
};

    // =========================================
    // FORM SUBMIT
    // =========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // =====================================
        // BASIC VALIDATION
        // =====================================

        if (!title.trim()) {

            setError(
                "Please enter the artwork title."
            );

            return;
        }

        if (!category) {

            setError(
                "Please select a category."
            );

            return;
        }

        if (!story.trim()) {

            setError(
                "Please enter the story behind the artwork."
            );

            return;
        }

        if (!medium.trim()) {

            setError(
                "Please enter the artwork medium."
            );

            return;
        }

        if (!year) {

            setError(
                "Please enter the artwork year."
            );

            return;
        }

        if (!dimensions.trim()) {

            setError(
                "Please enter the original artwork dimensions."
            );

            return;
        }

        if (!price) {

            setError(
                "Please enter the original artwork price."
            );

            return;
        }

        if (!image) {

            setError(
                "Please upload an artwork image."
            );

            return;
        }


        // =====================================
        // REPLICA VALIDATION
        // =====================================

        if (replicaAvailable) {

            if (!replicaImage) {
    setError(
        "Please upload a replica image."
    );

    return;
}

            const selectedSizes =
                REPLICA_SIZES.filter(
                    (size) =>
                        replicaSelected[
                            size.key
                        ]
                );

            if (
                selectedSizes.length === 0
            ) {

                setError(
                    "Please select at least one replica size."
                );

                return;
            }

            for (
                const size
                of selectedSizes
            ) {

                const sizePrice =
                    replicaPrices[
                        size.key
                    ];

                if (
                    !sizePrice ||
                    Number(sizePrice) < 1
                ) {

                    setError(
                        `Please enter a valid price for the ${size.name} replica.`
                    );

                    return;
                }
            }
        }


        // =====================================
        // SUBMIT
        // =====================================

        try {

            setLoading(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            if (!token) {

                navigate("/login");
                return;
            }


            // =================================
            // PREPARE REPLICA DATA
            // =================================

            const replicaData = {

                small:
                    replicaSelected.small
                        ? {
                            price:
                                Number(
                                    replicaPrices.small
                                ),
                            available:
                                true,
                        }
                        : {
                            price: null,
                            available: false,
                        },

                medium:
                    replicaSelected.medium
                        ? {
                            price:
                                Number(
                                    replicaPrices.medium
                                ),
                            available:
                                true,
                        }
                        : {
                            price: null,
                            available: false,
                        },

                large:
                    replicaSelected.large
                        ? {
                            price:
                                Number(
                                    replicaPrices.large
                                ),
                            available:
                                true,
                        }
                        : {
                            price: null,
                            available: false,
                        },

                xl:
                    replicaSelected.xl
                        ? {
                            price:
                                Number(
                                    replicaPrices.xl
                                ),
                            available:
                                true,
                        }
                        : {
                            price: null,
                            available: false,
                        },
            };


            // =================================
            // FORM DATA
            // =================================

            const formData =
                new FormData();

            formData.append(
                "title",
                title.trim()
            );

            formData.append(
                "artistName",
                artistName.trim()
            );

            formData.append(
                "category",
                category
            );

            formData.append(
                "description",
                description.trim()
            );

            formData.append(
                "story",
                story.trim()
            );

            formData.append(
                "medium",
                medium.trim()
            );

            formData.append(
                "year",
                year
            );

            formData.append(
                "dimensions",
                dimensions.trim()
            );

            formData.append(
                "orientation",
                orientation
            );

            formData.append(
                "framed",
                framed
            );

            formData.append(
                "shipsFrom",
                shipsFrom.trim()
            );

            formData.append(
                "price",
                price
            );

            formData.append(
                "availability",
                availability
            );

            formData.append(
                "replicaAvailable",
                replicaAvailable
            );

            formData.append(
                "replicaPrices",
                JSON.stringify(
                    replicaData
                )
            );

            formData.append(
                "image",
                image
            );
            if (replicaImage) {
    formData.append(
        "replicaImage",
        replicaImage
    );
}


            // =================================
            // API REQUEST
            // =================================

            const response =
                await fetch(
                    `${API_BASE_URL}/artworks/upload`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: formData,
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Artwork upload failed."
                );
            }


            // =================================
            // SUCCESS
            // =================================

            setSuccess(
                "Artwork submitted successfully for approval."
            );


            // =================================
            // RESET FORM
            // =================================

            setTitle("");
            setCategory("");
            setStory("");
            setMedium("");
            setYear("");
            setDimensions("");

            setOrientation(
                "Portrait"
            );

            setFramed("Yes");

            setShipsFrom("India");

            setPrice("");

            setAvailability(
                "Available"
            );

            setReplicaAvailable(
                false
            );

            setReplicaPrices({
                small: "",
                medium: "",
                large: "",
                xl: "",
            });

            setReplicaSelected({
                small: false,
                medium: false,
                large: false,
                xl: false,
            });

            setImage(null);
            setPreview("");


            const input =
                document.getElementById(
                    "artwork-image"
                );

            if (input) {
                input.value = "";
            }

        } catch (error) {

            console.error(
                "Artwork upload error:",
                error
            );

            setError(
                error.message ||
                "Something went wrong while uploading the artwork."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================
    // PAGE
    // =========================================

    return (
        <main className="artevora-upload-page">

            {/* =================================
                BACK
            ================================= */}

            <div className="artevora-upload-header">

                <button
                    type="button"
                    className="artevora-upload-back"
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    <FaArrowLeft />

                    <span>
                        Back
                    </span>

                </button>

            </div>


            {/* =================================
                INTRO
            ================================= */}

            <section className="artevora-upload-intro">

                <p className="artevora-upload-label">
                    ARTIST SUBMISSION
                </p>

                <h1>
                    Submit Your Artwork
                </h1>

                <p className="artevora-upload-intro-text">
                    Present a new work to the
                    ArteVora collection by
                    providing the essential
                    information below.
                </p>

            </section>


            {/* =================================
                FORM
            ================================= */}

            <form
                className="artevora-upload-form"
                onSubmit={handleSubmit}
            >


                {/* =================================
                    SECTION 01
                    ARTWORK INFORMATION
                ================================= */}

                <section className="artevora-upload-information">

                    <div className="artevora-upload-section-title">

                        <span>
                            01
                        </span>

                        <h2>
                            Artwork Information
                        </h2>

                    </div>


                    {/* TITLE */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-title">
                            Artwork Title
                        </label>

                        <input
                            id="artwork-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="Enter artwork title"
                            maxLength={150}
                            required
                        />

                    </div>


                    {/* ARTIST */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artist-name">
                            Artist Name
                        </label>

                        <input
                            id="artist-name"
                            type="text"
                            value={artistName}
                            readOnly
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-category">
                            Category
                        </label>

                        <select
                            id="artwork-category"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select category
                            </option>

                            {ARTWORK_CATEGORIES.map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                    {/* DESCRIPTION */}

<div className="artevora-upload-field">

    <label htmlFor="artwork-description">
        Artwork Description
    </label>

    <textarea
        id="artwork-description"
        value={description}
        onChange={(event) =>
            setDescription(
                event.target.value
            )
        }
        placeholder="Write a short description introducing this artwork to visitors"
        rows="4"
        maxLength={500}
        required
    />

</div>


                    {/* STORY */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-story">
                            Story Behind the Artwork
                        </label>

                        <textarea
                            id="artwork-story"
                            value={story}
                            onChange={(event) =>
                                setStory(
                                    event.target.value
                                )
                            }
                            placeholder="Tell visitors the story or inspiration behind this artwork"
                            rows="6"
                            maxLength={1000}
                            required
                        />

                    </div>


                    {/* MEDIUM */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-medium">
                            Medium
                        </label>

                        <input
                            id="artwork-medium"
                            type="text"
                            value={medium}
                            onChange={(event) =>
                                setMedium(
                                    event.target.value
                                )
                            }
                            placeholder="Example: Oil on Canvas"
                            required
                        />

                    </div>


                    {/* YEAR */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-year">
                            Year Created
                        </label>

                        <input
                            id="artwork-year"
                            type="number"
                            value={year}
                            onChange={(event) =>
                                setYear(
                                    event.target.value
                                )
                            }
                            min="1000"
                            max={
                                new Date()
                                    .getFullYear()
                            }
                            placeholder="Example: 2025"
                            required
                        />

                    </div>


                    {/* ORIGINAL DIMENSIONS */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-dimensions">
                            Original Artwork Size
                        </label>

                        <input
                            id="artwork-dimensions"
                            type="text"
                            value={dimensions}
                            onChange={(event) =>
                                setDimensions(
                                    event.target.value
                                )
                            }
                            placeholder="Example: 60 × 45 cm"
                            required
                        />

                    </div>


                    {/* ORIENTATION */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-orientation">
                            Orientation
                        </label>

                        <select
                            id="artwork-orientation"
                            value={orientation}
                            onChange={(event) =>
                                setOrientation(
                                    event.target.value
                                )
                            }
                        >

                            <option value="Portrait">
                                Portrait
                            </option>

                            <option value="Landscape">
                                Landscape
                            </option>

                            <option value="Square">
                                Square
                            </option>

                        </select>

                    </div>


                    {/* FRAMED */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-framed">
                            Framed
                        </label>

                        <select
                            id="artwork-framed"
                            value={framed}
                            onChange={(event) =>
                                setFramed(
                                    event.target.value
                                )
                            }
                        >

                            <option value="Yes">
                                Yes
                            </option>

                            <option value="No">
                                No
                            </option>

                        </select>

                    </div>


                    {/* SHIPS FROM */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-ships-from">
                            Ships From
                        </label>

                        <input
                            id="artwork-ships-from"
                            type="text"
                            value={shipsFrom}
                            onChange={(event) =>
                                setShipsFrom(
                                    event.target.value
                                )
                            }
                            placeholder="Example: Bengaluru, India"
                            required
                        />

                    </div>


                    {/* =================================
                        ORIGINAL PRICE
                    ================================= */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-price">
                            Original Artwork Price (₹)
                        </label>

                        <input
                            id="artwork-price"
                            type="number"
                            value={price}
                            onChange={(event) =>
                                setPrice(
                                    event.target.value
                                )
                            }
                            min="1"
                            placeholder="Enter original artwork price"
                            required
                        />

                    </div>


                    {/* AVAILABILITY */}

                    <div className="artevora-upload-field">

                        <label htmlFor="artwork-availability">
                            Availability
                        </label>

                        <select
                            id="artwork-availability"
                            value={availability}
                            onChange={(event) =>
                                setAvailability(
                                    event.target.value
                                )
                            }
                        >

                            <option value="Available">
                                Available
                            </option>

                            <option value="Reserved">
                                Reserved
                            </option>

                            <option value="Sold">
                                Sold
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        REPLICA AVAILABILITY
                    ================================= */}

                    <div className="artevora-upload-field">

                        <label>
                            Replica Availability
                        </label>

                        <div className="artevora-replica-toggle">

                            <button
                                type="button"
                                className={
                                    !replicaAvailable
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleReplicaAvailability(
                                        false
                                    )
                                }
                            >
                                No
                            </button>

                            <button
                                type="button"
                                className={
                                    replicaAvailable
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handleReplicaAvailability(
                                        true
                                    )
                                }
                            >
                                Yes
                            </button>

                        </div>

                        <p className="artevora-upload-field-help">
                            Choose whether customers can purchase
                            replicas of this original artwork.
                        </p>

                    </div>


                    {/* =================================
                        REPLICA OPTIONS
                    ================================= */}

                    {replicaAvailable && (

                        <div className="artevora-replica-options">

                            <div className="artevora-replica-heading">

                                <h3>
                                    Replica Options
                                </h3>

                                <p>
                                    Select the available replica
                                    sizes and set their selling prices.
                                </p>

                            </div>


                            {REPLICA_SIZES.map(
                                (size) => {

                                    const selected =
                                        replicaSelected[
                                            size.key
                                        ];

                                    return (

                                        <div
                                            key={
                                                size.key
                                            }
                                            className={
                                                `artevora-replica-option ${
                                                    selected
                                                        ? "selected"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <label
                                                className="artevora-replica-option-check"
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selected
                                                    }
                                                    onChange={() =>
                                                        handleReplicaSizeToggle(
                                                            size.key
                                                        )
                                                    }
                                                />

                                                <span>
                                                    Select
                                                </span>

                                            </label>


                                            <div className="artevora-replica-option-info">

                                                <strong>
                                                    {size.name}
                                                </strong>

                                                <span>
                                                    {size.dimensions}
                                                </span>

                                            </div>


                                            <div className="artevora-replica-option-price">

                                                <label
                                                    htmlFor={`replica-${size.key}`}
                                                >
                                                    Price (₹)
                                                </label>

                                                <input
                                                    id={`replica-${size.key}`}
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        replicaPrices[
                                                            size.key
                                                        ]
                                                    }
                                                    onChange={(event) =>
                                                        handleReplicaPriceChange(
                                                            size.key,
                                                            event.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        !selected
                                                    }
                                                    placeholder="Enter price"
                                                />

                                            </div>

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    )}
                    {replicaAvailable && (
    <div className="artevora-upload-field">
        <label htmlFor="replica-image">
            Replica Image
        </label>

        {!replicaPreview ? (
            <label
                htmlFor="replica-image"
                className="artevora-upload-area"
            >
                <FaCloudUploadAlt />

                <strong>
                    Upload replica image
                </strong>

                <span>
                    Upload one replica image for all available sizes
                </span>

                <small>
                    JPG · JPEG · PNG · WEBP · MAX 10 MB
                </small>

                <input
                    id="replica-image"
                    type="file"
                    accept="image/*"
                    onChange={handleReplicaImageChange}
                />
            </label>
        ) : (
            <div className="artevora-upload-preview">
                <img
                    src={replicaPreview}
                    alt="Replica artwork preview"
                />

                <button
                    type="button"
                    onClick={() => {
                        setReplicaImage(null);
                        setReplicaPreview("");

                        const input =
                            document.getElementById("replica-image");

                        if (input) {
                            input.value = "";
                        }
                    }}
                    className="artevora-remove-image"
                >
                    Remove Replica Image
                </button>
            </div>
        )}
    </div>
)}

                </section>


                {/* =================================
                    SECTION 02
                    UPLOAD IMAGE
                ================================= */}

                <section className="artevora-upload-image-section">

                    <div className="artevora-upload-section-title">

                        <span>
                            02
                        </span>

                        <h2>
                            Upload Artwork
                        </h2>

                    </div>


                    {!preview ? (

                        <label
                            htmlFor="artwork-image"
                            className="artevora-upload-area"
                        >

                            <FaCloudUploadAlt />

                            <strong>
                                Upload your artwork
                            </strong>

                            <span>
                                Drag and drop your image here
                                or browse from your device
                            </span>

                            <small>
                                JPG · JPEG · PNG · WEBP · MAX 10 MB
                            </small>

                            <input
                                id="artwork-image"
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                        </label>

                    ) : (

                        <div className="artevora-upload-preview">

                            <img
                                src={preview}
                                alt="Artwork preview"
                            />

                            <button
                                type="button"
                                onClick={
                                    handleRemoveImage
                                }
                                className="artevora-remove-image"
                            >
                                Remove Image
                            </button>

                        </div>

                    )}

                </section>


                {/* =================================
                    MESSAGES
                ================================= */}

                {error && (

                    <div className="artevora-upload-error">
                        {error}
                    </div>

                )}

                {success && (

                    <div className="artevora-upload-success">
                        {success}
                    </div>

                )}


                {/* =================================
                    SUBMIT
                ================================= */}

                <div className="artevora-upload-submit">

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Submitting..."
                            : "Submit Artwork"}

                    </button>

                </div>

            </form>

        </main>
    );
};

export default UploadArtwork;