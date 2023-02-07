import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import ButtonRegular from "../components/ButtonRegular/ButtonRegular";
import userType from "../components/Sidebar/listUsersTypes";
import PageLayout from "./PageLayout";
import sadLion from "./sadLion.png";

/**
 *
 * @returns An error 404 page, that includes a redirection button back to home. Shown when an user accesses an invalid URL.
 */
export default function ErrorMailPage() {
  return (
    // Declare the pagelayout with its title
    <PageLayout title="ERROR 404" sidebarType={userType.NONE}>
      {/* Make use of the Grid to place the components 
      and define the settings of the grid */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        {/* Add the header text for the main body */}
        <Grid>
          <Typography variant="h4"> You might be here because of:</Typography>
          <Typography>1. The reset passoword link might be expired.</Typography>
          <Typography> 2. The User might not exist.</Typography>
          <Typography>Please repeat the process or contact admin.</Typography>
        </Grid>
        {/* Add a button to return home */}
        <Grid>
          <Link to="/login">
            <ButtonRegular text="back to login" />
          </Link>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
