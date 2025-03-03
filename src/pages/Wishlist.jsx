import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomProductCard from "../customComponents/CustomProductCard";
import CustomTypography from "../customComponents/CustomTypography";
import { getAllProducts, getFavorites, updateFavorites } from "../apiCalls/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";
import { theme } from "../utils/theme";

function Wishlist() {
  const currentUser = JSON.parse(localStorage.getItem("userinfo"));
  const [favoritesListFromLocal, setFavoritesListFromLocal] = useState(
    currentUser?.favorites || []
  );
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const resp = await getFavorites(currentUser?.userId);
        setFavoritesListFromLocal(resp?.data?.favorites || []);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  const dispatch = useDispatch();
  const handleFavoriteButtonClick = async (id) => {
    if (!currentUser) return;

    const updatedFavoritesList =
      favoritesListFromLocal?.length && favoritesListFromLocal?.includes(id)
        ? favoritesListFromLocal.filter((favId) => favId !== id)
        : [...(favoritesListFromLocal || []), id];
    try {
      const response = await updateFavorites(currentUser.userId, {
        favorite_products: updatedFavoritesList,
      });
      if (response?.status?.code === 200) {
        dispatch(
          showSnackbar(
            favoritesListFromLocal?.length &&
              favoritesListFromLocal?.includes(id)
              ? "Removed from Wishlist!"
              : "Added to Wishlist!"
          )
        );
        setFavoritesListFromLocal(updatedFavoritesList);
        const filtered = wishList.filter((a) => a.productId !== id);
        setWishList(filtered);
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

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!currentUser?.favorites?.length) {
        setWishList([]);
        return;
      }

      try {
        const response = await getAllProducts();
        if (response?.data) {
          const filteredFavorites = response.data.filter((product) =>
            currentUser.favorites.includes(product.productId)
          );
          setWishList(filteredFavorites);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchWishlist();
  }, []);

  // JSX
  return (
    <Box>
      <CustomTypography
        heading
        value="Wishlist"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          padding: "30px 0 50px",
          fontSize: "14px",
        }}
      />

      {wishList.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 4,
            pb: 2,
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(6, 1fr)",
            },
          }}
        >
          {wishList.map((product) => (
            <CustomProductCard
              item={product}
              setFilteredProducts={setWishList}
              favoritesListFromLocal={favoritesListFromLocal}
              handleFavoriteButtonClick={handleFavoriteButtonClick}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            padding: "10px 40px 35px",
            maxWidth: 600,
            mx: "auto",
            background: theme.grey,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
            No items in Wishlist
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Wishlist;
