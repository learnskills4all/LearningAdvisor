import * as React from "react";
import { BlockPicker, ColorResult } from "react-color";
import { UseMutationResult } from "react-query";
import { Link } from "react-router-dom";
import {
  GridActionsCellItem,
  GridColumns,
  GridRowId,
  GridPreProcessEditCellProps,
} from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericGrid from "../../Generic/GenericGrid";
import {
  handleAdd,
  handleDelete,
  handleInit,
  handleMove,
  handleChange,
  preProcessEditOrder,
  processRowUpdate,
} from "../../functions/handlers/handlers";
import {
  CategoryAPP,
  useDeleteCategory,
  useGetCategories,
  usePatchCategory,
  usePostCategory,
} from "../../../../api/CategoryAPI/CategoryAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import { RenderEditCell } from "../columns";

type CategoryGridProps = {
  theme: Theme;
  templateId: number;
};

/**
 * Grid for categories
 * Uses theme and templateId
 */
export default function CategoryGrid({ theme, templateId }: CategoryGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<CategoryAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorCategory = React.useRef<RefObject>(null);
  const onErrorCategory = getOnError(refErrorCategory);

  /**
   * Category query
   * Gets all categories
   */
  const { status, data } = useGetCategories(
    templateId,
    undefined,
    onErrorCategory
  );

  /**
   * Category mutations
   * Patch category
   * Post category
   * Delete category
   */
  const patchCategory = usePatchCategory(onErrorCategory);
  const postCategory = usePostCategory(templateId, onErrorCategory);
  const deleteCategory = useDeleteCategory(onErrorCategory);

  /**
   * useEffect for initialization of rows
   * Called when "status" of categories query is changed
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
      preProcessEditOrder(rows, params, onErrorCategory),
    [rows]
  );

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: CategoryAPP, oldRow: CategoryAPP) =>
      processRowUpdate(
        setRows,
        patchCategory as UseMutationResult,
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
    (row: CategoryAPP) => () => {
      handleMove(setRows, patchCategory as UseMutationResult, {
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
    (row: CategoryAPP) => () => {
      handleMove(setRows, patchCategory as UseMutationResult, {
        ...row,
        order: row.order + 1,
      });
    },
    []
  );

  /**
   * Color change handler
   * Called when color picker registers a complete change
   */
  const handleColorChange = React.useCallback(
    (color: ColorResult, row: CategoryAPP) => {
      handleChange(
        setRows,
        patchCategory as UseMutationResult,
        { ...row, color: color.hex },
        row
      );
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
        deleteCategory as UseMutationResult,
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
    handleAdd(setRows, postCategory as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<CategoryAPP>>(
    () => [
      {
        width: 50,
        field: "",
        renderCell: (params: { row: CategoryAPP }) => (
          <RenderEditCell
            handleUpward={handleUpwardDecorator(params.row)}
            handleDownward={handleDownwardDecorator(params.row)}
          />
        ),
      },
      {
        headerAlign: "center",
        field: "order",
        headerName: "Order",
        align: "center",
        type: "number",
        preProcessEditCellProps: preProcessEditOrderDecorator,
        width: 75,
        editable: true,
      },
      {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 1,
        editable: true,
      },
      {
        field: "color",
        headerName: "Color Theme",
        flex: 1,
        editable: false,
        renderCell: (params: { row: CategoryAPP }) => (
          <BlockPicker
            width="250px"
            colors={[]}
            triangle="hide"
            color={params.row.color}
            onChangeComplete={(color: ColorResult) =>
              handleColorChange(color, params.row)
            }
            styles={{
              default: {
                head: {
                  height: "50px",
                  borderStyle: "solid",
                  borderColor:
                    params.row.order % 2 === 0
                      ? theme.palette.secondary.light
                      : "white",
                },
                body: {
                  backgroundColor:
                    params.row.order % 2 === 0
                      ? theme.palette.secondary.light
                      : "white",
                },
              },
            }}
          />
        ),
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
        width: 125,
        getActions: (params: { id: GridRowId; row: CategoryAPP }) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Visit">
                <Link to={`/admin/templates/${templateId}/${params.id}`}>
                  <ArrowForwardIcon className="arrowIcon" />
                </Link>
              </Tooltip>
            }
            label="Visit"
          />,
          <GridActionsCellItem
            onClick={handleDeleteDecorator(params.id)}
            icon={<DeleteIcon />}
            showInMenu
            label="Delete"
          />,
        ],
      },
    ],
    [
      handleDownwardDecorator,
      handleUpwardDecorator,
      preProcessEditOrderDecorator,
      handleColorChange,
      handleDeleteDecorator,
    ]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        add={{
          text: "CREATE NEW AREA",
          handler: handleAddDecorator,
        }}
        processRowUpdate={processRowUpdateDecorator}
        columns={columns}
        hasToolbar
      />
      <ErrorPopup ref={refErrorCategory} />
    </>
  );
}
