/**
 * Imports,
 * e.g. the theming,
 * layout of login,
 * error popups etc
 */
import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useRegister } from "../../api/LoginAPI/LoginAPI";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";
import INGTheme from "../../Theme";
import LoginLayout from "./LoginLayout";

// eslint-disable-next-line import/prefer-default-export
export function Chooserole() {
  /**
   * Defines the role state to keep track of the selected role
   */
  const [userRole, setUserRole] = React.useState("");
  const [teamId, setTeamId] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setUserRole(event.target.value as string);
  };

  /**
   * Ref for error popup
   */
  const refErrorChooserole = React.useRef<RefObject>(null);
  const onErrorChooserole = getOnError(refErrorChooserole);

  /**
   * Imports the API hook for registering
   */
  const userReg = useRegister(onErrorChooserole, teamId);

  /**
   * Checks if a teamId is passed
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

    if (urlParams.get('userType') != null) {
      var parseUserType = urlParams.get('userType');
      if (parseUserType != null) {
        setUserRole(parseUserType);
      }
    }
  }, []);
  /**
   * Return a box containing an icon at the top
   * a text: "Please, select your role"
   * followed by a dropdown list which contains
   * user and facilitator
   * followed with a continue button, which can be pressed once
   * a role has been selected
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
            marginBottom: 2,
          }}
        >
          Please, select your role
        </Typography>
        {/* The form for the drop down menu to pick a role */}
        <FormControl fullWidth>
          <Select sx={{ m: 2 }} value={userRole} onChange={handleChange}>
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ASSESSOR">Facilitator</MenuItem>
          </Select>
        </FormControl>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          sx={{
            p: 2,
            m: 2,
          }}
          onClick={() => {
            userReg.mutate({ role: userRole });
          }}
        >
          Continue
        </Button>
      </LoginLayout>
      <ErrorPopup ref={refErrorChooserole} />
    </ThemeProvider>
  );
}
