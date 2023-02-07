import { Card, Stack, Tab, Tabs, Theme, Button, Box } from "@mui/material";
import React, { SetStateAction, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import userTypes from "../../../components/Sidebar/listUsersTypes";
import Subarea from "../../../components/Subarea/Subarea";
import PageLayout from "../../PageLayout";
import ListOfCheckpoints from "../../../components/ListOfCheckpoints/ListOfCheckpoints";
import TextfieldEdit from "../../../components/TextfieldEdit/TextfieldEdit";
import Textfield from "../../../components/Textfield/Textfield";
import { RootState } from "../../../app/store";
import createPDF from "../PDF/pdf/pdf";
import ProgressEvaluationCard from "../../../components/PageCard/SpecificPageCards/ProgressEvaluationCard";
import ListOfRecommendations from "../../../components/ListOfRecommendations/ListOfRecommendations";
import {
  AssessmentAPP,
  useGetAssessment,
  usePostFeedbackAssessment,
} from "../../../api/AssessmentAPI/AssessmentAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../components/ErrorPopup/ErrorPopup";
import checkAssessmentRouting, { checkTeamRouting } from "../../routingHelpers";
import { useGetTeam } from "../../../api/TeamAPI/TeamAPI";

type ShowFeedbackArgs = {
  team: boolean;
  userRole: string;
  view: string;
  assessmentInfo: AssessmentAPP;
};

const showFeedbackTextUser = (args: ShowFeedbackArgs) =>
  args.team &&
  args.userRole === "USER" &&
  args.view === "Recommendations" &&
  args.assessmentInfo &&
  args.assessmentInfo.feedbackText;

const showFeedbackTextAssessor = (args: ShowFeedbackArgs) =>
  args.team &&
  args.userRole === "ASSESSOR" &&
  args.view === "Recommendations" &&
  args.assessmentInfo;

/**
 * Page with the feedback related to a self assessment
 * This should only be accessible to the user/team whose assement this belongs to
 */
function Feedback({ team, theme }: { team: boolean; theme: Theme }) {
  // get assessment id and team id from routing
  const { assessmentId, teamId } = useParams();

  // get role of user logged in
  const { userRole } = useSelector((state: RootState) => state.userData);

  /**
   * View that is set.
   * There are 3 possible views:
   * - Recommendations
   * - Checkpoints
   * - Progress
   */
  const [view, setView] = useState("Recommendations");

  /**
   * Function called to change the view
   * @param event event triggered by clicking on tab
   * @param newView value of tab to change to
   */
  const handleChange = (event: React.SyntheticEvent, newView: string) => {
    setView(newView);
  };

  // Ref for error popup
  const refErrorFeedback = useRef<RefObject>(null);
  const onErrorFeedback = getOnError(refErrorFeedback);

  /**
   * object used to navigate to another address
   */
  const navigate = useNavigate();

  const [assessmentInfo, setAssessmentInfo] = useState<AssessmentAPP>();

  /**
   * API request to get assessment information
   */
  const assessmentResponse = useGetAssessment(
    Number(assessmentId),
    onErrorFeedback
  );

  if (team) {
    // if it's a team assessment, check if user is part of the team
    // if they aren't, they will be redirected
    const teamResponse = useGetTeam(Number(teamId), onErrorFeedback);
    React.useEffect(() => {
      const rerouting = checkTeamRouting(teamResponse);
      if (rerouting) {
        navigate(rerouting);
      }
    }, [teamResponse]);
  }

  React.useEffect(() => {
    // set assessment information
    if (assessmentResponse.status === "success" && assessmentResponse.data) {
      setAssessmentInfo(assessmentResponse.data);
    }
    // check validity of assessment routing
    const rerouting = checkAssessmentRouting({
      assessmentResponse,
      team,
      completed: true,
      teamId,
      assessmentId,
    });
    // reroute if necessary
    if (rerouting) {
      navigate(rerouting);
    }
  }, [assessmentResponse]);

  /**
   * API request to post the assessor feedback
   */
  const postFeedback = usePostFeedbackAssessment(
    Number(assessmentId),
    onErrorFeedback
  );

  /**
   * Function to send API request to change assessor feedback
   * @param newFeedback new feedback information
   */
  const changeFeedback = (newFeedback: string) => {
    postFeedback.mutate(newFeedback, {
      onSuccess: (newAssessmentInfo: AssessmentAPP) => {
        setAssessmentInfo(newAssessmentInfo);
      },
    });
  };

  /**
   * Function to download the feedback to pdf
   */
  const download = () => {
    if (assessmentInfo) createPDF(assessmentInfo);
  };
  /**
   * return page with title,
   * tabs for recommendations + checkpoints + progress (from left to right)
   * followed by (automated) feedback
   * An import note is that once you receive automated feedback,
   * the checkpoint answers are not editable
   */
  return (
    <PageLayout
      title={
        team ? "Team Evaluation Feedback" : "Individual Evaluation Feedback"
      }
      sidebarType={userTypes[userRole]}
    >
      <Card
        sx={{
          backgroundColor: "white",
          width: "inherit",
          borderRadius: "5px",
        }}
      >
        <Stack direction="row" justifyContent="left" alignItems="center">
          <Tabs value={view} onChange={handleChange} textColor="primary">
            <Tab value="Recommendations" label="Recommendations" />
            <Tab value="Checkpoints" label="Checkpoints" />
            {userRole === "ASSESSOR" && (
              <Tab value="Progress" label="Progress" />
            )}
          </Tabs>
        </Stack>
      </Card>

      {/* this is not actually a subarea, it's the automated feedback */}
      {view !== "Progress" &&
        assessmentInfo &&
        assessmentInfo.information !== "" && (
          <Subarea
            theme={theme}
            title=""
            summary=""
            description={assessmentInfo.information}
          />
        )}

      {team && view === "Recommendations" && <h2>Facilitator Feedback</h2>}

      {assessmentInfo &&
        showFeedbackTextAssessor({ team, userRole, view, assessmentInfo }) && (
          <TextfieldEdit
            rows={5}
            theme={theme}
            text={assessmentInfo.feedbackText}
            handleSave={changeFeedback}
          />
        )}

      {assessmentInfo &&
        showFeedbackTextUser({ team, userRole, view, assessmentInfo }) && (
          <Textfield
            rows={5}
            columns="inherit"
            theme={theme}
            text={assessmentInfo.feedbackText}
          />
        )}

      {view === "Recommendations" && assessmentInfo && (
        <ListOfRecommendations
          theme={theme}
          assessmentId={Number(assessmentId)}
          templateId={Number(assessmentInfo.templateId)}
          completedAt={assessmentInfo.completedAt}
        />
      )}

      {view === "Checkpoints" && assessmentInfo && (
        <ListOfCheckpoints
          feedback
          theme={theme}
          assessmentInfo={assessmentInfo}
          setCurrentlyAnswered={function (arg0: number): void {
            throw new Error("Function not implemented.");
          }}
          setTotalQuestions={function (value: SetStateAction<number>): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      {view === "Progress" && assessmentInfo && (
        <ProgressEvaluationCard
          assessmentId={Number(assessmentId)}
          templateId={Number(assessmentInfo.templateId)}
        />
      )}
      {/* create button component at the bottom of the page
      in which you will see a download as pdf button */}
      <Button className="widthInherited" variant="contained" onClick={download}>
        <Stack direction="row">
          <CloudDownloadOutlinedIcon sx={{ fontSize: 40 }} />
          <Box sx={{ p: 1.0 }}>
            {" "}
            <b>
              <u>Download as PDF</u>
            </b>
          </Box>
        </Stack>
      </Button>
      <ErrorPopup ref={refErrorFeedback} />
    </PageLayout>
  );
}

export default Feedback;
