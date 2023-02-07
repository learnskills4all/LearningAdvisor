import { Route } from "react-router-dom";
import ChangePassword from "../pages/changepassword/changepassword";
import Evaluation from "../pages/evaluations/Evaluation/Evaluation";
import Feedback from "../pages/evaluations/Feedback/Feedback";
import Team from "../pages/teams/Team/Team";
import TeamList from "../pages/teams/TeamList/TeamList";
import INGTheme from "../Theme";

/**
 * Assessor routes
 * @returns All the assessor routes
 */
export default [
  // Teams List
  <Route path="/teams" element={<TeamList theme={INGTheme} />} />,
  // Team
  <Route path="/teams/:teamId" element={<Team theme={INGTheme} />} />,
  // Evaluation
  <Route
    path="/teams/:teamId/:assessmentId"
    element={<Evaluation team theme={INGTheme} />}
  />,
  // Feedback
  <Route
    path="/teams/:teamId/feedback/:assessmentId"
    element={<Feedback team theme={INGTheme} />}
  />,
  // Change Password
  <Route
    path="/changepassword" element={<ChangePassword />}
  />,
];
