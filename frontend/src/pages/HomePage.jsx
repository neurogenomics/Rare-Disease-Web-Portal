import BackgroundAnimation from "../components/BackgroundAnimation";
import HomeOption from "../components/HomeOption";
import Header from "../components/utilities/Header";

export default function HomePage() {
    return (
        <>
            <Header activePageKey="home" />
            <BackgroundAnimation />
            <HomeOption />
        </>
    );
}
