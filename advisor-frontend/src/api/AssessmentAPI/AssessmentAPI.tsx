import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";
import { AssessmentType } from "../../types/AssessmentType";

// APP/API types for assessments
export type AssessmentAPP = {
  id: GridRowId;
  name: string;
  assessmentType: AssessmentType;
  countryName: string;
  departmentName: string;
  templateId: number;
  feedbackText: string;
  information: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  teamId: number;
};

export type AssessmentAPI = {
  assessment_id: number;
  assessment_name: string;
  assessment_type: AssessmentType;
  country_name: string;
  department_name: string;
  template_id: number;
  feedback_text: string;
  information: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  team_id: number;
};

/**
 * Convert API object to APP object
 * @param assessmentAPI
 * @returns AssessmentAPP object
 */
export function assessmentToAPP(assessmentAPI: AssessmentAPI) {
  return {
    id: assessmentAPI.assessment_id,
    name: assessmentAPI.assessment_name,
    assessmentType: assessmentAPI.assessment_type,
    countryName: assessmentAPI.country_name,
    departmentName: assessmentAPI.department_name,
    templateId: assessmentAPI.template_id,
    feedbackText: assessmentAPI.feedback_text,
    information: assessmentAPI.information,
    createdAt: assessmentAPI.created_at,
    updatedAt: assessmentAPI.updated_at,
    completedAt: assessmentAPI.completed_at,
    teamId: assessmentAPI.team_id,
  } as AssessmentAPP;
}

/**
 * Convert APP object to API object
 * @param assessmentAPP
 * @returns AssessmentAPI object
 */
export function assessmentToAPI(assessmentAPP: AssessmentAPP) {
  return {
    assessment_id: assessmentAPP.id,
    assessment_name: assessmentAPP.name,
    assessment_type: assessmentAPP.assessmentType,
    country_name: assessmentAPP.countryName,
    department_name: assessmentAPP.departmentName,
    template_id: assessmentAPP.templateId,
    feedback_text: assessmentAPP.feedbackText,
    information: assessmentAPP.information,
    created_at: assessmentAPP.createdAt,
    updated_at: assessmentAPP.updatedAt,
    completed_at: assessmentAPP.completedAt,
    team_id: assessmentAPP.teamId,
  };
}

// APP/API types for assessment checkpoints
export type AssessmentCheckpointAPP = {
  checkpointId: number;
  answerId: number | undefined;
};

export type AssessmentCheckpointAPI = {
  checkpoint_id: number;
  answer_id: number | undefined;
};

/**
 * Convert API object to APP object
 * @param assessmentCheckpointAPI
 * @returns AssessmentCheckpointAPP object
 */
export function assessmentCheckpointToAPP(
  assessmentCheckpointAPI: AssessmentCheckpointAPI
) {
  return {
    checkpointId: assessmentCheckpointAPI.checkpoint_id,
    answerId: assessmentCheckpointAPI.answer_id,
  } as AssessmentCheckpointAPP;
}

/**
 * Convert APP object to API object
 * @param assessmentCheckpointAPP
 * @returns AssessmentCheckpointAPI object
 */
export function assessmentCheckpointToAPI(
  assessmentCheckpointAPP: AssessmentCheckpointAPP
) {
  return {
    checkpoint_id: assessmentCheckpointAPP.checkpointId,
    answer_id: assessmentCheckpointAPP.answerId,
  } as AssessmentCheckpointAPI;
}

/**
 * Get all assessments from database
 */
export function useGetAssessments(onError?: (err: unknown) => void) {
  return useQuery(
    ["GET", "/assessment"],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/assessment`);

      // Convert filtered data to assessmentsAPP
      const assessmentsAPP = data.map((assessmentAPI: AssessmentAPI) =>
        assessmentToAPP(assessmentAPI)
      );

      return assessmentsAPP as AssessmentAPP[];
    },
    { onError }
  );
}

/**
 * Filters assessments
 * @param data Data to be filtered
 * @param isCompleted Is the assessment completed?
 * @returns Filtered data
 */
export const filterCompletedAssessments = (
  data: AssessmentAPI[],
  isCompleted: boolean
) => {
  // Filter data on whether it is completed
  const dataFiltered = isCompleted
    ? data.filter((assessmentAPI: AssessmentAPI) => assessmentAPI.completed_at)
    : data.filter(
        (assessmentAPI: AssessmentAPI) => !assessmentAPI.completed_at
      );

  // Convert filtered data to assessmentsAPP
  const assessmentsAPP = dataFiltered.map((assessmentAPI: AssessmentAPI) =>
    assessmentToAPP(assessmentAPI)
  );

  return assessmentsAPP as AssessmentAPP[];
};

/**
 * Get all my individual assessments from database
 */
export function useGetMyIndividualAssessments(
  isCompleted: boolean,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/assessment/my", isCompleted],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/assessment/my`);
      return filterCompletedAssessments(data, isCompleted);
    },
    { onError }
  );
}

