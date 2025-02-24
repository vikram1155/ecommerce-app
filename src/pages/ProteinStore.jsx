import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { proteinList } from "../assets/data";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { theme } from "../utils/theme";

function ProteinStore() {
  const isMobile = useMediaQuery("(max-width: 650px)");
  const categories = Array.from(
    new Set(proteinList?.map((product) => product.category))
  );

  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    selectedCategories: [],
    selectedRating: "",
    selectedOffer: "",
    minMax: [0, 0],
  });

  const [proteinStoreList, setProteinStoreList] = useState(proteinList);

  useEffect(() => {
    let min = Infinity;
    let max = -Infinity;

    proteinList.forEach((product) => {
      if (product.price < min) min = product.price;
      if (product.price > max) max = product.price;
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [min, max],
      minMax: [min, max],
    }));
  }, []);

  useEffect(() => {
    const { priceRange, selectedCategories, selectedRating, selectedOffer } =
      filters;

    const [minPrice, maxPrice] = priceRange;
    const filteredEquipmentList = proteinList.filter((equipment) => {
      const matchesPrice =
        equipment.price >= minPrice && equipment.price <= maxPrice;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(equipment.category);
      const matchesRating =
        selectedRating === "" || equipment.ratings > Number(selectedRating);
      const matchesOffer =
        selectedOffer === "" || equipment.offer === selectedOffer;

      return matchesPrice && matchesCategory && matchesRating && matchesOffer;
    });

    setProteinStoreList(filteredEquipmentList);
  }, [filters]);

  return (
    <Box sx={{}}>
      {!isMobile && (
        <CustomFilterBox
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />
      )}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: "44px",
            height: "50px",
            width: "calc(100% - 40px)",
            backgroundColor: theme.black2,
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              width: "100%",
              height: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FilterListRoundedIcon sx={{ fontSize: "16px" }} /> Filters
          </Box>
          <hr style={{ margin: "0", height: "20px" }}></hr>
          <Box
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              width: "100%",
              height: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <SwapVertRoundedIcon sx={{ fontSize: "16px" }} /> Sort
          </Box>
        </Box>
      )}
      <Box ml={!isMobile && "250px"}>
        {proteinStoreList?.length && (
          <CustomProductList
            list={proteinStoreList}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </Box>
    </Box>
  );
}

export default ProteinStore;
