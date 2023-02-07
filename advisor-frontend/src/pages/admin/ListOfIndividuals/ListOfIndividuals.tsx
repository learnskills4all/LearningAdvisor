import { Theme } from "@mui/material";
import PageLayout from "../../PageLayout";
import userType from "../../../components/Sidebar/listUsersTypes";
import IndividualGrid from "../../../components/Grids/Specific/Individual/IndividualGrid";

/**
 * Page listing all users registered in the tool
 * This page should only be accessible to admins
 */
function ListOfIndividuals({ theme }: { theme: Theme }) {
  return (
    <div data-testid="individualTests">
      <PageLayout title="Individuals" sidebarType={userType.ADMIN}>
        <IndividualGrid theme={theme} />
      </PageLayout>
    </div>
  );
}

export default ListOfIndividuals;
