import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { supplements } from "../assets/data";

function Supplements() {
  const isMobile = useMediaQuery("(max-width: 650px)");
  const categories = Array.from(
    new Set(supplements?.map((product) => product.category))
  );

  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    selectedCategories: [],
    selectedRating: "",
    selectedOffer: "",
    minMax: [0, 0],
  });

  const [supplementsList, setSupplementsList] = useState(supplements);

  useEffect(() => {
    let min = Infinity;
    let max = -Infinity;

    supplements.forEach((product) => {
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

    const filteredEquipmentList = supplements.filter((equipment) => {
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

    setSupplementsList(filteredEquipmentList);
  }, [filters]);

  return (
    <Box sx={{}}>
      {!isMobile && (
        <CustomFilterBox
          categories={categories}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <Box ml={!isMobile && "250px"}>
        {supplementsList?.length && (
          <CustomProductList
            list={supplementsList}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </Box>
    </Box>
  );
}

export default Supplements;
