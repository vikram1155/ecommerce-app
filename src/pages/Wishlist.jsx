import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CustomProductCard from "../customComponents/CustomProductCard";
import CustomTypography from "../customComponents/CustomTypography";
import { getAllProducts, getFavorites, updateFavorites } from "../apiCalls/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

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
        sx={{ textAlign: "center", fontSize: "16px", fontWeight: 600, py: 2 }}
      />

      {wishList.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
              xl: "repeat(5, 1fr)",
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
        <Box sx={{ textAlign: "center", py: 4 }}>No items in Wishlist</Box>
      )}
    </Box>
  );
}

export default Wishlist;
