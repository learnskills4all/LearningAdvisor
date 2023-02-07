import { Link } from "react-router-dom";
import userType from "../../../components/Sidebar/listUsersTypes";
import PageLayout from "../../PageLayout";
import IndividualCard from "../../../components/PageCard/SpecificPageCards/IndividualCard";
import TemplateCard from "../../../components/PageCard/SpecificPageCards/TemplateCard";
import ImportTemplateCard from "../../../components/PageCard/SpecificPageCards/ImportTemplateCard";

/**
 * Home page visible to anyone with the admin role
 * containing the title: "Admin Home"
 * with a sidebar on the left
 */
function AdminInterface() {
  return (
    <div>
      <PageLayout title="Admin Home" footer sidebarType={userType.ADMIN}>
        <Link to="/admin/individuals" data-testid="individuals">
          <IndividualCard />
        </Link>

        <br />

        <Link to="/admin/templates" data-testid="templates">
          <TemplateCard />
        </Link>

        <Link to="/admin/templates/import" data-testid="import">
          <ImportTemplateCard />
        </Link>
      </PageLayout>
    </div>
  );
}

export default AdminInterface;
