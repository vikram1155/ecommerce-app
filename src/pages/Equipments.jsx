import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { getAllProducts } from "../apiCalls/api";
import { setProductsRedux } from "../redux/allProductsSlice";
import { useDispatch } from "react-redux";

function Equipments() {
  const [productsFromApi, setProductsFromApi] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const isMobile = useMediaQuery("(max-width: 650px)");

  const [filters, setFilters] = useState({
    priceRange: [0, 0],
    selectedCategories: [],
    selectedRating: "",
    selectedOffer: "",
    minMax: [0, 0],
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setProductsFromApi(response.data); // Ensure it's set
          dispatch(setProductsRedux(response.data));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [dispatch]);

  useEffect(() => {
    let min = Infinity,
      max = -Infinity;
    productsFromApi
      .filter((productFromApi) => productFromApi.type === "Equipments")
      .forEach((product) => {
        if (product.price < min) min = product.price;
        if (product.price > max) max = product.price;
      });

    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [min, max],
      minMax: [min, max], // Store original min/max
    }));
  }, [productsFromApi]);

  useEffect(() => {
    if (!productsFromApi.length) return;

    const { priceRange, selectedCategories, selectedRating, selectedOffer } =
      filters;

    const [minPrice, maxPrice] = priceRange;

    const filteredEquipmentList = productsFromApi
      .filter((productFromApi) => productFromApi.type === "Equipments")
      .filter((equipment) => {
        const matchesPrice =
          equipment.price >= minPrice && equipment.price <= maxPrice;
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(equipment.category);
        const matchesRating =
          selectedRating === "" || equipment.ratings >= Number(selectedRating);
        const matchesOffer =
          selectedOffer === "" ||
          equipment.offer >= Number(selectedOffer?.slice(0, 2));

        return matchesPrice && matchesCategory && matchesRating && matchesOffer;
      });

    setCategories(
      Array.from(
        new Set(
          productsFromApi
            ?.filter((productFromApi) => productFromApi.type === "Equipments")
            .map((product) => product.category)
        )
      )
    );
    setFilteredProducts(filteredEquipmentList);
  }, [filters, productsFromApi]);

  return (
    <Box>
      {!isMobile && (
        <CustomFilterBox
          categories={categories}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <Box ml={!isMobile ? "250px" : "0"}>
        {filteredProducts.length ? (
          <CustomProductList
            list={filteredProducts}
            filters={filters}
            setFilters={setFilters}
            setFilteredProducts={setFilteredProducts}
          />
        ) : (
          <p>No products available</p>
        )}
      </Box>
    </Box>
  );
}

export default Equipments;
