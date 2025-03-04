import { Box, IconButton, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomProductCard from "./CustomProductCard";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";
import { getFavorites, updateFavorites } from "../apiCalls/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";
import CustomSelect from "../customComponents/CustomSelect";

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
  const [selectedSort, setSelectedSort] = useState("");
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
        const response = await getFavorites(currentUser?.userId);
        if (response.status.code === 200) {
          setFavoritesListFromLocal(response?.data?.favorites || []);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, [currentUser?.userId]);

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
          justifyContent: "space-between",
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pt: 1,
            flexFlow: "wrap",
          }}
        >
          {Object.entries(filters || {}).map(([key, value]) =>
            key === "priceRange" &&
            (filters.minMax[0] !== value[0] ||
              filters.minMax[1] !== value[1]) ? (
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
            ) : value &&
              (key === "selectedRating" || key === "selectedOffer") ? (
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
        <Box sx={{ width: "200px" }}>
          <CustomSelect
            label={selectedSort ? "" : "Sort Products"}
            name={selectedSort ? "" : "Sort Products"}
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            options={[
              "Price: Low To High",
              "Price: High To Low",
              "Better Offers",
              "Popularity",
              "Top Rated",
            ]}
            required
          />
        </Box>
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
          {filteredProducts
            .sort((a, b) => {
              if (selectedSort === "Price: Low To High") {
                return a.price - b.price;
              }
              if (selectedSort === "Price: High To Low") {
                return b.price - a.price;
              }
              if (selectedSort === "Better Offers") {
                return b.offer - a.offer;
              }
              if (selectedSort === "Popularity") {
                return b.no_of_ratings - a.no_of_ratings;
              }
              if (selectedSort === "Top Rated") {
                return b.ratings - a.ratings;
              }
              return 0;
            })
            .map((listItem, index) => (
              <Box key={index}>
                <CustomProductCard
                  item={listItem}
                  setFilteredProducts={setFilteredProducts}
                  favoritesListFromLocal={favoritesListFromLocal}
                  handleFavoriteButtonClick={handleFavoriteButtonClick}
                />
              </Box>
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
