import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomButton from "../customComponents/CustomButton";
import CreateProduct from "../components/CreateProduct";
import CustomTypography from "../customComponents/CustomTypography";
import { theme } from "../utils/theme";
import { deleteProduct, getAllProducts } from "../apiCalls/api";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

function Admin() {
  // Modal
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

  //   Get all products
  const [productsFromApi, setProductsFromApi] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [type, setType] = useState("create");

  useEffect(() => {
    const getAllProductsFn = async () => {
      try {
        const response = await getAllProducts();
        if (response?.data) {
          setProductsFromApi(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProductsFn();
  }, [openModal]);

  const handleDelete = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      window.location.reload();
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
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 4,
        }}
      >
        <CustomTypography
          heading={true}
          value={"Manage Products - Admin Access"}
          sx={{ fontSize: "18px", fontWeight: 600 }}
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

      <Box>
        <Box sx={{ boxShadow: 2, borderRadius: 2, background: theme.grey }}>
          <List>
            {productsFromApi.map((product, index) => (
              <React.Fragment key={product.id}>
                <ListItem
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
                    <Typography variant="subtitle1" sx={{ color: theme.white }}>
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
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <IconButton
                      onClick={() => {
                        setOpenModal(true);
                        setType("update");
                        setSelectedProduct(
                          productsFromApi.filter(
                            (productFromApi) =>
                              productFromApi.productId === product.productId
                          )[0]
                        );
                      }}
                    >
                      <EditRoundedIcon sx={{ color: theme.yellow }} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(product.productId);
                      }}
                    >
                      <DeleteForeverRoundedIcon sx={{ color: theme.yellow }} />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < productsFromApi.length - 1 && (
                  <Divider sx={{ bgcolor: theme.white }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>

      {openModal && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          sx={{ alignContent: "center" }}
        >
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
