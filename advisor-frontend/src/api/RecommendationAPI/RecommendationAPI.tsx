import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";

// APP/API types for recommendations
export type RecommendationAPP = {
  id: GridRowId;
  order: number;
  description: string;
  additionalInfo: string;
};

export type RecommendationAPI = {
  feedback_id: number;
  order: number;
  feedback_text: string;
  feedback_additional_information: string;
};

/**
 * Convert API object to APP object
 * @param recommendationAPI
 * @returns RecommendationAPP object
 */
export function recommendationToAPP(recommendationAPI: RecommendationAPI) {
  // Define an unique rowId, in case the evaluation is not finished yet.
  let uniqueID = 0;
  if (recommendationAPI.feedback_id === undefined) {
    uniqueID = recommendationAPI.order;
  } else {
    uniqueID = recommendationAPI.feedback_id;
  }
  return {
    id: uniqueID,
    order: recommendationAPI.order,
    description: recommendationAPI.feedback_text,
    additionalInfo: recommendationAPI.feedback_additional_information,
  } as RecommendationAPP;
}

/**
 * Convert APP object to API object
 * @param recommendationAPP
 * @returns RecommendationAPI object
 */
export function recommendationToAPI(recommendationAPP: RecommendationAPP) {
  return {
    feedback_id: recommendationAPP.id,
    order: recommendationAPP.order,
    feedback_text: recommendationAPP.description,
    feedback_additional_information: recommendationAPP.additionalInfo,
  } as RecommendationAPI;
}

/**
 * Get feedback of assessment from database
 */
export function useGetRecommendations(
  assessmentId: number,
  topicId: number | undefined,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/assessment", assessmentId, "/feedback", topicId],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/assessment/${assessmentId}/feedback`, {
        params: { topic_id: topicId },
      });

      // Convert data to recommendationAPP
      const recommendationsAPP = data.map(
        (recommendationAPI: RecommendationAPI) =>
          recommendationToAPP(recommendationAPI)
      );

      // Return response
      return recommendationsAPP as RecommendationAPP[];
    },
    { onError }
  );
}

/**
 * Patch assessment in database
 */
export function usePatchRecommendation(onError?: (err: unknown) => void) {
  return useMutation(
    ["PATCH", "/feedback", "/{feedback_id}"],
    async (recommendationAPP: RecommendationAPP) => {
      // Convert recommendationAPP to assessment
      const recommendationAPI = recommendationToAPI(recommendationAPP);

      // Get response data from database
      const { data } = await API.patch(
        `/feedback/${recommendationAPI.feedback_id}`,
        recommendationAPI
      );

      // Convert data to recommendationAPP
      return recommendationToAPP(data) as RecommendationAPP;
    },
    { onError }
  );
}
