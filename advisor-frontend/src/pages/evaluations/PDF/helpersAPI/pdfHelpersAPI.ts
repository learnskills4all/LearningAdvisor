import API from "../../../../api/_API";
import {
  CheckpointAPI,
  CheckpointAPP,
  checkpointToAPP,
} from "../../../../api/CheckpointAPI/CheckpointAPI";
import {
  SubareaAPI,
  SubareaAPP,
  subareaToAPP,
} from "../../../../api/SubareaAPI/SubareaAPI";
import {
  RecommendationAPI,
  RecommendationAPP,
  recommendationToAPP,
} from "../../../../api/RecommendationAPI/RecommendationAPI";
import {
  TemplateAPP,
  templateToAPP,
} from "../../../../api/TemplateAPI/TemplateAPI";
import {
  CategoryAPI,
  CategoryAPP,
  categoryToAPP,
} from "../../../../api/CategoryAPI/CategoryAPI";
import {
  AnswerAPI,
  AnswerAPP,
  answerToAPP,
} from "../../../../api/AnswerAPI/AnswerAPI";
import {
  TopicAPI,
  TopicAPP,
  topicToAPP,
} from "../../../../api/TopicAPI/TopicAPI";
import {
  AssessmentCheckpointAPI,
  AssessmentCheckpointAPP,
  assessmentCheckpointToAPP,
} from "../../../../api/AssessmentAPI/AssessmentAPI";

/**
 * Given a template id, the function retrieves a list
 * of enabled areas with their properties
 * @param templateId
 * @returns list of enabled areas of template presented as CategoryAPPs objects
 */
export async function getAreas(templateId: number) {
  // get areas available in template from API
  // and tranform them to a list of CategoryAPPs
  const { data } = await API.get(`/template/${templateId}/category`);
  const areas = data.map((categoryAPI: CategoryAPI) =>
    categoryToAPP(categoryAPI)
  );

  // filter to get only enabled areas
  const areasFiltered = areas.filter(
    (categoryAPP: CategoryAPP) => categoryAPP.enabled
  );

  return areasFiltered as CategoryAPP[];
}

/**
 * Given a template id, the function retrieves
 * the list of available answers to checkpoints
 * @param templateId
 * @returns list of answers to checkpoints of template,
 *  presented as AnswerAPP objects
 */
export async function getAnswers(templateId: number) {
  // get answers available in template from API
  // and tranform them into a list of AnswerAPPs
  const { data } = await API.get(`/template/${templateId}/answer`);
  const answersAPP = data.map((answerAPI: AnswerAPI) => answerToAPP(answerAPI));

  return answersAPP as AnswerAPP[];
}

/**
 * Given a template id, the function retrieves
 * the list of topics available in the template
 * @param templateId
 * @returns list of topics in the template,
 *  presented as TopicAPP objects
 */
export async function getTopics(templateId: number) {
  // get topics available in template from API
  // and tranform them to a list of TopicAPPs
  const { data } = await API.get(`/template/${templateId}/topic`);
  const topicsAPP = data.map((topicAPI: TopicAPI) => topicToAPP(topicAPI));

  return topicsAPP as TopicAPP[];
}

/**
 * Given an assessment id, the function retrieves the answers
 * that were already given to checkpoints
 * @param assessmentId
 * @returns record that maps each checkpoint id to an answer id
 *  checkpoint that were not answered do not appear
 */
export async function getAnswerDictionary(assessmentId: number) {
  // get answers to checkpoints of assessment from API
  // and tranform list of checkpoints into list of CheckpointAPPs
  const { data } = await API.get(`/assessment/${assessmentId}/save`);
  const checkpointsAPP = data.map((acAPI: AssessmentCheckpointAPI) =>
    assessmentCheckpointToAPP(acAPI)
  );

  // create an answer dictionary where each checkpointId
  // maps to an answerId
  const answerDictionary: Record<number, number | undefined> = {};
  checkpointsAPP.forEach((a: AssessmentCheckpointAPP) => {
    answerDictionary[a.checkpointId] = a.answerId;
  });

  return answerDictionary;
}

/**
 * Given an area id, the function retrieves
 * the list of enabled checkpoints belonging to that area
 * @param areaId
 * @returns sorted list of enabled checkpoints as CheckpointAPP objects
 */
export async function getCheckpoints(areaId: number) {
  // retrieve checkpoints from API
  const { data } = await API.get(`/category/${areaId}/checkpoint`);

  // transform checkpoints into CheckpointAPP objects
  // and sort them based on order property in ascending order
  const checkpointsAPP = data
    .map((checkpointAPI: CheckpointAPI) => checkpointToAPP(checkpointAPI))
    .sort((a: CheckpointAPI, b: CheckpointAPI) => a.order - b.order);

  // filter to only get enabled checkpoints
  const checkpointsFilteredAPP = checkpointsAPP.filter(
    (checkpointAPP: CheckpointAPP) => checkpointAPP.enabled
  );

  return checkpointsFilteredAPP as CheckpointAPP[];
}

/**
 * Given a template id, retrive template information
 * @param templateId
 * @returns template information as a TemplateAPP object
 */
export async function getTemplate(templateId: number) {
  // get template data from API
  const { data } = await API.get(`/template/${templateId}`);

  // transform into a TemplateAPP object
  return templateToAPP(data) as TemplateAPP;
}

/**
 * Given the id of an area, get the list of subareas
 * @param areaId
 * @returns list of enabled subareas as SubareaAPP objects
 */
export async function getSubareas(areaId: number) {
  // get subareas data from database
  const { data } = await API.get(`/category/${areaId}/subarea`);

  // Convert data to subareasAPP
  const subareasAPP = data.map((subareaAPI: SubareaAPI) =>
    subareaToAPP(subareaAPI)
  );

  // filter to exclude subareas that are not enabled
  const subareasFilteredAPP = subareasAPP.filter(
    (subareaAPP: SubareaAPP) => subareaAPP.enabled
  );

  return subareasFilteredAPP as SubareaAPP[];
}

/**
 * given an assessment id, retrive the recommendations generated
 * and potentially sort on topic based on the topic id give
 * @param assessmentId to get recommendations for
 * @param topicId to potentially sort recommendations on
 * @returns list of sorted recommendations as RecommendationAPP objects
 */
export async function getTopicRecommendations(
  assessmentId: number,
  topicId: number | undefined
) {
  // retrieve data from database
  const { data } = await API.get(`/assessment/${assessmentId}/feedback`, {
    params: { topic_id: topicId },
  });

  // Convert data to recommendationAPP
  const recommendationsAPP = data.map((recommendationAPI: RecommendationAPI) =>
    recommendationToAPP(recommendationAPI)
  );

  return recommendationsAPP as RecommendationAPP[];
}

/**
 * given an area id, return both the checkpoint list
 * and the subarea list
 * @param areaId
 * @returns an object containing a list of checkpoints as CheckpointAPP objects
 * and a list of subareas as SubareaAPP objects
 */
export async function getCheckpointsSubareas(areaId: number) {
  // call API functions for subareas and checkpoints
  const checkpoints = await getCheckpoints(areaId);
  const subareas = await getSubareas(areaId);
  return {
    checkpoints,
    subareas,
  };
}
