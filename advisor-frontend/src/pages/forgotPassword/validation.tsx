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



function ValidationURL() {
    const { id } = useParams();
    const { token } = useParams();
  
    const refErrorResetPass = useRef<RefObject>(null);
    const onErrorResetPass = getOnError(refErrorResetPass);
    
    const data = getData(id, token, onErrorResetPass);
    data.mutate();
    return(
        <div className="App" data-testid="emptyPage">
      {" "}
    </div>
    );
  }

  export default ValidationURL;
  