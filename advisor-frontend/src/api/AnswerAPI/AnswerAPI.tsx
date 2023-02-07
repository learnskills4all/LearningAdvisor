import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";

// export AnswerApp as a type
export type AnswerAPP = {
  id: GridRowId;
  label: string;
  value: number;
  templateId: number;
  enabled: boolean;
};

/**
 * declare type AnswerAPI, that consists of
 * answer_id which is a number,
 * answer_text which is a text expressed in strings,
 * answer_weight which is a value/number for the weights per answer,
 * template_id which states the id of each template (expressed in numbers)
 * a boolean value disabled (that makes sure that e.g. answers to the checkpoints get disabled)
 * once completing evaluations
 */
export type AnswerAPI = {
  answer_id: number;
  answer_text: string;
  answer_weight: number;
  template_id: number;
  disabled: boolean;
};

/**
 * Convert API object to APP object
 * @param answerAPI
 * @returns AnswerAPP object
 */
export function answerToAPP(answerAPI: AnswerAPI) {
  return {
    id: answerAPI.answer_id,
    label: answerAPI.answer_text,
    value: answerAPI.answer_weight,
    templateId: answerAPI.template_id,
    enabled: !answerAPI.disabled,
  } as AnswerAPP;
}

/**
 * Convert APP object to API object
 * @param answerAPP
 * @returns AnswerAPI object
 */
export function answerToAPI(answerAPP: AnswerAPP) {
  return {
    answer_id: answerAPP.id,
    answer_text: answerAPP.label,
    answer_weight: answerAPP.value,
    template_id: answerAPP.templateId,
    disabled: !answerAPP.enabled,
  } as AnswerAPI;
}

/**
 * Get all answers from database
 */
export function useGetAnswers(
  templateId: number,
  enabledFilter?: boolean,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/template", templateId, "/answer"],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/template/${templateId}/answer`);

      // Convert data to answersAPP
      const answersAPP = data.map((answerAPI: AnswerAPI) =>
        answerToAPP(answerAPI)
      );
      // If defined, filter on enabled/disabled
      if (enabledFilter !== undefined) {
        const answersFilteredAPP = answersAPP.filter(
          (answerAPP: AnswerAPP) => answerAPP.enabled === enabledFilter
        );

        return answersFilteredAPP as AnswerAPP[];
      }

      // Convert data to answerAPP
      return answersAPP as AnswerAPP[];
    },
    {
      onError,
      enabled: !!templateId,
    }
  );
}

/**
 * Get answer with id from database
 */
export function useGetAnswer(onError?: (err: unknown) => void) {
  return useQuery(
    ["GET", "/answer", "/answer_id}"],
    async (answerId) => {
      // Get data from database
      const { data } = await API.get(`/answer/${answerId}`);

      return answerToAPP(data) as AnswerAPP;
    },
    { onError }
  );
}

/**
 * Post answer to database
 */
export function usePostAnswer(
  templateId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/template", templateId, "/answer"],
    async () => {
      // Get response data from database
      const { data } = await API.post(`/template/${templateId}/answer`);

      // Convert data to answerAPP
      return answerToAPP(data) as AnswerAPP;
    },
    { onError }
  );
}

/**
 * Patch answer in database
 */
export function usePatchAnswer(onError?: (err: unknown) => void) {
  return useMutation<AnswerAPP, Error, AnswerAPP>(
    ["PATCH", "/answer", "/{answer_id}"],
    async (answerAPP: AnswerAPP) => {
      // Convert answerAPP to template
      const answer = answerToAPI(answerAPP);

      // Get response data from database
      const { data } = await API.patch(`/answer/${answer.answer_id}`, answer);

      // Convert data to answerAPP
      return answerToAPP(data) as AnswerAPP;
    },
    { onError }
  );
}

/**
 * Delete answer from database
 */
export function useDeleteAnswer(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/answer", "/{answer_id}"],
    async (answerId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/answer/${answerId}`);

      // Convert data to answerAPP
      return answerToAPP(data) as AnswerAPP;
    },
    { onError }
  );
}
