import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CustomProductCard from "../customComponents/CustomProductCard";
import CustomTypography from "../customComponents/CustomTypography";
import { getAllProducts } from "../apiCalls/api";

function Wishlist() {
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setWishList(response.data); // Ensure it's set
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, []);

  // JSX
  return (
    <Box>
      <CustomTypography
        heading={true}
        value={"WishList"}
        sx={{ textAlign: "center", fontSize: "16px", fontWeight: 600, py: 2 }}
      />
      {Object.entries(wishList).filter(
        ([key, value]) => value.favorited === true
      ).length ? (
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
          {Object.entries(wishList)
            .filter(([key, value]) => value.favorited === true)
            .map(([key, value]) => (
              <CustomProductCard
                key={value.id}
                item={value}
                setFilteredProducts={setWishList}
              />
            ))}
        </Box>
      ) : (
        <>No Wish list</>
      )}
    </Box>
  );
}

export default Wishlist;
