import { useState, useRef, useEffect } from "react";
import BackgroundAnimation from "../components/BackgroundAnimation";
import { Layout } from "antd";
import Header from "../components/utilities/Header";
import {
    KeyboardArrowDown,
    CircleOutlined,
    Circle,
    SearchOutlined,
} from "@mui/icons-material";
import { FaDisease, FaDna } from "react-icons/fa";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { FaHeadSideMask } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ExamplesSection from "../components/HomeExamples";

const { Content } = Layout;

const searchOptions = {
    phenotype: {
        title: "Phenotype",
        icon: <BsFileEarmarkMedicalFill />,
        description:
            "Search with a phenotype term to explore its relationships with different cell types, diseases and genes",
        path: "/phenotype",
    },
    celltype: {
        title: "Cell Type",
        icon: <FaDisease />,
        description:
            "Search with a cell type term to explore its relationships with different genes and phenotypes",
        path: "/celltype",
    },
    gene: {
        title: "Gene",
        icon: <FaDna />,
        description:
            "Search with a gene identifier to explore its relationships with different cell types, diseases and phenotypes",
        path: "/gene",
    },
    severity: {
        title: "Severity",
        icon: <FaHeadSideMask />,
        description:
            "Filter phenotypes based on severity and occurence of various clinical characteristics",
        path: "/severity",
    },
};

