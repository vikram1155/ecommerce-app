import { Typography } from "@mui/material";
import React from "react";
import { theme } from "../utils/theme";

function CustomTypography({ value, heading, sx }) {
  return (
    <Typography
      sx={{
        color: heading ? theme.yellow : theme.white,
        textTransform: heading && "uppercase",
        fontSize: heading && "16px",
        fontWeight: heading ? 600 : 400,
        ...sx,
      }}
    >
      {value}
    </Typography>
  );
}

export default CustomTypography;
