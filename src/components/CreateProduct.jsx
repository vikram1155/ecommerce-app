import { postProduct, updateProduct } from "../apiCalls/api";
import { Box, IconButton } from "@mui/material";
import { theme } from "../utils/theme";
import CustomTypography from "../customComponents/CustomTypography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CustomTextField from "../customComponents/CustomTextfield";
import CustomButton from "../customComponents/CustomButton";

const productFields = [
  { name: "name", label: "Product Name" },
  { name: "weight", label: "Weight" },
  { name: "category", label: "Category" },
  { name: "price", label: "Price", type: "number" },
  { name: "ratings", label: "Ratings", type: "number" },
  { name: "no_of_ratings", label: "Number of Ratings", type: "number" },
  { name: "description", label: "Description" },
  { name: "offer", label: "Offer (%)", type: "number" },
  { name: "features", label: "Features" },
  { name: "protein", label: "Protein", type: "number" },
  { name: "carbs", label: "Carbs", type: "number" },
  { name: "fat", label: "Fat", type: "number" },
  { name: "veg_nonveg", label: "Veg/Non-Veg" },
  { name: "etd", label: "Estimated Delivery Time", type: "number" },
  { name: "type", label: "Type" },
];

const CreateProduct = ({
  productData,
  setProductData,
  handleCloseModal,
  type,
}) => {
  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "create") {
      try {
        const response = await postProduct(productData);
        console.log("Product Created:", response);
        handleCloseModal();
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
    if (type === "update") {
      try {
        const response = await updateProduct(
          productData.productId,
          productData
        );
        console.log("Product Created:", response);
        handleCloseModal();
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        mx: "auto",
        mt: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: theme.grey,
        height: "525px",
        overflowY: "scroll",
        maxWidth: "400px",
        margin: "auto",
        position: "relative",
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <CustomTypography
            heading={true}
            value={type === "create" ? "Create Product" : "Update Product"}
            sx={{ fontSize: "18px", fontWeight: 600 }}
          />
          <IconButton onClick={handleCloseModal}>
            <CloseRoundedIcon sx={{ color: theme.yellow }} />
          </IconButton>
        </Box>

        {productFields.map(({ name, label, type }) => (
          <CustomTextField
            label={label}
            name={name}
            value={productData[name]}
            onChange={handleInputChange}
            required
          />
        ))}
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: "0",
          width: "calc(100% - 48px)",
          margin: "0",
          justifyItems: "center",
          background: "#000",
          padding: "12px 24px",
          left: "0",
          zIndex: 2,
        }}
      >
        <CustomButton
          variant={"contained"}
          altText={type === "create" ? "Create Product" : "Update Product"}
          buttonText={type === "create" ? "Create Product" : "Update Product"}
          onClick={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default CreateProduct;
