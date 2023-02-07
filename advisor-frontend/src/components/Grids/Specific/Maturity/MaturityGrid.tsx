import { UseMutationResult } from "react-query";
import * as React from "react";
import {
  GridColumns,
  GridActionsCellItem,
  GridRowId,
  GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Theme } from "@mui/material/styles";
import GenericGrid from "../../Generic/GenericGrid";
import {
  handleDelete,
  handleAdd,
  processRowUpdate,
  handleInit,
  preProcessEditOrder,
  handleMove,
} from "../../functions/handlers/handlers";
import {
  MaturityAPP,
  useDeleteMaturity,
  useGetMaturities,
  usePatchMaturity,
  usePostMaturity,
} from "../../../../api/MaturityAPI/MaturityAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import { RenderEditCell } from "../columns";

type MaturityGridProps = {
  theme: Theme;
  templateId: number;
};

/**
 * Grid for maturities
 * Uses theme and templateId
 */
export default function MaturityGrid({ theme, templateId }: MaturityGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<MaturityAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorMaturity = React.useRef<RefObject>(null);
  const onErrorMaturity = getOnError(refErrorMaturity);

  /**
   * Maturity query
   * Gets all maturities
   */
  const { status, data } = useGetMaturities(
    templateId,
    undefined,
    onErrorMaturity
  );

  /**
   * Maturity mutations
   * Patch maturity
   * Post maturity
   * Delete maturity
   */
  const patchMaturity = usePatchMaturity(onErrorMaturity);
  const postMaturity = usePostMaturity(templateId, onErrorMaturity);
  const deleteMaturity = useDeleteMaturity(onErrorMaturity);

  /**
   * useEffect for initialization of rows
   * Called when "status" of maturities query is changed
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
      preProcessEditOrder(rows, params, onErrorMaturity),
    [rows]
  );

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: MaturityAPP, oldRow: MaturityAPP) =>
      processRowUpdate(
        setRows,
        patchMaturity as UseMutationResult,
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
    (row: MaturityAPP) => () => {
      handleMove(setRows, patchMaturity as UseMutationResult, {
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
    (row: MaturityAPP) => () => {
      handleMove(setRows, patchMaturity as UseMutationResult, {
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
        deleteMaturity as UseMutationResult,
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
    handleAdd(setRows, postMaturity as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<MaturityAPP>>(
    () => [
      {
        field: "",
        renderCell: (params: { row: MaturityAPP }) => (
          <RenderEditCell
            handleDownward={handleDownwardDecorator(params.row)}
            handleUpward={handleUpwardDecorator(params.row)}
          />
        ),
        width: 50,
      },
      {
        headerName: "Order",
        field: "order",
        type: "number",
        headerAlign: "center",
        align: "center",
        editable: true,
        width: 75,
        preProcessEditCellProps: preProcessEditOrderDecorator,
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        type: "string",
        editable: true,
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
        width: 75,
        getActions: (params: { id: GridRowId }) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteDecorator(params.id)}
            showInMenu
          />,
        ],
      },
    ],
    [
      handleDownwardDecorator,
      preProcessEditOrderDecorator,
      handleDeleteDecorator,
      handleUpwardDecorator,
    ]
  );

  return (
    <>
      <GenericGrid
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
        add={{
          text: "CREATE NEW MATURITY LEVEL",
          handler: handleAddDecorator,
        }}
        theme={theme}
      />
      <ErrorPopup ref={refErrorMaturity} />
    </>
  );
}
