import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { theme } from "../utils/theme";
import CustomTypography from "../customComponents/CustomTypography";
import EquipmentsImage from "../assets/equipments.jpeg";
import SupplementsImage from "../assets/supplements.jpeg";
import ProteinFoodsImage from "../assets/proteinFoods.jpeg";
import { useNavigate } from "react-router-dom";
import { ReactSVG as SVG } from "react-svg";
import Arms from "../assets/arms.svg";
import Dumbbells from "../assets/dumbbells.svg";
import WheyProtein from "../assets/whey-protein.svg";
import { getAllProducts } from "../apiCalls/api";
import { setProductsRedux } from "../redux/allProductsSlice";
import { useDispatch } from "react-redux";
import TodayDeals from "../customComponents/TodayDeals";
import HeroSection from "../components/HeroSection";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

// Sample quotes
const quotes = [
  "The only bad workout is the one you didn't do. Be stronger than your excuses.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Action is the foundational key to all success. Excuses don’t burn calories.",
  "No matter how slow you go, you're still lapping everyone on the couch.",
  "To keep the body in good health is a duty. The body achieves what the mind believes.",
  "It never gets easier, you just get better. Sweat is just fat crying.",
  "Push yourself because no one else will do it for you. Train insane or remain the same.",
  "Strive for progress, not perfection. Wake up. Work out. Look hot. Repeat.",
  "Fitness is not about being better than someone else; it's about being better than you used to be.",
  "Don't limit your challenges, challenge your limits. Push and pull harder",
  "Become stronger than yesterday everyday. Hustle for that muscle.",
  "Be stronger than your excuses! Sweat. Smile. Repeat. Sore today, strong tomorrow.",
  "You don't find willpower, you create it. Make yourself proud.",
  "The best project you'll ever work on is yourself. Fall in love with taking care of yourself.",
];

const Home = () => {
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(quote);
  }, []);

  const categories = [
    { name: "Equipments", routeTo: "/equipments", image: EquipmentsImage },
    {
      name: "Protein Rich  Foods",
      routeTo: "/equipments",
      image: ProteinFoodsImage,
    },
    { name: "Supplements", routeTo: "/supplements", image: SupplementsImage },
  ];

  const [todaysDealProducts, setTodaysDealProducts] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setTodaysDealProducts(response.data); // Ensure it's set
          dispatch(setProductsRedux(response.data));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [dispatch]);

  const navigate = useNavigate();
  const handleShopNowButtonClick = () => {
    const section3 = document.getElementById("section3");
    if (section3) {
      section3.scrollIntoView({ behavior: "smooth" });
    }
  };

  // JSX
  return (
    <Box>
      {/* Section 1: Hero Banner */}
      <HeroSection onClick={handleShopNowButtonClick} />

      {/* Section 2: Categories */}
      <Box id="section3"> </Box>
      <br></br>
      <CustomTypography
        heading={true}
        value="Categories"
        sx={{
          fontWeight: 600,
          textAlign: "center",
          my: 5,
        }}
      />
      <Box
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: "100%",
        }}
      >
        {categories.map((category, index) => (
          <Box
            sx={{
              justifySelf: "center",
              width: { xs: "calc(100% - 32px)", sm: "auto" },
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                background: theme.black2,
                p: 2,
                borderRadius: 2,
                cursor: "pointer",
                maxWidth: "250px",
                m: "auto",
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 500ms",
                  "& .MuiTypography-root": {
                    color: theme.yellow,
                  },
                  svg: {
                    color: theme.yellow,
                    fill: theme.yellow,
                  },
                  div: {},
                },
              }}
              onClick={() => navigate(category.routeTo)}
            >
              <Box
                sx={{
                  height: { xs: "250px", sm: "200px" },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                {/* <FitnessCenterRoundedIcon sx={{ fontSize: "20px" }} /> */}
                <SVG
                  src={
                    category.name === "Equipments"
                      ? Dumbbells
                      : category.name === "Supplements"
                      ? WheyProtein
                      : Arms
                  }
                  style={{
                    width: 24,
                    height: 24,
                    fill: theme.white,
                    color: theme.white,
                  }}
                />
                <CustomTypography
                  heading={false}
                  value={`${category.name}`}
                  sx={{ fontSize: "14px", textAlign: "center" }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <TodayDeals todaysDealProducts={todaysDealProducts} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 0 120px",
          margin: "auto",
          width: "70%",
        }}
      >
        <FormatQuoteIcon sx={{ fontSize: 80 }} />
        <Typography
          variant={"h6"}
          fontWeight={700}
          gutterBottom
          sx={{ fontStyle: "italic" }}
        >
          {randomQuote}
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
