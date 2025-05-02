import React from "react";
import { Layout } from "antd";
import CustomHeader from "../components/utilities/Header";
import BackgroundAnimation from "../components/BackgroundAnimation";
import { Email, Place, GitHub, X, Launch } from "@mui/icons-material";

const { Content } = Layout;

function Logos() {
    return (
        <div className="flex justify-center items-center max-h-[40px] space-x-10 mt-3">
            <a href="https://www.ukdri.ac.uk/" target="_blank">
                <img
                    src={"/logos/logo_UKDRI.png"}
                    className="h-[85px] object-contain"
                    alt="UK Dementia Research Institute logo"
                />
            </a>
            <a href="https://www.imperial.ac.uk/" target="_blank">
                <img
                    src={"/logos/logo_Imperial_DoBS.png"}
                    className="h-[70px] object-contain mt-2"
                    alt="Imperial College London logo"
                />
            </a>
        </div>
    );
}

export default function AboutPage() {
    return (
        <div className="relative">
            <CustomHeader activePageKey="about" />
            <div className="fixed inset-0 -z-10">
                <BackgroundAnimation />
            </div>
            <Content className="relative z-10 p-12 bg-center">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="bg-white bg-opacity-95 p-10 rounded-lg shadow-lg min-w-[600px] flex flex-col">
                        <h1 className="text-4xl font-bold flex items-center mb-6">
                            About
                        </h1>
                        <hr />
                        <br />
                        <p className="text-justify">
                            Rare diseases often involve complex genetic
                            variation, creating challenges for patients,
                            clinicians, and researchers alike. This portal aims
                            to shed light on the cell-type mechanisms involved
                            in each rare disease phenotype by integrating
                            large-scale single-cell transcriptomic data with the
                            Human Phenotype Ontology. By highlighting
                            significant associations between thousands of cell
                            types and phenotypes, users can quickly see which
                            cells are most relevant to a given genetic
                            condition. Within this site, you’ll also find
                            severity metrics that help prioritize which
                            phenotypes may benefit most from gene therapy or
                            other targeted interventions. This resource is fully
                            open-access, designed to encourage global
                            collaboration, and supports interactive exploration
                            through visual tools like graphs and networks.
                            Ultimately, we hope to contribute to more precise
                            diagnostic and therapeutic strategies for
                            individuals living with these diverse and
                            understudied conditions.
                        </p>
                        <br />
                        <div className="italic font-semibold text-gray-700">
                            <a
                                href="http://github.com/neurogenomics/Rare-Disease-Web-Portal"
                                target="_blank"
                            >
                                Contribute to this project on GitHub!{" "}
                                <sup className="text-xs">
                                    <Launch fontSize="inherit" />
                                </sup>
                            </a>
                        </div>
                        <br />
                        <div className="mt-auto">
                            <hr />
                            <br />
                            <Logos />
                        </div>
                    </div>
                    <div className="bg-white bg-opacity-95 p-10 rounded-lg shadow-lg  min-w-[400px] flex flex-col">
                        <h1 className="text-4xl font-bold flex items-center mb-6">
                            Contact
                        </h1>
                        <hr />
                        <br />
                        <div className="space-y-2">
                            <a href="https://www.neurogenomics.co.uk" target="_blank">
                            <img
                                target="_blank"
                                src="/logos/logo_neurogenomicslab.png"
                                alt="Neurogenomics Lab logo"
                            /></a>
                            <div className="pt-4 text-gray-700">
                                UK Dementia Research Institute Department of
                                Brain Sciences
                                <br />
                                Faculty of Medicine
                                <br />
                                Imperial College London
                            </div>
                            <div className="pt-2">
                                <Email />{" "}
                                <a href="mailto:nskene@ic.ac.uk">
                                    {" "}
                                    nskene@ic.ac.uk
                                </a>
                            </div>
                            <div>
                                <Place />{" "}
                                <a
                                    href="https://maps.app.goo.gl/Fxs7yTVidBDvthjZ9"
                                    target="_blank"
                                >
                                    Sir Michael Uren Hub, Imperial College
                                    London, London, UK - W12 0BZ
                                </a>
                            </div>
                            <div className="items-center space-x-4 pt-2">
                                <a
                                    href="http://github.com/neurogenomics"
                                    target="_blank"
                                >
                                    <GitHub fontSize="large" />
                                </a>
                                <a href="https://x.com/n_skene" target="_blank">
                                    <X fontSize="large" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    );
}
