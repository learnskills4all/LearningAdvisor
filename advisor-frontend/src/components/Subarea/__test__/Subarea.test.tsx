import { render, cleanup } from "@testing-library/react";
import { createTheme } from "@mui/material";
import Subarea from "../Subarea";

//  cleanup after each test case
afterEach(cleanup);

const theme = createTheme({
  palette: {
    primary: {
      light: "#FFD6B1", // Light Orange
      main: "#FF6200", // Orange
      dark: "#AA3909", // Dark Orange
    },
    secondary: {
      light: "#EDE6E2", // Light Grey
      main: "#8B817C", // Grey
      dark: "#5A534F", // Dark Grey
    },
    text: {
      secondary: "#5A534F", // Dark Grey
    },
    info: {
      light: "#FAF6F3", // Lightest Grey
      main: "#ffffff", // White color for icons.
    },
    background: {
      default: "#ffffff", // Used to define the custom sidebar text color.
    },
  },
});

//  test rendering of the subarea cards
it("Rendering without crash and check title and text on card", () => {
  const { getByText } = render(
    <Subarea
      title="Title"
      summary="Summary"
      description="Description"
      theme={theme}
      tip
    />
  );
  expect(getByText("Title")).toBeInTheDocument();
  expect(getByText("Summary")).toBeInTheDocument();
  expect(getByText("Description")).toBeInTheDocument();
});
