import React, { useEffect, useState } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";

let cot = 1;
const SeverityNetWork = ({ data1 }) => {
    const [data, setData] = useState({});
    useEffect(() => {
        console.log("Props changed:", JSON.stringify(data1));
        if (JSON.stringify(data1) !== "{}") {
            cot = 4;
        }

        setData(data1);
    }, [data1]);
    const temp = {
        nodes: [
            {
                id: "Node 1",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 2",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 3",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 4",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 5",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 6",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 7",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 8",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 9",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 10",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 11",
                height: 1,
                size: 24,
                color: "rgb(97, 205, 187)",
            },
            {
                id: "Node 0",
                height: 2,
                size: 32,
                color: "rgb(244, 117, 96)",
            },
            {
                id: "Node 1.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 1.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 1.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 1.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 1.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 2.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 3.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 3.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 3.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 3.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 3.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 3.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.7",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 4.8",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 5.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 5.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 5.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 5.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 6.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.7",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 7.8",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 8.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 8.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 8.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 8.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.7",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 9.8",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 10.7",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.0",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.1",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.2",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.3",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.4",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.5",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
            {
                id: "Node 11.6",
                height: 0,
                size: 12,
                color: "rgb(232, 193, 160)",
            },
        ],
        links: [
            {
                source: "Node 0",
                target: "Node 1",
                distance: 80,
            },
            {
                source: "Node 1",
                target: "Node 1.0",
                distance: 50,
            },
            {
                source: "Node 1",
                target: "Node 1.1",
                distance: 50,
            },
            {
                source: "Node 1",
                target: "Node 1.2",
                distance: 50,
            },
            {
                source: "Node 1",
                target: "Node 1.3",
                distance: 50,
            },
            {
                source: "Node 1",
                target: "Node 1.4",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 2",
                distance: 80,
            },
            {
                source: "Node 2",
                target: "Node 2.0",
                distance: 50,
            },
            {
                source: "Node 2",
                target: "Node 2.1",
                distance: 50,
            },
            {
                source: "Node 2",
                target: "Node 2.2",
                distance: 50,
            },
            {
                source: "Node 2",
                target: "Node 2.3",
                distance: 50,
            },
            {
                source: "Node 2",
                target: "Node 2.4",
                distance: 50,
            },
            {
                source: "Node 2",
                target: "Node 2.5",
                distance: 50,
            },
            {
                source: "Node 2",
                target: "Node 2.6",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 3",
                distance: 80,
            },
            {
                source: "Node 3",
                target: "Node 3.0",
                distance: 50,
            },
            {
                source: "Node 3",
                target: "Node 3.1",
                distance: 50,
            },
            {
                source: "Node 3",
                target: "Node 3.2",
                distance: 50,
            },
            {
                source: "Node 3",
                target: "Node 3.3",
                distance: 50,
            },
            {
                source: "Node 3",
                target: "Node 3.4",
                distance: 50,
            },
            {
                source: "Node 3",
                target: "Node 3.5",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 4",
                distance: 80,
            },
            {
                source: "Node 4",
                target: "Node 4.0",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.1",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.2",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.3",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.4",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.5",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.6",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.7",
                distance: 50,
            },
            {
                source: "Node 4",
                target: "Node 4.8",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 5",
                distance: 80,
            },
            {
                source: "Node 5",
                target: "Node 2",
                distance: 80,
            },
            {
                source: "Node 5",
                target: "Node 4",
                distance: 80,
            },
            {
                source: "Node 5",
                target: "Node 5.0",
                distance: 50,
            },
            {
                source: "Node 5",
                target: "Node 5.1",
                distance: 50,
            },
            {
                source: "Node 5",
                target: "Node 5.2",
                distance: 50,
            },
            {
                source: "Node 5",
                target: "Node 5.3",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 6",
                distance: 80,
            },
            {
                source: "Node 6",
                target: "Node 6.0",
                distance: 50,
            },
            {
                source: "Node 6",
                target: "Node 6.1",
                distance: 50,
            },
            {
                source: "Node 6",
                target: "Node 6.2",
                distance: 50,
            },
            {
                source: "Node 6",
                target: "Node 6.3",
                distance: 50,
            },
            {
                source: "Node 6",
                target: "Node 6.4",
                distance: 50,
            },
            {
                source: "Node 6",
                target: "Node 6.5",
                distance: 50,
            },
            {
                source: "Node 6",
                target: "Node 6.6",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 7",
                distance: 80,
            },
            {
                source: "Node 7",
                target: "Node 7.0",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.1",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.2",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.3",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.4",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.5",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.6",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.7",
                distance: 50,
            },
            {
                source: "Node 7",
                target: "Node 7.8",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 8",
                distance: 80,
            },
            {
                source: "Node 8",
                target: "Node 8.0",
                distance: 50,
            },
            {
                source: "Node 8",
                target: "Node 8.1",
                distance: 50,
            },
            {
                source: "Node 8",
                target: "Node 8.2",
                distance: 50,
            },
            {
                source: "Node 8",
                target: "Node 8.3",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 9",
                distance: 80,
            },
            {
                source: "Node 9",
                target: "Node 9.0",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.1",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.2",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.3",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.4",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.5",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.6",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.7",
                distance: 50,
            },
            {
                source: "Node 9",
                target: "Node 9.8",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 10",
                distance: 80,
            },
            {
                source: "Node 10",
                target: "Node 10.0",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.1",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.2",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.3",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.4",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.5",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.6",
                distance: 50,
            },
            {
                source: "Node 10",
                target: "Node 10.7",
                distance: 50,
            },
            {
                source: "Node 0",
                target: "Node 11",
                distance: 80,
            },
            {
                source: "Node 11",
                target: "Node 2",
                distance: 80,
            },
            {
                source: "Node 11",
                target: "Node 11.0",
                distance: 50,
            },
            {
                source: "Node 11",
                target: "Node 11.1",
                distance: 50,
            },
            {
                source: "Node 11",
                target: "Node 11.2",
                distance: 50,
            },
            {
                source: "Node 11",
                target: "Node 11.3",
                distance: 50,
            },
            {
                source: "Node 11",
                target: "Node 11.4",
                distance: 50,
            },
            {
                source: "Node 11",
                target: "Node 11.5",
                distance: 50,
            },
            {
                source: "Node 11",
                target: "Node 11.6",
                distance: 50,
            },
        ],
    };
    if (cot < 3) {
        return (
            <div style={{ margin: 29, height: 400 }}>
                {/*<ResponsiveNetwork*/}
                {/*    data={temp}*/}
                {/*    margin={{top: 0, right: 0, bottom: 0, left: 0}}*/}
                {/*    linkDistance={e => e.distance}*/}
                {/*    centeringStrength={0.3}*/}
                {/*    repulsivity={15}*/}
                {/*    iterations={144}*/}
                {/*    nodeSize={n => n.size}*/}
                {/*    activeNodeSize={n => 1.5 * n.size}*/}
                {/*    inactiveNodeSize={12}*/}
                {/*    nodeColor={e => e.color}*/}
                {/*    nodeBorderWidth={1}*/}
                {/*    nodeBorderColor="#0431e7"*/}
                {/*    linkThickness={n => 2 + 2 * n.target.data.height}*/}
                {/*    linkColor="#252d9d"*/}
                {/*    linkBlendMode="multiply"*/}
                {/*    motionConfig="wobbly"*/}
                {/*    annotations={[*/}
                {/*        {*/}
                {/*            type: 'circle',*/}
                {/*            match: {*/}
                {/*                id: 'Node 0'*/}
                {/*            },*/}
                {/*            note: 'your search results',*/}
                {/*            noteX: 180,*/}
                {/*            noteY: 80,*/}
                {/*            offset: 8,*/}
                {/*            noteTextOffset: 10*/}
                {/*        }*/}
                {/*    ]}*/}
                {/*/>*/}
            </div>
        );
    }
    cot++;
    return (
        <div style={{ margin: 0, height: 400 }}>
            <ResponsiveHeatMap
                data={data}
                margin={{ top: 80, right: 200, bottom: 60, left: 200 }}
                axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -90,
                    legend: "",
                    legendOffset: 46,
                    truncateTickAt: 0,
                }}
                axisRight={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: 70,
                    truncateTickAt: 0,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: -72,
                    truncateTickAt: 0,
                }}
                colors={{
                    type: "diverging",
                    scheme: "purples",
                    divergeAt: 0.5,
                    minValue: -1,
                    maxValue: 3,
                }}
                emptyColor="#555555"
                legends={[
                    {
                        anchor: "bottom",
                        translateX: 0,
                        translateY: 30,
                        length: 400,
                        thickness: 8,
                        direction: "row",
                        tickPosition: "after",
                        tickSize: 3,
                        tickSpacing: 4,
                        tickOverlap: false,
                        title: "Value →",
                        titleAlign: "start",
                        titleOffset: 4,
                    },
                ]}
                motionConfig="molasses"
            />
        </div>
    );
};

export default SeverityNetWork;
