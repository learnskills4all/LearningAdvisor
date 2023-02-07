import {
  Grid,
  Stack,
  Pagination,
  Card,
  Tab,
  Tabs,
  ThemeOptions,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { AnswerAPP } from "../../api/AnswerAPI/AnswerAPI";
import {
  CheckpointAPP,
  useGetCheckpoints,
} from "../../api/CheckpointAPI/CheckpointAPI";
import { SubareaAPP, useGetSubareas } from "../../api/SubareaAPI/SubareaAPI";
import Checkpoint from "../Checkpoint/Checkpoint";
import Subarea from "../Subarea/Subarea";
import { TopicAPP } from "../../api/TopicAPI/TopicAPI";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";

/**
 * Page with a self evaluation that can be filled in
 * This should only be accessible to the user whose assement this belongs to
 * It contains the assessmentId,
 * the list of topics,
 * the id of an area,
 * the list of answers,
 * a list of checkpointanswers,
 * a list that sets the answers of the checkpoints,
 * the 'global' theme,
 * and feedback
 */
function AreaSpecificCheckpoints({
  assessmentId,
  topicList,
  areaId,
  answerList,
  checkpointAnswerList,
  setCheckpointAnswerList,
  theme,
  feedback,
  setCurrentlyAnswered
}: {
  assessmentId: number;
  topicList: TopicAPP[];
  areaId: number;
  answerList: AnswerAPP[];
  checkpointAnswerList: Record<number, number | undefined>;
  setCheckpointAnswerList: React.Dispatch<
    React.SetStateAction<Record<number, number | undefined> | undefined>
  >;
  theme: ThemeOptions;
  feedback: boolean;
  setCurrentlyAnswered: (arg0: number) => void;
}) {
  /**
   * using react useState hook it sets up a page and the changes of a page
   */
  const [page, setPage] = React.useState(1);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  /**
   * set the value initially to the "Single" tab on the page
   */
  const [value, setValue] = React.useState("Single");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    /**
     * here we need to send new value to API
     */
  };

  /**
   * GET ASSESSMENT INFORMATION
   */

  /**
   * Ref for error popup
   */
  const refErrorSubarea = useRef<RefObject>(null);
  const onErrorSubarea = getOnError(refErrorSubarea);

  const [subareaList, setSubareaList] = useState<SubareaAPP[]>();
  const [checkpointList, setCheckpointList] = useState<CheckpointAPP[]>();
  
  /**
   * get answer list from API
   */
  const subareasResponse = useGetSubareas(areaId, true, onErrorSubarea);

  /**
   * get checkpoint list from API
   */
  const checkpointResponse = useGetCheckpoints(areaId, true, onErrorSubarea);

  /**
   * set the subarea list value
   */
  React.useEffect(() => {
    if (subareasResponse.data && subareasResponse.status === "success") {
      setSubareaList(subareasResponse.data);
    }
  }, [subareasResponse]);

  /**
   * set the checkpoint list value
   */
  React.useEffect(() => {
    if (checkpointResponse.data && checkpointResponse.status === "success") {
      const orderedCheckpoints = checkpointResponse.data.sort(
        (a: CheckpointAPP, b: CheckpointAPP) => a.order - b.order
      );
      setCheckpointList(orderedCheckpoints);
    }
  }, [checkpointResponse]);

  React.useEffect(() => {
    setPage(1);
  }, [areaId]);

  const checkpointIdToAnswerLabel = (checkpointId: number) => {
    if (checkpointId in checkpointAnswerList) {
      const answer = checkpointAnswerList[checkpointId] || "-";
      return answer.toString() || "-";
    }
    return "";
  };

  /**
   * constant declaration that creates a checkpointcard
   */
  const createCheckpointCard = (checkpoint: CheckpointAPP) => (
    <Checkpoint
      key={`checkpoint-card-${checkpoint.id}`}
      feedback={feedback}
      checkpointId={Number(checkpoint.id)}
      assessmentId={assessmentId}
      topicList={topicList}
      number={checkpoint.order}
      topicIds={checkpoint.topics}
      selectedAnswer={checkpointIdToAnswerLabel(Number(checkpoint.id))}
      setCheckpointAnswerList={setCheckpointAnswerList}
      theme={theme}
      description={checkpoint.description}
      answers={answerList}
      setCurrentlyAnswered={setCurrentlyAnswered}
    />
  );

  /**
   * return Single / List tabs with the areaspecific checkpoints
   */
  return (
    <div style={{ width: "inherit", display: "contents" }}>
      <Card
        sx={{
          backgroundColor: "white",
          width: "inherit",
          borderRadius: "5px",
        }}
      >
        <Stack direction="row" justifyContent="left" alignItems="center">
          <Tabs value={value} onChange={handleChange} textColor="primary">
            <Tab value="Single" label="Single" />
            <Tab value="List" label="List" />
          </Tabs>
        </Stack>
      </Card>

      {subareaList &&
        subareaList.map((subarea) => (
          <Subarea
            key={`subarea${subarea.id}`}
            theme={theme}
            title={subarea.name}
            summary={subarea.summary}
            description={subarea.description}
          />
        ))}

      {value === "Single" &&
        checkpointList &&
        checkpointList[page - 1] !== undefined &&
        createCheckpointCard(checkpointList[page - 1])}

      {value === "List" &&
        checkpointList !== undefined &&
        checkpointList.map((checkpoint) => createCheckpointCard(checkpoint))}

      <div style={{width: "inherit", marginBottom: "50px"}}>
      {checkpointList !== undefined && (
        <Grid item container direction="column" alignItems="center">
          <Grid item>
            <Stack direction="row" spacing={2} alignItems="center">
              {value === "Single" && (
                <Pagination
                  onChange={handlePageChange}
                  count={checkpointList.length}
                  shape="rounded"
                  color="primary"
                  page={page}
                />
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
      <ErrorPopup ref={refErrorSubarea} />
      </div>
      
    </div>
  );
}

export default AreaSpecificCheckpoints;
