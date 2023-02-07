/**
 * Define imports for e.g.,
 * loginlayout , theming, errorpopups,
 * buttons, icons etc
 */
import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useLogin } from "../../api/LoginAPI/LoginAPI";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";
import INGTheme from "../../Theme";
import LoginLayout from "./LoginLayout";
import Textfield from "../Textfield/Textfield";
import { ThemeContext } from "styled-components";
import TextfieldEdit from "../TextfieldEdit/TextfieldEdit";
import { useState } from "react";

// eslint-disable-next-line import/prefer-default-export
export function DetailGen() {
  /**
   * Make global state variables accessible
   */
  const { userPassword, userName } = useSelector(
    (state: RootState) => state.userData
  );


  const [teamId, setTeamId] = useState("");

  /**
   * Tries to parse the teamId from the header url
   */
  React.useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.get('teamId') != null) {
      var parseTeamId = urlParams.get('teamId');
      if (parseTeamId != null) {
        setTeamId(parseTeamId);
      }
    }
  }, []);

  /**
   * Ref for error popup
   */
  const refErrorDetailGen = React.useRef<RefObject>(null);
  const onErrorDetailGen = getOnError(refErrorDetailGen);

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

  /**
   * Make Login API call available
   */
  const login = useLogin(onErrorDetailGen);
  /**
   * return a detailgen page that consists of the following:
   * an icon at the top (person icon)
   * the text "Your username and password were generated for you"
   * two textfields containing the detail generations
   * for username and password
   * followed by a button called finish and login
   */
  return (
    <ThemeProvider theme={INGTheme}>
      <LoginLayout>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          fontWeight="fontWeightBold"
          sx={{
            pt: 0,
            marginTop: 2,
            marginBottom: 3,
          }}
        >
          Your username and password were generated for you
        </Typography>
        
        {/* Uneditable text field */}
        <FormControl variant="standard">
          <InputLabel htmlFor="Username">Username</InputLabel>
          <OutlinedInput
            id="username"
            value={userName}
            readOnly
            sx={{ m: 2 }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  onClick={() => navigator.clipboard.writeText(userName)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="Username">Password</InputLabel>
          <OutlinedInput
            readOnly
            sx={{ m: 2 }}
            id="password"
            value={userPassword}
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  onClick={() => navigator.clipboard.writeText(userPassword)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {teamId != "" && teamId != null &&
        <FormControl variant="standard">
          <InputLabel htmlFor="Username">Team id</InputLabel>
          <OutlinedInput
            sx={{ m: 2 }}
            id="team"
            value={teamId}
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  onClick={() => navigator.clipboard.writeText(teamId)}
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        }
        <Button
          variant="contained"
          color="primary"
          sx={{
            p: 2,
            m: 2,
          }}
          onClick={() =>
            login.mutate({
              username: userName,
              password: userPassword,
            })
          }
        >
          Finish and Log in
        </Button>
      </LoginLayout>
      <ErrorPopup ref={refErrorDetailGen} />
    </ThemeProvider>
  );
}
