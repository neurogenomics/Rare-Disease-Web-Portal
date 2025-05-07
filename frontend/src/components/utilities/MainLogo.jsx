export default function MainLogo() {
    return (
        <div
            style={{
                textAlign: "left",
                marginLeft: "2em",
                lineHeight: 1,
                fontFamily: "Arial, sans-serif",
            }}
            className="flex items-center"
        >
            <img
                src={"/logos/logo_RareDiseasePortal.svg"}
                className="h-[40px] object-contain mr-1"
                alt="Rare Disease Celltyping Portal logo"
            />
            <div>
                <span style={{ fontWeight: "bold", display: "block", fontSize: "20px" }}>
                    Rare Disease
                </span>
                <span style={{ fontSize: "15px" }}>Celltyping Portal</span>
            </div>
        </div>
    )
}