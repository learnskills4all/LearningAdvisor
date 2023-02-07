import { Route } from "react-router-dom";
import AdminInterface from "../pages/admin/AdminInterface/AdminInterface";
import ListOfIndividuals from "../pages/admin/ListOfIndividuals/ListOfIndividuals";
import Area from "../pages/admin/templates/Area/Area";
import Import from "../pages/admin/templates/Import/Import";
import ListOfTemplatesIndividual from "../pages/admin/templates/ListOfTemplates/ListOfTemplatesIndividual";
import ListOfTemplatesTeam from "../pages/admin/templates/ListOfTemplates/ListOfTemplatesTeam";
import Template from "../pages/admin/templates/Template/Template";
import TemplateIndex from "../pages/admin/templates/TemplateIndex/TemplateIndex";
import ChangePassword from "../pages/changepassword/changepassword";
import INGTheme from "../Theme";

/**
 * Admin routes
 * @returns All the admin routes
 */
export default [
  // Admin interface
  <Route path="/admin" element={<AdminInterface />} />,
  // List of individuals
  <Route
    path="/admin/individuals"
    element={<ListOfIndividuals theme={INGTheme} />}
  />,
  //Template index
  <Route
    path="/admin/templates"
    element={<TemplateIndex />}
  />,
  // List of individual templates
  <Route
    path="/admin/templates-individual"
    element={<ListOfTemplatesIndividual theme={INGTheme} />}
  />,
  // List of team templates
  <Route
    path="/admin/templates-team"
    element={<ListOfTemplatesTeam theme={INGTheme} />}
  />,
  // Template
  <Route
    path="/admin/templates/:templateId"
    element={<Template theme={INGTheme} />}
  />,
    // Import
    <Route
    path="/admin/templates/import"
    element={<Import theme={INGTheme} />}
  />,
  // Area
  <Route
    path="/admin/templates/:templateId/:areaId"
    element={<Area theme={INGTheme} />}
  />,
  // Change Password
  <Route
    path="/changepassword" element={<ChangePassword />}
  />,
];
