import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";
import { AssessmentType } from "../../types/AssessmentType";

// APP/API types for templates
export type TemplateAPP = {
  id: GridRowId;
  name: string;
  description: string;
  templateType: AssessmentType;
  feedback: string;
  information: string;
  enabled: boolean;
  weightRangeMin: number;
  weightRangeMax: number;
  scoreFormula: string;
  includeNoAnswer: boolean;
};

export type TemplateAPI = {
  template_id: number;
  template_name: string;
  template_description: string;
  template_type: AssessmentType;
  template_feedback: string;
  information: string;
  enabled: boolean;
  weight_range_min: number;
  weight_range_max: number;
  score_formula: string;
  include_no_answer: boolean;
};

/**
 * Convert API object to APP object
 * @param templatetAPI
 * @returns TemplateAPP object
 */
export function templateToAPP(templateAPI: TemplateAPI) {
  return {
    id: templateAPI.template_id,
    name: templateAPI.template_name,
    description: templateAPI.template_description,
    templateType: templateAPI.template_type,
    feedback: templateAPI.template_feedback,
    information: templateAPI.information,
    enabled: templateAPI.enabled,
    weightRangeMin: templateAPI.weight_range_min,
    weightRangeMax: templateAPI.weight_range_max,
    scoreFormula: templateAPI.score_formula,
    includeNoAnswer: templateAPI.include_no_answer,
  } as TemplateAPP;
}

/**
 * Convert APP object to API object
 * @param templateAPP
 * @returns TemplateAPI object
 */
export function templateToAPI(templateAPP: TemplateAPP) {
  return {
    template_id: templateAPP.id,
    template_name: templateAPP.name,
    template_description: templateAPP.description,
    template_type: templateAPP.templateType,
    template_feedback: templateAPP.feedback,
    information: templateAPP.information,
    enabled: templateAPP.enabled,
    weight_range_min: templateAPP.weightRangeMin,
    weight_range_max: templateAPP.weightRangeMax,
    score_formula: templateAPP.scoreFormula,
    include_no_answer: templateAPP.includeNoAnswer,
  } as TemplateAPI;
}

/**
 * Get all templates from database
 */
export function useGetTemplates(
  templateType: AssessmentType,
  enabledFilter?: boolean,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/template", templateType, enabledFilter],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/template`);

      // Filter data on type of the templates
      const dataFiltered = data.filter(
        (templateAPI: TemplateAPI) => templateAPI.template_type === templateType
      );

      // Convert filtered data to templatesAPP
      const templatesAPP = dataFiltered.map((templateAPI: TemplateAPI) =>
        templateToAPP(templateAPI)
      );

      // If defined, filter on enabled/disabled
      if (enabledFilter !== undefined) {
        const templatesFilteredAPP = templatesAPP.filter(
          (templateAPP: TemplateAPP) => templateAPP.enabled === enabledFilter
        );

        return templatesFilteredAPP as TemplateAPP[];
      }

      return templatesAPP as TemplateAPP[];
    },
    { onError }
  );
}

/**
 * Get template with id from database
 */
export function useGetTemplate(
  templateId: number,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/template", templateId],
    async () => {
      // Get data from database
      const { data } = await API.get(`/template/${templateId}`);

      return templateToAPP(data) as TemplateAPP;
    },
    {
      onError,
      enabled: !!templateId,
    }
  );
}

/**
 * Post template to database
 */
export function usePostTemplate(
  templateType: AssessmentType,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/template"],
    async () => {
      // Get response data from database
      const { data } = await API.post(`/template`, {
        template_type: templateType,
      });

      // Convert data to templateAPP
      return templateToAPP(data) as TemplateAPP;
    },
    { onError }
  );
}

/**
 * Patch template in database
 */
export function usePatchTemplate(onError?: (err: unknown) => void) {
  return useMutation(
    ["PATCH", "/template", "/{template_id}"],
    async (templateAPP: TemplateAPP) => {
      // Convert templateAPP to templateAPI
      const templateAPI = templateToAPI(templateAPP);

      // Get response data from database
      const { data } = await API.patch(
        `/template/${templateAPI.template_id}`,
        templateAPI
      );

      // Convert data to templateAPP
      return templateToAPP(data) as TemplateAPP;
    },
    { onError }
  );
}

/**
 * Delete template from database
 */
export function useDeleteTemplate(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/template", "/{template_id}"],
    async (templateId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/template/${templateId}`);

      // Convert data to templateAPP
      return templateToAPP(data) as TemplateAPP;
    },
    { onError }
  );
}

/**
 * Duplicate template to database
 */
export function useDuplicateTemplate(onError?: (err: unknown) => void) {
  return useMutation(
    ["POST", "/template", "/{template_id}", "/clone"],
    async (templateId: number) => {
      const { data } = await API.post(`/template/${templateId}/clone`);

      return templateToAPP(data) as TemplateAPP;
    },
    { onError }
  );
}
