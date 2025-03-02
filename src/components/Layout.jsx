import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, home = false }) => {
  return (
    <Box>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 140px)",
          px: home ? 0 : 2.5,
          pt: 7,
          pb: 5.5,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
