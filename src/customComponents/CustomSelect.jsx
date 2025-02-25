import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { theme } from "../utils/theme";

const CustomSelect = ({ label, name, value, onChange, options, ...props }) => {
  return (
    <FormControl fullWidth>
      <InputLabel
        sx={{
          "&.MuiInputLabel-root.Mui-focused": {
            mt: 1,
            color: theme.white,
          },
          "&.MuiInputLabel-root": {
            color: theme.white,
          },
        }}
      >
        {label}
      </InputLabel>
      {options?.length && (
        <Select
          value={value}
          onChange={(e) => onChange(e, name)}
          label={label}
          {...props}
          sx={{
            width: "100%",
            padding: 0,
            "&.MuiInputBase-root": {
              marginTop: "8px",
            },
            "& .MuiSelect-select": {
              p: "8.5px",
              backgroundColor: theme.darkGrey,
              color: theme.white,
            },
            "& .MuiSelect-icon": {
              color: theme.white,
            },
            "& .MuiFormLabel-root": {
              color: theme.darkGrey,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.darkGrey,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.darkGrey,
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default CustomSelect;
