import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { sidebarConfig } from "../config/sidebarConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet } from "react-router-dom";

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard * 2,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard * 2,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard * 2,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard * 2,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          backgroundColor: "#f4f4f4",
          backgroundImage: 'url("/src/assets/images/sidebar-bg-light.jpg")',
          // backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          // Overlay Layer
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(182, 195, 220, 0.7)", // Semi-transparent black overlay
            backdropFilter: "blur(5px)", // Optional: Adds a frosted glass effect
            WebkitBackdropFilter: "blur(5px)", // Safari support
            zIndex: 1, // Ensures it stays above the background image
          },

          // Ensures text and icons remain on top of the overlay
          "& *": {
            position: "relative",
            zIndex: 2,
          },
        },
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: "#075985",
        },
      },
    },
  ],
}));

export default function MiniDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [minHeight, setMinHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const header = document.getElementById("appBar");
      if (header) {
        const viewportHeight = window.innerHeight;
        const headerHeight = header.offsetHeight;
        // console.log(
        //   headerHeight,
        //   viewportHeight,
        //   viewportHeight - headerHeight
        // );
        setMinHeight(`${viewportHeight - headerHeight}px`);
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    // Force re-render when drawer state changes
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, [open]);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleClick = (id) => {
    navigate(id);
    setActiveItem(id); // Set active item on click
    if (id === "logout") {
      navigate("/");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        id="appBar"
        position="fixed"
        sx={{
          backgroundColor: "#075985",
          boxShadow: "0.8px 0.8px 0.8px 0.8px rgba(224, 227, 232, 0.9)",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
              sx={[
                {
                  marginRight: 0,
                },
                open && { display: "block" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <img
              src="/favicon.png"
              alt="logo"
              width="40px"
              height="40px"
              style={{ marginLeft: "10px" }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "#fff", ml: 1, fontWeight: "medium" }}
            >
              Electrical Engineering Department
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: hover ? 1 : 0,
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              padding: "5px",
            }}
            onClick={() => navigate("/")}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <LogoutIcon
              sx={{
                transform: hover ? "translateX(-5px)" : "translateX(0)",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                alignItems: "center",
              }}
            />
            {hover && <span>Logout</span>}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ mt: "4px", alignItems: "center" }}></DrawerHeader>

        <List>
          {sidebarConfig?.items?.map((item, index) => {
            const IconComponent = item?.icon;
            const isActive = activeItem === `/${item.id}`; // Ensure it matches the route correctly

            return (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleClick(item?.id)}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    py: 1,
                    justifyContent: open ? "initial" : "center",
                    backgroundColor: isActive ? "#0284c7" : "transparent", // Active item color
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: isActive ? "#043c5a" : "#f1f5f9", // Hover effect 0284c7 043c5a
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      mr: open ? 3 : "auto",
                      color: isActive ? "#fff" : open ? "#083344" : "#fff",
                      "&:hover": {
                        color: isActive ? "#fff" : "#043c5a",
                      },
                    }}
                  >
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={item?.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: isActive ? "#fff" : "#083344",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // minHeight: "100vh",
          minHeight,
          p: 2,
          width: !open ? "100%" : "calc(100vw - 280px)",
        }}
      >
        <Toolbar />
        <Outlet
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f4f4f4",
          }}
        />
      </Box>
    </Box>
  );
}
