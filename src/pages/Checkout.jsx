import React, { useEffect, useState } from "react";
import { productList, proteinList, supplements } from "../assets/data";
import { Box, CircularProgress, Typography } from "@mui/material";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";
import CustomButton from "../customComponents/CustomButton";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    setWishList([...productList, ...supplements, ...proteinList]);
  }, []);

  // Filter items in cart
  const cartItems = wishList.filter((item) => item.inCart);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const [buttonClick, setButtonClick] = useState(false);
  const [orderSuccessPage, setOrderSuccessPage] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setOrderSuccessPage(true);
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }, 5000);
  }, [buttonClick, navigate]);

  // JSX
  return (
    <Box>
      {buttonClick ? (
        orderSuccessPage ? (
          <Box
            sx={{
              height: "calc(100vh - 116px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <CustomTypography
              value="Order Placed Successfully!"
              sx={{ fontSize: "20px", fontWeight: 600 }}
              heading={true}
            />
            <br></br>
            <br></br>(We'll assume payment has been made via 3rd party
            packages😊)
            <br></br>
            <br></br>
            Returning to Home Page!
          </Box>
        ) : (
          <Box
            sx={{
              height: "calc(100vh - 116px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress sx={{ color: theme.yellow }} />
            <br></br>
            Please Wait While We Confirm Your Order!
          </Box>
        )
      ) : (
        <Box
          sx={{
            p: 3,
            maxWidth: 600,
            mx: "auto",
            background: theme.grey,
            borderRadius: 2,
            boxShadow: 3,
            mt: 3,
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
                altText={"Proceed to Payment"}
                buttonText={"Proceed to Payment"}
                sx={{ m: "auto", mt: 10 }}
                onClick={() => setButtonClick(true)}
              />
            </>
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
              Your cart is empty.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Checkout;
