import { useEffect } from "react";
import { postProduct, updateProduct } from "../apiCalls/api";
import { Box, IconButton } from "@mui/material";
import { theme } from "../utils/theme";
import CustomTypography from "../customComponents/CustomTypography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CustomTextField from "../customComponents/CustomTextfield";
import CustomButton from "../customComponents/CustomButton";
import CustomSelect from "../customComponents/CustomSelect";

const productFields = {
  common: [
    { name: "name", label: "Product Name" },
    { name: "weight", label: "Weight" },
    { name: "category", label: "Category" },
    { name: "price", label: "Price", type: "number" },
    { name: "ratings", label: "Ratings", type: "number" },
    { name: "no_of_ratings", label: "Number of Ratings", type: "number" },
    { name: "description", label: "Description" },
    { name: "offer", label: "Offer (%)", type: "number" },
    { name: "features", label: "Features" },
    { name: "etd", label: "Estimated Delivery Time", type: "number" },
  ],
  supplements: [
    { name: "protein", label: "Protein", type: "number" },
    { name: "carbs", label: "Carbs", type: "number" },
    { name: "fat", label: "Fat", type: "number" },
  ],
  proteinFoods: [
    { name: "protein", label: "Protein", type: "number" },
    { name: "carbs", label: "Carbs", type: "number" },
    { name: "fat", label: "Fat", type: "number" },
    { name: "veg_nonveg", label: "Veg/Non-Veg" },
  ],
};

const typeOptions = ["Equipments", "Supplements", "Protein-Foods"];

const CreateProduct = ({
  productData,
  setProductData,
  handleCloseModal,
  type,
}) => {
  useEffect(() => {
    if (productData.type === "Equipments") {
      setProductData((prev) => ({
        ...prev,
        protein: null,
        carbs: null,
        fat: null,
        veg_nonveg: null,
      }));
    }
    if (productData.type === "Supplements") {
      setProductData((prev) => ({
        ...prev,
        veg_nonveg: null,
      }));
    }
  }, [productData.type]);

  const handleInputChange = (e, name) => {
    setProductData({ ...productData, [name || e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalProductData = {
      ...productData,
      ...(productData.type === "Equipments" && {
        protein: 0,
        carbs: 0,
        fat: 0,
        veg_nonveg: "null",
      }),
      ...(productData.type === "Supplements" && {
        veg_nonveg: "null",
      }),
    };

    try {
      const response =
        type === "create"
          ? await postProduct(finalProductData)
          : await updateProduct(finalProductData.productId, finalProductData);

      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${type === "create" ? "creating" : "updating"} product:`,
        error
      );
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <CustomTypography
            heading
            value={type === "create" ? "Create Product" : "Update Product"}
            sx={{ fontSize: "18px", fontWeight: 600 }}
          />
          <IconButton onClick={handleCloseModal}>
            <CloseRoundedIcon sx={{ color: theme.yellow }} />
          </IconButton>
        </Box>

        {productFields.common.map(({ name, label, type }) => (
          <CustomTextField
            key={name}
            label={label}
            name={name}
            value={productData[name] || ""}
            onChange={handleInputChange}
            required
          />
        ))}
        <CustomSelect
          label="Type"
          name="type"
          value={productData.type}
          onChange={handleInputChange}
          options={typeOptions}
        />

        {productData.type === "Supplements" &&
          productFields.supplements.map(({ name, label, type }) => (
            <CustomTextField
              key={name}
              label={label}
              name={name}
              value={productData[name] || ""}
              onChange={handleInputChange}
              required
            />
          ))}

        {productData.type === "Protein-Foods" &&
          productFields.proteinFoods.map(({ name, label }) => (
            <CustomTextField
              key={name}
              label={label}
              name={name}
              value={productData[name] || ""}
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
          background: "#000",
          padding: "12px 24px",
          left: "0",
          zIndex: 2,
        }}
      >
        <CustomButton
          variant="contained"
          altText={type === "create" ? "Create Product" : "Update Product"}
          buttonText={type === "create" ? "Create Product" : "Update Product"}
          onClick={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default CreateProduct;
