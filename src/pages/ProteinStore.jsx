import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { proteinList } from "../assets/data";

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
      <Box ml={!isMobile && "230px"}>
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
