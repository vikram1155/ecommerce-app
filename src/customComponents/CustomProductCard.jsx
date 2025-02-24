import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";
import CustomButton from "./CustomButton";
import { useLocation, useNavigate } from "react-router-dom";

function CustomProductCard({ item }) {
  const [favorited, setFavorited] = useState(item.favorited);
  const navigate = useNavigate();
  const location = useLocation();

  //JSX
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `0.5px solid #ffbd0033`,
        p: 2,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          border: `1px solid ${theme.yellow}`,
          transform: "scale(1.005)",
          transition: "transform 300ms",
        },
      }}
      onClick={() => {
        navigate(`${location.pathname}/${item.id}`);
      }}
    >
      {/* Favorite Icon */}
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
        onClick={(e) => {
          e.stopPropagation();
          setFavorited(!favorited);
        }}
      >
        {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* Product Image */}
      <Box
        sx={{
          height: "150px",
          display: "flex",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <img
          src={
            item.image ||
            "https://dummyimage.com/800x400&text=placeholder-image"
          }
          alt={item.name}
          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
        />
      </Box>

      {/* Product Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          alignItems: "center",
          my: 1,
        }}
      >
        <CustomTypography
          heading={true}
          value={item.name}
          sx={{ fontWeight: 600, fontSize: "14px" }}
        />

        <Box display={"flex"} gap={1} alignItems={"center"}>
          {/* <CustomTypography
            heading={false}
            value={`₹${item.price}`}
            sx={{ fontWeight: 600, fontSize: "14px" }}
          />
          <CustomTypography
            heading={false}
            value={`${item.offer} Off`}
            sx={{ fontWeight: 600, fontSize: "12px" }}
          /> */}
          <CustomTypography
            heading={false}
            value={`${item.price + (item.price * item.offer) / 100}`}
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              textDecoration: "line-through",
              color: "grey !important",
            }}
          />
          <CustomTypography
            heading={false}
            value={`₹${item.price}`}
            sx={{ fontWeight: 400, fontSize: "18px" }}
          />
          <CustomTypography
            heading={false}
            value={`${item.offer}% Off`}
            sx={{
              fontWeight: 400,
              fontSize: "14px",
              color: `${theme.yellow} !important`,
            }}
          />
        </Box>

        <CustomTypography
          heading={false}
          value={`⭐ ${item.ratings} (${item.no_of_ratings})`}
          sx={{ fontWeight: 400, fontSize: "12px" }}
        />
        <br></br>
        {/* Add to Cart Button */}
        <CustomButton
          variant="contained"
          iconSrc={<ShoppingCartIcon sx={{ fontSize: "16px" }} />}
          altText={"Shopping Cart"}
          buttonText={"Add to Cart"}
        />
      </Box>
    </Box>
  );
}

export default CustomProductCard;
