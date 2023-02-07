import { AnswerAPP } from "../../../../api/AnswerAPI/AnswerAPI";
import { CategoryAPP } from "../../../../api/CategoryAPI/CategoryAPI";
import { CheckpointAPP } from "../../../../api/CheckpointAPI/CheckpointAPI";
import { RecommendationAPP } from "../../../../api/RecommendationAPI/RecommendationAPI";
import { SubareaAPP } from "../../../../api/SubareaAPI/SubareaAPI";
import { TopicAPP } from "../../../../api/TopicAPI/TopicAPI";
import { getCheckpointsSubareas } from "../helpersAPI/pdfHelpersAPI";

/**
 * object for a section
 * each section has a title and 0+ texts
 */
export type Section = {
  title: string;
  text: string[];
};

/**
 * table object, it has
 * - a title
 * - sections that appear before the actual table
 * - the headers are the title of the columns of the table
 * - the data is an array of rows, each row is an array
 */
export type Table = {
  title: string;
  sections: Section[];
  data: (string | number)[][];
  headers: string[];
};

/**
 * data referring to the checkpoint,
 * including the answer that was given by the user
 */
export type CheckpointAnswer = {
  id: number;
  description: string;
  order: number;
  topics: string;
  answer: string;
};

/**
 * given the necessary data, it transforms a list of CheckpointAPP objects
 * into a list of CheckpointAnswer objects
 * @param checkpoints checkpoint objects retrieved from the database
 * @param answers answer dictionary that maps a checkpoint id to an answer id
 * @param answerList available answers to a checkpoint
 * @param topicList availble topics assignable to a checkpoint
 * @returns a list of CheckpointAnswer objects, one object per checkpoint in @param checkpoints
 */
export const transformCheckpoints = (
  checkpoints: CheckpointAPP[],
  answers: Record<number, number | undefined>,
  answerList: AnswerAPP[],
  topicList: TopicAPP[]
) =>
  checkpoints.map((c) => {
    const object: CheckpointAnswer = {
      id: Number(c.id),
      description: c.description,
      order: c.order,
      // get the names of the checkpoint topics from their ids
      // names are joined into a string and separated by commas
      topics: topicList
        .filter((t) => c.topics.includes(Number(t.id)))
        .map((t) => t.name)
        .join(", "),
      // get answer label of chosen answer
      answer: answerList
        .filter((a) => a.id === answers[Number(c.id)])
        .map((a) => a.label)
        .join(""),
    };
    return object;
  });

/**
 * transform a CategoryAPP object into
 * a table object containing subarea information,
 * checkpoints and given checkpoints answers
 *
 * the related information has to be given to the function
 * @param area specific area to transform into table
 * @param subareas subareas related to the area
 * @param checkpoints list of CheckpointAnswer objects pertaining to the area
 * @param checkpointHeaders title of columns of table
 * @returns a table object pertaining to @param area
 */
export const transformArea = (
  area: CategoryAPP,
  subareas: SubareaAPP[],
  checkpoints: CheckpointAnswer[],
  checkpointHeaders: string[]
) => ({
  order: area.order,
  title: `Checkpoints: ${area.name}`,
  sections: subareas.map((s) => ({
    title: s.name,
    text: [s.summary, s.description],
  })),
  data: checkpoints.map((c) => [c.order, c.description, c.topics, c.answer]),
  headers: checkpointHeaders,
});

/**
 * given an area and unprocessed related data,
 * it returns a table object related to the area
 * @param area the specific area to transform into a table
 * @param checkpointAnswers answer dictionary that maps each checkpoint id to an answer id
 * @param answerList list of available answers to checkpoints
 * @param topics list of available topics of checkpoints
 * @param checkpointHeaders name of checkpoint table columns
 * @returns a table object related to the specified area
 */
async function processArea(
  area: CategoryAPP,
  checkpointAnswers: Record<number, number | undefined>,
  answerList: AnswerAPP[],
  topics: TopicAPP[],
  checkpointHeaders: string[]
) {
  // get subareas and checkpoints from database
  const checkpointsSubareas = await getCheckpointsSubareas(Number(area.id));
  const { checkpoints, subareas } = checkpointsSubareas;

  // get CheckpointAnswer objects for each checkpoint in the area
  const tCheckpoints = transformCheckpoints(
    checkpoints,
    checkpointAnswers,
    answerList,
    topics
  );

  return transformArea(area, subareas, tCheckpoints, checkpointHeaders);
}

/**
 * Given a list of areas and the rest of the necessary data,
 * this function outputs tables related to each area
 * @param allAreas list of areas to transform into tables
 * @param checkpointHeaders checkpoint table column names
 * @param checkpointAnswers answer dictionary that maps each checkpoint id to an answer id
 * @param answerList available answers to checkpoints
 * @param topics list of available topics of checkpoints
 * @returns list of tables, one for each area
 */
export async function getAreaTables(
  allAreas: CategoryAPP[],
  checkpointHeaders: string[],
  checkpointAnswers: Record<number, number | undefined>,
  answerList: AnswerAPP[],
  topics: TopicAPP[]
) {
  // get a table for each area
  const areaPromises = allAreas.map((a) =>
    processArea(a, checkpointAnswers, answerList, topics, checkpointHeaders)
  );

  // wait for responses for all areas
  const responses = await Promise.all(areaPromises);

  // sort tables based on area order
  const tables = responses.sort((a, b) => a.order - b.order) as Table[];
  return tables;
}

/**
 * given the necessary data, create a table of recommendations
 * @param recs list of recommendations
 * @param recsHeaders names of columns of recommendation table
 * @param feedback general feedback of assessment
 * @param assessorFeedback feedback given by the assessor
 * @returns a table objects related to recommendations
 */
export function getRecTable(
  recs: RecommendationAPP[],
  recsHeaders: string[],
  feedback: string,
  assessorFeedback: string
) {
  const sections: Section[] = [];

  // check if there is general feedback
  // if so, add to sections
  if (feedback) {
    sections.push({ title: "", text: [feedback] });
  }

  // check if there is assessor feedback,
  // if so, add to sections
  if (assessorFeedback) {
    sections.push({ title: "Facilitator Feedback", text: [assessorFeedback] });
  }

  return {
    title: `Recommendations`,
    sections,
    data: recs.map((c) => [c.order, c.description, c.additionalInfo]),
    headers: recsHeaders,
  };
}
