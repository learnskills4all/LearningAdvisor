import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Grid } from "@mui/material";
// import  mainListItems  from "./listItems";
import SidebarList from "./listItems";

/**
 * Used to define the maximum width of the sidebar.
 */
const drawerWidth = 220;

/**
 * Drawer defines the two different styles of the sidebar, when opened and closed.
 */
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(7),
      },
    }),
  },
}));

/**
 * Defines the props type used in Sidebar
 * that takes in React.ReactNode children and
 * a Map that defines the user-viewability
 */
type SidebarProps = {
  children?: React.ReactNode;
  sidebarType: Map<string, boolean>;
};
const defaultProps = {
  children: null,
};

/**
 * Sidebar function that will render the sidebar on the left side, with a flexbox container on the right, where children
 * can be passed through.
 * @param children Any children components passed through will be rendered on the right side of the sidebar.
 * @param sidebarType Uses a Map<string, boolean> format to decide what components of sidebar are rendered.
 * @returns A sidebar with an empty box on the right, to be filled in with children components.
 */
export default function Sidebar({ children, sidebarType }: SidebarProps) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen((isOpen) => !isOpen);
  };

  return (
    <Grid
      sx={{ display: "flex", minHeight: "100vh" }}
      data-testid="SidebarTest"
    >
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            bgcolor: "secondary.main",
          },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={toggleDrawer}
            data-testid="DrawerButton"
            sx={{
              padding: "16px",
            }}
          >
            <MenuIcon color="info" />
          </IconButton>
        </Toolbar>
        <Divider />
        <List
          component="nav"
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <SidebarList userType={sidebarType} />
          <Divider sx={{ my: 1 }} />
          {}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          width: "100vw",
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Grid>
  );
}
Sidebar.defaultProps = defaultProps;
