import { Box, Typography, useMediaQuery } from "@mui/material";
import { theme } from "../utils/theme";
import CustomButton from "../customComponents/CustomButton";
import HeroSectionImage from "../assets/Header3.jpeg";

const HeroSection = ({ onClick }) => {
  const isMobile = useMediaQuery("(max-width:550px)");

  return (
    <Box
      sx={{
        position: "relative",
        textAlign: "center",
        bgcolor: theme.black2,
        color: "#FFF",
        py: 4,
        px: 2,
        height: "calc(100vh - 164px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background Image with Opacity */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${HeroSectionImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.35, // Setting the opacity here
          //   zIndex: -1,
          backgroundAttachment: "fixed",
        }}
      />
      <Box
        sx={{
          position: "absolute",
        }}
      >
        {/* App Name */}
        <Typography
          variant={isMobile ? "h3" : "h1"}
          fontWeight={700}
          gutterBottom
          sx={{ textTransform: "uppercase" }}
        >
          Strength Hub
        </Typography>

        {/* Taglines */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={700}
          sx={{ color: theme.yellow, textTransform: "uppercase" }}
        >
          Be Strong | Be Healthy
        </Typography>

        {/* Website Description */}
        <Typography variant="body1" mt={2} maxWidth="600px" mx="auto">
          Your go-to all-in-one store for premium gym gear, accessories,
          supplements, and nutrition essentials.
        </Typography>

        <CustomButton
          buttonText="Shop Now"
          sx={{ mt: 4, justifySelf: "center" }}
          onClick={onClick}
        />
      </Box>
    </Box>
  );
};

export default HeroSection;
