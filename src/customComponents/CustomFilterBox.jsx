import {
  Box,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import { theme } from "../utils/theme";
import CustomTypography from "./CustomTypography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const accordionStyles = {
  backgroundColor: theme.black2,
  "& .MuiAccordionSummary-root": { p: 0 },
  "& .MuiAccordionDetails-root": { p: 0 },
};

function CustomFilterBox({ categories, onFilterChange, filters, setFilters }) {
  // Handle Price Slider & Input
  const handlePriceChange = (_, newValue) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue }));
  };

  // Handle Category Checkbox
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  return (
    <Box
      sx={{
        width: 200,
        p: 2,
        backgroundColor: theme.black2,
        borderRight: `0.9px solid ${theme.yellow}`,
        height: "calc(100vh - 140px)",
        position: "fixed",
        overflowY: "scroll",
      }}
    >
      {/* Price Slider */}
      <Box>
        <CustomTypography
          heading={true}
          value={"Price Range"}
          sx={{ fontWeight: 600, fontSize: "12px" }}
        />
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          min={filters.minMax[0]}
          max={filters.minMax[1]}
          valueLabelDisplay="auto"
          sx={{
            mt: 2,
            mb: 3,
            color: theme.yellow,
            "& .MuiSlider-thumb": { height: 12, width: 12 },
            "& .MuiSlider-track": { border: 0 },
            width: "90%",
          }}
        />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${theme.yellow} !important`,
              },
              "& .MuiOutlinedInput-root": {
                color: theme.white,
                p: 0,
                fontSize: "12px",
              },
            }}
            value={filters.priceRange[0]}
            onChange={(e) =>
              handlePriceChange(null, [+e.target.value, filters.priceRange[1]])
            }
          />

          <Typography>-</Typography>

          <TextField
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 1,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: `${theme.yellow} !important`,
              },
              "& .MuiOutlinedInput-root": {
                color: theme.white,
                p: 0,
                fontSize: "12px",
              },
            }}
            value={filters.priceRange[1]}
            onChange={(e) =>
              handlePriceChange(null, [filters.priceRange[0], +e.target.value])
            }
          />
        </Box>
      </Box>

      {/* Category Multi-Select */}
      <Accordion sx={accordionStyles} defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme.yellow }} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <CustomTypography
            heading={true}
            value={"Category"}
            sx={{ fontWeight: 600, fontSize: "12px" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories?.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    value={category}
                    checked={filters.selectedCategories.includes(category)}
                    onChange={handleCategoryChange}
                    sx={{
                      color: theme.white,
                      "&.MuiCheckbox-root.Mui-checked": { color: theme.yellow },
                      svg: {
                        fontSize: "16px",
                      },
                    }}
                  />
                }
                label={category}
                sx={{
                  textTransform: "capitalize",
                  color: theme.white,
                  "& .MuiTypography-root": { fontSize: "12px" },
                }}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Rating Radio Select */}
      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme.yellow }} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <CustomTypography
            heading={true}
            value={"Rating"}
            sx={{ fontWeight: 600, fontSize: "12px" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {["2", "3", "4"].map((rating) => (
            <FormControlLabel
              key={rating}
              control={
                <Checkbox
                  checked={filters.selectedRating === rating}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedRating:
                        prev.selectedRating === rating ? "" : rating,
                    }))
                  }
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: theme.yellow,
                      fontSize: "14px",
                    },
                  }}
                />
              }
              label={`${rating}+ Stars`}
              sx={{
                color: theme.white,
                "& .MuiTypography-root": { fontSize: "12px" },
                "&.MuiFormControlLabel-root": {
                  width: "100%",
                },
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Offer Radio Select */}
      <Accordion sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: theme.yellow }} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <CustomTypography
            heading={true}
            value={"Offers"}
            sx={{ fontWeight: 600, fontSize: "12px" }}
          />
        </AccordionSummary>
        <AccordionDetails>
          {["10%", "20%", "30%"].map((offer) => (
            <FormControlLabel
              key={offer}
              control={
                <Checkbox
                  checked={filters.selectedOffer === offer}
                  onChange={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedOffer: prev.selectedOffer === offer ? "" : offer,
                    }))
                  }
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: theme.yellow,
                      fontSize: "16px",
                    },
                  }}
                />
              }
              label={`${offer} Off`}
              sx={{
                color: theme.white,
                width: "100&",
                "& .MuiTypography-root": { fontSize: "12px" },
                "&.MuiFormControlLabel-root": {
                  width: "100%",
                },
              }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default CustomFilterBox;
