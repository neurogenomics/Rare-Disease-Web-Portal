import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const marks = [
    {
        value: 0,
        label: "Mild",
    },
    {
        value: 1,
        label: "Moderate",
    },
    {
        value: 2,
        label: "Severe",
    },
    {
        value: 3,
        label: "Profound",
    },
];

function valuetext(value) {
    return `${value}`;
}

export default function SeveritySlider({ name, onChange }) {
    const [value, setValue] = useState([0, 3]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Box sx={{ width: 200 }}>
            <Typography variant="h7" gutterBottom>
                {name}
            </Typography>
            <Slider
                getAriaLabel={() => "Custom marks"}
                defaultValue={0}
                getAriaValueText={valuetext}
                step={1}
                max={3}
                marks={marks}
                value={value}
                onChange={handleChange}
                size="small"
                color="secondary"
            />
        </Box>
    );
}
