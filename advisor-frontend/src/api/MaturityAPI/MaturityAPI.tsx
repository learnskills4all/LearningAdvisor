import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";

// APP/API types for maturities
export type MaturityAPP = {
  id: GridRowId;
  name: string;
  order: number;
  templateId: number;
  enabled: boolean;
};

export type MaturityAPI = {
  maturity_id: number;
  maturity_name: string;
  order: number;
  template_id: number;
  disabled: boolean;
};

/**
 * Convert API object to APP object
 * @param maturityAPI
 * @returns MaturityAPP object
 */
export function maturityToAPP(maturityAPI: MaturityAPI) {
  return {
    id: maturityAPI.maturity_id,
    name: maturityAPI.maturity_name,
    order: maturityAPI.order,
    templateId: maturityAPI.template_id,
    enabled: !maturityAPI.disabled,
  } as MaturityAPP;
}

/**
 * Convert APP object to API object
 * @param maturityAPP
 * @returns MaturityAPI object
 */
export function maturityToAPI(maturityAPP: MaturityAPP) {
  return {
    maturity_id: maturityAPP.id,
    maturity_name: maturityAPP.name,
    order: maturityAPP.order,
    template_id: maturityAPP.templateId,
    disabled: !maturityAPP.enabled,
  } as MaturityAPI;
}

/**
 * Get all maturities from database
 */
export function useGetMaturities(
  templateId: number,
  enabledFilter?: boolean,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/template", templateId, "/maturity", enabledFilter],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/template/${templateId}/maturity`);

      // Convert data to maturitiesAPP
      const maturitiesAPP = data.map((maturityAPI: MaturityAPI) =>
        maturityToAPP(maturityAPI)
      );

      // If defined, filter on enabled/disabled
      if (enabledFilter !== undefined) {
        const maturitiesFilteredAPP = maturitiesAPP.filter(
          (maturityAPP: MaturityAPP) => maturityAPP.enabled === enabledFilter
        );

        return maturitiesFilteredAPP as MaturityAPP[];
      }

      return maturitiesAPP as MaturityAPP[];
    },
    { onError }
  );
}

/**
 * Get maturity with id from database
 */
export function useGetMaturity(onError?: (err: unknown) => void) {
  return useQuery(
    ["GET", "/maturity", "/{maturity_id}"],
    async (maturityId) => {
      // Get data from database
      const { data } = await API.get(`/maturity/${maturityId}`);

      // Convert data to maturityAPP
      return maturityToAPP(data) as MaturityAPP;
    },
    { onError }
  );
}

/**
 * Post maturity to database
 */
export function usePostMaturity(
  templateId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/template", templateId, "/maturity"],
    async () => {
      // Get response data from database
      const { data } = await API.post(`/template/${templateId}/maturity`);

      // Convert data to maturityAPP
      return maturityToAPP(data) as MaturityAPP;
    },
    { onError }
  );
}

/**
 * Patch maturity in database
 */
export function usePatchMaturity(onError?: (err: unknown) => void) {
  return useMutation(
    ["PATCH", "/maturity", "/{maturity_id}"],
    async (maturityAPP: MaturityAPP) => {
      // Convert maturityAPP to template
      const maturityAPI = maturityToAPI(maturityAPP);

      // Get response data from database
      const { data } = await API.patch(
        `/maturity/${maturityAPI.maturity_id}`,
        maturityAPI
      );

      // Convert data to maturityAPP
      return maturityToAPP(data) as MaturityAPP;
    },
    { onError }
  );
}

/**
 * Delete maturity from database
 */
export function useDeleteMaturity(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/maturity", "/{maturity_id}"],
    async (maturityId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/maturity/${maturityId}`);

      // Convert data to maturityAPP
      return maturityToAPP(data) as MaturityAPP;
    },
    { onError }
  );
}
