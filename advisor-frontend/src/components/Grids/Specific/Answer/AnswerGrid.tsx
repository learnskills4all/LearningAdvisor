import * as React from "react";
import { UseMutationResult } from "react-query";
import {
  GridActionsCellItem,
  GridColumns,
  GridRowId,
  GridValueFormatterParams,
  GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericGrid from "../../Generic/GenericGrid";
import {
  handleAdd,
  handleDelete,
  processRowUpdate,
  handleInit,
} from "../../functions/handlers/handlers";
import {
  AnswerAPP,
  useDeleteAnswer,
  useGetAnswers,
  usePatchAnswer,
  usePostAnswer,
} from "../../../../api/AnswerAPI/AnswerAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";

type AnswerGridProps = {
  theme: Theme;
  templateId: number;
};

/**
 * Grid for answer types in admin panel
 * Uses theme and templateId
 */
export default function AnswerTypeGrid({ theme, templateId }: AnswerGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<AnswerAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorAnswer = React.useRef<RefObject>(null);
  const onErrorAnswer = getOnError(refErrorAnswer);

  /**
   * Answer query
   * Gets all answers
   */
  const { status, data } = useGetAnswers(templateId, undefined, onErrorAnswer);

  /**
   * Answer mutations
   * Patch answer
   * Post answer
   * Delete answer
   */
  const patchAnswer = usePatchAnswer(onErrorAnswer);
  const postAnswer = usePostAnswer(templateId, onErrorAnswer);
  const deleteAnswer = useDeleteAnswer(onErrorAnswer);

  /**
   * useEffect for initialization of rows
   * Called when "status" of answers query is changed
   */
  React.useEffect(() => {
    const filteredData = data?.filter((a) => a.id);
    handleInit(setRows, status, filteredData);
  }, [status, data]);

  // Called when the 'Value' column is edited
  const preProcessEditValue = React.useCallback(
    (params: GridPreProcessEditCellProps) => {
      const { value } = params.props;

      // If value is below 0, above 100, or null: reject
      const hasError = value < 0 || value > 100 || value === null;

      return { ...params.props, error: hasError };
    },
    [rows]
  );

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: AnswerAPP, oldRow: AnswerAPP) =>
      processRowUpdate(
        setRows,
        patchAnswer as UseMutationResult,
        newRow,
        oldRow
      ),
    []
  );

  /**
   * Row delete handler
   * Called when the "Delete" action is pressed in the menu
   */
  const handleDeleteDecorator = React.useCallback(
    (rowId: GridRowId) => () => {
      handleDelete(setRows, deleteAnswer as UseMutationResult, rowId as number);
    },
    []
  );

  /**
   * Row add handler
   * Called when the "Add" button is pressed below the grid
   */
  const handleAddDecorator = React.useCallback(() => {
    handleAdd(setRows, postAnswer as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<AnswerAPP>>(
    () => [
      {
        field: "label",
        headerName: "Label",
        type: "string",
        flex: 1,
        editable: true,
      },
      {
        field: "value",
        headerName: "Value",
        headerAlign: "left",
        align: "left",
        type: "number",
        flex: 1,
        editable: true,
        preProcessEditCellProps: preProcessEditValue,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} %`,
      },
      {
        field: "enabled",
        headerName: "Enabled",
        type: "boolean",
        width: 75,
        editable: true,
      },
      {
        field: "Actions",
        type: "actions",
        width: 100,
        getActions: (params: { id: GridRowId }) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete">
                <DeleteIcon />
              </Tooltip>
            }
            label="Delete"
            onClick={handleDeleteDecorator(params.id)}
          />,
        ],
      },
    ],
    [preProcessEditValue, handleDeleteDecorator]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        columns={columns}
        add={{
          text: "ADD ANSWER OPTION",
          handler: handleAddDecorator,
        }}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
      />
      <ErrorPopup ref={refErrorAnswer} />
    </>
  );
}
