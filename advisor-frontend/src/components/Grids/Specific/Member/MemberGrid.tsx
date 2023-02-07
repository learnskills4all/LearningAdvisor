import * as React from "react";
import { UseMutationResult } from "react-query";
import { GridActionsCellItem, GridColumns, GridRowId } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import { Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/HighlightOff";
import GenericGrid from "../../Generic/GenericGrid";
import { UserRole } from "../../../../types/UserRole";
import { handleDelete, handleInit } from "../../functions/handlers/handlers";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";
import {
  useDeleteMemberTeamOne,
  useGetMembersTeam,
  UserAPP,
} from "../../../../api/UserAPI/UserAPI";

type MemberGridProps = {
  theme: Theme;
  userId: number;
  userRole: UserRole;
  teamId: number;
  forAssessors: boolean; // Is the grid for assessors (true) or users (false)
};

/**
 * Grid for members
 * Uses theme, userId, userRole, teamId, and forAssessors
 */
export default function MemberGrid({
  theme,
  userId,
  userRole,
  teamId,
  forAssessors,
}: MemberGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<UserAPP[]>([]);

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorMember = React.useRef<RefObject>(null);
  const onErrorMember = getOnError(refErrorMember);

  /**
   * Member queries
   * Gets all members of a team for assessors or users
   */
  const { status, data } = forAssessors
    ? useGetMembersTeam(teamId, "ASSESSOR", onErrorMember)
    : useGetMembersTeam(teamId, "USER", onErrorMember);

  /**
   * Member mutation
   * Delete member
   */
  const deleteMember = useDeleteMemberTeamOne(teamId, onErrorMember);

  /**
   * useEffect for initialization of rows
   * Called when "status" of members query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, status, data);
  }, [status, data]);

  /**
   * Row delete handler
   * Called when the "Delete" action is pressed in the menu
   */
  const handleDeleteDecorator = React.useCallback(
    (rowId: GridRowId) => () => {
      handleDelete(setRows, deleteMember as UseMutationResult, rowId as number);
    },
    []
  );

  const columns = React.useMemo<GridColumns<UserAPP>>(
    () => [
      {
        field: "name",
        headerName: forAssessors ? "Facilitator Name" : "Member Name",
        type: "string",
        flex: 1,
        editable: userRole === "ASSESSOR",
      },
      ...(userRole === "ASSESSOR"
        ? [
            {
              field: "Actions",
              type: "actions",
              width: 100,
              getActions: (params: { id: GridRowId }) =>
                params.id === userId
                  ? []
                  : [
                      <GridActionsCellItem
                        icon={
                          <Tooltip title="Remove">
                            <RemoveIcon />
                          </Tooltip>
                        }
                        label="Remove"
                        onClick={handleDeleteDecorator(params.id)}
                      />,
                    ],
            },
          ]
        : []),
    ],
    [handleDeleteDecorator]
  );

  return (
    <>
      <GenericGrid theme={theme} rows={rows} columns={columns} hasToolbar w="48%" />
      <ErrorPopup ref={refErrorMember} />
    </>
  );
}
