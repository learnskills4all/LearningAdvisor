import { Route } from "react-router-dom";
import ChangePassword from "../pages/changepassword/changepassword";
import Evaluation from "../pages/evaluations/Evaluation/Evaluation";
import Feedback from "../pages/evaluations/Feedback/Feedback";
import ListOfSelfEvals from "../pages/user/ListOfSelfEvals/ListOfSelfEvals";
import UserInterface from "../pages/user/UserInterface/UserInterface";
import INGTheme from "../Theme";

/**
 * User routes
 * @returns All the user routes
 */
export default [
  // User interface
  <Route path="/user" element={<UserInterface />} />,
  // List of evaluations
  <Route
    path="/user/self_evaluations"
    element={<ListOfSelfEvals theme={INGTheme} />}
  />,
  // Evaluation
  <Route
    path="/user/self_evaluations/:assessmentId"
    element={<Evaluation team={false} theme={INGTheme} />}
  />,
  // Feedback
  <Route
    path="/user/self_evaluations/feedback/:assessmentId"
    element={<Feedback team={false} theme={INGTheme} />}
  />,
  // Change Password
  <Route
    path="/changepassword" element={<ChangePassword />}
  />,
];
