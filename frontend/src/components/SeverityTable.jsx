import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import {
    createTheme,
    ThemeProvider,
    alpha,
    getContrastRatio,
} from "@mui/material/styles";

const violetBase = "#9832ff";
const violetMain = alpha(violetBase, 0.8);

const theme = createTheme({
    palette: {
        violet: {
            main: violetMain,
            light: alpha(violetBase, 0.5),
            dark: alpha(violetBase, 0.9),
            contrastText:
                getContrastRatio(violetMain, "#fff") > 4.5 ? "#fff" : "#111",
        },
    },
});

export default function VioletButton({ name, path, minWidth, onClick }) {
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={theme}>
            <Button
                variant="contained"
                color="violet"
                size="large"
                sx={{
                    width: "15%",
                    fontSize: "0.875rem",
                    minWidth: minWidth,
                }}
                onClick={(event) => {
                    if (onClick) onClick(event);
                    if (path) navigate(path);
                }}
            >
                {name}
            </Button>
        </ThemeProvider>
    );
}
