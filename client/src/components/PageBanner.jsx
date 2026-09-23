function PageBanner({ title, subtitle, image }) {
    return (
        <section
            className="page-banner"
            style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url(${image})`
            }}
        >
            <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
        </section>
    )
}

export default PageBanner