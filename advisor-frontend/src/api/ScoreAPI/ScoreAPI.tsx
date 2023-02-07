import { useQuery } from "react-query";
import API from "../_API";

// APP/API types for scores
export type ScoreAPP = {
  maturityId: number;
  categoryId: number;
  score: number;
};

type ScoreAPI = {
  maturity_id: number;
  category_id: number;
  score: number;
};

/**
 * Convert API object to APP object
 * @param scoreAPI
 * @returns ScoreAPP object
 */
export function scoreToAPP(scoreAPI: ScoreAPI) {
  return {
    maturityId: scoreAPI.maturity_id,
    categoryId: scoreAPI.category_id,
    score: scoreAPI.score,
  } as ScoreAPP;
}

/**
 * Get scores of assessment from database
 */
export function useGetScores(
  assessmentId: number,
  topicId: number | undefined,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/assessment", assessmentId, "/score", topicId],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/assessment/${assessmentId}/score`, {
        params: { topic_id: topicId },
      });

      // Convert data to scoreAPP
      const scoresAPP = data.map((scoreAPI: ScoreAPI) => scoreToAPP(scoreAPI));

      // Return response
      return scoresAPP as ScoreAPP[];
    },
    { onError }
  );
}
