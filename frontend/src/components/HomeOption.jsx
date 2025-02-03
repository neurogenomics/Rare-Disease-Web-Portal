import * as React from "react";
import VioletButton from "./VioletButton";

export default function HomeOption() {
    return (
        <>
            <h1 className="absolute bottom-[47%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-slate-200 font-medium text-2xl md:text-5xl pointer-events-none">
                Rare Disease
            </h1>
            <h1 className="absolute top-[54%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-slate-700 font-small text-2xl md:text-3xl pointer-events-none">
                Imperial College Neurogenomics Lab
            </h1>
            <div className="absolute top-[65%] left-[50%] -translate-x-[50%] -translate-y-[50%] grid grid-cols-2 gap-y-4 gap-x-8">
                <VioletButton
                    name="Search by Phenotype"
                    path="/phenotype"
                    minWidth="250px"
                />
                <VioletButton
                    name="Search by Cell Type"
                    path="/celltype"
                    minWidth="250px"
                />
                <VioletButton
                    name="Search by Gene"
                    path="/gene"
                    minWidth="250px"
                />
                <VioletButton
                    name="Search by Severity"
                    path="/severity"
                    minWidth="250px"
                />
            </div>
        </>
    );
}
