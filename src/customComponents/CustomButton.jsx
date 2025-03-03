import { Button } from "@mui/material";
import React from "react";
import { theme } from "../utils/theme";

function CustomButton({
  iconSrc,
  altText,
  buttonText,
  sx = {},
  variant = "contained",
  onClick = () => {},
  disabled = false,
}) {
  return (
    <Button
      variant={variant}
      color="primary"
      onClick={onClick}
      disabled={disabled}
      sx={{
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        textTransform: "none",
        backgroundColor: theme.black2,
        border: `1px solid ${theme.yellow}`,
        color: theme.white,
        fontSize: "12px",
        ":hover": {
          color: theme.black,
          backgroundColor: theme.yellow,
        },
        "&.Mui-disabled": {
          backgroundColor: theme.grey,
          color: "#999",
          opacity: 0.5,
        },
        ...sx,
      }}
    >
      {iconSrc && iconSrc} {buttonText}
    </Button>
  );
}

export default CustomButton;
