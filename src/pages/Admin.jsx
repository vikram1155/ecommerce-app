import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Modal,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import CustomButton from "../customComponents/CustomButton";
import CreateProduct from "../components/CreateProduct";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";
import { deleteProduct, getAllOrders, getAllProducts } from "../apiCalls/api";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ManageOrders from "./ManageOrders";

function Admin() {
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    weight: "",
    category: "",
    price: "",
    ratings: "",
    no_of_ratings: "",
    description: "",
    offer: "",
    features: "",
    protein: "",
    carbs: "",
    fat: "",
    veg_nonveg: "",
    etd: "",
    type: "",
  });

  const [productsFromApi, setProductsFromApi] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [type, setType] = useState("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    const getAllProductsFn = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setProductsFromApi(response.data);
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
  }, [openModal]);

  useEffect(() => {
    const getAllOrdersFn = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const response = await getAllOrders();
        if (response?.data) {
          setAllOrders(response.data);
        } else {
          setAllOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrdersError("Some error occurred while fetching orders");
      } finally {
        setOrdersLoading(false);
      }
    };
    getAllOrdersFn();
  }, [openModal]);

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProductsFromApi((prev) =>
        prev.filter((p) => p.productId !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductData({
      name: "",
      weight: "",
      category: "",
      price: "",
      ratings: "",
      no_of_ratings: "",
      description: "",
      offer: "",
      features: "",
      protein: "",
      carbs: "",
      fat: "",
      veg_nonveg: "",
      etd: "",
      type: "",
    });
    setSelectedProduct([]);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
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
          label="Manage Products"
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
          label="Manage Orders"
        />
      </Tabs>

      {tabIndex === 0 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 4,
            }}
          >
            <CustomTypography
              heading={false}
              value={"Create and Update Products"}
              sx={{ fontSize: "16px", fontWeight: 600, color: theme.yellow }}
            />
            <CustomButton
              buttonText={"Add New Product"}
              variant={"contained"}
              onClick={() => {
                setOpenModal(true);
                setType("create");
              }}
            />
          </Box>

          <Box sx={{ boxShadow: 2, borderRadius: 2, background: theme.grey }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: theme.yellow }} />
              </Box>
            ) : error ? (
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
                  {error}
                </Typography>
              </Box>
            ) : productsFromApi.length ? (
              <List
                sx={{
                  "&.MuiList-root": {
                    maxHeight: "calc(100vh - 350px)",
                    overflow: "scroll",
                  },
                }}
              >
                {productsFromApi.map((product, index) => (
                  <React.Fragment key={product.id || index}>
                    <ListItem
                      key={product.productId || index}
                      sx={{
                        p: 3.5,
                        pt: 2,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: theme.white }}
                        >
                          <strong>{product.name}</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ color: theme.white }}
                        >
                          ₹{product.price} | Offer: {product.offer}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <IconButton
                          onClick={() => {
                            setOpenModal(true);
                            setType("update");
                            setSelectedProduct(
                              productsFromApi.find(
                                (productFromApi) =>
                                  productFromApi.productId === product.productId
                              )
                            );
                          }}
                        >
                          <EditRoundedIcon sx={{ color: theme.yellow }} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(product.productId)}
                        >
                          <DeleteForeverRoundedIcon
                            sx={{ color: theme.yellow }}
                          />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < productsFromApi.length - 1 && (
                      <Divider sx={{ bgcolor: theme.white }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
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
                  No Products available!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          {ordersLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: theme.yellow }} />
            </Box>
          ) : ordersError ? (
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
                {ordersError}
              </Typography>
            </Box>
          ) : (
            <ManageOrders allOrders={allOrders} setAllOrders={setAllOrders} />
          )}
        </Box>
      )}

      {openModal && (
        <Modal open={openModal} onClose={handleCloseModal}>
          <CreateProduct
            productData={type === "create" ? productData : selectedProduct}
            setProductData={
              type === "create" ? setProductData : setSelectedProduct
            }
            handleCloseModal={handleCloseModal}
            type={type}
          />
        </Modal>
      )}
    </Box>
  );
}

export default Admin;
