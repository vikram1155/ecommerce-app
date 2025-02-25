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
// Sample quotes
const quotes = [
  "No pain, no gain.",
  "Sweat is just fat crying.",
  "The body achieves what the mind believes.",
  "Push yourself because no one else will do it for you.",
  "Train insane or remain the same.",
  "Strive for progress, not perfection.",
  "Fitness is not about being better than someone else; it's about being better than you used to be.",
  "Don't limit your challenges, challenge your limits.",
  "Stronger every day.",
  "Hustle for that muscle.",
  "Wake up. Work out. Look hot. Repeat.",
  "Your only limit is you.",
  "Sore today, strong tomorrow.",
  "Be stronger than your excuses.",
  "Sweat. Smile. Repeat.",
  "You don't find willpower, you create it.",
  "Make yourself proud.",
  "The best project you'll ever work on is yourself.",
  "Beast mode: ON.",
  "Fall in love with taking care of yourself.",
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

  // const todaysDealProducts = [
  //   {
  //     name: "Dumbbells",
  //     routeTo: "/equipments",
  //     image: EquipmentsImage,
  //     price: 1500,
  //     offer: 15,
  //   },
  //   {
  //     name: "Protein Powder",
  //     routeTo: "/supplements",
  //     image: SupplementsImage,
  //     price: 2500,
  //     offer: 20,
  //   },
  //   {
  //     name: "Chicken Breast",
  //     routeTo: "/protein-store",
  //     image: ProteinFoodsImage,
  //     price: 1200,
  //     offer: 10,
  //   },
  //   {
  //     name: "Kettlebells",
  //     routeTo: "/equipments",
  //     image: EquipmentsImage,
  //     price: 1800,
  //     offer: 12,
  //   },
  //   {
  //     name: "Creatine",
  //     routeTo: "/supplements",
  //     image: SupplementsImage,
  //     price: 2200,
  //     offer: 18,
  //   },
  //   {
  //     name: "Salmon Fillet",
  //     routeTo: "/protein-store",
  //     image: ProteinFoodsImage,
  //     price: 2000,
  //     offer: 8,
  //   },
  //   {
  //     name: "Treadmill",
  //     routeTo: "/equipments",
  //     image: EquipmentsImage,
  //     price: 15000,
  //     offer: 25,
  //   },
  //   {
  //     name: "BCAA",
  //     routeTo: "/supplements",
  //     image: SupplementsImage,
  //     price: 1800,
  //     offer: 14,
  //   },
  //   {
  //     name: "Egg Whites",
  //     routeTo: "/protein-store",
  //     image: ProteinFoodsImage,
  //     price: 800,
  //     offer: 5,
  //   },
  //   {
  //     name: "Resistance Bands",
  //     routeTo: "/equipments",
  //     image: EquipmentsImage,
  //     price: 900,
  //     offer: 10,
  //   },
  // ];

  const navigate = useNavigate();

  return (
    <Box>
      {/* Section 1: Hero Banner */}
      <Box
        sx={{
          height: "300px",
          backgroundImage: "url(https://via.placeholder.com/1200x300)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          "Work Hard, Train Harder - For the Future You!"
        </Typography>
      </Box>

      {/* Section 2: Categories */}
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

      {/* Section 3: Today's Deals */}
      <Box sx={{ p: 4 }}>
        <CustomTypography
          heading={true}
          value="Today's Deals"
          sx={{ fontSize: "24px", fontWeight: 600, textAlign: "center", my: 5 }}
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
          {todaysDealProducts
            ?.filter((todaysDealProduct) => todaysDealProduct.offer >= 20)
            .map((todaysDealProduct) => (
              <Box
                sx={{ textAlign: "center", p: 2 }}
                onClick={() => {
                  navigate(
                    `${
                      todaysDealProduct.type === "Equipments"
                        ? "/equipments"
                        : todaysDealProduct.type === "Supplements"
                        ? "/supplements"
                        : "/protein-store"
                    }/${todaysDealProduct.productId}`
                  );
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
                      transition: "transform 300ms",
                    },
                  }}
                  onClick={() => navigate(todaysDealProduct.routeTo)}
                >
                  <Box
                    sx={{
                      height: { xs: "250px", sm: "200px" },
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={
                        todaysDealProduct.type === "Equipments"
                          ? EquipmentsImage
                          : todaysDealProduct.type === "Supplements"
                          ? SupplementsImage
                          : ProteinFoodsImage
                      }
                      alt={todaysDealProduct.name}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography variant="body1">
                    {todaysDealProduct.name}
                  </Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={1}
                  >
                    <CustomTypography
                      heading={false}
                      value={todaysDealProduct.price}
                      sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        textDecoration: "line-through",
                        color: "grey !important",
                      }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`₹${
                        todaysDealProduct.price -
                        (todaysDealProduct.price * todaysDealProduct.offer) /
                          100
                      }`}
                      sx={{ fontWeight: 400, fontSize: "18px" }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`${todaysDealProduct.offer}% Off`}
                      sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        color: `${theme.yellow} !important`,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>

      {/* Section 4: Quotes */}
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">{randomQuote}</Typography>
      </Box>
    </Box>
  );
};

export default Home;
