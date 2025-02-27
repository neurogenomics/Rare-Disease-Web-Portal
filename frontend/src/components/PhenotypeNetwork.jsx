import ForceGraph2D from "react-force-graph-2d";
import { forceY } from "d3-force";
import { useRef, useState, useEffect, useMemo } from "react";
import { Button, Popover, Tooltip, ConfigProvider } from "antd";
import {
    Add,
    Remove,
    Fullscreen,
    FullscreenExit,
    InfoOutlined,
    InboxOutlined,
    RestartAlt,
} from "@mui/icons-material";

export default function PhenotypeNetwork({ elementRef, data, height }) {
    const networkRef = useRef();
    const containerRef = useRef();
    const [windowDimensions, setWindowDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const width = elementRef?.current?.offsetWidth - 2 || 800;
    const [zoomLevel, setZoomLevel] = useState(1.2);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const disabledButtons = data.nodes.length === 0;

    // Group nodes by connected components and assign colors
    const enhancedData = useMemo(() => {
        if (!data || !data.nodes || data.nodes.length === 0) return data;

        // Deep clone the data to avoid mutating the original
        const newData = JSON.parse(JSON.stringify(data));

        // Find connected components
        const nodeMap = {};
        newData.nodes.forEach((node) => {
            nodeMap[node.id] = {
                ...node,
                connections: [],
                group: null,
            };
        });

        newData.links.forEach((link) => {
            nodeMap[link.source]?.connections.push(link.target);
            nodeMap[link.target]?.connections.push(link.source);
        });

        let currentGroup = 0;
        const visited = new Set();

        const dfs = (nodeId, group) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            nodeMap[nodeId].group = group;

            nodeMap[nodeId].connections.forEach((connectedId) => {
                if (!visited.has(connectedId)) {
                    dfs(connectedId, group);
                }
            });
        };

        // Assign groups
        Object.keys(nodeMap).forEach((nodeId) => {
            if (!visited.has(nodeId)) {
                dfs(nodeId, currentGroup);
                currentGroup++;
            }
        });

        const colors = [
            "#e0bbff",
            "#d1a3ff",
            "#c285ff",
            "#b366ff",
            "#a347ff",
            "#9428ff",
            "#8510ff",
            "#7600e6",
            "#6700cc",
            "#5800b3",
            "#490099",
            "#3a007f",
            "#2b0066",
            "#1c004c",
            "#0d0033",
            "#f2e6ff",
            "#e6ccff",
            "#d9b3ff",
            "#cc99ff",
            "#bf80ff",
            "#ffccf9",
            "#ff99e6",
            "#ff66d4",
            "#ff33c1",
            "#ff00af",
        ];

        // Apply colors to nodes
        newData.nodes.forEach((node) => {
            const group = nodeMap[node.id].group;
            node.color = colors[group % colors.length];
            node.group = group;
            node.connections = nodeMap[node.id].connections;
        });

        // Apply colors to links
        newData.links.forEach((link) => {
            const sourceNode =
                nodeMap[
                    typeof link.source === "object"
                        ? link.source.id
                        : link.source
                ];
            if (sourceNode) {
                link.color = colors[sourceNode.group % colors.length];
            }
        });

        return newData;
    }, [data]);

    // Update window dimensions when resized
    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Monitor fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

    function zoomIn() {
        setZoomLevel((prevZoomLevel) => {
            const newZoomLevel = prevZoomLevel + 0.2;
            networkRef.current.zoom(newZoomLevel, 500);
            return newZoomLevel;
        });
    }

    function zoomOut() {
        setZoomLevel((prevZoomLevel) => {
            const newZoomLevel = prevZoomLevel - 0.2;
            networkRef.current.zoom(newZoomLevel, 500);
            return newZoomLevel;
        });
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            containerRef.current
                .requestFullscreen()
                .then(() => {
                    setTimeout(() => {
                        networkRef.current.zoomToFit(400);
                    }, 800); // Add a slight delay to allow fullscreen to take effect
                })
                .catch((err) => {
                    console.error(
                        `Error attempting to enable fullscreen: ${err.message}`
                    );
                });

            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }

    function InfoHoverButton({ getPopupContainer }) {
        const content = (
            <>
                <p className="-mt-1">
                    This graph plots the phenotype hierarchy between all the
                    phenotypes associated with this cell. Each node represents a
                    phenotype and the edges represent the relationship between
                    them. Nodes with the same color belong to the same
                    connected group.
                </p>
                <div className="bg-purple-50 rounded-lg mt-3 py-2 px-3">
                    <div className="font-semibold mb-1">Graph Controls</div>
                    <div className="space-y-1">
                        <div>
                            Click on the buttons below to control the zoom
                            levels and fullscreen for a better view of the
                            graph. Additionally, you may use mouse controls and
                            touch controls to zoom and pan the graph.
                        </div>
                        <div>
                            Hover over a node to see more details about the
                            phenotype. Clicking on any node will launch
                            phenotype search.
                        </div>
                    </div>
                </div>
            </>
        );
        return (
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            defaultHoverBorderColor: "#ab11f7",
                            defaultHoverColor: "#ab11f7",
                        },
                    },
                }}
                wave={{ disabled: true }}
            >
                <Popover
                    content={content}
                    title="Phenotype Relationship Network Graph"
                    placement="leftTop"
                    getPopupContainer={getPopupContainer}
                    overlayStyle={{ maxWidth: "420px" }}
                >
                    <Button
                        type="default"
                        icon={<InfoOutlined fontSize="inherit" />}
                        className="cursor-default"
                    />
                </Popover>
            </ConfigProvider>
        );
    }

    useEffect(() => {
        const g = networkRef.current;
        if (g) {
            g.d3Force("y", forceY().strength(0.0205));
            g.d3Force("charge").strength(-50)
        }
    }, [isFullscreen, windowDimensions, width, height, data]);

    return (
        <div
            className={`relative ${
                isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
            }`}
            ref={containerRef}
            style={isFullscreen ? { width: "100vw", height: "100vh" } : {}}
        >
            <div className="absolute top-0 right-0 z-10 p-4 flex flex-col space-y-4">
                <InfoHoverButton
                    getPopupContainer={() => containerRef.current}
                />
                <div className="flex flex-col space-y-2">
                    <Tooltip title="Zoom In" placement="left">
                        <Button
                            variant="solid"
                            color="purple"
                            icon={<Add fontSize="inherit" />}
                            onClick={zoomIn}
                            disabled={disabledButtons}
                        />
                    </Tooltip>
                    <Tooltip title="Zoom Out" placement="left">
                        <Button
                            variant="solid"
                            color="purple"
                            icon={<Remove fontSize="inherit" />}
                            onClick={zoomOut}
                            disabled={disabledButtons}
                        />
                    </Tooltip>
                    <Tooltip title="Reset Zoom" placement="left">
                        <Button
                            variant="solid"
                            color="purple"
                            icon={<RestartAlt fontSize="inherit" />}
                            onClick={() => networkRef.current.zoomToFit(500)}
                            disabled={disabledButtons}
                        />
                    </Tooltip>
                </div>
                <Tooltip title="Toggle Fullscreen" placement="left">
                    <Button
                        variant="solid"
                        color="purple"
                        icon={
                            isFullscreen ? (
                                <FullscreenExit fontSize="inherit" />
                            ) : (
                                <Fullscreen fontSize="inherit" />
                            )
                        }
                        onClick={toggleFullscreen}
                        disabled={disabledButtons}
                    />
                </Tooltip>
            </div>
            {data.nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-gray-400 text-lg mb-1">
                        <InboxOutlined fontSize="large" />
                    </div>
                    <p className="text-gray-400 text-lg font-semibold">
                        No phenotypes to plot
                    </p>
                </div>
            )}
            <ForceGraph2D
                ref={networkRef}
                graphData={enhancedData}
                dagMode={null}
                nodeRelSize={6}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(
                        (n) => n + fontSize * 0.6
                    );

                    // Draw white background for better readability
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(
                        node.x - bckgDimensions[0] / 2,
                        node.y - bckgDimensions[1] / 2,
                        ...bckgDimensions
                    );

                    // Draw border (light gray)
                    ctx.strokeStyle = "#e0e0e0";
                    ctx.lineWidth = 0.5 / globalScale;
                    ctx.strokeRect(
                        node.x - bckgDimensions[0] / 2,
                        node.y - bckgDimensions[1] / 2,
                        ...bckgDimensions
                    );

                    // Draw colored text using the node's group color
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = node.color || "#000000";
                    ctx.fillText(label, node.x, node.y);
                    node.__bckgDimensions = bckgDimensions;
                }}
                nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions &&
                        ctx.fillRect(
                            node.x - bckgDimensions[0] / 2,
                            node.y - bckgDimensions[1] / 2,
                            ...bckgDimensions
                        );
                }}
                linkDirectionalArrowLength={10}
                linkDirectionalArrowRelPos={1}
                linkColor={(link) => link.color || "#999999"}
                linkWidth={1.5}
                cooldownTicks={200}
                onEngineStop={() => networkRef.current.zoom(zoomLevel, 500)}
                height={isFullscreen ? windowDimensions.height : height}
                width={isFullscreen ? windowDimensions.width : width}
                nodeLabel={(node) => node.id}
                onNodeClick={(node) => window.open(`/phenotype?jump=${node.id}&db_type=DescartesHuman`, "_blank").focus()}
            />
        </div>
    );
}