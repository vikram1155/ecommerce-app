import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { theme } from "../utils/theme";
import Arms from "../assets/arms.svg";
import Dumbbells from "../assets/dumbbells.svg";
import WheyProtein from "../assets/whey-protein.svg";
import { useMediaQuery } from "@mui/material";
import { ReactSVG as SVG } from "react-svg";

function Header() {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();

  const ListItemComponent = ({ key, routeTo, svg, heading }) => {
    return (
      <>
        <ListItem
          key={key}
          disablePadding
          onClick={() => navigate(routeTo)}
          sx={{
            pb: 1.5,
            "& .MuiListItemButton-root:hover": {
              backgroundColor: theme.yellow,
              div: {
                "& .MuiTypography-root": {
                  color: theme.black,
                },
                div: {
                  fill: theme.black,
                  color: theme.black,
                },
              },
            },
          }}
        >
          <ListItemButton>
            <ListItemIcon>
              <SVG
                src={svg}
                style={{
                  width: 24,
                  height: 24,

                  fill: location.pathname.startsWith(routeTo)
                    ? theme.yellow
                    : theme.white,
                  color: location.pathname.startsWith(routeTo)
                    ? theme.yellow
                    : theme.white,
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={heading}
              sx={{
                color: location.pathname.startsWith(routeTo)
                  ? theme.yellow
                  : theme.white,
                "& .MuiTypography-body1": {
                  fontWeight: 600,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </>
    );
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key={1} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CloseRoundedIcon
                onClick={toggleDrawer(false)}
                sx={{ color: theme.yellow }}
              />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <Box sx={{ pt: 2 }}></Box>

        <ListItemComponent
          key={"Protein Store"}
          routeTo={"/protein-store"}
          svg={Arms}
          heading={"Protein Store"}
        />
        <ListItemComponent
          key={"Supplements"}
          routeTo={"/supplements"}
          svg={WheyProtein}
          heading={"Supplements"}
        />
        <ListItemComponent
          key={"Equipments"}
          routeTo={"/equipments"}
          svg={Dumbbells}
          heading={"Equipments"}
        />
      </List>
    </Box>
  );

  const HeaderTypoGraphy = ({ routeTo, value }) => {
    return (
      <Typography
        onClick={() => navigate(routeTo)}
        sx={{
          cursor: "pointer",
          color: theme.yellow,
          fontWeight: 600,
          fontSize: location.pathname.startsWith(routeTo) ? "17px" : "16px",
          textDecoration: location.pathname.startsWith(routeTo) && "underline",
          "&.MuiTypography-root:hover": {
            textDecoration: "underline",
            transform: "scale(1.1)",
            transition: "transform 500ms",
          },
        }}
      >
        {value}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.black2,
        padding: "10px 20px",
        color: "white",
        width: "calc(100% - 40px)",
        float: "right",
        position: "fixed",
        top: 0,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
      >
        {isMobile && (
          <MenuRoundedIcon
            sx={{ fontSize: 20, cursor: "pointer", color: theme.yellow }}
            onClick={toggleDrawer(true)}
          />
        )}
        <Typography
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", color: theme.yellow, fontWeight: 600 }}
        >
          App name
        </Typography>
      </Box>

      {/* display these if screen size > 768px  */}
      {!isMobile && (
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <HeaderTypoGraphy routeTo="/protein-store" value={"Protein Store"} />
          <HeaderTypoGraphy routeTo="/supplements" value={"Supplements"} />
          <HeaderTypoGraphy routeTo="/equipments" value={"Equipments"} />
        </Box>
      )}

      {/*  */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <IconButton onClick={() => navigate("/wishlist")}>
          <FavoriteRoundedIcon
            sx={{ fontSize: 20, cursor: "pointer", color: theme.yellow }}
          />
        </IconButton>
        <IconButton onClick={() => navigate("/checkout")}>
          <ShoppingCartRoundedIcon
            sx={{ fontSize: 20, cursor: "pointer", color: theme.yellow }}
          />
        </IconButton>
        <IconButton onClick={() => navigate("/profile")}>
          <AccountCircleRoundedIcon
            sx={{ fontSize: 20, cursor: "pointer", color: theme.yellow }}
          />
        </IconButton>
      </Box>

      {/* display these if screen size < 768px  */}
      {isMobile && (
        <Drawer
          open={open}
          onClose={toggleDrawer(false)}
          sx={{ "& .MuiDrawer-paper": { backgroundColor: theme.darkGrey } }}
        >
          {DrawerList}
        </Drawer>
      )}
    </Box>
  );
}

export default Header;
