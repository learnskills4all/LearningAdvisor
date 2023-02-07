import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Theme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PageLayout from "../../PageLayout";
import userTypes from "../../../components/Sidebar/listUsersTypes";
import TextfieldEdit from "../../../components/TextfieldEdit/TextfieldEdit";
import MemberGrid from "../../../components/Grids/Specific/Member/MemberGrid";
import AssessmentOngoingGrid from "../../../components/Grids/Specific/Assessment/AssessmentOngoing/AssessmentOngoingGrid";
import AssessmentCompletedGrid from "../../../components/Grids/Specific/Assessment/AssessmentCompleted/AssessmentCompletedGrid";
import { RootState } from "../../../app/store";
import Textfield from "../../../components/Textfield/Textfield";
import {
  TeamAPP,
  useGetTeam,
  usePatchTeam,
} from "../../../api/TeamAPI/TeamAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../components/ErrorPopup/ErrorPopup";
import { checkTeamRouting } from "../../routingHelpers";
import { UserRole } from "../../../types/UserRole";
import { TemplateAPP, useGetTemplates } from "../../../api/TemplateAPI/TemplateAPI";
import API from "../../../api/_API";
import axios from "axios";

/**
 * Page providing team details
 * This should only be accessible to the users and assessors in the team
 * Assessors can modify team details
 *
 * Below, the team function is defined that consists of theme,
 * the preset of the team information
 * and the preset of the user role
 */
