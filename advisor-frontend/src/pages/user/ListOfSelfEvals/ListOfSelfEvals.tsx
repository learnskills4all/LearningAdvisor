import { Button, FormControl, MenuItem, Select, Theme } from "@mui/material";
import PageLayout from "../../PageLayout";
import userTypes from "../../../components/Sidebar/listUsersTypes";
import AssessmentOngoingGrid from "../../../components/Grids/Specific/Assessment/AssessmentOngoing/AssessmentOngoingGrid";
import AssessmentCompletedGrid from "../../../components/Grids/Specific/Assessment/AssessmentCompleted/AssessmentCompletedGrid";
import { useEffect, useRef, useState } from "react";
import { TemplateAPP, useGetTemplates } from "../../../api/TemplateAPI/TemplateAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../components/ErrorPopup/ErrorPopup";
import ButtonRegular from "../../../components/ButtonRegular/ButtonRegular";
import API from "../../../api/_API";
import React from "react";


/**
 * Page with the list of self evaluations that belong to the user
 */
function ListOfSelfEvals({ theme }: { theme: Theme }) {
  // only users can see this page, no need to fetch role
  const userRole = "USER";

  const [activeTeamTemplate, setActiveTeamTemplate] = useState<TemplateAPP>();
  const [individualTemplates, setIndividualTemplates] = useState<TemplateAPP[]>([]);
  const [teamTemplates, setTeamTemplates] = useState<TemplateAPP[]>([]);
  const [activeIndividualTemplate, setActiveIndividualTemplate] = useState<TemplateAPP>();

  const refAssessmentCreated = React.useRef<RefObject>(null);

  /**
   * Ref for error popup
  */
  const refErrorTemplates = useRef<RefObject>(null);
  const onErrorTemplates = getOnError(refErrorTemplates);
  
  /**
   * Template queries
   * for e.g. individual and team
  */
  const individualResponse = useGetTemplates(
    "INDIVIDUAL",
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
    if (individualResponse.status === "success") {
      setIndividualTemplates(individualResponse.data);

      const activeIndividual = individualResponse.data.find(
        (templateAPP: TemplateAPP) => templateAPP.enabled
      );

      if (activeIndividual) {
        setActiveIndividualTemplate(activeIndividual);
      }
    }
  }, [individualResponse.data, individualResponse.status]);

  const handleActiveTemplateChange = (
    templateId: number,
    options: { individual: boolean }
  ) => {
    const { individual } = options;
    const templates = individual ? individualTemplates : teamTemplates;
    const oldTemplate = templates.find(
      (template) => template.id === templateId
    );

    if (oldTemplate) {
      const templateAPP = individualTemplates.find((template) => template.id === templateId);
      if (individual) {
        setActiveIndividualTemplate(templateAPP);
      } else {
        setActiveTeamTemplate(templateAPP);
      }
    }
  };

  async function postAssessment () {
    const { data } = await API.post(
      `/assessment`,
      {
        assessment_type: "INDIVIDUAL",
        template_id: activeIndividualTemplate?.id
      },
    );
  }
  


  const handleActiveIndividualTemplateChange = (
    individualTemplateId: number
  ) => {
    handleActiveTemplateChange(individualTemplateId, { individual: true });
  };

  const handleActiveTeamTemplateChange = (teamTemplateId: number) => {
    handleActiveTemplateChange(teamTemplateId, { individual: false });
  };


  /**
   * return page with individual evaluations as title
   * together with the ongoing evaluation grid and
   * completed evaluations grid
   */
  return (
    <PageLayout
      title="Individual Evaluations"
      sidebarType={userTypes[userRole]}
    >

      <FormControl sx={{ width: "inherit" }}>
        <Select
          value={activeIndividualTemplate ? activeIndividualTemplate.id : ""}
          onChange={(e) =>
            handleActiveIndividualTemplateChange(Number(e.target.value))
          }
        >
          {individualTemplates.map((individualTemplate) =>
            addTemplateMenuItem(individualTemplate)
          )}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        style={{ fontWeight: "600", float: "left" }}
        onClick={() => {
          postAssessment();
          location.reload();
        }}
      >Create new evaluation</Button>

      <h2>Ongoing Evaluations</h2>
      <AssessmentOngoingGrid
        theme={theme}
        userRole={userRole}
        assessmentType="INDIVIDUAL"
      />

      <h2>Completed Evaluations</h2>
      <AssessmentCompletedGrid theme={theme} assessmentType="INDIVIDUAL" />
    </PageLayout>
  );
}

export default ListOfSelfEvals;
