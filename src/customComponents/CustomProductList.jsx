import { Box, IconButton } from "@mui/material";
import React from "react";
import CustomProductCard from "./CustomProductCard";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";

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

function CustomProductList({ list, filters, setFilters }) {
  const handleRemoveFilter = (key, item) => {
    setFilters((prevFilters) => {
      if (Array.isArray(prevFilters[key])) {
        return {
          ...prevFilters,
          [key]: prevFilters[key].filter((i) => i !== item),
        };
      }
      const updatedFilters = { ...prevFilters };
      delete updatedFilters[key];
      return updatedFilters;
    });
  };

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
            <CustomProductCard key={listItem.id} item={listItem} />
          ))}
        </Box>
      ) : (
        <>No Products</>
      )}
    </Box>
  );
}

export default CustomProductList;
