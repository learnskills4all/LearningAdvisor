// Imports
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { colors, ThemeProvider } from "@mui/material";
import { useRef, useState } from "react";
//import { Link } from "react-router-dom";
import { useLogin } from "../../api/LoginAPI/LoginAPI";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";
import INGTheme from "../../Theme";
import LoginLayout from "./LoginLayout";
import { hover } from "@testing-library/user-event/dist/hover";
import { color } from "@mui/system";
import { orange } from "@mui/material/colors";

/**
 *
 * This component renders the whole login page
 * @returns Signin page, based on the login layout
 */
// eslint-disable-next-line import/prefer-default-export
export function SignIn() {
  // Prevents the textfield to automatically refresh the page, after input
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // Ref for error popup
  const refErrorSignIn = useRef<RefObject>(null);
  const onErrorSignIn = getOnError(refErrorSignIn);

  // Import login API calls
  const login = useLogin(onErrorSignIn);

  // Create statehooks to store the login details in the textfields
  const [inputUserName, setInputUserName] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  // Login page that contains the login toolbox, a dialog with informationa and a signup button.
  return (
    <ThemeProvider theme={INGTheme}>
      {/* Import the login page layout  */}
      <LoginLayout>
        {/* Define the box component where the textfields will be rendered */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ p: 4, pt: 1.5 }}
        >
          {/* Textfield for username */}
          <TextField
            margin="normal"
            fullWidth
            id="Username"
            label="Username"
            name="Username"
            autoComplete="email"
            variant="filled"
            sx={{ bgcolor: INGTheme.palette.primary.light }}
            value={inputUserName}
            onChange={(e) => {
              setInputUserName(e.target.value);
            }}
          />
          {/* Textfield for password  */}
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            variant="filled"
            value={inputPassword}
            sx={{ bgcolor: INGTheme.palette.primary.light }}
            onChange={(e) => {
              setInputPassword(e.target.value);
            }}
          />

          <Link href="/forgotPassword" underline="hover" color="orange"> Forgot Password ?</Link>

          {/* Grid component to set the row for the buttons */}
          <Grid container columns={2} spacing={0} sx={{ marginTop: 2 }}>
            <Grid>
              {/* Define the styling of the button */}
              <Button
                size="medium"
                variant="contained"
                sx={{
                  p: 2,
                  m: 2,
                  ml: 6,
                }}
                onClick={() => {
                  login.mutate({
                    username: inputUserName,
                    password: inputPassword,
                  });
                }}
              >
                Log In
              </Button>
            </Grid>

            <Grid>
              <Link href="/signup">
                {/* Define the styling of the button */}
                <Button
                  sx={{
                    p: 2,
                    m: 2,
                  }}
                  variant="outlined"
                  size="medium"
                >
                  Sign Up
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </LoginLayout>
      {/* Declare the error popup, in case API returns an error */}
      <ErrorPopup ref={refErrorSignIn} />
    </ThemeProvider>
  );
}
