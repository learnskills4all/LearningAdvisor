import * as React from "react";
import { UseMutationResult } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  GridColumns,
  gridColumnsTotalWidthSelector,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import { Button } from "@mui/material";
import GenericGrid from "../../../Generic/GenericGrid";
import { UserRole } from "../../../../../types/UserRole";
import { AssessmentType } from "../../../../../types/AssessmentType";
import { handleAdd, handleInit } from "../../../functions/handlers/handlers";
import {
  AssessmentAPP,
  useGetMyIndividualAssessments,
  useGetMyTeamAssessments,
  usePostAssessment,
} from "../../../../../api/AssessmentAPI/AssessmentAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../../ErrorPopup/ErrorPopup";
import API from "../../../../../api/_API";
import { string } from "prop-types";
import { templateToAPI } from "../../../../../api/TemplateAPI/TemplateAPI";

type AssessmentOngoingGridProps = {
  theme: Theme;
  userRole: UserRole;
  // eslint-disable-next-line react/require-default-props
  teamId?: number;
  assessmentType: AssessmentType;
};

let mp = new Map();

/**
 * Grid for ongoing assessments
 * Uses theme, teamId, and assessmentType
 */
export default function AssessmentOngoingGrid({
  theme,
  userRole,
  teamId,
  assessmentType,
}: AssessmentOngoingGridProps) {

  function getTemplateNameForId (templateId: number) {
    let templateName = mp.get(templateId);
    return templateName;
  }

  async function getAllTemplateNames () {
    const { data } = await API.get(`/template`);
    for (let i = 0; i < data.length; i++) {
      if(!mp.has(data[i].template_id)) {
        mp.set(data[i].template_id, data[i].template_name);
      }
    }
  }

  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<AssessmentAPP[]>([]);
  const navigate = useNavigate();

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorAssessmentOngoing = React.useRef<RefObject>(null);
  const onErrorAssessmentOngoing = getOnError(refErrorAssessmentOngoing);

  /**
   * Assessment queries
   * Gets all individual or team assessments
   */
  const { status, data } =
    assessmentType === "TEAM" && teamId !== undefined
      ? useGetMyTeamAssessments(false, teamId, onErrorAssessmentOngoing)
      : useGetMyIndividualAssessments(false, onErrorAssessmentOngoing);

  /**
   * Assessment mutations
   * Post assessment
   */
  const postAssessment =
    assessmentType === "TEAM" && teamId !== undefined
      ? usePostAssessment(assessmentType, teamId, onErrorAssessmentOngoing)
      : usePostAssessment(assessmentType, undefined, onErrorAssessmentOngoing);

  const handleContinue = (id: number) => {
    navigate(
      assessmentType === "INDIVIDUAL"
        ? `/user/self_evaluations/${id}`
        : `/teams/${teamId}/${id}`
    );
  };

  /**
   * useEffect for initialization of rows
   * Called when "status" of assessments query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, status, data);
  }, [status, data]);

  React.useEffect(() => {
    getAllTemplateNames();
  }, []);

  /**
   * Row add handler
   * Called when the "Add" button is pressed below the grid
   */
  const handleAddDecorator = React.useCallback(() => {
    handleAdd(setRows, postAssessment as UseMutationResult);
  }, []);

  /**
   * reroute to new assessment when one is created
   */
  React.useEffect(() => {
    if (postAssessment.isSuccess && postAssessment.data) {
      const assessment = postAssessment.data;
      const routing = assessment.teamId
        ? `/teams/${assessment.teamId}/${assessment.id}`
        : `/user/self_evaluations/${assessment.id}`;
      navigate(routing);
    }
  }, [postAssessment.data]);

  const columns = React.useMemo<GridColumns<AssessmentAPP>>(
    () => [
      {
        field: "Template Name",
        HeaderName: "Template Id",
        type: "string",
        flex: 1,
        valueGetter: params => {
          var templateId : number = params.row.templateId;
          return getTemplateNameForId(templateId);
        }
      },
      {
        field: "createdAt",
        headerName: "Created",
        type: "dateTime",
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<string>) =>
          `${new Date(params.value).toLocaleString()}`,
      },
      {
        field: "updatedAt",
        headerName: "Updated",
        type: "dateTime",
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<string>) =>
          `${new Date(params.value).toLocaleString()}`,
      },
      ...(userRole === "USER" && assessmentType === "TEAM"
        ? []
        : [
            {
              field: "Actions",
              type: "actions",
              width: 150,
              getActions: (params: { id: GridRowId }) => [
                <Button
                  variant="contained"
                  onClick={() => handleContinue(Number(params.id))}
                >
                  <strong>Continue</strong>
                </Button>,
              ],
            },
          ]),
    ],
    []
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        columns={columns}
        hasToolbar
        sortModel={[{ field: "updatedAt", sort: "desc" }]}
      />
      <ErrorPopup ref={refErrorAssessmentOngoing} />
    </>
  );
}
