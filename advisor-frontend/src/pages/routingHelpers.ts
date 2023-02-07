import { UseQueryResult } from "react-query";
import { AssessmentAPP } from "../api/AssessmentAPI/AssessmentAPI";
import { TeamAPP } from "../api/TeamAPI/TeamAPI";

/**
 * This function is used to check routes related to assessments
 *
 * It prevents:
 *  - accessing feedback pages for uncompleted assessments
 *  - accessing the ongoing evaluation page for completed assessment
 *
 * Moreover, it redirects the user when they don't have access rights to a certain assessment
 * @param param0 object containing:
 *  @param assessmentResponse a response to an API request for assessment information,
 *  @param team whether the assessment in question is a team assessment
 *  @param completed whether we expect the assessment to be completed
 * @returns the address to reroute to or an empty string if we are on the right page
 */
export default function checkAssessmentRouting({
  assessmentResponse,
  team,
  completed,
  teamId,
  assessmentId,
}: {
  assessmentResponse: UseQueryResult<AssessmentAPP, unknown>;
  team: boolean;
  completed: boolean;
  teamId: string | undefined;
  assessmentId: string | undefined;
}) {
  // if the assessment request is a success
  // (the assessment exists and the user has access rights)
  if (assessmentResponse.status === "success" && assessmentResponse.data) {
    // if we are trying to access an ongoing assessment as feedback
    // or access a completed assessment as an ongoing assessment
    // redirect, so that we get the ongoing assessment in the ongoing assessment page
    // or the completed assessment in the feedback page
    if (!!assessmentResponse.data.completedAt !== completed) {
      if (assessmentResponse.data.completedAt) {
        return team
          ? `/teams/${teamId}/feedback/${assessmentId}`
          : `/user/self_evaluations/feedback/${assessmentId}`;
      }
      return team
        ? `/teams/${teamId}/${assessmentId}`
        : `/user/self_evaluations/${assessmentId}`;
    }
  }
  // if an error is throw, for example because the assessment doesn't exist
  // or the user doesn't have access rights,
  // the redirect to the previous
  if (
    assessmentResponse.status === "error" ||
    assessmentResponse.failureCount
  ) {
    return team ? `/teams/${teamId}` : `/user/self_evaluations`;
  }
  // if there are no mistakes in the routing address, return empty string
  return "";
}

/**
 * Given a response to a request for team information in the database,
 * rerout to team page if there is an error:
 * e.g. if the team doesn't exist or the user is not part of the team
 * @param teamResponse a response to an API request for team information,
 * @returns the address to reroute to or an empty string if we are on the right page
 */
export function checkTeamRouting(
  teamResponse: UseQueryResult<TeamAPP, unknown>
) {
  // if there is an error, rerout to previos page: page with list of teams
  if (teamResponse.status === "error" || teamResponse.failureCount) {
    return `/teams`;
  }
  return "";
}
