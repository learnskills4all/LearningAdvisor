import * as React from "react";
import { UseMutationResult, UseQueryResult } from "react-query";
import { Link } from "react-router-dom";
import { GridActionsCellItem, GridColumns, GridRowId } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RemoveIcon from "@mui/icons-material/HighlightOff";
import GenericGrid from "../../Generic/GenericGrid";
import { UserRole } from "../../../../types/UserRole";
import {
  handleAdd,
  handleInit,
  handleDelete,
  processRowUpdate,
} from "../../functions/handlers/handlers";
import { useDeleteMemberTeamTwo } from "../../../../api/UserAPI/UserAPI";
import {
  TeamAPP,
  useDeleteTeam,
  usePatchTeam,
  usePostTeam,
} from "../../../../api/TeamAPI/TeamAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";

type TeamGridProps = {
  theme: Theme;
  userRole: UserRole;
  userId: number;
  teamResponse: UseQueryResult<TeamAPP[], unknown>;
};

/**
 * Grid for teams
 * Uses theme, userRole, userId, and teamResponse
 */
export default function TeamGrid({
  theme,
  userRole,
  userId,
  teamResponse,
}: TeamGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<TeamAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorTeam = React.useRef<RefObject>(null);
  const onErrorTeam = getOnError(refErrorTeam);

  /**
   * Team mutations
   * Patch team
   * Post team
   * Delete team
   * Delete team member
   */
  const patchTeam = usePatchTeam(onErrorTeam);
  const postTeam = usePostTeam(onErrorTeam);
  const deleteTeam = useDeleteTeam(onErrorTeam);
  const deleteMemberTeam = useDeleteMemberTeamTwo(onErrorTeam);

  /**
   * useEffect for initialization of rows
   * Called when "status" of teams query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, teamResponse.status, teamResponse.data);
  }, [teamResponse.status, teamResponse.data]);

  /**
   * Row update handler
   * Called when a row is edited
   */
  const processRowUpdateDecorator = React.useCallback(
    async (newRow: TeamAPP, oldRow: TeamAPP) =>
      processRowUpdate(setRows, patchTeam as UseMutationResult, newRow, oldRow),
    []
  );

  /**
   * Team member delete handler for leaving team
   * Called when the "Delete" action is pressed in the menu
   */
  const handleDeleteMemberDecorator = React.useCallback(
    (rowId: GridRowId) => () => {
      deleteMemberTeam.mutate(
        { teamId: rowId as number, userId },
        {
          onSuccess: () => {
            setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));
          },
          onError: onErrorTeam,
        }
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
      handleDelete(setRows, deleteTeam as UseMutationResult, rowId as number);
    },
    []
  );

  /**
   * Row add handler
   * Called when the "Add" button is pressed below the grid
   */
  const handleAddDecorator = React.useCallback(() => {
    handleAdd(setRows, postTeam as UseMutationResult);
  }, []);

  const columns = React.useMemo<GridColumns<TeamAPP>>(
    () => [
      {
        field: "name",
        headerName: "Team Name",
        type: "string",
        flex: 1,
        editable: userRole === "ASSESSOR",
      },
      {
        field: "Actions",
        type: "actions",
        width: 100,
        getActions: (params: { id: GridRowId }) => [
          <GridActionsCellItem
            icon={
              <Tooltip title="Visit">
                <Link to={`/teams/${params.id}`}>
                  <ArrowForwardIcon className="arrowIcon" />
                </Link>
              </Tooltip>
            }
            label="Visit"
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Leave">
                <RemoveIcon />
              </Tooltip>
            }
            label="Leave"
            onClick={handleDeleteMemberDecorator(params.id)}
            showInMenu={userRole === "ASSESSOR"}
          />,
          ...(userRole === "ASSESSOR"
            ? [
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteDecorator(params.id)}
                  showInMenu
                />,
              ]
            : []),
        ],
      },
    ],
    [handleDeleteDecorator]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        columns={columns}
        processRowUpdate={processRowUpdateDecorator}
        hasToolbar
        add={
          userRole === "ASSESSOR"
            ? { text: "CREATE NEW TEAM", handler: handleAddDecorator }
            : undefined
        }
      />
      <ErrorPopup ref={refErrorTeam} />
    </>
  );
}
