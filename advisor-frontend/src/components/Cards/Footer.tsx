import Paper from "@mui/material/Paper";
import { Box, Typography, Link } from "@mui/material";

/**
 * A function to render a footer at the bottom of the page.ƒ
 * @returns A footer component, which contains the ING logo
 * including a copyright sign mentioning the TU/e Eindhoven
 * (Eindhoven University of Technology)
 */
export default function Footer() {
  return (
    <Paper
      sx={{
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        backgroundColor: "primary.main",
        width: "100%",
      }}
    >
      <Box
        sx={{
          height: "200px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
        }}
      >
      </Box>
    </Paper>
  );
}
