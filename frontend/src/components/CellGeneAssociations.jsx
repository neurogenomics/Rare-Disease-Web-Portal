import { useEffect, useState } from "react";
import { Button, Modal, Tooltip, Alert } from "antd";
import { Column } from "@ant-design/plots";
import { TbDna2 } from "react-icons/tb";
import formatText from "../scripts/formatText";
import { ONTOLOGY_API_URL, BASE_API_URL } from "../../config";
import { InboxOutlined } from "@mui/icons-material";

function GeneAssociationGraph({ data }) {
    const config = {
        xField: "gene",
        yField: "expression_specificity",
        axis: {
            x: {
                title: "Gene",
            },
            y: {
                title: "Expression Specificity",
            },
        },
        interaction: {
            tooltip: {
                render: (e, { title, items }) => {
                    return (
                        <div key={title}>
                            <div className="text-xs">
                                <span className="font-semibold">
                                    Gene Name:{" "}
                                </span>
                                {formatText(title)}
                            </div>
                            {items.map((item) => {
                                const { value, color } = item;
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div>
                                        <div
                                            style={{
                                                margin: 10,
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: "50%",
                                                        backgroundColor: color,
                                                        marginRight: 6,
                                                    }}
                                                />
                                                <span>
                                                    Expression Specificity:{" "}
                                                    <b>{value.toFixed(4)}</b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="italic">
                                A higher value indicates that the gene likely
                                plays a more important role in the cell type.
                            </div>
                        </div>
                    );
                },
            },
        },
    };

    return (
        <div className="bg-gray-50 px-2 pt-4 rounded-lg">
            <Column {...config} data={data.slice(0, 40)} />
        </div>
    );
}

export default function CellGeneAssociations({ hpID, hpName, cell, dbType }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const ModalCloseButton = () => {
        return (
            <Button
                variant="solid"
                color="purple"
                onClick={() => setModalVisible(false)}
            >
                Close
            </Button>
        );
    };

    async function fetchData({ hpID, cell }) {
        setLoading(true);
        Promise.all([
            fetch(`${ONTOLOGY_API_URL}/api/network/annotation/${hpID}`),
            fetch(`${BASE_API_URL}/gene1/${cell}/${dbType}`),
        ])
            .then((responses) => {
                return Promise.all(
                    responses.map((response) => response.json())
                );
            })
            .then(([cellGenesAllData, phenoGenes]) => {
                // Only keep phenotype associated genes if they are also
                // associated with the selected cell type
                const cellGeneNames = cellGenesAllData.genes.map(
                    (gene) => gene.name
                );
                const phenoGenesFiltered = phenoGenes
                    .filter((entry) => cellGeneNames.includes(entry.gene))
                    .sort(
                        (a, b) =>
                            b.expression_specificity - a.expression_specificity
                    );

                setData(phenoGenesFiltered);
                setLoading(false);
            });
    }

    useEffect(() => {
        if (modalVisible) {
            fetchData({ hpID, cell });
        }
    }, [modalVisible]);

    const modalContent = (
        <div className="flex flex-col space-y-4">
            <div>
                The following graph shows the expression specificity for genes
                which are associated with both{" "}
                {
                    <Tooltip title="Selected cell type">
                        <span className="text-purple-800 font-semibold">
                            {formatText(cell)}
                        </span>
                    </Tooltip>
                }{" "}
                and{" "}
                {
                    <Tooltip title="Selected phenotype">
                        <span className="text-purple-800 font-semibold">
                            {hpName}
                        </span>
                    </Tooltip>
                }
                . If you are interested in viewing all the genes associated with
                this phenotype, close this modal and select the gene
                associations tab instead.
            </div>
            {data?.length > 40 && (
                <Alert
                    type="info"
                    showIcon
                    message={
                        <>
                            Only showing the top 30 genes (sorted by expression
                            specificity) out of{" "}
                            <span className="font-semibold text-blue-950">
                                {data.length}
                            </span>{" "}
                            total genes associated with both the cell type and
                            phenotype.
                        </>
                    }
                />
            )}
            {data?.length === 0 ? (
                <div className="text-center text-xl text-gray-400 bg-gray-50 rounded-lg py-32">
                    <InboxOutlined fontSize="large" />
                    <div className="mt-2">
                    No Common Genes Found
                    </div>
                </div>
            ) : (
                <GeneAssociationGraph data={data} />
            )}
            <div className="bg-purple-50 p-2 px-4 rounded-lg">
                Expression specificity shows how selectively a gene is expressed
                in this cell type. Values range from 0 to 1, where 1 means the
                gene is expressed almost exclusively in this cell type, and
                lower values indicate the gene is expressed more broadly across
                multiple cell types. Genes with high specificity often play
                important roles in that cell type's unique functions.
            </div>
        </div>
    );

    return (
        <>
            <Modal
                title="Gene Associations for This Cell Type and Phenotype"
                open={modalVisible}
                centered
                footer={(_) => (
                    <>
                        <ModalCloseButton />
                    </>
                )}
                onCancel={() => setModalVisible(false)}
                loading={loading}
                width={"80%"}
            >
                {modalContent}
            </Modal>
            <Tooltip
                title="Click to view genes associated with both this cell type and the selected phenotype"
                placement="right"
            >
                <span
                    onClick={() => setModalVisible(true)}
                    className="cursor-pointer text-xl hover:text-blue-600 text-blue-950 rotate-[40deg]"
                >
                    <TbDna2 />
                </span>
            </Tooltip>
        </>
    );
}
