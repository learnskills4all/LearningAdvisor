import { Link } from "react-router-dom";
import userType from "../../../../components/Sidebar/listUsersTypes";
import PageLayout from "../../../PageLayout";
import IndividualTemplateCard from "../../../../components/PageCard/SpecificPageCards/IndividualTemplateCard";
import TeamTemplateCard from "../../../../components/PageCard/SpecificPageCards/TeamTemplateCard";

function TemplateIndex() {
  return (
    <div>
      <PageLayout title="Templates" footer sidebarType={userType.ADMIN}>
        <Link to="/admin/templates-individual" data-testid="templates-individual">
          <IndividualTemplateCard />
        </Link>

        <br />

        <Link to="/admin/templates-team" data-testid="templates">
          <TeamTemplateCard />
        </Link>
      </PageLayout>
    </div>
  );
}

export default TemplateIndex;