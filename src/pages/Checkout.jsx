import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";
import CustomButton from "../customComponents/CustomButton";
import { useNavigate } from "react-router-dom";
import { getAllProducts, updateProduct } from "../apiCalls/api";
import { useDispatch } from "react-redux";
import {
  setProductsRedux,
  updateProductRedux,
} from "../redux/allProductsSlice";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setCartItems(response.data.filter((item) => item.inCart));
          dispatch(setProductsRedux(response.data));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [dispatch]);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const [buttonClick, setButtonClick] = useState(false);
  const [orderSuccessPage, setOrderSuccessPage] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const updatePromises = cartItems.map(async (cartItem) => {
        let updatedData = {
          ...cartItem,
          inCart: false,
        };

        try {
          await updateProduct(cartItem.productId, updatedData);
          dispatch(updateProductRedux(cartItem.productId, updatedData));
        } catch (error) {
          console.error(
            `Error updating cart item ${cartItem.productId}:`,
            error
          );
        }
      });

      await Promise.all(updatePromises);

      setButtonClick(true);
      setTimeout(() => {
        setOrderSuccessPage(true);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }, 5000);
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

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
                  display={"flex"}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  pt={3}
                >
                  <Box display={"flex"} gap={1} flexDirection={"column"}>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                      <CustomTypography
                        heading={true}
                        value={item.name}
                        sx={{ fontWeight: 400, fontSize: "18px" }}
                      />
                      <CustomTypography
                        heading={true}
                        value={`(${item.category})`}
                        sx={{ fontWeight: 400, fontSize: "18px" }}
                      />
                    </Box>
                    <CustomTypography
                      heading={false}
                      value={`Delivery in ${item.etd} day(s)`}
                      sx={{ fontWeight: 400, fontSize: "16px" }}
                    />
                  </Box>

                  <Box display={"flex"} gap={1} alignItems={"center"}>
                    <CustomTypography
                      heading={false}
                      value={`${item.price + (item.price * item.offer) / 100}`}
                      sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        textDecoration: "line-through",
                        color: "grey !important",
                      }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`₹${item.price}`}
                      sx={{ fontWeight: 400, fontSize: "18px" }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`${item.offer}% Off`}
                      sx={{
                        fontWeight: 400,
                        fontSize: "14px",
                        color: `${theme.yellow} !important`,
                      }}
                    />
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 3,
                  fontWeight: "bold",
                  borderTop: "1px solid #ddd",
                  py: 2,
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
                sx={{ m: "auto", mt: 4 }}
                onClick={handleCheckout}
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
