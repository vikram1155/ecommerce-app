import { Box, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";
import CustomButton from "./CustomButton";
import { useNavigate } from "react-router-dom";
import EquipmentsImage from "../assets/equipments.jpeg";
import SupplementsImage from "../assets/supplements.jpeg";
import ProteinFoodsImage from "../assets/proteinFoods.jpeg";

function CustomProductCard({
  item,
  setFilteredProducts,
  favoritesListFromLocal,
  handleFavoriteButtonClick,
}) {
  const navigate = useNavigate();

  const altImage =
    item.type === "Equipments"
      ? EquipmentsImage
      : item.type === "Supplements"
      ? SupplementsImage
      : ProteinFoodsImage;

  const url =
    item.type === "Equipments"
      ? "equipments"
      : item.type === "Supplements"
      ? "supplements"
      : "protein-store";

  //JSX
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid #ffbd0033`,
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
        navigate(`/${url}/${item.productId}`);
      }}
    >
      {/* Favorite Icon */}
      <IconButton
        sx={{ position: "absolute", top: 8, right: 8, color: "red" }}
        onClick={(e) => {
          e.stopPropagation();
          handleFavoriteButtonClick(item.productId);
        }}
      >
        {favoritesListFromLocal?.includes(item.productId) ? (
          <FavoriteIcon />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>

      {/* Product Image */}
      <Box
        sx={{
          height: "120px",
          display: "flex",
          justifyContent: "center",
          mb: 1,
          background: "#fff",
          borderRadius: "4px",
          padding: "5px",
        }}
      >
        <img
          src={item?.image || altImage}
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
          sx={{ fontWeight: 600, fontSize: "12px" }}
        />

        <Box display={"flex"} gap={1} alignItems={"center"}>
          <CustomTypography
            heading={false}
            value={`${Math.round(item.price / ((100 - item.offer) / 100))}`}
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              textDecoration: "line-through",
              color: "grey !important",
            }}
          />
          <CustomTypography
            heading={false}
            value={`₹${item.price}`}
            sx={{ fontWeight: 400, fontSize: "16px" }}
          />
          <CustomTypography
            heading={false}
            value={`${item.offer}% Off`}
            sx={{
              fontWeight: 400,
              fontSize: "12px",
              color: `${theme.yellow} !important`,
            }}
          />
        </Box>
        {item.ratings ? (
          <CustomTypography
            heading={false}
            value={`⭐ ${item.ratings} (${item.no_of_ratings})`}
            sx={{ fontWeight: 400, fontSize: "10px" }}
          />
        ) : (
          <></>
        )}
        <br></br>
        {/* Add to Cart Button */}
        <CustomButton
          variant="contained"
          iconSrc={<ShoppingCartIcon sx={{ fontSize: "14px" }} />}
          altText={"Shopping Cart"}
          buttonText={"View Product"}
        />
      </Box>
    </Box>
  );
}

export default CustomProductCard;
