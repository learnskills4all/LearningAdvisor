import { createTheme } from "@mui/material";

/**
 * In this Theme.tsx file you can see the colors below that will be used
 * a lot in the front-end UI for TestING Advisor
 * for e.g.: colour of the texts in components and background colour
 */
const INGTheme = createTheme({
  palette: {
    primary: {
      // Light Orange
      light: "#FFD6B1",
      // Orange
      main: "#FF6200",
      // Dark Orange
      dark: "#AA3909",
    },
    secondary: {
      // Light Grey
      light: "#EDE6E2",
      // Grey
      main: "#8B817C",
      // Dark Grey
      dark: "#5A534F",
    },
    text: {
      // Dark Grey
      secondary: "#5A534F",
    },
    info: {
      // Lightest Grey
      light: "#FAF6F3",
      // White color for icons.
      main: "#ffffff",
    },
    background: {
      // Used to define the custom sidebar text color.
      default: "#ffffff",
    },
  },
});
export default INGTheme;