export default function HomePage() {
    const navigate = useNavigate();

    const refSearch = useRef(null);
    const refExplore = useRef(null);
    const [activeScrollPage, setActiveScrollPage] = useState(0);
    const scrollWindows = 3; // Number of snap sections

    // Update activeScrollPage based on the snap section in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Get the index from the data attribute
                        const index = parseInt(entry.target.dataset.index);
                        setActiveScrollPage(index);
                    }
                });
            },
            {
                root: null, // Use viewport as root
                threshold: 0.7, // Trigger when 70% of the element is visible
            }
        );

        // Find all snap sections and observe them
        const sections = document.querySelectorAll(".snap-center");
        sections.forEach((section, index) => {
            section.dataset.index = index;
            observer.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                observer.unobserve(section);
            });
        };
    }, []);

    function scrollIndicator() {
        const circles = [];
        for (let i = 0; i < scrollWindows; i++) {
            circles.push(
                <div key={i}>
                    {activeScrollPage === i ? (
                        <Circle style={{ fontSize: "10px" }} />
                    ) : (
                        <CircleOutlined style={{ fontSize: "10px" }} />
                    )}
                </div>
            );
        }

        return (
            <div className="z-10 fixed flex flex-col right-7 top-1/2 text-purple-200 shadow-lg">
                {circles}
            </div>
        );
    }

    return (
        <>
            <div className="fixed t-0 w-full z-10 min-w-[50rem]">
                <Header activePageKey="home" />
            </div>
            <Layout className="min-w-[50rem] overflow-hidden">
                <div className="-z-10 fixed h-screen w-screen mt-[3rem] pb-[3rem] overflow-hidden">
                    <BackgroundAnimation homePage={true} />
                </div>
                {scrollIndicator()}
                <Content
                    className="text-purple-50 z-1 absolute h-screen w-screen overflow-y-auto scroll-smooth snap-y snap-mandatory"
                    style={{ scrollbarWidth: "none" }}
                >
                    <div className="h-screen flex flex-col md:max-w-xl lg:max-w-4xl md:mx-8 lg:mx-16 snap-center snap-always justify-center">
                        <div
                            id="intro"
                            className="backdrop-blur-sm bg-black/30 p-8 rounded-xl shadow-2xl border border-purple-400/20"
                        >
                            <div className="font-mono text-purple-50">
                                <h1 className="md:text-3xl lg:text-5xl font-bold tracking-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                                        A Comprehensive Browser for
                                    </span>
                                </h1>
                                <h2 className="md:text-xl lg:text-3xl font-semibold mt-2 md:mb-3 lg:mb-6 leading-tight">
                                    Uncovering Disease, Gene and Cell Type
                                    Associations
                                </h2>
                            </div>

                            <div className="md:space-y-2 lg:space-y-4 md:text-sm lg:text-lg">
                                <p className="leading-relaxed">
                                    Welcome to the{" "}
                                    <span className="text-purple-300 font-medium">
                                        Rare Disease Web Portal
                                    </span>
                                    , a comprehensive resource for investigating
                                    the relationship between rare diseases,
                                    genes and different cell types.
                                </p>

                                <p className="leading-relaxed">
                                    Our platform integrates Human Phenotype
                                    Ontology data with single-cell
                                    transcriptomic atlases to map{" "}
                                    <span className="text-purple-300 font-medium">
                                        201 cell types
                                    </span>{" "}
                                    to over{" "}
                                    <span className="text-purple-300 font-medium">
                                        9,500 phenotypes
                                    </span>{" "}
                                    across
                                    <span className="text-purple-300 font-medium">
                                        {" "}
                                        8,628 rare diseases
                                    </span>
                                    .
                                </p>

                                <p className="leading-relaxed">
                                    Delve into interactive visualizations that
                                    reveal cell type-specific disease mechanisms
                                    and identify high-priority phenotypes for
                                    potential therapeutic intervention based on
                                    severity metrics.
                                </p>
                            </div>

                            <div className="flex flex-row space-x-5">
                                <button
                                    onClick={() =>
                                        refSearch.current.scrollIntoView()
                                    }
                                    className="md:mt-3 lg:mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 flex-grow rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                                >
                                    <span>
                                        Start Searching{" "}
                                        <SearchOutlined
                                            className="-mr-2 ml-1 -mt-[0.5px]"
                                            fontSize="small"
                                        />
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        refExplore.current.scrollIntoView()
                                    }
                                    className="md:mt-3 lg:mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                                >
                                    <span>
                                        View Examples{" "}
                                        <KeyboardArrowDown className="-mr-2 -mt-1" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={refSearch}
                        className="h-screen flex flex-col md:max-w-xl lg:max-w-4xl mx-auto md:mx-8 lg:mx-16 snap-center snap-always justify-center"
                    >
                        <div className="backdrop-blur-sm bg-black/30 p-8 rounded-xl shadow-2xl border border-purple-400/20">
                            <div className="md:text-2xl lg:text-4xl font-semibold mt-2 md:mb-1 lg:mb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                                Search Options
                            </div>
                            <div className="md:mb-2 lg:mb-4 text-lg">
                                Select your preferred search method
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-3">
                                {Object.entries(searchOptions).map((item) => (
                                    <div
                                        key={item[0]}
                                        className="flex flex-row cursor-pointer bg-purple-800/40 rounded-3xl items-center p-5 hover:scale-105 hover:bg-purple-800/50 transition-all duration-200 border border-purple-400/10"
                                        onClick={() => navigate(item[1].path)}
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 text-purple-100 mx-2">
                                            <span className="text-5xl">
                                                {item[1].icon}
                                            </span>
                                        </div>
                                        <div className="flex flex-col ml-4 flex-1">
                                            <div className="font-bold text-xl mb-2 text-purple-100">
                                                {item[1].title}
                                            </div>
                                            <div className="text-sm text-purple-100">
                                                {item[1].description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-5">
                                <a
                                    className="inline-flex items-center text-lg text-purple-300 hover:text-purple-100 cursor-pointer"
                                    onClick={() =>
                                        refExplore.current.scrollIntoView()
                                    }
                                >
                                    Not sure? View examples{" "}
                                    <KeyboardArrowDown className="ml-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* <div
                        ref={refExplore}
                        className="h-screen flex flex-col md:max-w-xl lg:max-w-6xl mx-auto md:mx-8 lg:mx-16 snap-center snap-always justify-center"
                    >
                        <div className="backdrop-blur-sm bg-black/30 p-8 rounded-xl shadow-2xl border border-purple-400/20">
                            <div className="md:text-2xl lg:text-4xl font-semibold mt-2 md:mb-3 lg:mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                                Examples
                            </div>
                            <p className="leading-relaxed text-sm md:text-lg">
                                Placeholder
                            </p>
                        </div>
                    </div> */}
                    <div
                        ref={refExplore}
                        className="h-screen flex flex-col md:max-w-xl lg:max-w-6xl h-50 mx-auto md:mx-8 lg:mx-16 snap-center snap-always justify-center"
                    >
                        <ExamplesSection />
                    </div>
                </Content>
            </Layout>
        </>
    );
}
