import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  getAllProducts,
  postProductsInCartByUser,
  updateFavorites,
} from "../apiCalls/api";
import CustomButton from "../customComponents/CustomButton";
import { useDispatch } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { theme } from "../utils/theme";
import { addOrUpdateOrder } from "../redux/orderListSlice";

const COLORS = ["#FF0000", "#00C49F", "#FFBB28"]; // Red for Protein, Green for Carbs, Yellow for Fat

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("userinfo"));

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setProduct(response?.data.find((item) => item.productId === id));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [id]);

  const [favoritesListFromLocal, setFavoritesListFromLocal] = useState(
    currentUser?.favorites
  );

  const handleFavoriteButtonClick = async (id) => {
    if (!currentUser) return;

    const favoritesList = currentUser?.favorites ?? [];

    const updatedFavoritesList = favoritesList.includes(id)
      ? favoritesList.filter((favId) => favId !== id)
      : [...favoritesList, id];

    try {
      const response = await updateFavorites(currentUser.userId, {
        favorite_products: updatedFavoritesList,
      });
      if (response?.status?.code === 200) {
        setFavoritesListFromLocal(updatedFavoritesList);
        localStorage.setItem(
          "userinfo",
          JSON.stringify({
            ...currentUser,
            favorites: updatedFavoritesList,
          })
        );
      }
      console.log("Updated favorites:", response);
    } catch (error) {
      console.error("Failed to update favorites:", error);
    }
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!product.inCart) {
      const toBeAddedInCart = {
        userId: currentUser.userId,
        userEmail: currentUser.email, // Ensure email is sent
        productsInCart: [
          {
            productId: product.productId,
            quantity: quantity,
          },
        ],
      };

      try {
        // CREATE - create cart items for an user
        const response = await postProductsInCartByUser(toBeAddedInCart);
        console.log("Cart update response:", response);
      } catch (error) {
        console.log("Error adding to cart:", error);
      }
    }

    navigate("/checkout");
  };

  const nutritionData = [
    { name: "Protein", value: product?.protein || 0 },
    { name: "Carbs", value: product?.carbs || 0 },
    { name: "Fat", value: product?.fat || 0 },
  ];

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: "5%",
        maxWidth: "900px",
        margin: "auto",
        mt: 4,
      }}
    >
      {/* Left Section - Image */}
      <Box
        sx={{
          width: "45%",
          height: "400px",
          background: "#f3f3f3",
          borderRadius: "10px",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </Box>

      {/* Right Section - Details */}
      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Favorite Icon */}
        <Box sx={{ alignSelf: "flex-end" }}>
          <IconButton
            onClick={() => handleFavoriteButtonClick(product?.productId)}
            color="error"
          >
            {favoritesListFromLocal.includes(product.productId) ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        {/* Product Name & Price */}
        <Typography variant="h5" fontWeight="bold">
          {product.name}
        </Typography>
        <Typography variant="h6">
          ₹{product.price}{" "}
          <span style={{ fontSize: "16px", color: "gray" }}>
            ({product.offer})
          </span>
        </Typography>

        {/* Category Tag */}
        <Chip
          label={product.category}
          sx={{ backgroundColor: "#FFD700", color: "#000", fontWeight: "bold" }}
        />

        {/* Ratings & Purchases */}
        <Typography variant="body1">
          {product.ratings} ⭐ ({product.no_of_ratings} purchases)
        </Typography>

        {/* Quantity Selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            border: "1px solid gray",
            borderRadius: "5px",
            width: "fit-content",
            padding: "5px",
          }}
        >
          <IconButton
            size="small"
            onClick={() => quantity > 0 && handleQuantityChange("decrease")}
          >
            <RemoveIcon
              fontSize="small"
              sx={{ color: quantity > 1 ? theme.white : "#333" }}
            />
          </IconButton>
          <Typography>{quantity}</Typography>
          <IconButton
            size="small"
            onClick={() => quantity < 6 && handleQuantityChange("increase")}
          >
            <AddIcon
              fontSize="small"
              sx={{ color: quantity < 6 ? theme.white : "#333" }}
            />
          </IconButton>
        </Box>

        {/* Add to Cart Button */}
        <CustomButton
          variant="contained"
          iconSrc={<ShoppingCartIcon sx={{ fontSize: "16px" }} />}
          altText={"Shopping Cart"}
          buttonText={product.inCart ? "Go To Cart" : "Add To Cart"}
          onClick={handleAddToCart}
        />

        {/* Description */}
        <Typography variant="body2" color="gray">
          {product.description}
        </Typography>

        {/* Pie Chart for Nutrition */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={nutritionData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {nutritionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default ProductDetail;
