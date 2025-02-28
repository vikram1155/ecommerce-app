import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomProductCard from "./CustomProductCard";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";
import { getFavorites, updateFavorites } from "../apiCalls/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

const FilterChip = ({ label, onRemove }) => (
  <Box
    sx={{
      border: `1px solid ${theme.yellow}`,
      p: 1,
      display: "flex",
      alignItems: "center",
      gap: 1,
      color: theme.yellow,
      cursor: "pointer",
      borderRadius: 2,
    }}
  >
    <CustomTypography
      heading={true}
      value={label}
      sx={{ fontWeight: 400, fontSize: "14px", color: theme.yellow }}
    />
    <IconButton sx={{ p: 0 }} onClick={onRemove}>
      <CloseRoundedIcon sx={{ fill: theme.yellow }} />
    </IconButton>
  </Box>
);

function CustomProductList({ list, filters, setFilters, setFilteredProducts }) {
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
        delete updatedFilters[key];
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 2 }}>
        {Object.entries(filters || {})
          .filter(([key]) => key !== "minMax")
          .map(([key, value]) =>
            Array.isArray(value) ? (
              value.map((item, index) => (
                <FilterChip
                  key={`${key}-${item}`}
                  label={
                    key === "priceRange"
                      ? index === 0
                        ? `Min - ₹${item}`
                        : `Max - ₹${item}`
                      : item
                  }
                  onRemove={() => handleRemoveFilter(key, item)}
                />
              ))
            ) : value ? (
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
      {list.length ? (
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
          {list.map((listItem) => (
            <CustomProductCard
              item={listItem}
              setFilteredProducts={setFilteredProducts}
              favoritesListFromLocal={favoritesListFromLocal}
              handleFavoriteButtonClick={handleFavoriteButtonClick}
            />
          ))}
        </Box>
      ) : (
        <>No Products</>
      )}
    </Box>
  );
}

export default CustomProductList;
