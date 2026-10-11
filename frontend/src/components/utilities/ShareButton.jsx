/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Tooltip } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

export default function ShareButton({ url = null }) {
    const defaultText = "Copy link to clipboard";
    const [tooltipText, setTooltipText] = useState(defaultText);

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
                type="default"
                size="small"
                icon={<ShareAltOutlined />}
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(url || window.location.href);
                        setTooltipText("Link copied");
                    } catch {
                        setTooltipText("Copy the address from your browser");
                    }
                }}
            >
                Share
            </Button>
        </Tooltip>
    );
}
