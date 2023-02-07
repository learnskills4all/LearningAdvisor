import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../app/store";
import ButtonRegular from "../components/ButtonRegular/ButtonRegular";
import userTypes from "../components/Sidebar/listUsersTypes";
import PageLayout from "./PageLayout";

/**
 *
 * @returns An error 404 page, that includes a redirection button back to home. Shown when an user accesses an invalid URL.
 */
export default function ErrorPage() {
  // Fetch the userRole from the global state
  const { userRole } = useSelector((state: RootState) => state.userData);
  return (
    // Declare the pagelayout with its title
    <PageLayout title="ERROR 404" sidebarType={userTypes[userRole]}>
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
          <Typography variant="h2"> You should not be here.</Typography>
        </Grid>
        {/* Add a button to return home */}
        <Grid>
          <Link to="/">
            <ButtonRegular text="Go back home" />
          </Link>
        </Grid>
      </Grid>
    </PageLayout>
  );
}
