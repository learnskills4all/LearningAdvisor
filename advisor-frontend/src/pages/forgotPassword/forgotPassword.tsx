import userType from "../../components/Sidebar/listUsersTypes";
import INGTheme from "../../Theme";
import PageLayout from "../PageLayout";
import { useChangePassword } from "../../api/ChangePasswordAPI/changePasswordAPI";
import { Box, Button, Grid, Link, TextField, ThemeProvider } from "@mui/material";
import { useRef, useState } from "react";
import LoginLayout from "../../components/SignInUP/LoginLayout";
import { useForgotPassword } from "../../api/ForgotPasswordAPI/forgotPasswordAPI";
import ErrorPopup, { getOnError, RefObject } from "../../components/ErrorPopup/ErrorPopup";


function ForgotPassword() {

    // Prevents the textfield to automatically refresh the page, after input
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  };
  // Ref for error popup
  const refErrorForgotPass = useRef<RefObject>(null);
  const onErrorForgotPass = getOnError(refErrorForgotPass);

  const forgotPassword = useForgotPassword(onErrorForgotPass);

  // Create statehooks to store the login details in the textfields
  const [inputEmail, setInputEmail] = useState("");
  const [inputUserName, setInputUserName] = useState("");
  const [error, setError] = useState("");

  function validEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }
  
    return (
        <div>
            <ThemeProvider theme={INGTheme}>
            <LoginLayout>
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ p: 4, pt: 1.5 }}
        >
            {/* Textfield for username */}
            <TextField
            required
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
          {/* Textfield for email */}
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="E-mail address"
            name="email"
            type="email"
            required
            autoComplete="E-mail address"
            variant="filled"
            sx={{ bgcolor: INGTheme.palette.primary.light }}
            value={inputEmail}
            onChange={(e) => {
                if (!validEmail(e.target.value)) {
                    setError("Email is invalid");
                  } else {
                    setError("");
                  }
                setInputEmail(e.target.value);
            }}
          />
          <p className="text-danger" style={{padding: '0em', fontSize: '12px', color: 'orangered'}}>{error}</p>
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
                  //ml: 6,
                }}
                onClick={() => {
                  if(error==""){
                    forgotPassword.mutate({
                      username: inputUserName,
                      email: inputEmail,
                    });
                 
                  }
                }}
              >
                Send Reset Code
              </Button>
            </Grid>
            <Grid>
              <Link href="/login">
                {/* Define the styling of the button */}
                <Button
                  sx={{
                    p: 2,
                    m: 2,                  
                  }}
                  variant="outlined"
                  size="medium"
                >
                  Back
                </Button>
              </Link>
            </Grid>
            </Grid>
            </Box>
            {/* Declare the error popup, in case API returns an error */}
          <ErrorPopup ref={refErrorForgotPass} />
      </LoginLayout>
      </ThemeProvider>
        </div>
    );
  }
  
  export default ForgotPassword;
