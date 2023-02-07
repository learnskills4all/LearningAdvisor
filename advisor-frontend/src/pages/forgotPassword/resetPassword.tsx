import { Alert, AlertTitle, Box, Button, Grid, Link, TextField, ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { UseMutationResult } from "react-query";
import { Route, useParams } from "react-router-dom";
import { Integer } from "read-excel-file";
import { getData, useResetPassword } from "../../api/ForgotPasswordAPI/forgotPasswordAPI";
//import { Link } from "react-router-dom";
import ErrorPopup, { getOnError, RefObject } from "../../components/ErrorPopup/ErrorPopup";
import userType from "../../components/Sidebar/listUsersTypes";
import LoginLayout from "../../components/SignInUP/LoginLayout";
import INGTheme from "../../Theme";
import ErrorPage from "../ErrorPage";
import PageLayout from "../PageLayout";

function ResetPassword() {
 
  useEffect(() => {
   // ValidationURL();
  }, []);
  
   const { id } = useParams();
   const { token } = useParams();

  // Prevents the textfield to automatically refresh the page, after input
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

    // Ref for error popup
    const refErrorResetPass = useRef<RefObject>(null);
    const onErrorResetPass = getOnError(refErrorResetPass);

  const resetPassword = useResetPassword(onErrorResetPass);

  // Create statehooks to store the details in the textfields
  //const [inputCurrentPassword, setInputCurrentPassword] = useState("");
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState("");
  const [inputNewPasswordError, setInputNewPasswordError] = useState("");
  const [inputConfirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  

const handleValidation= (evnt: any)=>{
    const passwordInputValue = evnt.target.value.trim();
    const passwordInputFieldName = evnt.target.name;
        //for password 
if(passwordInputFieldName==='newPassword'){
    const uppercaseRegExp   = /(?=.*?[A-Z])/;
    const lowercaseRegExp   = /(?=.*?[a-z])/;
    const digitsRegExp      = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp   = /.{8,}/;
    const passwordLength =      passwordInputValue.length;
    const uppercasePassword =   uppercaseRegExp.test(passwordInputValue);
    const lowercasePassword =   lowercaseRegExp.test(passwordInputValue);
    const digitsPassword =      digitsRegExp.test(passwordInputValue);
    const specialCharPassword = specialCharRegExp.test(passwordInputValue);
    const minLengthPassword =   minLengthRegExp.test(passwordInputValue);
    let errMsg ="";
    if(passwordLength===0){
            errMsg="Password is empty";
    }else if(!uppercasePassword){
            errMsg="At least one Uppercase";
    }else if(!lowercasePassword){
            errMsg="At least one Lowercase";
    }else if(!digitsPassword){
            errMsg="At least one digit";
    }else if(!specialCharPassword){
            errMsg="At least one Special Characters";
    }else if(!minLengthPassword){
            errMsg="At least minumum 8 characters";
    }else{
        errMsg="";
    }
    setInputNewPasswordError(errMsg);
    }
    // for confirm password
    if(passwordInputFieldName=== "confirmNewPassword" || (passwordInputFieldName==="newPassword" && inputConfirmNewPassword.length>0) ){
            
        if(inputConfirmNewPassword!==inputNewPassword)
        {
        setConfirmNewPasswordError("New password and confirm password does not match");
        }else{
        setConfirmNewPasswordError("");
        }
        
    }
}
  return (
    <div>
        <ThemeProvider theme={INGTheme}>
            <LoginLayout>
      {/* <PageLayout title="Reset Password" footer sidebarType={userType.NONE}> */}


        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ p: 4, pt: 1.5 }}
        >
          {/* Textfield for new password  */}
          <TextField
            margin="normal"
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            variant="filled"
            value={inputNewPassword}
            sx={{ bgcolor: INGTheme.palette.primary.light }}
            onKeyUp={handleValidation}
            onChange={(e) => {
                setInputNewPassword(e.target.value);
            }}
          />
          <p className="text-danger" style={{padding: '0em', fontSize: '10px', color: 'orange'}}>{inputNewPasswordError}</p>
          {/* Textfield for confirm new password  */}
          <TextField
            margin="normal"
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            autoComplete="confirm-new-password"
            variant="filled"
            value={inputConfirmNewPassword}
            sx={{ bgcolor: INGTheme.palette.primary.light }}
            onKeyUp={handleValidation}
            onChange={(e) => {
                setInputConfirmNewPassword(e.target.value);
            }}
          />
          <p className="text-danger" style={{padding: '0em', fontSize: '10px', color: 'orangered'}}>{inputConfirmNewPasswordError}</p>
          {/* Grid component to set the row for the buttons */}
          <Grid container columns={2} spacing={0} sx={{ marginTop: 2 }}>
            <Grid>
              {/* Define the styling of the button */}
              <Button
                disabled={!(inputNewPasswordError=="")}
                size="medium"
                variant="contained"
                sx={{
                  p: 2,
                  m: 2,
                  ml: 6,
                }}
                onClick={() => {
                  if((inputNewPassword == "")||(inputConfirmNewPassword == "")){
                    alert("Please recheck new password or confirm new password!")
                  //   <Alert severity="error">
                  //   <AlertTitle>Error</AlertTitle>
                  //   New Password or Confirm new password is <strong>empty!</strong>
                  // </Alert>
                  }
                  else if((inputNewPassword == inputConfirmNewPassword)){
                    resetPassword.mutate({
                      userId: id,
                      newPassword: inputNewPassword,
                      token: token,
                    });
                  }
                }}
              >
                Reset Password
              </Button>
            </Grid>
            </Grid>
            </Box>
          {/* Declare the error popup, in case API returns an error */}
          <ErrorPopup ref={refErrorResetPass} />
      {/* </PageLayout> */}
      </LoginLayout>
      </ThemeProvider>

    </div>
  );
}
export default ResetPassword;
