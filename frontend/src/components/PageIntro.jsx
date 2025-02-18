import React, { useEffect, useState } from "react";
import { Alert, Tour, Button, Tooltip } from "antd";
import {
    InfoOutlined,
    Info,
    AutoAwesome,
    TipsAndUpdates,
} from "@mui/icons-material";
import { HPOTextTooltip } from "./info/TextTooltips";
import SeverityTierHover from "./info/SeverityTierHover";

export default function PageIntro({ description, tourSteps = [] }) {
    const [tourOpen, setTourOpen] = useState(false);
    const [tourStepsState, setTourSteps] = useState(tourSteps);

    const stepDescriptions = [
        {
            key: "atlas-search",
            title: "Select a Cell Atlas",
            description: (
                <>
                    <div className="mb-2">
                        Select a cell atlas that served as the source of cell
                        expression data for identifying associations with genes,
                        diseases, and phenotypes.
                    </div>
                    <div className="italic">
                        Not sure? Start with Descartes Human to find all the
                        associations with expression data from human fetal
                        cells. Hover over each option for more information.
                    </div>
                </>
            ),
            placement: "rightBottom",
        },
        {
            key: "phenotype-search",
            title: "Search for a Phenotype",
            description: (
                <>
                    Use the search bar to find a specific phenotype. You can
                    enter the phenotype name or <HPOTextTooltip type="short" />{" "}
                    identifier to quickly locate the phenotype of interest.
                </>
            ),
            placement: "right",
        },
        {
            key: "phenotype-select",
            title: "Explore the Phenotype Tree",
            description: (
                <>
                    <div className="mb-2">
                        Click on any phenotype from the nested tree structure to
                        view detailed information about its associations with
                        different cell types, diseases, and genes. Each node of
                        the tree can be expanded to view more specific
                        phenotypes.
                    </div>
                    <div>
                        The tree starts at the root of phenotype abnormalities,
                        allowing you to explore various nested phenotypes.
                    </div>
                </>
            ),
            placement: "right",
        },
        {
            key: "gene-search",
            title: "Search for a Gene",
            description:
                "Use the search bar to find a specific gene. You can enter the gene name or NCBI gene identifier to quickly locate the gene of interest.",
            placement: "right",
        },
        {
            key: "gene-select",
            title: "Select a Gene",
            description: (
                <>
                    <div className="mb-2">
                        Click on a gene from the search results to view detailed
                        information about its associations with cell types,
                        diseases, and phenotypes.
                    </div>
                    <div>
                        The search pane is pre-populated with a selection of
                        gene names that you can explore without manually
                        initiating a search.
                    </div>
                </>
            ),
            placement: "right",
        },
        {
            key: "cell-search",
            title: "Search for a Cell Type",
            description: (
                <>
                    Use the search bar to find a specific cell type in the
                    selected cell atlas.
                </>
            ),
            placement: "right",
        },
        {
            key: "cell-select",
            title: "Select a Cell Type",
            description: (
                <>
                    <div className="mb-2">
                        Select a cell type from the search results to find
                        associated genes and phenotypes.
                    </div>
                    <div>
                        The search pane is pre-populated with a selection of
                        cell types that you can explore without manually
                        initiating a search.
                    </div>
                </>
            ),
            placement: "right",
        },
        {
            key: "cell-qvalue",
            title: "Filter by q-value",
            description: (
                <>
                    <div className="mb-2">
                        Enter the maximum q-value to filter the results by
                        statistical significance. A lower q-value (closer to 0)
                        indicates a stronger and more reliable association.
                    </div>
                    <div>
                        We recommend starting with a q-value of 0.05 and then
                        reducing it if you seek more stringent results.
                    </div>
                </>
            ),
            placement: "right",
        },
        {
            key: "cell-submit",
            title: "View Results",
            description: "Submit your query to view the results.",
            placement: "right",
        },
        {
            key: "severity-submit",
            title: "View Results",
            description: (
                <>
                    <div className="mb-2">
                        Submit your query to view the results.
                    </div>
                    <div>
                        <i>
                            Submitting with the default values will show all the
                            phenotypes with their severity tier and clinical
                            characteristics in our database.
                        </i>
                    </div>
                </>
            ),
            placement: "right",
        },
        {
            key: "severity-tier",
            title: "Set Range for Severity Class",
            description: (
                <>
                    <div className="mb-2">
                        Adjust the slider to filter phenotypes based on their
                        severity class.
                    </div>
                    <div className="bg-gray-50 pt-4 pb-2 p-4 rounded-lg">
                        <SeverityTierHover infoOnly={true} />
                    </div>
                </>
            ),
            placement: "right",
        },
        {
            key: "severity-occurence",
            title: "Set Range for Clinical Characteristics",
            description: (
                <>
                    Adjust the sliders for each clinical characteristic to
                    filter phenotypes based on the frequency of occurrence of
                    that specific characteristic.
                </>
            ),
            placement: "right",
        },
        {
            key: "severity-cell-association",
            title: "Select Cell Type Associations",
            description: "Filter phenotypes based on their a",
            placement: "right",
        },
    ];

    useEffect(() => {
        const updatedTourSteps = tourSteps.map((step) => {
            const matchingDescription = stepDescriptions.find(
                (desc) => desc.key === step.key
            );
            if (matchingDescription) {
                return { ...step, ...matchingDescription };
            }
            return step;
        });
        setTourSteps(updatedTourSteps);
    }, [tourSteps]);

    const HelpfulIcon = () => (
        <>
            <Tooltip title="Nice and helpful information!">
                <InfoOutlined fontSize="inherit" className="mb-1" />
            </Tooltip>
        </>
    );

    const completeDescription = (
        <>
            <div className="ml-11 mt-3">
                <div className="ml-1 ">{description}</div>
                <div className="mt-5 rounded-xl bg-blue-500 bg-opacity-5 p-3">
                    <div className="font-bold text-lg mr-1 mb-1 text-cyan-950">
                        <TipsAndUpdates
                            fontSize="inherit"
                            className="-mt-1 mr-2"
                        />
                        TIP
                    </div>
                    <div>
                        Look out for the <HelpfulIcon className="mb-1" /> icon
                        throughout the page and hover over it for more details
                        on specific terms. You can also hover over certain{" "}
                        <Tooltip title="Like this!">
                            <span className="text-purple-900">
                                selections, numbers and text
                            </span>
                        </Tooltip>{" "}
                        for additional information.
                    </div>
                </div>
                {tourSteps.length > 0 && (
                    <Button
                        size="large"
                        type="primary"
                        onClick={() => setTourOpen(true)}
                        className="mt-5"
                        block
                    >
                        <AutoAwesome fontSize="inherit" />
                        <b>Guide me!</b>
                    </Button>
                )}
            </div>
        </>
    );

    return (
        <>
            <Alert
                className="mb-5"
                width="50%"
                message={
                    <>
                        <span className="font-bold text-2xl text-cyan-900">
                            <Info fontSize="large" className="-mt-1" />
                            <span className="ml-2">Get Started</span>
                        </span>
                    </>
                }
                description={completeDescription}
                type="info"
            />
            {tourSteps.length > 0 && (
                <Tour
                    steps={tourStepsState}
                    open={tourOpen}
                    onClose={() => setTourOpen(false)}
                    gap={{
                        offset: 10,
                        radius: 5,
                    }}
                />
            )}
        </>
    );
}
