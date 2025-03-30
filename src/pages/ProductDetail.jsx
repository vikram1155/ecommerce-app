import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  useMediaQuery,
} from "@mui/material";
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
import { showSnackbar } from "../redux/snackbarSlice";
import TodayDeals from "../customComponents/TodayDeals";
import CustomTypography from "../customComponents/CustomTypography";
import CustomLoader from "../customComponents/CustomLoader";

const COLORS = ["#FF0000", "#00C49F", "#FFBB28"];

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const isMobile = useMediaQuery("(max-width: 550px)");
  const isTab = useMediaQuery("(max-width: 1024px)");

  // Deals
  const [todaysDealProducts, setTodaysDealProducts] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("userinfo"));

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setProduct(response?.data.find((item) => item.productId === id));
          setTodaysDealProducts(response.data);
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

    const updatedFavoritesList = favoritesList?.includes(id)
      ? favoritesList.filter((favId) => favId !== id)
      : [...favoritesList, id];

    try {
      const response = await updateFavorites(currentUser.userId, {
        favorite_products: updatedFavoritesList,
      });
      if (response?.status?.code === 200) {
        dispatch(
          showSnackbar(
            favoritesList?.length && favoritesList?.includes(id)
              ? "Removed from Wishlist!"
              : "Added to Wishlist!"
          )
        );
        setFavoritesListFromLocal(updatedFavoritesList);
        localStorage.setItem(
          "userinfo",
          JSON.stringify({
            ...currentUser,
            favorites: updatedFavoritesList,
          })
        );
      }
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
        userEmail: currentUser.email,
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
        if (response.status.code === 200) {
          dispatch(showSnackbar("Product Added to Cart!"));
        }
      } catch (error) {
        dispatch(showSnackbar(`Error adding to cart: ${error}`));
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
    return <CustomLoader fullPage={true} />;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          maxWidth: "900px",
          margin: "auto",
          mt: 4,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 4 : "5%",
        }}
      >
        {/* Left Section - Image */}
        <Box
          sx={{
            width: isMobile ? "100%" : "40%",
            height: "400px",
            background: "#fff",
            borderRadius: "10px",
          }}
        >
          <img
            src={product?.image}
            alt={product?.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </Box>

        {/* Right Section - Details */}

        <Box
          sx={{
            width: isMobile ? "100%" : "50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: !isTab
                ? product?.protein || product?.carbs || product?.fat
                  ? "1fr 1fr"
                  : "auto"
                : "auto",
              alignItems: "center",
              position: "relative",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Favorite Icon */}
              <Box
                sx={{
                  alignSelf: "flex-end",
                  position: "absolute",
                  right: 0,
                  top: "-10px",
                  backgroundColor: theme.black,
                  borderRadius: "100%",
                }}
              >
                <IconButton
                  onClick={() => handleFavoriteButtonClick(product?.productId)}
                  color="error"
                >
                  {favoritesListFromLocal?.includes(product.productId) ? (
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
              <Typography variant="body1" fontWeight="bold">
                {product.description}
              </Typography>
              <Chip
                label={product.category}
                sx={{
                  backgroundColor: theme.yellow,
                  color: "#000",
                  fontWeight: "bold",
                  width: "fit-content",
                }}
              />
              <Box display={"flex"} gap={1} alignItems={"center"}>
                <CustomTypography
                  heading={false}
                  value={`${Math.round(
                    product.price / ((100 - product.offer) / 100)
                  )}`}
                  sx={{
                    fontWeight: 400,
                    fontSize: "12px",
                    textDecoration: "line-through",
                    color: "grey !important",
                  }}
                />
                <CustomTypography
                  heading={false}
                  value={`₹${product.price}`}
                  sx={{ fontWeight: 400, fontSize: "16px" }}
                />
                <CustomTypography
                  heading={false}
                  value={`${product.offer}% Off`}
                  sx={{
                    fontWeight: 400,
                    fontSize: "12px",
                    color: `${theme.yellow} !important`,
                  }}
                />
              </Box>
              {/* Category Tag */}

              <Typography variant="body1">{product.features}</Typography>
              {/* Ratings & Purchases */}
              {product.no_of_ratings ? (
                <Typography variant="body1" sx={{ fontSize: "12px" }}>
                  <span
                    style={{ fontWeight: 700 }}
                  >{`⭐ ${product.ratings}`}</span>
                  {` | ${product.no_of_ratings} Ratings`}
                </Typography>
              ) : (
                <></>
              )}
            </Box>
            {/* Pie Chart for Nutrition */}

            {product?.protein || product?.carbs || product?.fat ? (
              <Box
                sx={{
                  display: isTab && "flex",
                  alignItems: isTab && "center",
                  gap: isTab && 3,
                  flexDirection: isTab && "column",
                }}
              >
                <Box
                  sx={{
                    display: isTab && "flex",
                    alignItems: isTab && "center",
                    gap: isTab && 3,
                  }}
                >
                  <ResponsiveContainer
                    width={150}
                    height={150}
                    style={{ padding: "20px 0", justifySelf: "center" }}
                  >
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
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: isTab && "column",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Box
                        sx={{
                          height: "16px",
                          width: "16px",
                          bgcolor: "#FF0000",
                          borderRadius: 1,
                        }}
                      ></Box>
                      Protein
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Box
                        sx={{
                          height: "16px",
                          width: "16px",
                          bgcolor: "#00C49F",
                          borderRadius: 1,
                        }}
                      ></Box>
                      Carbs
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Box
                        sx={{
                          height: "16px",
                          width: "16px",
                          bgcolor: "#FFBB28",
                          borderRadius: 1,
                        }}
                      ></Box>
                      Fat
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  (Values per 100g)
                </Box>{" "}
              </Box>
            ) : (
              <></>
            )}
          </Box>
          <br></br>
          <Box>
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
              iconSrc={<ShoppingCartIcon sx={{ fontSize: "14px" }} />}
              altText={"Shopping Cart"}
              buttonText={product.inCart ? "Go To Cart" : "Add To Cart"}
              onClick={handleAddToCart}
              sx={{ mt: 2, width: "100%" }}
            />
          </Box>
        </Box>
      </Box>
      <TodayDeals todaysDealProducts={todaysDealProducts} />
    </Box>
  );
}

export default ProductDetail;
