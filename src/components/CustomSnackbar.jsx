import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../redux/snackbarSlice";
import { theme } from "../utils/theme";

const CustomSnackbar = () => {
  const { message, open } = useSelector((state) => state.snackbar);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-message": {
          display: "flex",
          justifyContent: "center",
          color: theme.yellow,
          fontWeight: 600,
          //   width: "100%",
        },
        "& .MuiSnackbarContent-root": {
          minWidth: "fit-content",
          px: "40px",
        },
      }}
    />
  );
};

export default CustomSnackbar;
