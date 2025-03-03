import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { theme } from "../utils/theme";

function CustomLoader({ fullPage }) {
  return (
    <Box
      sx={{
        display: "flex",
        height: fullPage && "calc(100vh - 100px)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: theme.yellow }} />
    </Box>
  );
}

export default CustomLoader;
