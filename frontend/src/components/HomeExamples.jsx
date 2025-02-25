import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { FaDisease, FaDna, FaHeadSideMask } from "react-icons/fa";

const exampleData = [
    {
        id: 1,
        title: "Phenotype Exploration",
        description:
            (<>Show me all the cells, diseases and genes associated with <span className="text-purple-300 font-medium">diabetic ketoacidosis</span>.</>),
        path: "/phenotype?jump=HP%3A0001953&db_type=DescartesHuman",
        icon: <BsFileEarmarkMedicalFill className="text-3xl" />,
    },
    {
        id: 2,
        title: "Cell Type Analysis",
        description:
            (<>Show me phenotypes closely linked to <span className="text-purple-300 font-medium">microglia</span> and genes that are highly active in these cells but not much in others.</>),
        path: "/celltype?jump=Microglia&db_type=DescartesHuman&q_value=0.05",
        icon: <FaDisease className="text-3xl" />,
    },
    {
        id: 3,
        title: "Gene Relationships",
        description:
            (<>Show me how the <span className="text-purple-300 font-medium">TP53 tumor suppressor gene</span> relates to various cell types, diseases and phenotypes.</>),
        path: "/gene?jump=7157",
        icon: <FaDna className="text-3xl" />,
    },
    {
        id: 4,
        title: "Severity Search",
        description:
            (<>Show me all the phenotypes which are <span className="text-purple-300 font-medium">always associated with intellectual disability</span> but <span className="text-purple-300 font-medium">rarely cause death</span>. Additionally, only show phenotypes <span className="text-purple-300 font-medium">with associated cell types</span>.</>),
        path: "/severity?intellectual_disability=33&death=01&impaired_mobility=03&physical_malformations=03&blindness=03&sensory_impairments=03&immunodeficiency=03&cancer=03&reduced_fertility=03&congenital_onset=03&severity_class=03&with1=true&without=false",
        icon: <FaHeadSideMask className="text-3xl" />,
    },
];

export default function ExamplesSection() {
    const navigate = useNavigate();
    const [activeExample, setActiveExample] = useState(0);
    const [autoplay, setAutoplay] = useState(true);

    useEffect(() => {
        let interval;
        if (autoplay) {
            interval = setInterval(() => {
                setActiveExample((prev) => (prev + 1) % exampleData.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [autoplay]);

    const handleDotClick = (index) => {
        setActiveExample(index);
        setAutoplay(false);
    };

    const handleArrowClick = (direction) => {
        setAutoplay(false);
        if (direction === "next") {
            setActiveExample((prev) => (prev + 1) % exampleData.length);
        } else {
            setActiveExample(
                (prev) => (prev - 1 + exampleData.length) % exampleData.length
            );
        }
    };

    return (
        <div className="backdrop-blur-sm bg-black/30 p-8 rounded-xl shadow-2xl border border-purple-400/20 flex flex-col">
            <div className="md:text-2xl lg:text-4xl font-semibold mb-7 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                Examples
            </div>

            <div
                className="flex-grow relative"
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeExample}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="h-full flex flex-col"
                    >
                        {/* Example Content */}
                        <div className="bg-purple-800/20 rounded-xl p-6 border border-purple-400/10 flex-grow">
                            <div className="flex items-start md:items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 text-purple-100 rounded-full bg-purple-800/40 p-2 border border-purple-400/10 shrink-0">
                                    {exampleData[activeExample].icon}
                                </div>
                                <h2 className="font-bold text-xl md:text-2xl text-purple-100">
                                    {exampleData[activeExample].title}
                                </h2>
                            </div>

                            <p className="mt-4 text-base md:text-lg leading-relaxed text-purple-50">
                                {exampleData[activeExample].description}
                            </p>

                            <div className="mt-6">
                                <button
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                                    onClick={() =>
                                        navigate(
                                            exampleData[activeExample].path
                                        )
                                    }
                                >
                                    <span className="flex items-center">
                                        Try This Query
                                            <ArrowForward
                                                className="ml-2"
                                                fontSize="small"
                                            />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-6 pt-2">
                <div className="flex space-x-3">
                    {exampleData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                index === activeExample
                                    ? "bg-purple-300"
                                    : "bg-purple-200/40 hover:bg-purple-200/60"
                            }`}
                            aria-label={`Example ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => handleArrowClick("prev")}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-800/40 hover:bg-purple-800/60 transition-all duration-200 border border-purple-400/10"
                        aria-label="Previous example"
                    >
                        <ArrowBack fontSize="small" />
                    </button>
                    <button
                        onClick={() => handleArrowClick("next")}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-purple-800/40 hover:bg-purple-800/60 transition-all duration-200 border border-purple-400/10"
                        aria-label="Next example"
                    >
                        <ArrowForward fontSize="small" />
                    </button>
                </div>
            </div>
        </div>
    );
}
