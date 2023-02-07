import {
  ThemeOptions,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  ThemeProvider,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useRef, useState } from "react";
import { AnswerAPP, useGetAnswers } from "../../api/AnswerAPI/AnswerAPI";
import {
  AssessmentAPP,
  useGetSaveAssessment,
} from "../../api/AssessmentAPI/AssessmentAPI";
import {
  CategoryAPP,
  useGetCategories,
} from "../../api/CategoryAPI/CategoryAPI";
import { useGetCheckpoints } from "../../api/CheckpointAPI/CheckpointAPI"
import { TopicAPP, useGetTopics } from "../../api/TopicAPI/TopicAPI";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";
import AreaSpecificCheckpoints from "./AreaSpecificCheckpoints";
import Stepper from "../../components/FormProgress/Stepper";
import API from "../../api/_API";
import { Integer } from "read-excel-file";

/**
 * Page with a self evaluation that can be filled in
 * This should only be accessible to the user whose assement this belongs to
 */
function ListOfCheckpoints({
  assessmentInfo,
  theme,
  feedback,
  setPrimaryColor,
  setTotalQuestions,
  setCurrentlyAnswered
}: {
  assessmentInfo: AssessmentAPP;
  theme: ThemeOptions;
  feedback: boolean;
  setPrimaryColor?: React.Dispatch<React.SetStateAction<string>> | undefined;
  setTotalQuestions: React.Dispatch<React.SetStateAction<number>>; 
  setCurrentlyAnswered: (arg0: number) => void;
}) {
  const [activeArea, setActiveArea] = useState<CategoryAPP>();
  
  /**
   * GET ASSESSMENT INFORMATION
   */

  const [areaList, setAreaList] = useState<CategoryAPP[]>();
  const [answerList, setAnswerList] = useState<AnswerAPP[]>([]);
  const [checkpointAnswerList, setCheckpointAnswerList] =
    useState<Record<number, number | undefined>>();

  /*const handleAreaChange = (event: SelectChangeEvent<number>) => {
    if (areaList) {
      const newArea = areaList.filter((a) => a.id === event.target.value)[0];
      setActiveArea(newArea);
    }
  };*/

  const handleAreaChange = (i: number) => {
    if (areaList) {
      // Find the area it changed to and set the active one to that one
      //const newArea = areaList.filter((a) => a.id === event.target.value)[0];
      const newArea = areaList[i];
      setActiveArea(newArea);
    }
  };
  
  React.useEffect(() => {
    if (setPrimaryColor && activeArea) {
      setPrimaryColor(activeArea.color);
    }
  }, [activeArea]);

  /**
   * Ref for error popup
   */
  const refErrorCheckpoints = useRef<RefObject>(null);
  const onErrorCheckpoints = getOnError(refErrorCheckpoints);

  /**
   * get area list from API
   */
  const areasResponse = useGetCategories(
    Number(assessmentInfo?.templateId),
    true,
    onErrorCheckpoints
  );

  /**
   * get answer list from API
   */
  const answersResponse = useGetAnswers(
    Number(assessmentInfo?.templateId),
    true,
    onErrorCheckpoints
  );

  /**
   * get checkpoint answer list from API
   */
  const checkpointAnswerResponse = useGetSaveAssessment(
    Number(assessmentInfo?.id),
    onErrorCheckpoints
  );

  // Used to avoid useEffect triggering twice
  const [initAnswers, setInitAnswers] = React.useState(false);
  
  /**
   * set the area list value and get total amount of answers
   */
  React.useEffect(() => {
    if (areasResponse.data && areasResponse.status === "success") {
      setAreaList(areasResponse.data);
    }
  }, [areasResponse]);

  /**
   * calculate the total questions and the questions per area
   */
  React.useEffect(() => {
    if (areaList) {
      const fetchData = async () => {
        var q = 0;
        for (const e of areaList) {
          const { data } = await API.get(`/category/${e.id}/checkpoint`);
          q += data.length;
        }
        setTotalQuestions(q);
      }

      fetchData()
        .catch(console.error);
    }
  }, [areaList]);

  /**
   * go back to previous area
   */
  const handlePreviousArea = () => {
    if (areaList && activeArea) {
      // index of active area in array is order - 1
      // so index of previous area is order - 2
      const prevArea = areaList[activeArea.order - 2];
      setActiveArea(prevArea);
    }
  };

  /**
   * go to the next area
   */
  const handleNextArea = () => {
    if (areaList && activeArea) {
      // index of area in array is order - 1
      // so index of next area is order
      const nextArea = areaList[activeArea.order];
      setActiveArea(nextArea);
    }
  };

  /**
   * set the answer list value
   * using the useEffect hooks from React
   */
  React.useEffect(() => {
    if (answersResponse.data && answersResponse.status === "success") {
      setAnswerList(answersResponse.data);
    }
  }, [answersResponse]);

  /**
   * create an checkpoint answer dictionary where each
   * checkpoint id maps to an answer id
   */
  React.useEffect(() => {
    if (
      checkpointAnswerResponse.data &&
      checkpointAnswerResponse.status === "success"
    ) {
      const answerDictionary: Record<number, number | undefined> = {};
      checkpointAnswerResponse.data.forEach((a) => {
        answerDictionary[a.checkpointId] = a.answerId;
      });
      setCheckpointAnswerList(answerDictionary);
      if (!initAnswers) {
        setCurrentlyAnswered(Object.keys(Object(answerDictionary)).length);
        setInitAnswers(true);
      }
    }
  }, [checkpointAnswerResponse.status, checkpointAnswerResponse.data]);

  const [topicList, setTopicList] = useState<TopicAPP[]>([]);
  const topicResponse = useGetTopics(assessmentInfo?.templateId);

  /**
   * set assessment info value
   */
  React.useEffect(() => {
    if (topicResponse.status === "success" && topicResponse.data) {
      setTopicList(topicResponse.data);
    }
  }, [topicResponse.status, topicResponse.data]);

  React.useEffect(() => {
    if (areaList && areaList.length > 0) {
      setActiveArea(areaList[0]);
    }
  }, [areaList]);

  React.useEffect(() => {
    
  });

  /*
  * get an array of area names
  */
  var n = new Array<string>();
  areaList?.forEach(a => {
    n.push(a.name);
  });
  const areaNames = n;

  //console.log('Currently answered: ' + Object.keys(Object(checkpointAnswerList)).length);

  const[pad, setPad] = React.useState({});

  return (
    <div style={{ width: "inherit", display: "contents", }}>
      <ThemeProvider theme={theme}>
        {areaList !== undefined && activeArea !== undefined && (
          <Stepper 
            steps={areaList}
            activeStep={areaList.indexOf(activeArea)}
            handleNext={handleNextArea}
            handleBack={handlePreviousArea}
            handleStep={handleAreaChange}
            pad={setPad}
            checkpointanswerlist={checkpointAnswerList}
            assessmentInfo={assessmentInfo}
          />
        )}

        { pad &&
          <div style={{ width: 'inherit', color: '#EDE6E2' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae proin sagittis nisl rhoncus mattis rhoncus. Diam sollicitudin tempor id eu nisl. Donec enim diam vulputate ut pharetra sit. Massa placerat duis ultricies lacus. Augue interdum velit euismod in pellentesque massa placerat duis ultricies. A cras semper auctor neque vitae tempus quam pellentesque nec. Consequat ac felis donec et odio pellentesque diam volutpat. Lobortis elementum nibh tellus molestie nunc non. Purus ut faucibus pulvinar elementum integer enim neque. Amet est placerat in egestas. Posuere morbi leo urna molestie at elementum eu. Sed libero enim sed faucibus turpis. Auctor urna nunc id cursus metus aliquam eleifend mi.
          </div>
        }
      </ThemeProvider>
      
      {activeArea &&
        answerList &&
        assessmentInfo &&
        checkpointAnswerList &&
        topicList && (
          <AreaSpecificCheckpoints
            theme={theme}
            topicList={topicList}
            areaId={Number(activeArea.id)}
            answerList={answerList}
            checkpointAnswerList={checkpointAnswerList}
            setCheckpointAnswerList={setCheckpointAnswerList}
            feedback={feedback}
            assessmentId={Number(assessmentInfo.id)}
            setCurrentlyAnswered={setCurrentlyAnswered}
          />
        )}
      <ErrorPopup ref={refErrorCheckpoints} />
    </div>
  );
}

ListOfCheckpoints.defaultProps = {
  setPrimaryColor: undefined,
};

export default ListOfCheckpoints;
