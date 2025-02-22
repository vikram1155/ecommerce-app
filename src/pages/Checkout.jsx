import React, { useEffect, useState } from "react";
import { productList, proteinList, supplements } from "../assets/data";
import { Box, Typography } from "@mui/material";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";
import CustomButton from "../customComponents/CustomButton";

function Checkout() {
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    setWishList([...productList, ...supplements, ...proteinList]);
  }, []);

  // Filter items in cart
  const cartItems = wishList.filter((item) => item.inCart);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 600,
        mx: "auto",
        background: theme.grey,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
      >
        Checkout
      </Typography>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              <CustomTypography heading={false} value={item.name} />
              <CustomTypography heading={false} value={item.price} />
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              fontWeight: "bold",
              borderTop: "1px solid #ddd",
              pt: 3,
            }}
          >
            <CustomTypography heading={false} value={"Total"} />
            <CustomTypography heading={false} value={`₹ ${totalPrice}`} />
          </Box>
          <CustomButton
            variant="contained"
            // iconSrc={<ShoppingCartIcon sx={{ fontSize: "16px" }} />}
            altText={"Proceed to Checkout"}
            buttonText={"Proceed to Checkoutt"}
            sx={{ m: "auto", mt: 10 }}
          />
        </>
      ) : (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
          Your cart is empty.
        </Typography>
      )}
    </Box>
  );
}

export default Checkout;
