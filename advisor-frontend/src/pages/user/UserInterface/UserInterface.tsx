import { Link } from "react-router-dom";
import PageLayout from "../../PageLayout";
import userTypes from "../../../components/Sidebar/listUsersTypes";
import EvaluationCard from "../../../components/PageCard/SpecificPageCards/EvaluationCard";
import TeamCard from "../../../components/PageCard/SpecificPageCards/TeamCard";

/**
 * Home page visible to anyone with the user role
 */
function UserInterface() {
  const pageTitle = `User Home`;

  return (
    <PageLayout title={pageTitle} footer sidebarType={userTypes.USER}>
      <Link to="/user/self_evaluations" data-testid="user-evals">
        <EvaluationCard />
      </Link>
      <Link to="/teams" data-testid="user-teams">
        <TeamCard />
      </Link>
    </PageLayout>
  );
}

export default UserInterface;
