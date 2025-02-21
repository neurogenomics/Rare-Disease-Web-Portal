import { LaunchOutlined } from "@mui/icons-material";
import { Popover, Tooltip } from "antd";

function TextTooltips({ texts, tooltipText, type, moreInfo }) {
    if (type == "full") {
        texts.full = texts["big"] + " (" + texts["short"] + ")";
    }

    const tooltipContent = (
        <>
            <div>{tooltipText}</div>
            {moreInfo && (
                <div className="mt-1">
                    <span className="font-semibold">More information:</span>
                    <span className="ml-2">
                        <Tooltip title={moreInfo.hoverText} placement="bottom">
                            <a href={moreInfo.link} target="_blank">
                                {moreInfo.text}{" "}<sup><LaunchOutlined fontSize="inherit" /></sup>
                            </a>
                        </Tooltip>
                    </span>
                </div>
            )}
        </>
    );
    return (
        <Popover
            content={tooltipContent}
            styles={{ root: { maxWidth: "400px" } }}
        >
            <span className="text-purple-900 cursor-help">{texts[type]}</span>
        </Popover>
    );
}

// HPO
export function HPOTextTooltip({ type = "short" }) {
    return (
        <TextTooltips
            texts={{
                big: "Human Phenotype Ontology",
                short: "HPO",
            }}
            tooltipText="The Human Phenotype Ontology (HPO) is a standardized vocabulary of phenotypic abnormalities encountered in human disease. Each term in the HPO describes a phenotypic abnormality, such as Atrial septal defect. The HPO is used for clinical diagnostics in human genetics."
            moreInfo={{
                text: "Resource Website",
                link: "https://hpo.jax.org/app/",
                hoverText:
                    "The Jackson Laboratory - The Human Phenotype Ontology",
            }}
            type={type}
        />
    );
}
