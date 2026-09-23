function PageLayout({ background, children }) {
    return (
        <div
            className="page-layout"
            style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.38), rgba(255,255,255,0.38)), url(${background})`
            }}
        >
            {children}
        </div>
    )
}

export default PageLayout