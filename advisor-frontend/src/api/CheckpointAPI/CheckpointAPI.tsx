import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";

// APP/API types for checkpoints
export type CheckpointAPP = {
  id: GridRowId;
  description: string;
  additionalInfo: string;
  weight: number;
  order: number;
  categoryId: number;
  maturityId: number;
  topics: number[];
  enabled: boolean;
};

export type CheckpointAPI = {
  checkpoint_id: number;
  checkpoint_description: string;
  checkpoint_additional_information: string;
  weight: number;
  order: number;
  category_id: number;
  maturity_id: number;
  topics: number[];
  disabled: boolean;
};

/**
 * Convert API object to APP object
 * @param checkpointAPI
 * @returns CheckpointAPP object
 */
export function checkpointToAPP(checkpointAPI: CheckpointAPI) {
  return {
    id: checkpointAPI.checkpoint_id,
    description: checkpointAPI.checkpoint_description,
    additionalInfo: checkpointAPI.checkpoint_additional_information,
    weight: checkpointAPI.weight,
    order: checkpointAPI.order,
    categoryId: checkpointAPI.category_id,
    maturityId: checkpointAPI.maturity_id,
    topics: checkpointAPI.topics,
    enabled: !checkpointAPI.disabled,
  } as CheckpointAPP;
}

/**
 * Convert APP object to API object
 * @param checkpointAPP
 * @returns CheckpointAPI object
 */
export function checkpointToAPI(checkpointAPP: CheckpointAPP) {
  return {
    checkpoint_id: checkpointAPP.id,
    checkpoint_description: checkpointAPP.description,
    checkpoint_additional_information: checkpointAPP.additionalInfo,
    weight: checkpointAPP.weight,
    order: checkpointAPP.order,
    category_id: checkpointAPP.categoryId,
    maturity_id: checkpointAPP.maturityId,
    topics: checkpointAPP.topics,
    disabled: !checkpointAPP.enabled,
  } as CheckpointAPI;
}

/**
 * Get all checkpoints from database
 */
export function useGetCheckpoints(
  categoryId: number,
  enabledFilter?: boolean,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/category", categoryId, "/checkpoint"],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/category/${categoryId}/checkpoint`);

      // Convert data to checkpointsAPP
      const checkpointsAPP = data.map((checkpointAPI: CheckpointAPI) =>
        checkpointToAPP(checkpointAPI)
      );

      // If defined, filter on enabled/disabled
      if (enabledFilter !== undefined) {
        const checkpointsFilteredAPP = checkpointsAPP.filter(
          (checkpointAPP: CheckpointAPP) =>
            checkpointAPP.enabled === enabledFilter
        );

        return checkpointsFilteredAPP as CheckpointAPP[];
      }

      return checkpointsAPP as CheckpointAPP[];
    },
    { onError, enabled: !!categoryId }
  );
}

/**
 * Get checkpoint with id from database
 */
export function useGetCheckpoint(onError?: (err: unknown) => void) {
  return useQuery(
    ["GET", "/checkpoint", "/{checkpoint_id}"],
    async (checkpointId) => {
      // Get data from database
      const { data } = await API.get(`/checkpoint/${checkpointId}`);

      return checkpointToAPP(data) as CheckpointAPP;
    },
    { onError }
  );
}

/**
 * Post checkpoint to database
 */
export function usePostCheckpoint(
  categoryId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/category", categoryId, "/checkpoint"],
    async () => {
      // Get response data from database
      const { data } = await API.post(`/category/${categoryId}/checkpoint`);

      // Convert data to checkpointAPP
      return checkpointToAPP(data) as CheckpointAPP;
    },
    { onError }
  );
}

/**
 * Patch checkpoint in database
 */
export function usePatchCheckpoint(onError?: (err: unknown) => void) {
  return useMutation(
    ["PATCH", "/checkpoint", "/{checkpoint_id}"],
    async (checkpointAPP: CheckpointAPP) => {
      // Convert checkpointAPP to checkpoint
      const checkpointAPI = checkpointToAPI(checkpointAPP);

      // Get response data from database
      const { data } = await API.patch(
        `/checkpoint/${checkpointAPI.checkpoint_id}`,
        checkpointAPI
      );

      // Convert data to checkpointAPP
      return checkpointToAPP(data) as CheckpointAPP;
    },
    { onError }
  );
}

/**
 * Delete checkpoint from database
 */
export function useDeleteCheckpoint(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/checkpoint", "/{checkpoint_id}"],
    async (checkpointId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/checkpoint/${checkpointId}`);

      // Convert data to checkpointAPP
      return checkpointToAPP(data) as CheckpointAPP;
    },
    { onError }
  );
}
