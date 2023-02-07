// Imports
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider, useTheme } from "@mui/material";
import { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ErrorPopup, { RefObject } from "../ErrorPopup/ErrorPopup";
import INGTheme from "../../Theme";

/**
 *
 * Create a login layout that has a pre-styled background,
 * Title text and div box to place the child components
 * @param children Pass through the child components that are specifically designed.
 * @returns The general login layoput that will contain the child components in a Box.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ref for error popup
  const ref = useRef<RefObject>(null);

  // State hook to keep track if the dialog is opened or not
  const [open, setOpen] = React.useState(false);
  // Handle the opening of the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  // Handle the closing of the box
  const handleClose = () => {
    setOpen(false);
  };
  const theme = useTheme();

  // Login page that contains the login toolbox, a dialog with informationa and a signup button.
  return (
    <ThemeProvider theme={INGTheme}>
      <div
        // ING colored image for background
        style={{
          backgroundImage: "url(/backpic.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        {/* Help button placed on the left */}
        <IconButton
          size="medium"
          onClick={handleClickOpen}
          sx={{
            color: "white",
            float: "left",
          }}
        >
          <HelpOutlineOutlinedIcon />
        </IconButton>
        {/* This dialog is used to display the help text */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Our Tool</DialogTitle>
          {/* Main body of the Dialog component */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              TestING Advisor builds on an Excel-based tool by giving users
              automated feedback based on individual/team assessments, which
              previously had to be done manually by an assessor. The current
              tool has seven categories of assessment: Ready Work, Alignment,
              Testware, Test Environment, Mastery, Metrics and Reporting. First,
              login or signup by clicking the sign up button. This will take you
              to a choose role screen where you can pick your role as an
              Assessor or an Admin, then your username and password will be
              generated, you can use these from now on.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {/* Button to close the Dialog component */}
            <Button onClick={handleClose}>Go to Login</Button>
          </DialogActions>
        </Dialog>
        {/* The box contains the title of the page/tool */}
        <Box sx={{ height: "25vh" }}>
          <Typography
            variant="h2"
            align="center"
            color="white"
            fontWeight="fontWeightBold"
            sx={{
              pt: 5,
            }}
          >
            TestING Advisor
          </Typography>
        </Box>
        {/* Container is where all functionality exists */}
        <Box sx={{ height: "25vh" }}>
          <Container
            component="main"
            maxWidth="xs"
            sx={{
              pt: 10,
            }}
          >
            {/* Define the box containing the login functionality */}
            <Box
              sx={{
                pt: 0,
                marginBottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 5px 0",
                borderRadius: "16px",
                bgcolor: "white",
              }}
            >
              {/* Contact icon on top of username */}
              <Avatar sx={{ m: 1, bgcolor: theme.palette.primary.main }}>
                <AccountCircleRoundedIcon sx={{ fontSize: 40 }} />
              </Avatar>
              {/* Here the children props will be placed */}
              {children}
            </Box>
          </Container>
        </Box>
        {/* Error popup component renders when an error is received from the API */}
        <ErrorPopup ref={ref} />
      </div>
    </ThemeProvider>
  );
}
