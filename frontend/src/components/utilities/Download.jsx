import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";

export default function DownloadButton({ elementId }) {
    // Creates a download button which grabs the element with the given ID and
    // downloads it as a PNG. Make sure the wrap the element with a div with
    // id="given-id"
    const download = () => {
        const element = document.querySelector("#severity-network");
        if (!element) {
            console.error(`Element with supplied ID not found for download`);
            return;
        }

        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = "SeverityNetwork.png";
            link.href = imgData;
            link.click();
        });
    };

    return (
        <Button
            style={{ width: 50 }}
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            onClick={download}
        />
    );
}
