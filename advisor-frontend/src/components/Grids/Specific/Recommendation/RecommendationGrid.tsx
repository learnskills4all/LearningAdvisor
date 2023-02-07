import * as React from "react";
import { UseMutationResult } from "react-query";
import { GridColumns, GridPreProcessEditCellProps } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import GenericGrid from "../../Generic/GenericGrid";
import {
  handleInit,
  handleMove,
  preProcessEditOrder,
  processRowUpdate,
} from "../../functions/handlers/handlers";
import {
  RecommendationAPP,
  useGetRecommendations,
  usePatchRecommendation,
} from "../../../../api/RecommendationAPI/RecommendationAPI";
import { RenderEditCell } from "../columns";

type RecommendationGridProps = {
  theme: Theme;
  assessmentId: number;
  topicId: number | undefined;
  isEditable: boolean; // Is this grid editable?
};

/**
 * Grid for recommendations
 * Uses theme, assessmentId, topicId, and isEditable
 */
export default function RecommendationGrid({
  theme,
  assessmentId,
  topicId,
  isEditable,
}: RecommendationGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<RecommendationAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorRecommendation = React.useRef<RefObject>(null);
  const onErrorRecommendation = getOnError(refErrorRecommendation);

  // Recommendation query
  const { status, data } = useGetRecommendations(
    assessmentId,
    topicId,
    onErrorRecommendation
  );

  /**
   * Recommendation query
   * Gets all recommendations
   */
  const patchRecommendation = usePatchRecommendation(onErrorRecommendation);

  /**
   * useEffect for initialization of rows
   * Called when "status" of recommendations query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, status, data);
  }, [status, data]);

  /**
   * Preprocesses the order when edited
   * Called when the 'Order' column is edited
   */
  const preProcessEditOrderDecorator = React.useCallback(
    (params: GridPreProcessEditCellProps) =>
      preProcessEditOrder(rows, params, onErrorRecommendation),
    [rows]
  );

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: RecommendationAPP, oldRow: RecommendationAPP) =>
      processRowUpdate(
        setRows,
        patchRecommendation as UseMutationResult,
        newRow,
        oldRow
      ),
    []
  );

  /**
   * Upward order handler
   * Called when the "Upward" action is pressed
   */
  const handleUpwardDecorator = React.useCallback(
    (row: RecommendationAPP) => () => {
      handleMove(setRows, patchRecommendation as UseMutationResult, {
        ...row,
        order: row.order - 1,
      });
    },
    []
  );

  /**
   * Downward order handler
   * Called when the "Downward" action is pressed
   */
  const handleDownwardDecorator = React.useCallback(
    (row: RecommendationAPP) => () => {
      handleMove(setRows, patchRecommendation as UseMutationResult, {
        ...row,
        order: row.order + 1,
      });
    },
    []
  );

  const columns = React.useMemo<GridColumns<RecommendationAPP>>(
    () => [
      ...(isEditable
        ? [
            {
              field: "",
              width: 50,
              renderCell: (params: { row: RecommendationAPP }) => (
                <RenderEditCell
                  handleUpward={handleUpwardDecorator(params.row)}
                  handleDownward={handleDownwardDecorator(params.row)}
                />
              ),
            },
          ]
        : []),
      {
        field: "order",
        headerName: "Priority",
        headerAlign: "center",
        align: "center",
        type: "number",
        width: 75,
        editable: isEditable,
        preProcessEditCellProps: preProcessEditOrderDecorator,
      },
      {
        field: "description",
        headerName: "Description",
        type: "string",
        flex: 1,
      },
      {
        field: "additionalInfo",
        headerName: "Additional Information",
        type: "string",
        flex: 1,
        editable: isEditable,
      },
    ],
    [
      handleUpwardDecorator,
      handleDownwardDecorator,
      preProcessEditOrderDecorator,
    ]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
      />
      <ErrorPopup ref={refErrorRecommendation} />
    </>
  );
}
