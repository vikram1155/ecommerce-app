import { Box } from "@mui/material";
import React from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";

function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.black2,
        padding: "10px 20px",
        color: "white",
        width: "calc(100% - 40px)",
        float: "right",
        position: "fixed",
        bottom: 0,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 1,
        }}
      >
        <CustomTypography heading={true} value={"Connect for more!"} />
        <LinkedInIcon
          sx={{ fontSize: 18, cursor: "pointer", color: theme.yellow }}
          onClick={() =>
            window.open("https://www.linkedin.com/in/vikram1155/", "_blank")
          }
        />
        <GitHubIcon
          sx={{ fontSize: 18, cursor: "pointer", color: theme.yellow }}
          onClick={() =>
            window.open("https://github.com/vikram1155/", "_blank")
          }
        />
      </Box>
    </Box>
  );
}

export default Footer;
