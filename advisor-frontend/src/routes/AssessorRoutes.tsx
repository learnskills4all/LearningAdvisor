import { Route } from "react-router-dom";
import AssessorInterface from "../pages/assessor/AssessorInterface";

/**
 * Assessor routes
 * @returns All the assessor routes
 */
export default [
  // Assessor interface
  <Route path="/assessor" element={<AssessorInterface />} />,
];
