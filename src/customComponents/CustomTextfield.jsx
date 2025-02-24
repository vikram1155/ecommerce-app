import React from "react";
import { TextField } from "@mui/material";
import { theme } from "../utils/theme";

const CustomTextField = ({ label, name, value, onChange, sx, ...props }) => {
  return (
    <TextField
      margin="normal"
      size="small"
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={{
        ...sx,
        backgroundColor: theme.darkGrey,
        borderRadius: "4px",
        "& .MuiOutlinedInput-input": {
          color: `${theme.white} !important`,
        },
        "& .MuiInputLabel-root": {
          color: `${theme.white} !important`,
        },
        "& .MuiInputLabel-outlined": {
          color: `${theme.white} !important`,
        },
        "& .Mui-disabled": {
          color: `${theme.white} !important`,
          WebkitTextFillColor: `${theme.white} !important`,
          opacity: "0.5",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: `${theme.darkGrey} !important`,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: `${theme.darkGrey} !important`,
        },
        "& input:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 1000px ${theme.darkGrey} inset`,
          WebkitTextFillColor: `${theme.white}`,
          transition: "background-color 5000s ease-in-out 0s",
        },
        "& input:-internal-autofill-selected": {
          appearance: "none",
          backgroundColor: "transparent !important",
          color: "#000 !important",
        },
      }}
      {...props}
      s
    />
  );
};

export default CustomTextField;
