import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import { sidebarConfig } from "../config/sidebarConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet } from "react-router-dom";
import UserIssuanceFom from "../components/UserIssuanceFom";

const drawerWidth = 240;

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
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#075985",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            zIndex: 1,
          },

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
  const [open, setOpen] = useState(true);
  const [hover, setHover] = useState(false);
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [minHeight, setMinHeight] = useState("100vh");
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      const header = document.getElementById("appBar");
      if (header) {
        const viewportHeight = window.innerHeight;
        const headerHeight = header.offsetHeight;
        setMinHeight(`${viewportHeight - headerHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, [open]);

  useEffect(() => {
    const restOfPath =
      user && user?.role === "admin"
        ? location.pathname.replace("/dashboard/admin/", "")
        : user && user?.role === "master"
          ? location.pathname.replace("/dashboard/master/", "")
          : "";
    if (
      restOfPath !== "/dashboard/admin" &&
      restOfPath !== "/dashboard/master"
    ) {
      setActiveItem(restOfPath);
    } else {
      setActiveItem("/");
    }
  }, [location.pathname, user]);

  const handleClick = (id) => {
    if (id === "logout") {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const basePath =
      user && user?.role === "admin" ? "/dashboard/admin" : "/dashboard/master";
    const target = id === "/" ? basePath : `${basePath}/${id}`;
    navigate(target);
    setActiveItem(id);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        id="appBar"
        position="fixed"
        sx={{
          backgroundColor: "#075985",
          boxShadow: "0.8px 0.8px 0.8px 0.8px rgba(18, 77, 122, 0.9)",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* Left Side: Menu Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {/* Center: Image + Title */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              src="/favicon.png"
              alt="logo"
              width="55px"
              height="55px"
              style={{ marginRight: "8px" }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                ml: 1,
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "1.2rem",
              }}
            >
              Department of Electrical Engineering, IIT Bhilai Durg
            </Typography>
          </Box>
          {/* Right Side: User Info & Logout */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "15%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {user.name}
              </Typography>
              <Typography variant="caption">{user.email}</Typography>
              <Typography
                variant="caption"
                sx={{
                  textTransform: "capitalize",
                  textAlign: "center",
                }}
              >
                Role: {user.role}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                transform: hover ? "translateX(-1px)" : "translateX(0)",
              }}
              onClick={() => {
                localStorage.removeItem("token"); //  Clear the token, Clear auth data if needed
                navigate("/login");
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <LogoutIcon />
              {hover && <span>Logout</span>}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ mt: 1, alignItems: "center" }}></DrawerHeader>

        <List>
          {sidebarConfig?.items?.map((item, index) => {
            const IconComponent = item?.icon;
            const isActive = activeItem === `${item?.id}`;

            return (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleClick(item?.id)}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    py: 1,
                    justifyContent: open ? "initial" : "center",
                    backgroundColor: isActive ? "#0284c7" : "transparent",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#043c5a",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      mr: open ? 2 : "auto",
                      color: "#fff",
                    }}
                  >
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={item?.label}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: "#fff",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          <Divider
            sx={{
              backgroundColor: "#dcdcdc",
              width: "90%",
              margin: "0 auto",
              mt: 1,
              mb: 1,
            }}
          />
          <UserIssuanceFom isDrawerOpen={open} />
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
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
