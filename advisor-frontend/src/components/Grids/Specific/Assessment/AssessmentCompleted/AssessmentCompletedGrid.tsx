import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import {
  GridColumns,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import GenericGrid from "../../../Generic/GenericGrid";
import { AssessmentType } from "../../../../../types/AssessmentType";
import { handleInit } from "../../../functions/handlers/handlers";
import {
  AssessmentAPP,
  useGetMyIndividualAssessments,
  useGetMyTeamAssessments,
} from "../../../../../api/AssessmentAPI/AssessmentAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../../ErrorPopup/ErrorPopup";
import API from "../../../../../api/_API";

type AssessmentCompletedGridProps = {
  theme: Theme;
  // eslint-disable-next-line react/require-default-props
  teamId?: number;
  assessmentType: AssessmentType;
};

let mp = new Map();

/**
 * Grid for completed assessments
 * Uses theme, teamId, and assessmentType
 */
export default function AssessmentCompletedGrid({
  theme,
  teamId,
  assessmentType,
}: AssessmentCompletedGridProps) {

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

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorAssessmentCompleted = React.useRef<RefObject>(null);
  const onErrorAssessmentCompleted = getOnError(refErrorAssessmentCompleted);
  const navigate = useNavigate();

  /**
   * Assessment queries
   * Gets all individual or team assessments
   */
  const { status, data } =
    assessmentType === "TEAM" && teamId !== undefined
      ? useGetMyTeamAssessments(true, teamId, onErrorAssessmentCompleted)
      : useGetMyIndividualAssessments(true, onErrorAssessmentCompleted);

  const handleReview = (id: number) => {
    navigate(
      assessmentType === "INDIVIDUAL"
        ? `/user/self_evaluations/feedback/${id}`
        : `/teams/${teamId}/feedback/${id}`
    );
  };

  /**
   * useEffect for initialization of rows
   * Called when "status" of assessments query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, status, data);
  }, [status, data]);

  /**
   * useEffect for  
   */
  React.useEffect(() => {
    getAllTemplateNames();
  }, []);

  const columns = React.useMemo<GridColumns<AssessmentAPP>>(
    () => [
      {
        field: "Template Name",
        HeaderName: "Template Id",
        type: "string",
        flex: 1,
        editable: true,
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
        field: "completedAt",
        headerName: "Completed",
        type: "dateTime",
        flex: 1,
        valueFormatter: (params: GridValueFormatterParams<string>) =>
          `${new Date(params.value).toLocaleString()}`,
      },
      {
        field: "Actions",
        type: "actions",
        width: 125,
        getActions: (params: { id: GridRowId }) => [
          <Button
            variant="outlined"
            onClick={() => handleReview(Number(params.id))}
          >
            <strong>Review</strong>
          </Button>,
        ],
      },
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
        sortModel={[{ field: "completedAt", sort: "desc" }]}
      />
      <ErrorPopup ref={refErrorAssessmentCompleted} />
    </>
  );
}
