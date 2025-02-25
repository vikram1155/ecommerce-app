import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { theme } from "../utils/theme";
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

export default ProteinStore;
