import { Box, IconButton, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomProductCard from "./CustomProductCard";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";
import { getAllProducts, getFavorites, updateFavorites } from "../apiCalls/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";
import TodayDeals from "./TodayDeals";

const FilterChip = ({ label, onRemove }) => (
  <Box
    sx={{
      border: `1px solid ${theme.yellow}`,
      py: 0.8,
      px: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 1,
      color: theme.yellow,
      cursor: "pointer",
      borderRadius: 2,
    }}
  >
    <CustomTypography
      heading={false}
      value={label}
      sx={{ fontWeight: 400, fontSize: "12px", color: theme.yellow }}
    />
    <IconButton sx={{ p: 0 }} onClick={onRemove}>
      <CloseRoundedIcon sx={{ fill: theme.yellow }} />
    </IconButton>
  </Box>
);

function CustomProductList({
  filteredProducts,
  filters,
  setFilters,
  setFilteredProducts,
}) {
  const isMobile = useMediaQuery("(max-width: 450px)");

  const handleRemoveFilter = (key, item) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (Array.isArray(updatedFilters[key])) {
        if (key === "priceRange") {
          updatedFilters[key] =
            item === prevFilters[key][0]
              ? [prevFilters.minMax[0], prevFilters[key][1]]
              : [prevFilters[key][0], prevFilters.minMax[1]];
        } else {
          updatedFilters[key] = updatedFilters[key].filter((i) => i !== item);
        }
      } else {
        updatedFilters[key] = "";
      }

      return updatedFilters;
    });
  };

  const currentUser = JSON.parse(localStorage.getItem("userinfo"));
  const [favoritesListFromLocal, setFavoritesListFromLocal] = useState(
    currentUser?.favorites || []
  );

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

  // JSX
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 2,
          flexFlow: "wrap",
        }}
      >
        {Object.entries(filters || {}).map(([key, value]) =>
          key === "priceRange" &&
          (filters.minMax[0] !== value[0] || filters.minMax[1] !== value[1]) ? (
            value.map((item, index) => {
              return (
                item > 0 && (
                  <FilterChip
                    key={`${key}-${item}`}
                    label={index === 0 ? `Min - ₹${item}` : `Max - ₹${item}`}
                    onRemove={() => handleRemoveFilter(key, item)}
                  />
                )
              );
            })
          ) : key === "selectedCategories" ? (
            value.map((item, index) => {
              return (
                <FilterChip
                  key={`${key}-${item}`}
                  label={item}
                  onRemove={() => handleRemoveFilter(key, item)}
                />
              );
            })
          ) : value && (key === "selectedRating" || key === "selectedOffer") ? (
            <FilterChip
              key={key}
              label={
                key === "selectedRating" ? `${value} ⭐` : `Above ${value}`
              }
              onRemove={() => handleRemoveFilter(key)}
            />
          ) : null
        )}
      </Box>
      {/* Grid for Product Cards */}
      {filteredProducts.length ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: isMobile
              ? "repeat(1, 1fr)"
              : {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                  xl: "repeat(5, 1fr)",
                },
          }}
        >
          {filteredProducts.map((listItem) => (
            <CustomProductCard
              item={listItem}
              setFilteredProducts={setFilteredProducts}
              favoritesListFromLocal={favoritesListFromLocal}
              handleFavoriteButtonClick={handleFavoriteButtonClick}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            py: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Products available!
        </Box>
      )}
    </Box>
  );
}

export default CustomProductList;
