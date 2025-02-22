import React, { useEffect, useState } from "react";
import { productList, proteinList, supplements } from "../assets/data";
import { Box } from "@mui/material";
import CustomProductCard from "../customComponents/CustomProductCard";

function Wishlist() {
  const [wishList, setWishList] = useState([]);
  useEffect(() => {
    setWishList([...productList, ...supplements, ...proteinList]);
  }, []);

  return (
    <Box>
      {wishList.length ? (
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
              <CustomProductCard key={value.id} item={value} />
            ))}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default Wishlist;
