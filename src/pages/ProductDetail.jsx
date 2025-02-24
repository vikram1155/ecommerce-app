import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getAllProducts } from "../apiCalls/api";

const COLORS = ["#FF0000", "#00C49F", "#FFBB28"]; // Red for Protein, Green for Carbs, Yellow for Fat

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

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

  const toggleFavorite = () => {
    if (!product) return;
    setFavorites((prevFavorites) =>
      prevFavorites.includes(product.productId)
        ? prevFavorites.filter((favId) => favId !== product.productId)
        : [...prevFavorites, product.productId]
    );
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
          <IconButton onClick={toggleFavorite} color="error">
            {favorites.includes(product.productId) ? (
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
