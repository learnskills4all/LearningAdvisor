import { Button, Theme, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import React, { useRef, useState } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useNavigate, useParams } from "react-router-dom";
import ListOfCheckpoints from "../../../components/ListOfCheckpoints/ListOfCheckpoints";
import userTypes from "../../../components/Sidebar/listUsersTypes";
import PageLayout from "../../PageLayout";
import { RootState } from "../../../app/store";
import ListOfRecommendations from "../../../components/ListOfRecommendations/ListOfRecommendations";
import {
  AssessmentAPP,
  assessmentCheckpointToAPP,
  useGetAssessment,
  usePostCompleteAssessment,
} from "../../../api/AssessmentAPI/AssessmentAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../components/ErrorPopup/ErrorPopup";
import { getUpdatedTheme } from "../../admin/templates/Area/colorHelpers";
import { useGetTeam } from "../../../api/TeamAPI/TeamAPI";
import checkAssessmentRouting, { checkTeamRouting } from "../../routingHelpers";
import ProgressBar from "../../../components/FormProgress/ProgressBar";

/**
 * Page with a self evaluation that can be filled in
 * This should only be accessible to the user/team whose assement this belongs to
 */
function Evaluation({ team, theme }: { team: boolean; theme: Theme }) {
  // get assessment id and team id from routing
  const { assessmentId, teamId } = useParams();
  // get the role of the user logged in
  const { userRole } = useSelector((state: RootState) => state.userData);

  /**
   * if checkpointview is true, then the checkpoints are displayed,
   * otherwise recommendations are displayed
   */
  const [checkpointView, setCheckpointView] = useState(true);

  /**
   * main primary color of the palette of the theme,
   * this will change based on area selected  in the checkpoint view
   */
  const [primaryColor, setPrimaryColor] = useState(theme.palette.primary.main);

  /**
   * displayed theme of the page, this will change when the primary color changes
   */
  const [currentTheme, setCurrentTheme] = useState(theme);

  // when the primary color changes, update theme
  React.useEffect(() => {
    setCurrentTheme(() => getUpdatedTheme(primaryColor, theme));
  }, [primaryColor]);

  /**
   * handle toggling between list of checkpoints and recommendations
   * revert back to regular primary color when switching to recommendations
   */
  const handleViewChange = () => {
    setCheckpointView((v) => {
      if (v) setPrimaryColor(theme.palette.primary.main);
      return !v;
    });
  };

  // Ref for error popup
  const refErrorEvaluation = useRef<RefObject>(null);
  const onErrorEvaluation = getOnError(refErrorEvaluation);

  /**
   * object used to navigate to another address
   */
  const navigate = useNavigate();

  /**
   *  API function to complete the assessment
   */
  const postCompleteEval = usePostCompleteAssessment(
    Number(assessmentId),
    onErrorEvaluation
  );

  /**
   * Function called when user clicks the "finish evaluation" button,
   * it saves the assessment on the database.
   * If there is an error, it might be because not all checkpoints have been filled in
   */
  const handleClickFinish = () => {
    postCompleteEval.mutate(undefined, {
      onError: () => {
        onErrorEvaluation(
          "Unable to complete the evaluation. Make sure you filled in all the checkpoints in all areas."
        );
      },
      // if it's saved successfully, redirect to feedback page
      onSuccess: () => {
        navigate(
          team
            ? `/teams/${teamId}/feedback/${assessmentId}`
            : `/user/self_evaluations/feedback/${assessmentId}`
        );
      },
    });
  };

  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentAPP>();

  // get assessment information from API
  const assessmentResponse = useGetAssessment(
    Number(assessmentId),
    onErrorEvaluation
  );
  
  // set assessment info value
  React.useEffect(() => {
    if (assessmentResponse.status === "success" && assessmentResponse.data) {
      setAssessmentInfo(assessmentResponse.data);
    }

    // check validity of routing
    const rerouting = checkAssessmentRouting({
      assessmentResponse,
      team,
      completed: false,
      teamId,
      assessmentId,
    });

    // if there is some issue, reroute the user
    if (rerouting) {
      navigate(rerouting);
    }
  }, [assessmentResponse]);
  
  if (team) {
    // if it's a team assessment, check that user is part of the team
    // otherwise redirect
    const teamResponse = useGetTeam(Number(teamId), onErrorEvaluation);
    React.useEffect(() => {
      const rerouting = checkTeamRouting(teamResponse);
      if (rerouting) {
        navigate(rerouting);
      }
    }, [teamResponse]);
  }

  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentlyAnswered, setCurrentlyAnswered] = useState(0);
  const answerChanged = (ar0: number) => {
    // Add a check here to ensure that the answers that are added from a useEffect() hook are triggered only once
    var a = currentlyAnswered;
    setCurrentlyAnswered(a + ar0);
    console.log("Answer list updated!");
  }

  return (
    <div>
      {assessmentResponse.status === "success" && (
        <PageLayout
          title={team ? "Team Evaluation" : "Individual Evaluation"}
          sidebarType={userTypes[userRole]}
          headerColor={primaryColor}
        >
          <ThemeProvider theme={checkpointView ? currentTheme : theme}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "inherit",
              }}
            >
              <Button
                onClick={handleViewChange}
                startIcon={
                  checkpointView ? <ViewListIcon /> : <BorderColorIcon />
                }
                variant="contained"
              >
                {checkpointView
                  ? "See Recommendations"
                  : "Go back to checkpoints"}
              </Button>
            </div>
            
            {checkpointView && assessmentInfo && (
              <ListOfCheckpoints
                feedback={false || (team && userRole === "USER")}
                theme={currentTheme}
                assessmentInfo={assessmentInfo}
                setPrimaryColor={setPrimaryColor}
                setTotalQuestions={setTotalQuestions}
                setCurrentlyAnswered={answerChanged}
              />
            )}

            {!checkpointView && assessmentInfo && (
              <ListOfRecommendations
                theme={theme}
                assessmentId={Number(assessmentId)}
                templateId={assessmentInfo.templateId}
                completedAt={assessmentInfo.completedAt}
              />
            )}          

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                position: "fixed",
                bottom: 0,
                padding: "16px",
                backgroundColor: "#EDE6E2",
                margin: 0
              }}
            >
              <ProgressBar progress={currentlyAnswered} total={totalQuestions} />
              <Button
                variant="contained"
                onClick={handleClickFinish}
              >
                {" "}
                Finish Evaluation{" "}
              </Button>
              <ErrorPopup ref={refErrorEvaluation} />
            </div>
          </ThemeProvider>
        </PageLayout>
      )}
    </div>
  );
}

export default Evaluation;
