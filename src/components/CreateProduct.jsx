import { useEffect, useState } from "react";
import { postProduct, updateProduct } from "../apiCalls/api";
import { Box, IconButton } from "@mui/material";
import { theme } from "../utils/theme";
import CustomTypography from "../customComponents/CustomTypography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CustomTextField from "../customComponents/CustomTextfield";
import CustomButton from "../customComponents/CustomButton";
import CustomSelect from "../customComponents/CustomSelect";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/snackbarSlice";

const productFields = {
  common: [
    { name: "name", label: "Product Name" },
    { name: "weight", label: "Weight" },
    { name: "category", label: "Category" },
    { name: "price", label: "Price", type: "number" },
    { name: "image", label: "Paste Image URL" },
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
  const [validations, setValidations] = useState("");

  const dispatch = useDispatch();

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
  }, [productData.type, setProductData]);

  const handleInputChange = (e, name) => {
    setProductData({ ...productData, [name || e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Compute finalProductData first
    const finalProductData = {
      ...productData,
      ...(productData.type === "Protein-Foods" && {
        ratings: 0,
        no_of_ratings: 0,
      }),
      ...(productData.type === "Equipments" && {
        protein: 0,
        carbs: 0,
        fat: 0,
        veg_nonveg: "null",
        ratings: 0,
        no_of_ratings: 0,
      }),
      ...(productData.type === "Supplements" && {
        veg_nonveg: "null",
        ratings: 0,
        no_of_ratings: 0,
      }),
    };

    const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[^\s]*$/;

    let errors = {};

    const allFields = [
      ...productFields.common,
      ...(productFields[finalProductData.type.toLowerCase().replace("-", "")] ||
        []),
    ];

    allFields.forEach(({ name, type }) => {
      const value = finalProductData[name];

      if (!value && value !== 0) {
        errors[name] = `${name.replace("_", " ")} is required`;
      } else if (type === "string" && typeof value !== "string") {
        errors[name] = `${name.replace("_", " ")} should be a string`;
      } else if (type === "number" && (isNaN(value) || value === "")) {
        errors[name] = `${name.replace("_", " ")} should be a number`;
      }
      if (name === "image" && !urlRegex.test(value)) {
        errors[name] = "Invalid image URL";
      }
    });

    if (["Protein-Foods", "Supplements"]?.includes(productData.type)) {
      ["protein", "carbs", "fat"].forEach((key) => {
        if (
          finalProductData[key] === "" ||
          finalProductData[key] === null ||
          isNaN(finalProductData[key])
        ) {
          errors[key] = `${key} should be a valid number`;
        }
      });
    }

    if (productData.type === "Protein-Foods") {
      if (!["Veg", "Non-Veg"]?.includes(finalProductData.veg_nonveg)) {
        errors["veg_nonveg"] =
          "Veg/Non-Veg should be either 'Veg' or 'Non-Veg'";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidations(errors);
      return;
    }

    setValidations({});

    try {
      const response =
        type === "create"
          ? await postProduct(finalProductData)
          : await updateProduct(finalProductData.productId, finalProductData);
      if (response.status.code === 200 || response.status.code === 201) {
        dispatch(
          showSnackbar(
            type === "create"
              ? "Product Created Sucessfully!"
              : "Product Updated Sucessfully!"
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      console.error(
        `Error ${type === "create" ? "creating" : "updating"} product:`,
        error
      );
    }
  };

  // JSX
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
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: theme.black2,
        height: "525px",
        overflowY: "scroll",
        maxWidth: "400px",
        margin: "auto",
        position: "absolute",
        left: "50%",
        top: "50%",
        WebkitTransform: "translate(-50%, -50%)",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <CustomTypography
            heading
            value={type === "create" ? "Create Product" : "Update Product"}
            sx={{ fontSize: "14px", fontWeight: 600 }}
          />
          <IconButton onClick={handleCloseModal}>
            <CloseRoundedIcon sx={{ color: theme.yellow }} />
          </IconButton>
        </Box>

        {productFields.common.map(({ name, label, type }) =>
          name === "offer" ? (
            <CustomSelect
              label="Offer"
              name="offer"
              value={productData.offer}
              onChange={handleInputChange}
              options={[10, 20, 30, 40]}
              required
            />
          ) : (
            <CustomTextField
              key={name}
              label={label}
              name={name}
              value={productData[name] || ""}
              onChange={handleInputChange}
              required
            />
          )
        )}
        <CustomSelect
          label="Type"
          name="type"
          value={productData.type}
          onChange={handleInputChange}
          options={typeOptions}
          required
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
          productFields.proteinFoods.map(({ name, label }) =>
            name === "veg_nonveg" ? (
              <CustomSelect
                key={name}
                label={label}
                name={name}
                value={productData.veg_nonveg}
                onChange={handleInputChange}
                options={["Veg", "Non Veg"]}
                required
              />
            ) : (
              <CustomTextField
                key={name}
                label={label}
                name={name}
                value={productData[name] || ""}
                onChange={handleInputChange}
                required
              />
            )
          )}
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CustomButton
          variant="contained"
          altText={type === "create" ? "Create Product" : "Update Product"}
          buttonText={type === "create" ? "Create Product" : "Update Product"}
          onClick={handleSubmit}
          sx={{ justifySelf: "center" }}
        />
        {Object.entries(validations).length ? (
          <CustomTypography
            value={`* ${Object.entries(validations)?.[0]?.[1]}`}
            sx={{ fontSize: "10px", color: "red", textTransform: "capitalize" }}
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default CreateProduct;
