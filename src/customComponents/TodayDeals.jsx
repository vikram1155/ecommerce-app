import { Box, Typography } from "@mui/material";
import React from "react";
import CustomTypography from "./CustomTypography";
import { useNavigate } from "react-router-dom";
import { theme } from "../utils/theme";
import EquipmentsImage from "../assets/equipments.jpeg";
import SupplementsImage from "../assets/supplements.jpeg";
import ProteinFoodsImage from "../assets/proteinFoods.jpeg";

function TodayDeals({ todaysDealProducts }) {
  const navigate = useNavigate();

  //   JSX
  return (
    <Box sx={{ p: 4 }}>
      <CustomTypography
        heading={true}
        value="Today's Deals"
        sx={{ textAlign: "center", my: 5 }}
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
              sx={{ textAlign: "center" }}
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
                      (todaysDealProduct.price * todaysDealProduct.offer) / 100
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
  );
}

export default TodayDeals;