function Team({
  theme,
  presetTeamInfo,
  presetUserRole,
}: {
  theme: Theme;
  presetTeamInfo?: TeamAPP | undefined;
  presetUserRole?: UserRole;
}) {
  const { teamId } = useParams();
  const [userRole, setUserRole] = useState<UserRole>();
  const [teamTemplates, setTeamTemplates] = useState<TemplateAPP[]>([]);
  const [activeTeamTemplate, setActiveTeamTemplate] = useState<TemplateAPP>();
  const [baseURL, setBaseURL] = useState<string>();

  React.useEffect(() => {
    setUserRole(presetUserRole);
  }, [presetUserRole]);

  const { userRole: gotUserRole, userId } = useSelector(
    (state: RootState) => state.userData
  );

  React.useEffect(() => {
    if (!presetUserRole) {
      setUserRole(gotUserRole);
    }
  }, [gotUserRole]);

  React.useEffect(() => {
    const baseUrl = API.defaults.baseURL;
    if (baseUrl != null) {
      setBaseURL(baseUrl);
    }
  }, [baseURL])

  /**
   * Use React Referencs for error popup
   */
  const refErrorTeam = useRef<RefObject>(null);
  const onErrorTeam = getOnError(refErrorTeam);

  const navigate = useNavigate();

  const teamResponse = useGetTeam(Number(teamId), onErrorTeam);

  const [teamInfo, setTeamInfo] = useState<TeamAPP>();

  /**
   * use useeffect hooks,
   * so you don't have to write classes
   */
  React.useEffect(() => {
    if (presetTeamInfo) {
      setTeamInfo(presetTeamInfo);
    }
  }, [presetTeamInfo]);

  React.useEffect(() => {
    const rerouting = checkTeamRouting(teamResponse);
    if (rerouting) {
      navigate(rerouting);
    }

    if (teamResponse.data && teamResponse.status === "success") {
      setTeamInfo(teamResponse.data);
    }
  }, [teamResponse]);

  /**
   * Ref for error popup
  */
  const refErrorTemplates = useRef<RefObject>(null);
  const onErrorTemplates = getOnError(refErrorTemplates);

  const teamTemplateResponse = useGetTemplates(
    "TEAM",
    undefined,
    onErrorTemplates
  );

  const addTemplateMenuItem = (template: TemplateAPP) => (
    <MenuItem
      key={`template-menu-${template.id}`}
      value={template.id.toString()}
    >
      {template.name}
    </MenuItem>
  );

  useEffect(() => {
    if (teamTemplateResponse.status === "success") {
      setTeamTemplates(teamTemplateResponse.data);

      const activeTeam = teamTemplateResponse.data.find(
        (templateAPP: TemplateAPP) => templateAPP.enabled
      );

      if (activeTeam) {
        setActiveTeamTemplate(activeTeam);
      }
    }
  }, [teamTemplateResponse.data, teamTemplateResponse.status]);

  const patchTeam = usePatchTeam(onErrorTeam);

  const changeInfo = (newInfo: TeamAPP) => {
    patchTeam.mutate(newInfo, {
      onSuccess: (teamAPP: TeamAPP) => {
        setTeamInfo(teamAPP);
      },
      onError: onErrorTeam,
    });
  };

  /**
   * constant declaration that lets you change the IT department
   */
  const changeDept = (newDept: string) => {
    if (teamInfo) {
      const newInfo = teamInfo;
      newInfo.department = newDept;
      changeInfo(newInfo);
    }
  };

  /**
   * constant declaration that lets you change the country
   */
  const changeCountry = (newCountry: string) => {
    if (teamInfo) {
      const newInfo = teamInfo;
      newInfo.country = newCountry;
      changeInfo(newInfo);
    }
  };

  async function postAssessment (teamId: number) {
    const { data } = await API.post(
      `/assessment`,
      {
        assessment_type: "TEAM",
        template_id: activeTeamTemplate?.id,
        team_id: teamId,
      },
    );
  }

  const handleActiveTemplateChange = (
    templateId: number,
    options: { individual: boolean }
  ) => {
    const { individual } = options;
    const templates = individual ? teamTemplates : teamTemplates;
    const oldTemplate = templates.find(
      (template) => template.id === templateId
    );

    if (oldTemplate) {
      const templateAPP = teamTemplates.find((template) => template.id === templateId);
      setActiveTeamTemplate(templateAPP);
    }
  };

  const handleActiveTeamTemplateChange = (teamTemplateId: number) => {
    handleActiveTemplateChange(teamTemplateId, { individual: false });
  };

  /**
   * return page with e.g. the following:
   * team information, country, IT Area/ Department,
   * grids for ongoing evaluations, completed evaluations,
   * grids for members, assessors that contains e.g. the name(s)
   * of team members / assessors
   */
  return (
    <div>
      {teamInfo && userRole && (
        <PageLayout title={teamInfo.name} sidebarType={userTypes[userRole]}>
          <h2> Team Information </h2>
          <h3> Country </h3>

          {userRole === "ASSESSOR" ? (
            <TextfieldEdit
              text={teamInfo.country}
              theme={theme}
              rows={1}
              handleSave={changeCountry}
            />
          ) : (
            <Textfield
              text={teamInfo.country}
              theme={theme}
              rows={1}
              columns="inherit"
            />
          )}

          <h3> IT Area / Department </h3>

          {userRole === "ASSESSOR" ? (
            <TextfieldEdit
              text={teamInfo.department}
              theme={theme}
              rows={1}
              handleSave={changeDept}
            />
          ) : (
            <Textfield
              text={teamInfo.department}
              theme={theme}
              rows={1}
              columns="inherit"
            />
          )}

          {userRole === "ASSESSOR" && (
            <div
              id="token-info"
              style={{ width: "inherit", display: "contents" }}
            >
              <h3>Invite Token</h3>
              <FormControl sx={{ width: "inherit" }} variant="standard">
                <OutlinedInput
                  readOnly
                  sx={{ backgroundColor: "white" }}
                  id="token"
                  value={teamInfo.inviteToken}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        data-testid="copy-token"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            teamInfo.inviteToken.toString()
                          )
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          )}

          {userRole === "ASSESSOR" && (
            <div
              id="token-info"
              style={{ width: "inherit", display: "contents" }}
            >
              <h3>Invite Link</h3>
              <FormControl sx={{ width: "inherit" }} variant="standard">
                <OutlinedInput
                  readOnly
                  sx={{ backgroundColor: "white" }}
                  id="token"
                  value={baseURL + "/signup?teamId=" + teamInfo.inviteToken.toString() + "&userType=USER"}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton
                        data-testid="copy-token"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            baseURL+ "/signup?teamId=" + teamInfo.inviteToken.toString() + "&userType=USER"
                          )
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
          )}

          <h3>Facilitators & Members</h3>
          <MemberGrid
            theme={theme}
            userId={Number(userId)}
            userRole={userRole}
            teamId={Number(teamId)}
            forAssessors
          />
          <MemberGrid
            theme={theme}
            userId={Number(userId)}
            userRole={userRole}
            teamId={Number(teamId)}
            forAssessors={false}
          />
              
          {userRole === "ASSESSOR" && (
            <FormControl sx={{ width: "inherit" }}>
              <Select
                value={activeTeamTemplate ? activeTeamTemplate.id : ""}
                onChange={(e) =>
                  handleActiveTeamTemplateChange(Number(e.target.value))
                }
              >
                {teamTemplates.map((teamTemplate) =>
                  addTemplateMenuItem(teamTemplate)
                )}
              </Select>
            </FormControl>
          )}

          {userRole === "ASSESSOR" && (
            <Button
              variant="contained"
              color="primary"
              style={{ fontWeight: "600", float: "left" }}
              onClick={() => {
                postAssessment(Number(teamId));
                location.reload();
              }}
            >Create new evaluation</Button>
          )}

          <h3>Ongoing Evaluations</h3>
          <AssessmentOngoingGrid
            theme={theme}
            userRole={userRole}
            teamId={Number(teamId)}
            assessmentType="TEAM"
          />

          <h3>Completed Evaluations</h3>
          <AssessmentCompletedGrid
            theme={theme}
            teamId={Number(teamId)}
            assessmentType="TEAM"
          />
          <ErrorPopup ref={refErrorTeam} />
        </PageLayout>
      )}
    </div>
  );
}
/**
 * Define the default props of the team
 */
Team.defaultProps = {
  presetTeamInfo: undefined,
  presetUserRole: undefined,
};

export default Team;