/**
 * Get all my team assessments from database
 */
export function useGetMyTeamAssessments(
  isCompleted: boolean,
  teamId: number,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/teams", teamId, "/assessments", isCompleted],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/teams/${teamId}/assessments`);
      return filterCompletedAssessments(data, isCompleted);
    },
    { onError }
  );
}

/**
 * Get assessment with id from database
 */
export function useGetAssessment(
  assessmentId: number,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/assessment", assessmentId],
    async () => {
      // Get data from database
      const { data } = await API.get(`/assessment/${assessmentId}`);

      return assessmentToAPP(data) as AssessmentAPP;
    },
    {
      onError,
      enabled: !!assessmentId,
    }
  );
}

/**
 * Post assessment to database
 */
export function usePostAssessment(
  assessmentType: AssessmentType,
  teamId?: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/assessment"],
    async () => {
      // Get response data from database
      const { data } = await API.post(
        `/assessment`,
        teamId
          ? {
              assessment_type: assessmentType,
              team_id: teamId,
            }
          : {
              assessment_type: assessmentType,
            }
      );

      // Convert data to assessmentAPP
      return assessmentToAPP(data) as AssessmentAPP;
    },
    { onError }
  );
}

/**
 * Patch assessment in database
 */
export function usePatchAssessment(onError?: (err: unknown) => void) {
  return useMutation(
    ["PATCH", "/assessment", "/{assessment_id}"],
    async (assessmentAPP: AssessmentAPP) => {
      // Convert assessmentAPP to assessment
      const assessmentAPI = assessmentToAPI(assessmentAPP);

      // Get response data from database
      const { data } = await API.patch(
        `/assessment/${assessmentAPI.assessment_id}`,
        assessmentAPI
      );

      // Convert data to assessmentAPP
      return assessmentToAPP(data) as AssessmentAPP;
    },
    { onError }
  );
}

/**
 * Delete assessment from database
 */
export function useDeleteAssessment(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/assessment", "/{assessment_id}"],
    async (assessmentId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/assessment/${assessmentId}`);

      // Convert data to assessmentAPP
      return assessmentToAPP(data) as AssessmentAPP;
    },
    { onError }
  );
}

/**
 * Complete assessment in database
 */
export function usePostCompleteAssessment(
  assessmentId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/assessment", assessmentId, "/complete"],
    async () => {
      // Get response data from database
      const { data } = await API.post(`/assessment/${assessmentId}/complete`);

      // Convert data to assessmentAPP
      return assessmentToAPP(data) as AssessmentAPP;
    },
    { onError }
  );
}

/**
 * Save assessment checkpoint in database
 */
export function usePostSaveAssessment(
  assessmentId: number,
  oldValue: string,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/assessment", assessmentId, "/save"],
    async (assessmentCheckpointAPP: AssessmentCheckpointAPP) => {
      const assessmentCheckpointAPI = assessmentCheckpointToAPI(
        assessmentCheckpointAPP
      );

      // Get response data from database
      const { data } = await API.post(
        `/assessment/${assessmentId}/save`,
        assessmentCheckpointAPI
      );

      // Return response
      return data;
    },
    {
      onError,
      onMutate: () => ({ oldValue }),
    }
  );
}

/**
 * Get saved assessment checkpoints from database
 */
export function useGetSaveAssessment(
  assessmentId: number,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/assessment", assessmentId, "/save"],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/assessment/${assessmentId}/save`);
      // Convert data to checkpointsAPP
      const checkpointsAPP = data.map(
        (assessmentCheckpointAPI: AssessmentCheckpointAPI) =>
          assessmentCheckpointToAPP(assessmentCheckpointAPI)
      );

      // Return response
      return checkpointsAPP as AssessmentCheckpointAPP[];
    },
    {
      onError,
      enabled: !!assessmentId,
    }
  );
}

/**
 * Post feedback of assessment to database
 */
export function usePostFeedbackAssessment(
  assessmentId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/assessment", assessmentId, "/feedback"],
    async (feedbackText: string) => {
      // Get response data from database
      const { data } = await API.post(`/assessment/${assessmentId}/feedback`, {
        feedback_text: feedbackText,
      });

      // Convert data to assessmentAPP
      const assessmentAPP = assessmentToAPP(data);

      // Return response
      return assessmentAPP as AssessmentAPP;
    },
    { onError }
  );
}
