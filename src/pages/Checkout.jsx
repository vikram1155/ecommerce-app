import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";
import CustomButton from "../customComponents/CustomButton";
import { useNavigate } from "react-router-dom";
import {
  clearCartByUser,
  getAllProducts,
  getProductsInCartByUser,
  postOrdersByUser,
  removeCartItem,
} from "../apiCalls/api";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsInCart, setProductsInCart] = useState([]);
  const [buttonClick, setButtonClick] = useState(false);
  const [orderSuccessPage, setOrderSuccessPage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("userinfo"));
  const isMobile = useMediaQuery("(max-width: 550px)");

  // Utils
  const totalPrice = productsInCart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalPriceOffer = productsInCart.reduce(
    (sum, item) =>
      sum + item.quantity * Math.round(item.price / ((100 - item.offer) / 100)),
    0
  );

  // UseEffects
  // GET cart items
  useEffect(() => {
    const getProductsInCartByUserFn = async () => {
      try {
        const allCartProducts = await getProductsInCartByUser(
          currentUser?.userId
        );
        setCartItems(allCartProducts?.data);
      } catch (error) {
        dispatch(showSnackbar("Error fetching cart details"));
      }
    };
    getProductsInCartByUserFn();
  }, [currentUser?.userId, dispatch]);

  // GET all products available
  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setAllProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [dispatch]);

  useEffect(() => {
    if (!cartItems?.productsInCart || !allProducts) return;

    const quantityMap = new Map();
    cartItems.productsInCart.forEach((item) => {
      quantityMap.set(item.productId, item.quantity);
    });

    const updatedProducts = allProducts
      .filter((product) => quantityMap.has(product.productId))
      .map((product) => ({
        ...product,
        quantity: quantityMap.get(product.productId) || 0,
      }));

    setProductsInCart(updatedProducts);
  }, [cartItems, allProducts]);

  // Handlers
  const handleCheckout = async () => {
    try {
      let cartList = [];
      productsInCart.forEach((product) => {
        cartList.push({
          status: "In Progress",
          orderedOnDate: new Date(),
          costWhenOrdered: product.price,
          productId: product.productId,
          productName: product.name,
          quantity: product.quantity,
        });
      });

      // CREATE Order for an user
      const response = await postOrdersByUser({
        userId: currentUser?.userId,
        ordersList: cartList,
      });

      if (response.status.code === 200) {
        try {
          const response = await clearCartByUser({
            userId: currentUser?.userId,
            userEmail: currentUser?.email,
            productsInCart: [],
          });
          if (response.status.code === 200) {
            setButtonClick(true);
            setTimeout(() => {
              setOrderSuccessPage(true);
              setTimeout(() => {
                navigate("/");
              }, 5000);
            }, 5000);
          }
        } catch (error) {
          console.error("Failed to empty cart", error);
        }
      }
    } catch (error) {
      console.error("Error during checkout", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      // UPDATE cart items after removing an item
      const response = await removeCartItem(currentUser.userId, id);
      if (response.status.code === 200) {
        dispatch(showSnackbar("Product Removed from Cart!"));

        setProductsInCart(productsInCart.filter((p) => p.productId !== id));
      }
    } catch (error) {
      dispatch(showSnackbar(`Error removing item from cart: ${error}`));
    }
  };

  // JSX
  return (
    <Box>
      <CustomTypography
        heading
        value="Checkout"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          padding: "30px 0 50px",
          fontSize: "14px",
        }}
      />
      {buttonClick ? (
        orderSuccessPage ? (
          <Box
            sx={{
              height: "calc(100vh - 280px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <CustomTypography
              value="Order Placed Successfully!"
              sx={{ fontSize: "18px", fontWeight: 600 }}
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
              height: "calc(100vh - 280px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
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
            padding: { xs: "10px 16px 35px", sm: "10px 40px 35px" },
            maxWidth: 600,
            mx: "auto",
            background: theme.grey,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {productsInCart?.length > 0 ? (
            <>
              {productsInCart?.map((item, index) => (
                <Box
                  display={"flex"}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  py={3}
                  key={index}
                >
                  <Box display={"flex"} gap={1} flexDirection={"column"}>
                    <Box
                      display={"flex"}
                      gap={1}
                      alignItems={isMobile ? "flex-start" : "center"}
                      flexDirection={isMobile ? "column" : "row"}
                    >
                      <CustomTypography
                        heading={true}
                        value={item.name}
                        sx={{ fontWeight: 400, fontSize: "14px" }}
                      />

                      <CustomTypography
                        heading={false}
                        value={`x ${item.quantity} item(s)`}
                        sx={{ fontWeight: 400, fontSize: "12px" }}
                      />
                    </Box>
                    {/* <CustomTypography
                      heading={true}
                      value={`(${item.category})`}
                      sx={{ fontWeight: 400, fontSize: "14px" }}
                    /> */}
                    <Chip
                      label={item.category}
                      sx={{
                        backgroundColor: theme.yellow,
                        color: "#000",
                        fontWeight: "bold",
                        width: "fit-content",
                      }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`Delivery in ${item.etd} day(s)`}
                      sx={{ fontWeight: 400, fontSize: "14px" }}
                    />
                    <CustomButton
                      variant="contained"
                      altText={"Remove Item"}
                      buttonText={"Remove Item"}
                      onClick={() => handleRemoveItem(item.productId)}
                      sx={{ width: "fit-content", mt: 1 }}
                    />
                  </Box>

                  <Box
                    display={"flex"}
                    gap={1}
                    alignItems={"center"}
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <CustomTypography
                      heading={false}
                      value={`${Math.round(
                        item.price / ((100 - item.offer) / 100)
                      )}`}
                      sx={{
                        fontWeight: 400,
                        fontSize: "12px",
                        textDecoration: "line-through",
                        color: "grey !important",
                      }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`₹${item.quantity * item.price}`}
                      sx={{ fontWeight: 400, fontSize: "16px" }}
                    />
                    <CustomTypography
                      heading={false}
                      value={`${item.offer}% Off`}
                      sx={{
                        fontWeight: 400,
                        fontSize: "12px",
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
                <Box display={"flex"} gap={1} alignItems={"center"}>
                  <CustomTypography
                    heading={false}
                    value={totalPriceOffer}
                    sx={{
                      fontWeight: 400,
                      fontSize: "12px",
                      textDecoration: "line-through",
                      color: "grey !important",
                    }}
                  />
                  <CustomTypography heading={false} value={`₹ ${totalPrice}`} />
                </Box>
              </Box>
              <CustomButton
                variant="contained"
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
