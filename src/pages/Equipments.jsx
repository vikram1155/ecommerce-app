import React, { useEffect, useState } from "react";
import CustomFilterBox from "../customComponents/CustomFilterBox";
import { Box, useMediaQuery, CircularProgress } from "@mui/material";
import CustomProductList from "../customComponents/CustomProductList";
import { getAllProducts } from "../apiCalls/api";
import { setProductsRedux } from "../redux/allProductsSlice";
import { useDispatch } from "react-redux";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllProductsFn = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setProductsFromApi(response.data);
          dispatch(setProductsRedux(response.data));
        } else {
          setProductsFromApi([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Some error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };
    getAllProductsFn();
  }, [dispatch]);

  useEffect(() => {
    if (!productsFromApi.length) return;

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
      minMax: [min, max],
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
          selectedCategories?.includes(equipment.category);
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

  // JSX
  return (
    <Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: theme.yellow }} />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            py: 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomTypography
            heading={false}
            value={error}
            sx={{ color: theme.white }}
          />
        </Box>
      ) : (
        <>
          {!isMobile && (
            <CustomFilterBox
              categories={categories}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          <Box ml={!isMobile ? "250px" : "0"}>
            {productsFromApi.length ? (
              <CustomProductList
                filteredProducts={filteredProducts}
                filters={filters}
                setFilters={setFilters}
                setFilteredProducts={setFilteredProducts}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  py: 3,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomTypography
                  heading={false}
                  value="No Products available!"
                  sx={{ color: theme.white }}
                />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Equipments;
