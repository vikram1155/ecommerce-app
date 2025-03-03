import { Box, Divider, List, ListItem, Typography } from "@mui/material";
import React, { useMemo } from "react";
import CustomTypography from "../customComponents/CustomTypography";
import CustomButton from "../customComponents/CustomButton";
import { theme } from "../utils/theme";
import { updateOrderByUser } from "../apiCalls/api";

function ManageOrders({ allOrders, setAllOrders }) {
  const modifiedOrders = useMemo(() => {
    return allOrders.flatMap(({ userId, ordersList }) =>
      ordersList.map((order) => {
        return { ...order, userId };
      })
    );
  }, [allOrders]);

  const handleCompleteOrder = async (userId, orderId) => {
    try {
      const updatedOrders = allOrders.map((user) =>
        user.userId === userId
          ? {
              ...user,
              ordersList: user.ordersList.map((order) =>
                order.orderId === orderId
                  ? { ...order, status: "Completed" }
                  : order
              ),
            }
          : user
      );

      const updatedOrder = modifiedOrders.find((o) => o.orderId === orderId);
      if (!updatedOrder) return;

      const resp = await updateOrderByUser(userId, orderId, {
        ...updatedOrder,
        status: "Completed",
      });

      if (resp.status.code === 200) {
        setAllOrders(updatedOrders);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <Box>
      {/* Header Section */}

      {modifiedOrders.length ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: "38px",
              pb: 4,
            }}
          >
            <CustomTypography
              heading={false}
              value="Manage Orders"
              sx={{ fontSize: "16px", fontWeight: 600, color: theme.yellow }}
            />
          </Box>

          {/* Orders List */}
          <Box sx={{ boxShadow: 2, borderRadius: 2, background: theme.grey }}>
            <List
              sx={{
                p: 0,
                "&.MuiList-root": {
                  maxHeight: "calc(100vh - 350px)",
                  overflow: "scroll",
                },
              }}
            >
              {modifiedOrders.map((order, index) => (
                <React.Fragment key={order.orderId}>
                  <ListItem
                    sx={{
                      p: { xs: 2, sm: 3.5 },
                      pt: 2,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {/* Order Details */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: theme.white }}
                      >
                        <strong>{order.productName}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.white }}>
                        ₹{order.costWhenOrdered} | Quantity: {order.quantity}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.white }}>
                        Ordered On:{" "}
                        {new Date(order.orderedOnDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}{" "}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      {order.status === "In Progress" ? (
                        <CustomButton
                          buttonText="Click to Complete the Order"
                          onClick={() =>
                            handleCompleteOrder(order.userId, order.orderId)
                          }
                        />
                      ) : (
                        <CustomButton buttonText="Completed ✅" />
                      )}
                    </Box>
                  </ListItem>

                  {/* Divider Between Items */}
                  {index < modifiedOrders.length - 1 && (
                    <Divider sx={{ bgcolor: theme.white }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            padding: "10px 40px 35px",
            maxWidth: 600,
            mx: "auto",
            background: theme.grey,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="body1" sx={{ textAlign: "center", mt: 3 }}>
            No orders placed yet!
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ManageOrders;
