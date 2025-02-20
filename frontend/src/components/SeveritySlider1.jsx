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

export default function SeveritySlider({ name, onChange, startValue }) {
    const [value, setValue] = useState(startValue);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <Box sx={{ width: 210 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ marginTop: 1.5, marginBottom: -0.5 }}>
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
