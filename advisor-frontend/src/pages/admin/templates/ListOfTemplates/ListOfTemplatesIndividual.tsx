import { useEffect, useRef, useState } from "react";
import { FormControl, MenuItem, Select, Theme } from "@mui/material";
import userType from "../../../../components/Sidebar/listUsersTypes";
import PageLayout from "../../../PageLayout";
import TemplateGrid from "../../../../components/Grids/Specific/Template/TemplateGrid";
import {
  TemplateAPP,
  useGetTemplates,
  usePatchTemplate,
} from "../../../../api/TemplateAPI/TemplateAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../../components/ErrorPopup/ErrorPopup";

/**
 * This is basically a page that is containing
 * the list of all existing templates
 * Important note:
 * This should only be accessible to admins
 */
function ListOfTemplatesIndividual({ theme }: { theme: Theme }) {
  /**
   * Use states for templates and active templates
   */
  const [individualTemplates, setIndividualTemplates] = useState<TemplateAPP[]>(
    []
  );
  const [teamTemplates, setTeamTemplates] = useState<TemplateAPP[]>([]);

  const [activeIndividualTemplate, setActiveIndividualTemplate] =
    useState<TemplateAPP>();
  const [activeTeamTemplate, setActiveTeamTemplate] = useState<TemplateAPP>();

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

  const teamResponse = useGetTemplates("TEAM", undefined, onErrorTemplates);

  /**
   * Template mutation
   */
  const patchTemplate = usePatchTemplate(onErrorTemplates);

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

  useEffect(() => {
    if (teamResponse.status === "success") {
      setTeamTemplates(teamResponse.data);

      const activeTeam = teamResponse.data.find(
        (templateAPP: TemplateAPP) => templateAPP.enabled
      );

      if (activeTeam) {
        setActiveTeamTemplate(activeTeam);
      }
    }
  }, [teamResponse.status, teamResponse.data]);

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
      const newTemplate = { ...oldTemplate, enabled: true };
      patchTemplate.mutate(newTemplate, {
        onSuccess: (templateAPP: TemplateAPP) => {
          if (individual) {
            setActiveIndividualTemplate(templateAPP);
          } else {
            console.log(newTemplate.name);
            setActiveTeamTemplate(templateAPP);
          }
        },
      });
    }
  };

  const handleActiveIndividualTemplateChange = (
    individualTemplateId: number
  ) => {
    handleActiveTemplateChange(individualTemplateId, { individual: true });
  };

  const handleActiveTeamTemplateChange = (teamTemplateId: number) => {
    handleActiveTemplateChange(teamTemplateId, { individual: false });
  };

  const addTemplateMenuItem = (template: TemplateAPP) => (
    <MenuItem
      key={`template-menu-${template.id}`}
      value={template.id.toString()}
    >
      {template.name}
    </MenuItem>
  );

  /**
   * return page with list of templates, e.g.:
   * individual templates, team templates
   */
  return (
    <div>
      <PageLayout title="Individual Templates" sidebarType={userType.ADMIN}>
        <TemplateGrid
          theme={theme}
          templateType="INDIVIDUAL"
          templateResponse={individualResponse}
          setTemplates={setIndividualTemplates}
          activeTemplate={activeIndividualTemplate ? activeIndividualTemplate.name : ''}
        />

      </PageLayout>
      <ErrorPopup ref={refErrorTemplates} />
    </div>
  );
}

export default ListOfTemplatesIndividual;
