import { useQuery, useMutation } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";

// APP/API types for topics
export type TopicAPP = {
  id: GridRowId;
  name: string;
  templateId: number;
  enabled: boolean;
};

export type TopicAPI = {
  topic_id: number;
  topic_name: string;
  template_id: number;
  disabled: boolean;
};

/**
 * Convert API object to APP object
 * @param topicAPI
 * @returns TopicAPP object
 */
export function topicToAPP(topicAPI: TopicAPI) {
  return {
    id: topicAPI.topic_id,
    name: topicAPI.topic_name,
    templateId: topicAPI.template_id,
    enabled: !topicAPI.disabled,
  } as TopicAPP;
}

/**
 * Convert APP object to API object
 * @param topicAPP
 * @returns TopicAPI object
 */
export function topicToAPI(topicAPP: TopicAPP) {
  return {
    topic_id: topicAPP.id,
    topic_name: topicAPP.name,
    template_id: topicAPP.templateId,
    disabled: !topicAPP.enabled,
  } as TopicAPI;
}

/**
 * Get all topics from database
 */
export function useGetTopics(
  templateId: number,
  enabledFilter?: boolean,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/template", templateId, "/topic", enabledFilter],
    async () => {
      // Get response data from database
      const { data } = await API.get(`/template/${templateId}/topic`);

      // Convert data to topicsAPP
      const topicsAPP = data.map((topicAPI: TopicAPI) => topicToAPP(topicAPI));
      // If defined, filter on enabled/disabled
      if (enabledFilter !== undefined) {
        const topicsFilteredAPP = topicsAPP.filter(
          (topicAPP: TopicAPP) => topicAPP.enabled === enabledFilter
        );

        return topicsFilteredAPP as TopicAPP[];
      }

      return topicsAPP as TopicAPP[];
    },
    {
      onError,
      enabled: !!templateId,
    }
  );
}

/**
 * Get topic with id from database
 */
export function useGetTopic(topicId: number, onError?: (err: unknown) => void) {
  return useQuery(
    ["GET", "/topic", "/{topic_id}"],
    async () => {
      // Get data from database
      const { data } = await API.get(`/topic/${topicId}`);

      return topicToAPP(data) as TopicAPP;
    },
    {
      onError,
      enabled: !!topicId,
    }
  );
}

/**
 * Post topic to database
 */
export function usePostTopic(
  templateId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["POST", "/template", templateId, "/topic"],
    async () => {
      // Get response data from database
      const { data } = await API.post(`/template/${templateId}/topic`);

      // Convert data to topicAPP
      return topicToAPP(data) as TopicAPP;
    },
    { onError }
  );
}

/**
 * Patch topic in database
 */
export function usePatchTopic(onError?: (err: unknown) => void) {
  return useMutation(
    ["PATCH", "/topic", "/{topic_id}"],
    async (topicAPP: TopicAPP) => {
      // Convert topicAPP to template
      const topicAPI = topicToAPI(topicAPP);

      // Get response data from database
      const { data } = await API.patch(`/topic/${topicAPI.topic_id}`, topicAPI);

      // Convert data to topicAPP
      return topicToAPP(data) as TopicAPP;
    },
    { onError }
  );
}

/**
 * Delete topic from database
 */
export function useDeleteTopic(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/topic", "/{topic_id}"],
    async (topicId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/topic/${topicId}`);

      // Convert data to topicAPP
      return topicToAPP(data) as TopicAPP;
    },
    { onError }
  );
}
