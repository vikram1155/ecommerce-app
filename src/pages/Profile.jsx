import React, { useState } from "react";
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
} from "@mui/material";
import { theme } from "../utils/theme";

const accountInfo = {
  name: "John Doe",
  id: "JD12345",
  email: "johndoe@example.com",
  age: 28,
  phone: "+1 234 567 890",
};

const orderHistory = [
  {
    id: 1,
    productName: "Whey Protein",
    quantity: 2,
    price: 2000,
    orderedOn: "2024-02-10",
    status: "Completed",
  },
  {
    id: 2,
    productName: "Creatine Monohydrate",
    quantity: 1,
    price: 1500,
    orderedOn: "2024-02-08",
    status: "In Progress",
  },
  {
    id: 3,
    productName: "Multivitamins",
    quantity: 3,
    price: 900,
    orderedOn: "2024-02-05",
    status: "Completed",
  },
  {
    id: 4,
    productName: "BCAA",
    quantity: 1,
    price: 1200,
    orderedOn: "2024-02-03",
    status: "Completed",
  },
];

function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        centered
        sx={{
          mb: 2,
          "& .MuiTabs-indicator": {
            backgroundColor: theme.yellow,
          },
          "& .MuiTabs-flexContainer": {
            gap: { xs: 3, sm: 8 },
          },
        }}
      >
        <Tab
          sx={{
            color: theme.white,
            fontSize: "14px",
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
            {Object.entries(accountInfo).map(([key, value]) => (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", p: 3 }}
              >
                <Typography
                  key={key}
                  sx={{ textTransform: "capitalize", color: theme.white }}
                >
                  <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>
                </Typography>

                <Typography
                  key={key}
                  sx={{ textTransform: "capitalize", color: theme.white }}
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
          <List>
            {orderHistory.map((order, index) => (
              <React.Fragment key={order.id}>
                <ListItem
                  sx={{
                    p: 3,
                    pb: 3.5,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ color: theme.white }}>
                      <strong>{order.productName}</strong> (x{order.quantity})
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ color: theme.white }}
                    >
                      ₹{order.price} | Ordered on: {order.orderedOn}
                    </Typography>
                  </Box>
                  <Box>
                    <span
                      style={{
                        color:
                          order.status === "Completed" ? "green" : "orange",
                      }}
                    >
                      {order.status}
                    </span>
                  </Box>
                </ListItem>
                {index < orderHistory.length - 1 && (
                  <Divider sx={{ bgcolor: theme.white }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}

export default Profile;
