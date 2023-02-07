import * as React from "react";
import {
  GridActionsCellItem,
  GridRowId,
  GridColumns,
  GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Theme } from "@mui/material/styles";
import { UseMutationResult } from "react-query";
import {
  processRowUpdate,
  handleDelete,
  handleMove,
  preProcessEditOrder,
  handleInit,
  handleAdd,
} from "../../functions/handlers/handlers";
import GenericGrid from "../../Generic/GenericGrid";
import {
  SubareaAPP,
  usePatchSubarea,
  usePostSubarea,
  useDeleteSubarea,
  useGetSubareas,
} from "../../../../api/SubareaAPI/SubareaAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import { RenderEditCell } from "../columns";

type SubareaGridProps = {
  theme: Theme;
  categoryId: number;
};

export default function SubareaGrid({ theme, categoryId }: SubareaGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<SubareaAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorSubarea = React.useRef<RefObject>(null);
  const onErrorSubarea = getOnError(refErrorSubarea);

  /**
   * Subarea query
   * Gets all subareas
   */
  const { status, data } = useGetSubareas(
    categoryId,
    undefined,
    onErrorSubarea
  );

  /**
   * Subarea mutations
   * Patch subarea
   * Post subarea
   * Delete subarea
   */
  const patchSubarea = usePatchSubarea(onErrorSubarea);
  const postSubarea = usePostSubarea(categoryId, onErrorSubarea);
  const deleteSubarea = useDeleteSubarea(onErrorSubarea);

  /**
   * useEffect for initialization of rows
   * Called when "status" of subareas query is changed
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
      preProcessEditOrder(rows, params, onErrorSubarea),
    [rows]
  );

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: SubareaAPP, oldRow: SubareaAPP) =>
      processRowUpdate(
        setRows,
        patchSubarea as UseMutationResult,
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
    (row: SubareaAPP) => () => {
      handleMove(setRows, patchSubarea as UseMutationResult, {
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
    (row: SubareaAPP) => () => {
      handleMove(setRows, patchSubarea as UseMutationResult, {
        ...row,
        order: row.order + 1,
      });
    },
    []
  );

  /**
   * Row delete handler
   * Called when the "Delete" action is pressed in the menu
   */
  const handleDeleteDecorator = React.useCallback(
    (rowId: GridRowId) => () => {
      handleDelete(
        setRows,
        deleteSubarea as UseMutationResult,
        rowId as number
      );
    },
    []
  );

  /**
   * Row add handler
   * Called when the "Add" button is pressed below the grid
   */
  const handleAddDecorator = React.useCallback(() => {
    handleAdd(setRows, postSubarea as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<SubareaAPP>>(
    () => [
      {
        field: "",
        width: 50,
        renderCell: (params: { row: SubareaAPP }) => (
          <RenderEditCell
            handleUpward={handleUpwardDecorator(params.row)}
            handleDownward={handleDownwardDecorator(params.row)}
          />
        ),
      },
      {
        preProcessEditCellProps: preProcessEditOrderDecorator,
        field: "order",
        headerName: "Order",
        headerAlign: "center",
        align: "center",
        type: "number",
        width: 75,
        editable: true,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        width: 200,
        editable: true,
      },
      {
        field: "summary",
        headerName: "Summary",
        type: "string",
        editable: true,
        flex: 1,
      },
      {
        field: "description",
        headerName: "Description",
        type: "string",
        editable: true,
        flex: 1,
      },
      {
        field: "enabled",
        type: "boolean",
        headerName: "Enabled",
        editable: true,
        width: 75,
      },
      {
        field: "Actions",
        getActions: (params: { id: GridRowId }) => [
          <GridActionsCellItem
            label="Delete"
            icon={<DeleteIcon />}
            onClick={handleDeleteDecorator(params.id)}
            showInMenu
          />,
        ],
        type: "actions",
        width: 75,
      },
    ],
    [
      handleDeleteDecorator,
      handleUpwardDecorator,
      preProcessEditOrderDecorator,
      handleDownwardDecorator,
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
        add={{
          text: "CREATE NEW SUBAREA",
          handler: handleAddDecorator,
        }}
      />
      <ErrorPopup ref={refErrorSubarea} />
    </>
  );
}
