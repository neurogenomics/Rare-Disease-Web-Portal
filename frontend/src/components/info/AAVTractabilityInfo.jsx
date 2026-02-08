import React from "react";
import { Tooltip, Popover, Table } from "antd";
import { InfoOutlined, Launch } from "@mui/icons-material";

export default function AAVTractabilityInfo() {
    const info =
        "AAV tractability scores reflect how effectively different AAV serotypes can transduce (deliver genes to) specific cell types.";

    const tractabilityData = [
        { cellType: "Neurons", score: "High (0.9)", serotype: "AAV-PHP.eB, AAV9", note: "Terminally differentiated" },
        { cellType: "Astrocytes", score: "High (0.85)", serotype: "AAV-PHP.eB", note: "Terminally differentiated" },
        { cellType: "Oligodendrocytes", score: "Medium (0.6)", serotype: "AAV9", note: "Terminally differentiated" },
        { cellType: "Microglia", score: "Low (0.2)", serotype: "Limited", note: "Difficult to transduce" },
        { cellType: "Epithelial", score: "Variable", serotype: "AAV2/5", note: "Cell turnover limits durability" },
    ];

    const columns = [
        { title: "Cell Type", dataIndex: "cellType", key: "cellType" },
        { title: "Score", dataIndex: "score", key: "score" },
        { title: "Best Serotype", dataIndex: "serotype", key: "serotype" },
    ];

    function popoverContent() {
        return (
            <>
                <p className="mb-2">{info}</p>
                <div className="bg-gray-50 p-3 rounded mb-2">
                    <p className="font-semibold mb-1">AAV Tropism by Cell Type:</p>
                    <Table
                        dataSource={tractabilityData}
                        columns={columns}
                        size="small"
                        pagination={false}
                        rowKey="cellType"
                    />
                </div>
                <div className="bg-blue-50 p-3 rounded mb-2">
                    <p className="font-semibold mb-1">Key considerations:</p>
                    <ul className="list-disc ml-4 text-sm">
                        <li><strong>Terminally differentiated cells</strong> (neurons, cardiomyocytes) maintain AAV episomes for years to lifetime</li>
                        <li><strong>Dividing cells</strong> dilute AAV DNA with each division, limiting durability</li>
                        <li><strong>Microglia</strong> are difficult to transduce with current AAV serotypes</li>
                        <li><strong>Gene size</strong> must be &lt;4.7kb to fit in AAV capsid</li>
                    </ul>
                </div>
                <p className="mt-2 text-sm">
                    <span className="font-semibold">More information:</span>{" "}
                    <Tooltip title={<i>Gene therapy clinical trials worldwide to 2017</i>} placement="bottom">
                        <a
                            href="https://www.nature.com/articles/s41573-020-0090-8"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            AAV Gene Therapy Review
                            <sup className="text-xs">
                                <Launch fontSize="inherit" />
                            </sup>
                        </a>
                    </Tooltip>
                </p>
            </>
        );
    }

    return (
        <Popover
            content={popoverContent}
            styles={{ root: { maxWidth: "550px" } }}
        >
            <InfoOutlined fontSize="inherit" className="cursor-help" />
        </Popover>
    );
}
