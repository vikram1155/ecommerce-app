import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { productList } from "../assets/data";
import { getAllProducts } from "../apiCalls/api";

function Equipments() {
  const isMobile = useMediaQuery("(max-width: 650px)");
  const categories = Array.from(
    new Set(productList?.map((product) => product.category))
  );

  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    selectedCategories: [],
    selectedRating: "",
    selectedOffer: "",
    minMax: [0, 0],
  });

  const [equipmentsList, setEquipmentsList] = useState(productList);

  useEffect(() => {
    let min = Infinity;
    let max = -Infinity;

    productList.forEach((product) => {
      if (product.price < min) min = product.price;
      if (product.price > max) max = product.price;
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [min, max], // Set price range only once
      minMax: [min, max],
    }));
  }, []);

  useEffect(() => {
    const { priceRange, selectedCategories, selectedRating, selectedOffer } =
      filters;
    const [minPrice, maxPrice] = priceRange;

    const filteredEquipmentList = productList.filter((equipment) => {
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

    setEquipmentsList(filteredEquipmentList);
  }, [filters]);

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const allProducts = await getAllProducts();
        console.log("a-p", allProducts);
      } catch (error) {
        console.error("Error gettings tasks:", error);
      }
    };
    getAllProductsFn();
  }, []);

  return (
    <Box>
      {!isMobile && (
        <CustomFilterBox
          categories={categories}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <Box ml={!isMobile && "250px"}>
        {equipmentsList?.length && (
          <CustomProductList
            list={equipmentsList} // Pass the filtered list
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </Box>
    </Box>
  );
}

export default Equipments;
