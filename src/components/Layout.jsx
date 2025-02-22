import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box sx={{ minHeight: "calc(100vh - 140px)", px: 2.5, pt: 8, pb: 6 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
