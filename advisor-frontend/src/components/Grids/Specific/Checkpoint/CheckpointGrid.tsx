import * as React from "react";
import { UseMutationResult } from "react-query";
import {
  GridActionsCellItem,
  GridColumns,
  GridPreProcessEditCellProps,
  GridRowId,
} from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import {
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericGrid from "../../Generic/GenericGrid";
import { TopicAPP, useGetTopics } from "../../../../api/TopicAPI/TopicAPI";
import {
  MaturityAPP,
  useGetMaturities,
} from "../../../../api/MaturityAPI/MaturityAPI";
import {
  CheckpointAPP,
  useDeleteCheckpoint,
  useGetCheckpoints,
  usePatchCheckpoint,
  usePostCheckpoint,
} from "../../../../api/CheckpointAPI/CheckpointAPI";
import {
  handleAdd,
  handleChange,
  handleDelete,
  handleInit,
  handleMove,
  preProcessEditOrder,
  processRowUpdate,
} from "../../functions/handlers/handlers";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import { RenderEditCell } from "../columns";

type CheckpointGridProps = {
  theme: Theme;
  templateId: number;
  categoryId: number;
};

/**
 * Grid for checkpoints
 * Uses theme, templateId, and categoryId
 */
export default function CheckpointGrid({
  theme,
  templateId,
  categoryId,
}: CheckpointGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<CheckpointAPP[]>([]);

  /**
   * State of the topics
   * State setter of the topics
   */
  const [topics, setTopics] = React.useState<TopicAPP[]>([]);

  /**
   * State of the maturities
   * State setter of the maturities
   */
  const [maturities, setMaturities] = React.useState<MaturityAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorCheckpoint = React.useRef<RefObject>(null);
  const onErrorCheckpoint = getOnError(refErrorCheckpoint);

  /**
   * Checkpoint queries
   * Gets all checkpoints
   * Gets all enabled topics
   * Gets all enabled maturities
   */
  const { status: statusCheckpoints, data: dataCheckpoints } =
    useGetCheckpoints(categoryId, undefined, onErrorCheckpoint);

  const { status: statusTopics, data: dataTopics } = useGetTopics(
    templateId,
    true,
    onErrorCheckpoint
  );

  const { status: statusMaturities, data: dataMaturities } = useGetMaturities(
    templateId,
    true,
    onErrorCheckpoint
  );

  /**
   * Checkpoint mutations
   * Patch checkpoint
   * Post checkpoint
   * Delete checkpoint
   */
  const patchCheckpoint = usePatchCheckpoint(onErrorCheckpoint);
  const postCheckpoint = usePostCheckpoint(categoryId, onErrorCheckpoint);
  const deleteCheckpoint = useDeleteCheckpoint(onErrorCheckpoint);

  /**
   * useEffect for initialization of rows
   * Called when "status" of checkpoints query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, statusCheckpoints, dataCheckpoints);
  }, [statusCheckpoints, dataCheckpoints]);

  /**
   * useEffect for initialization of topics
   * Called when "status" of topics query is changed
   */
  React.useEffect(() => {
    handleInit(setTopics, statusTopics, dataTopics);
  }, [statusTopics, dataTopics]);

  /**
   * useEffect for initialization of maturities
   * Called when "status" of  maturities query is changed
   */
  React.useEffect(() => {
    handleInit(setMaturities, statusMaturities, dataMaturities);
  }, [statusMaturities, dataMaturities]);

  /**
   * Preprocesses the order when edited
   * Called when the 'Order' column is edited
   */
  const preProcessEditOrderDecorator = React.useCallback(
    (params: GridPreProcessEditCellProps) =>
      preProcessEditOrder(rows, params, onErrorCheckpoint),
    [rows]
  );

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: CheckpointAPP, oldRow: CheckpointAPP) =>
      processRowUpdate(
        setRows,
        patchCheckpoint as UseMutationResult,
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
    (row: CheckpointAPP) => () => {
      handleMove(setRows, patchCheckpoint as UseMutationResult, {
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
    (row: CheckpointAPP) => () => {
      handleMove(setRows, patchCheckpoint as UseMutationResult, {
        ...row,
        order: row.order + 1,
      });
    },
    []
  );

  /**
   * Topic change handler
   * Called when topic changes
   */
  const handleTopicsChange = React.useCallback(
    (row: CheckpointAPP, event: SelectChangeEvent<string[]>) => {
      const { value } = event.target;
      const topicStrings = typeof value === "string" ? value.split(",") : value;
      const topicIds = topicStrings.map((topicString) =>
        parseInt(topicString, 10)
      );

      handleChange(
        setRows,
        patchCheckpoint as UseMutationResult,
        { ...row, topics: topicIds },
        row
      );
    },
    []
  );

  /**
   * Maturity change handler
   * Called when maturity level changes
   */
  const handleMaturityChange = React.useCallback(
    (row: CheckpointAPP, event: SelectChangeEvent<string>) => {
      const maturityId = parseInt(event.target.value, 10);

      handleChange(
        setRows,
        patchCheckpoint as UseMutationResult,
        { ...row, maturityId },
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
        deleteCheckpoint as UseMutationResult,
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
    handleAdd(setRows, postCheckpoint as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<CheckpointAPP>>(
    () => [
      {
        field: "",
        width: 50,
        renderCell: (params: { row: CheckpointAPP }) => (
          <RenderEditCell
            handleUpward={handleUpwardDecorator(params.row)}
            handleDownward={handleDownwardDecorator(params.row)}
          />
        ),
      },
      {
        field: "order",
        headerName: "Order",
        headerAlign: "center",
        align: "center",
        type: "number",
        width: 75,
        editable: true,
        preProcessEditCellProps: preProcessEditOrderDecorator,
      },
      {
        field: "description",
        headerName: "Description",
        type: "string",
        flex: 1.5,
        editable: true,
      },
      {
        field: "additionalInfo",
        headerName: "Additional Information",
        type: "string",
        flex: 1.5,
        editable: true,
      },
      {
        field: "topic",
        headerName: "Topic",
        type: "string",
        flex: 1,
        renderCell: (params: { row: CheckpointAPP }) => (
          <FormControl sx={{ m: 1, width: 200 }}>
            <Select
              multiple
              value={params.row.topics.map((topicId) => topicId.toString())}
              onChange={(event: SelectChangeEvent<string[]>) =>
                handleTopicsChange(params.row, event)
              }
            >
              {topics.map((topic) => (
                <MenuItem key={topic.name} value={topic.id.toString()}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
      },
      {
        field: "maturity",
        headerName: "Maturity Level",
        type: "string",
        flex: 1,
        renderCell: (params: { row: CheckpointAPP }) => (
          <FormControl sx={{ m: 1, width: 200 }}>
            <Select
              value={params.row.maturityId.toString()}
              onChange={(event: SelectChangeEvent<string>) =>
                handleMaturityChange(params.row, event)
              }
            >
              {maturities.map((maturity) => (
                <MenuItem key={maturity.name} value={maturity.id.toString()}>
                  {maturity.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
      },
      {
        field: "weight",
        headerName: "Weight",
        headerAlign: "center",
        align: "center",
        type: "number",
        width: 75,
        editable: true,
      },
      {
        field: "enabled",
        headerName: "Enabled",
        headerAlign: "center",
        type: "boolean",
        width: 75,
        editable: true,
      },
      {
        field: "Actions",
        type: "actions",
        width: 75,
        getActions: (params: { id: GridRowId; row: CheckpointAPP }) => [
          <GridActionsCellItem
            showInMenu
            icon={<DeleteIcon />}
            onClick={handleDeleteDecorator(params.id)}
            label="Delete"
          />,
        ],
      },
    ],
    [
      handleUpwardDecorator,
      handleDownwardDecorator,
      preProcessEditOrderDecorator,
      handleTopicsChange,
      handleMaturityChange,
      handleDeleteDecorator,
      topics,
      maturities,
    ]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        add={{
          text: "CREATE CHECKPOINT",
          handler: handleAddDecorator,
        }}
        columns={columns}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
      />
      <ErrorPopup ref={refErrorCheckpoint} />
    </>
  );
}
