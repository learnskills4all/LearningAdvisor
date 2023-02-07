import React, { useState } from "react";
import {
  ThemeProvider,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ThemeOptions } from "@mui/material/styles/experimental_extendTheme";
import { AnswerAPP } from "../../api/AnswerAPI/AnswerAPI";
import { TopicAPP } from "../../api/TopicAPI/TopicAPI";
import { usePostSaveAssessment } from "../../api/AssessmentAPI/AssessmentAPI";

/**
 * passing parameter of the optional description of the checkpoints
 * description of checkpoint = description
 * description might be empty string
 * main function returning a checkpoint omponent
 */
function Checkpoint({
  description,
  checkpointId,
  assessmentId,
  number,
  topicIds,
  topicList,
  answers,
  selectedAnswer,
  setCheckpointAnswerList,
  theme,
  feedback,
  setCurrentlyAnswered,
}: {
  description: string;
  checkpointId: number;
  assessmentId: number;
  number: number;
  topicIds: number[];
  topicList: TopicAPP[];
  answers: AnswerAPP[];
  selectedAnswer: string;
  setCheckpointAnswerList:
    | React.Dispatch<
        React.SetStateAction<Record<number, number | undefined> | undefined>
      >
    | undefined;
  theme: ThemeOptions;
  feedback: boolean;
  setCurrentlyAnswered: (arg0: number) => void;
}) {
  /**
   * set the value when clicking on
   * one of the radio-buttons
   */
  const [value, setValue] = useState(selectedAnswer);

  React.useEffect(() => {
    setValue(selectedAnswer);
  }, [selectedAnswer]);

  const postCheckpointAnswer = usePostSaveAssessment(assessmentId, value);

  /**
   * constant declaration changeAnswerList that returns a (new) list of the answers once changing them
   */
  const changeAnswerList = (newAnswer: string) => {
    if (setCheckpointAnswerList) {
      setCheckpointAnswerList((old) => {
        if (old) {
          const newList = old;
          newList[checkpointId] =
            newAnswer !== "-" ? Number(newAnswer) : undefined;
          return newList;
        }
        return old;
      });
    }
  };

  /**
   * constant declaration that lets you to change the answer
   * of the checkpoints in assessments/evaluations
   */
  const changeCheckpointAnswer = (newValue: string) => {
    const newAssessmentCheckpoint = {
      checkpointId,
      answerId: newValue !== "-" ? Number(newValue) : undefined,
    };
    postCheckpointAnswer.mutate(newAssessmentCheckpoint, {
      onSuccess: () => {
        setValue(newValue);
      },
      onError: (err, _, context) => {
        if (context) {
          setValue(context.oldValue);
          changeAnswerList(context.oldValue);
        }
      },
    });
  };

  /**
   * constant declaration handleClick that assigns value, when clicking
   * on the radiobuttons/checkpoints, even if you switch between checkpoints / radiobutton
   */
  const handleClick = (newValue: string) => {
    if (!value) {
      setCurrentlyAnswered(1);
    }
    setValue(newValue);
    changeAnswerList(newValue);
    changeCheckpointAnswer(newValue);
  };

  return (
    /**
     * styling of the checkpoint
     * there are three radio-buttons Yes, No and N/A in that order
     * with horizontal direction (in a row)
     * initially the value is empty string
     * onClick update the value
     * the styling of the checkpoint/radiobutton is in line with the color scheme
     * darkgrey when not active and ING orange when selected/clicked
     */
    <ThemeProvider theme={theme}>
      <Card sx={{ width: "inherit", alignSelf: "center" }}>
        <CardContent>
          <Typography
            sx={{
              width: "5%",
              minWidth: "60px",
              float: "left",
              fontSize: "24px",
              fontWeight: "bold",
              pb: "125px",
            }}
            id="checkpointnrlabel"
          >
            {number}
          </Typography>

          {topicIds.length > 0 && (
            <Typography sx={{ textAlign: "left" }} id="checkpoint-topics">
              {`Topics: ${topicList
                .filter((t) => topicIds.includes(Number(t.id)))
                .map((t) => t.name)
                .join(", ")}`}
            </Typography>
          )}
          <Typography sx={{ textAlign: "left" }} id="checkpointnamelabel">
            {description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <RadioGroup
            color="text.primary"
            name="checkpointname"
            aria-labelledby="checkpointnamelabel"
            value={value}
            onChange={(e) => handleClick(e.target.value)}
            row
          >
            {answers.map((a) => (
              <FormControlLabel
                key={`answers-${a.id ? a.id.toString() : "-"}`}
                control={<Radio color="primary" />}
                label={a.label}
                value={a.id ? a.id.toString() : "-"}
                disabled={feedback}
              />
            ))}
          </RadioGroup>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default Checkpoint;
