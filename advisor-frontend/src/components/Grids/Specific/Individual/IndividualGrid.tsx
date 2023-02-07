import * as React from "react";
import { UseMutationResult } from "react-query";
import { GridActionsCellItem, GridColumns, GridRowId } from "@mui/x-data-grid";
import { Theme } from "@mui/material/styles";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/HighlightOff";
import GenericGrid from "../../Generic/GenericGrid";
import {
  handleChange,
  handleDelete,
  handleInit,
} from "../../functions/handlers/handlers";
import {
  useDeleteUser,
  useGetUsers,
  usePatchUser,
  UserAPP,
} from "../../../../api/UserAPI/UserAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../ErrorPopup/ErrorPopup";

type IndividualGridProps = {
  theme: Theme;
};

/**
 * Grid for individuals
 * Uses theme
 */
export default function IndividualGrid({ theme }: IndividualGridProps) {
  /**
   * State of the rows
   * State setter of the rows
   */
  const [rows, setRows] = React.useState<UserAPP[]>([]);

  // Roles of users
  const roles = ["USER", "ASSESSOR", "ADMIN"];

  /**
   * Ref for error popup
   * onError function
   */
  const refErrorIndividual = React.useRef<RefObject>(null);
  const onErrorIndividual = getOnError(refErrorIndividual);

  /**
   * User query
   * Gets all users
   */
  const { status, data } = useGetUsers(undefined, onErrorIndividual);

  /**
   * User mutations
   * Patch user
   * Delete user
   */
  const patchUser = usePatchUser(onErrorIndividual);
  const deleteUser = useDeleteUser(onErrorIndividual);

  /**
   * useEffect for initialization of rows
   * Called when "status" of users query is changed
   */
  React.useEffect(() => {
    handleInit(setRows, status, data);
  }, [status, data]);

  /**
   * Role change handler
   * Called when role is edited
   */
  const handleRoleChange = React.useCallback(
    (row: UserAPP, event: SelectChangeEvent<string>) => {
      handleChange(
        setRows,
        patchUser as UseMutationResult,
        { ...row, role: event.target.value },
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
      handleDelete(setRows, deleteUser as UseMutationResult, rowId as number);
    },
    []
  );

  const columns = React.useMemo<GridColumns<UserAPP>>(
    () => [
      {
        field: "name",
        headerName: "Name",
        type: "string",
        flex: 1,
      },
      {
        field: "role",
        headerName: "Role",
        type: "string",
        flex: 1,
        renderCell: (params: { row: UserAPP }) => (
          <FormControl sx={{ m: 1, width: 200 }}>
            <Select
              value={params.row.role}
              onChange={(event: SelectChangeEvent<string>) =>
                handleRoleChange(params.row, event)
              }
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role === "ASSESSOR" ? "FACILITATOR" : role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
      },
      {
        field: "Actions",
        type: "actions",
        width: 100,
        getActions: (params: { id: GridRowId; row: UserAPP }) =>
          params.row.role !== "ADMIN"
            ? [
                <GridActionsCellItem
                  icon={
                    <Tooltip title="Remove">
                      <RemoveIcon />
                    </Tooltip>
                  }
                  label="Remove"
                  onClick={handleDeleteDecorator(params.id)}
                />,
              ]
            : [],
      },
    ],
    [handleRoleChange, handleDeleteDecorator]
  );

  return (
    <>
      <GenericGrid
        theme={theme}
        rows={rows}
        columns={columns}
        hasToolbar
        sortModel={[{ field: "name", sort: "asc" }]}
      />
      <ErrorPopup ref={refErrorIndividual} />
    </>
  );
}
