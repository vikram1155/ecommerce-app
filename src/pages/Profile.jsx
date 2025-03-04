import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material";
import { theme } from "../utils/theme";
import {
  getAllProducts,
  getOrdersByUser,
  updateOrderByUser,
  updateProduct,
} from "../apiCalls/api";
import CustomButton from "../customComponents/CustomButton";
import { showSnackbar } from "../redux/snackbarSlice";
import { useDispatch } from "react-redux";

function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const currentUser = JSON.parse(localStorage.getItem("userinfo"));
  const [orderHistoryList, setOrderHistoryList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const getOrdersByUserFn = async () => {
      try {
        const response = await getOrdersByUser(currentUser?.userId);
        if (response?.status?.code === 200) {
          setOrderHistoryList(response?.data);
        }
      } catch (error) {
        dispatch(showSnackbar(`Error getting orders`));
      }
    };
    getOrdersByUserFn();
  }, [currentUser?.userId, dispatch]);

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
  }, []);

  const handleOpenRatingDialog = (productId) => {
    const product = allProducts.find((p) => p.productId === productId);
    if (product) {
      setSelectedProduct(product);
      setOpenRatingDialog(true);
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedProduct || ratingValue === 0) return;

    const updatedRatings =
      (selectedProduct.ratings * selectedProduct.no_of_ratings + ratingValue) /
      (selectedProduct.no_of_ratings + 1);

    const updatedData = {
      ratings: parseFloat(updatedRatings.toFixed(1)),
      no_of_ratings: selectedProduct.no_of_ratings + 1,
    };

    try {
      await updateProduct(selectedProduct.productId, updatedData);
      setAllProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.productId === selectedProduct.productId
            ? { ...p, ...updatedData }
            : p
        )
      );

      // Update order status to "Reviewed"
      const orderToUpdate = orderHistoryList?.ordersList?.find(
        (order) => order.productId === selectedProduct.productId
      );

      if (orderToUpdate) {
        await updateOrderByUser(currentUser?.userId, orderToUpdate.orderId, {
          ...orderToUpdate,
          status: "Reviewed",
        });

        setOrderHistoryList((prevOrders) => ({
          ...prevOrders,
          ordersList: prevOrders.ordersList.map((order) =>
            order.orderId === orderToUpdate.orderId
              ? { ...order, status: "Reviewed" }
              : order
          ),
        }));
      }

      dispatch(showSnackbar("Rating Sumbitted!"));
      setOpenRatingDialog(false);
    } catch (error) {
      console.error("Failed to update product rating", error);
    }
  };

  // JSX
  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        centered
        sx={{
          mb: 2,
          "& .MuiTabs-indicator": { backgroundColor: theme.yellow },
          "& .MuiTabs-flexContainer": {
            gap: { xs: 3, sm: 8 },
          },
        }}
      >
        <Tab
          sx={{
            color: theme.white,
            fontSize: "14px",
            fontWeight: 600,
            "&.Mui-selected": {
              color: theme.yellow,
            },
          }}
          label="Account Info"
        />
        <Tab
          sx={{
            color: theme.white,
            fontSize: "14px",
            fontWeight: 600,
            "&.Mui-selected": {
              color: theme.yellow,
            },
          }}
          label="Order History"
        />
      </Tabs>
      <br></br>

      {/* Tab Panels */}
      {activeTab === 0 && (
        <Card sx={{ boxShadow: 3, backgroundColor: theme.grey }}>
          <CardContent sx={{ textAlign: "center", p: 0 }}>
            {Object.entries(currentUser)
              .filter(
                ([key]) =>
                  key !== "userId" &&
                  key !== "admin" &&
                  key !== "favorites" &&
                  key !== "password" &&
                  key !== "_id"
              )
              .map(([key, value], index) => (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 3,
                  }}
                  key={`${key}-${index}`}
                >
                  <Typography
                    sx={{
                      textTransform: "capitalize",
                      color: theme.white,
                    }}
                  >
                    <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>
                  </Typography>

                  <Typography
                    sx={{
                      color: theme.white,
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
        <Box sx={{ boxShadow: 2, borderRadius: 2, background: theme.grey }}>
          <List
            sx={{
              "&.MuiList-root": {
                maxHeight: "calc(100vh - 250px)",
                overflow: "scroll",
              },
            }}
          >
            {orderHistoryList?.ordersList?.length ? (
              orderHistoryList.ordersList
                .sort(
                  (a, b) =>
                    new Date(b.orderedOnDate) - new Date(a.orderedOnDate)
                )
                .map((order, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      sx={{
                        p: { xs: 2, sm: 3 },
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: theme.yellow }}
                        >
                          <strong>{order.productName}</strong> (x
                          {order.quantity})
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.white }}>
                          ₹{order.costWhenOrdered} | Ordered on:{" "}
                          {new Date(order.orderedOnDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                        {order.status === "Completed" && (
                          <CustomButton
                            buttonText="Rate Product"
                            onClick={() =>
                              handleOpenRatingDialog(order.productId)
                            }
                            sx={{ mt: 2 }}
                          />
                        )}
                      </Box>
                      <Box>
                        <span
                          style={{
                            color:
                              order.status === "Completed" ? "green" : "orange",
                          }}
                        >
                          <CustomButton
                            buttonText={`${order.status} ${
                              order.status === "Completed"
                                ? "✅"
                                : order.status === "In Progress"
                                ? "🔜"
                                : "⭐"
                            }`}
                            sx={{ mt: 2, width: "120px" }}
                            disabled
                          />
                        </span>
                      </Box>
                    </ListItem>
                    {index < orderHistoryList?.ordersList?.length - 1 && (
                      <Divider sx={{ bgcolor: theme.white }} />
                    )}
                  </React.Fragment>
                ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center", my: 3 }}>
                No Orders Placed Yet!
              </Typography>
            )}
          </List>
        </Box>
      )}

      <Dialog
        open={openRatingDialog}
        onClose={() => setOpenRatingDialog(false)}
        sx={{
          "& .MuiPaper-root": {
            minWidth: "350px",
          },
          "& .MuiDialog-paper": { backgroundColor: theme.darkGrey },
        }}
      >
        <DialogTitle sx={{ color: theme.white, fontSize: "14px" }}>
          Rate Product - {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <Rating
            name="product-rating"
            value={ratingValue}
            onChange={(event, newValue) => setRatingValue(newValue)}
            sx={{ "& .MuiSvgIcon-root": { color: theme.yellow } }}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton
            buttonText="Cancel"
            onClick={() => setOpenRatingDialog(false)}
          />
          <CustomButton
            buttonText="Rate Product"
            onClick={handleSubmitRating}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
