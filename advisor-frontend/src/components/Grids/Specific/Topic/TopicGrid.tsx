import * as React from "react";
import { UseMutationResult } from "react-query";
import { GridActionsCellItem, GridColumns, GridRowId } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericGrid from "../../Generic/GenericGrid";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import {
  handleAdd,
  handleDelete,
  handleInit,
  processRowUpdate,
} from "../../functions/handlers/handlers";
import {
  TopicAPP,
  useDeleteTopic,
  useGetTopics,
  usePatchTopic,
  usePostTopic,
} from "../../../../api/TopicAPI/TopicAPI";

type TopicGridProps = {
  theme: Theme;
  templateId: number;
};

/**
 * Grid for topics
 * Uses theme and templateId
 */
export default function TopicGrid({ theme, templateId }: TopicGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<TopicAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorTopic = React.useRef<RefObject>(null);
  const onErrorTopic = getOnError(refErrorTopic);

  /**
   * Topic query
   * Gets all topics
   */
  const { status, data } = useGetTopics(templateId, undefined, onErrorTopic);

  /**
   * Topic mutations
   * Patch topic
   * Post topic
   * Delete topic
   */
  const patchTopic = usePatchTopic(onErrorTopic);
  const postTopic = usePostTopic(templateId, onErrorTopic);
  const deleteTopic = useDeleteTopic(onErrorTopic);

  /**
   * useEffect for initialization of rows
   * Called when "status" of topics query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, status, data);
  }, [status, data]);

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: TopicAPP, oldRow: TopicAPP) =>
      processRowUpdate(
        setRows,
        patchTopic as UseMutationResult,
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
      handleDelete(setRows, deleteTopic as UseMutationResult, rowId as number);
    },
    []
  );

  /**
   * Row add handler
   * Called when the "Add" button is pressed below the grid
   */
  const handleAddDecorator = React.useCallback(() => {
    handleAdd(setRows, postTopic as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<TopicAPP>>(
    () => [
      {
        editable: true,
        field: "name",
        type: "string",
        headerName: "Name",
        flex: 1,
      },
      {
        headerName: "Enabled",
        field: "enabled",
        type: "boolean",
        editable: true,
        width: 75,
      },
      {
        type: "actions",
        field: "Actions",
        width: 100,
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
    [handleDeleteDecorator]
  );

  return (
    <>
      <GenericGrid
        columns={columns}
        theme={theme}
        rows={rows}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
        add={{
          text: "CREATE NEW TOPIC",
          handler: handleAddDecorator,
        }}
      />
      <ErrorPopup ref={refErrorTopic} />
    </>
  );
}
