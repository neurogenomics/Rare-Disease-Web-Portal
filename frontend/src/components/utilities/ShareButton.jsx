import { useState } from "react";
import { Button, Tooltip } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

export default function ShareButton({ url = null }) {
    const defaultText = "Copy link to clipboard";
    const [tooltipText, setTooltipText] = useState(defaultText);
    if (!url) {
        url = window.location.href;
    }

    return (
        <Tooltip
            title={tooltipText}
            onOpenChange={(visible) => {
                if (!visible) {
                    setTooltipText(defaultText);
                }
            }}
        >
            <Button
                variant="solid"
                color="purple"
                size="small"
                icon={<ShareAltOutlined />}
                onClick={() => {
                    navigator.clipboard.writeText(url);
                    setTooltipText("Link copied!");
                }}
            >
                Share
            </Button>
        </Tooltip>
    );
}
