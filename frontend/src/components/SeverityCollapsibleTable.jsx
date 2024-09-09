import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function createData(hpo_id, hpo_name, definition) {
    return {
        hpo_id,
        hpo_name,
        definition,
        severity_data: [
            {
                clinical_char: hpo_id,
                frequency: hpo_name,
                justification: definition,
            },
            {
                clinical_char: hpo_id,
                frequency: hpo_name,
                justification: definition,
            },
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.hpo_id}
                </TableCell>
                <TableCell align="left">{row.hpo_name}</TableCell>
                <TableCell align="left">{row.definition}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Severity Information
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">
                                            Clinical Characteristic
                                        </TableCell>
                                        <TableCell align="left">
                                            Frequency
                                        </TableCell>
                                        <TableCell align="left">
                                            Justification
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.severity_data.map((severityRow) => (
                                        <TableRow key={severityRow.date}>
                                            <TableCell
                                                align="left"
                                                component="th"
                                                scope="row"
                                            >
                                                {severityRow.clinical_char}
                                            </TableCell>
                                            <TableCell align="left">
                                                {severityRow.frequency}
                                            </TableCell>
                                            <TableCell align="left">
                                                {severityRow.justification}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        hpo_id: PropTypes.string.isRequired,
        hpo_name: PropTypes.string.isRequired,
        definition: PropTypes.string.isRequired,
        severity_data: PropTypes.arrayOf(
            PropTypes.shape({
                clinical_char: PropTypes.string.isRequired,
                frequency: PropTypes.string.isRequired,
                justification: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
};

const rows = [
    createData("HP:0001", "Name1", "d1d1d1d1d1d1d1d1d"),
    createData("HP:0002", "Name2", "d2d2d2d2dd2d2d2d2"),
    createData("HP:0003", "Name4", "d3d3d3d3d3d3d3d3d"),
];

export default function SeverityCollapsibleTable() {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>HPO ID</TableCell>
                        <TableCell>HPO Name</TableCell>
                        <TableCell>Definition</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
