import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../apiCalls/api";
import { setProductsRedux } from "../redux/allProductsSlice";

function ProteinStore() {
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
          setProductsFromApi(response.data); 
          dispatch(setProductsRedux(response.data));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [dispatch]);

  useEffect(() => {
    let min = Infinity;
    let max = -Infinity;

    productsFromApi
      .filter((productFromApi) => productFromApi.type === "Protein-Foods")
      .forEach((product) => {
        if (product.price < min) min = product.price;
        if (product.price > max) max = product.price;
      });

    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: [min, max],
      minMax: [min, max],
    }));
  }, [productsFromApi]);

  useEffect(() => {
    if (!productsFromApi.length) return;

    const { priceRange, selectedCategories, selectedRating, selectedOffer } =
      filters;

    const [minPrice, maxPrice] = priceRange;

    const filteredProteinStoreList = productsFromApi
      .filter((productFromApi) => productFromApi.type === "Protein-Foods")
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
            ?.filter(
              (productFromApi) => productFromApi.type === "Protein-Foods"
            )
            .map((product) => product.category)
        )
      )
    );
    setFilteredProducts(filteredProteinStoreList);
  }, [filters, productsFromApi]);

  // JSX
  return (
    <Box>
      {!isMobile && (
        <CustomFilterBox
          filters={filters}
          setFilters={setFilters}
          categories={categories}
        />
      )}
      <Box ml={!isMobile && "250px"}>
        <CustomProductList
          filteredProducts={filteredProducts}
          filters={filters}
          setFilters={setFilters}
          setFilteredProducts={setFilteredProducts}
        />
      </Box>
    </Box>
  );
}

export default ProteinStore;
