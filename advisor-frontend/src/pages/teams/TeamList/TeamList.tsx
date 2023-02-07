import { Box, Button, Stack, TextField, Theme } from "@mui/material";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import PageLayout from "../../PageLayout";
import userTypes from "../../../components/Sidebar/listUsersTypes";
import TeamGrid from "../../../components/Grids/Specific/Team/TeamGrid";
import { RootState } from "../../../app/store";
import {
  useGetMyTeams,
  useJoinInviteTokenTeam,
} from "../../../api/TeamAPI/TeamAPI";
import ErrorPopup, {
  getOnError,
  RefObject,
} from "../../../components/ErrorPopup/ErrorPopup";

/**
 * Page with the list of teams that the user or assessor is part of
 */
function TeamList({ theme }: { theme: Theme }) {
  const { userRole, userId } = useSelector(
    (state: RootState) => state.userData
  );

  // Ref for error popup
  const refErrorTeams = useRef<RefObject>(null);
  const onErrorTeams = getOnError(refErrorTeams);

  // Team query
  const teamResponse = useGetMyTeams(onErrorTeams);

  // Define token, setToken as a state hook in React that is set initially to empty
  const [token, setToken] = useState("");

  const patchToken = useJoinInviteTokenTeam(token, onErrorTeams);

  const handleJoinTeam = () => {
    patchToken.mutate(undefined, {
      onSuccess: () => {
        teamResponse.refetch();
      },
    });
  };

  /**
   * function that allows you to join team as token once
   * token has been filled in editable textfield (at the left of the button) following
   * with clicking on the button "join team with token"
   */
  return (
    <PageLayout title="Teams" sidebarType={userTypes[userRole]}>
      {userRole !== "ADMIN" && (
        <Stack direction="row" sx={{ width: "60%" }}>
          <Box>
            <TextField
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
              }}
              label="Enter token"
              rows={1}
            />
          </Box>
          <Box sx={{ p: 1.5 }}>
            <Button variant="contained" onClick={handleJoinTeam}>
              Join Team With Token
            </Button>
          </Box>
        </Stack>
      )}

      <TeamGrid
        theme={theme}
        userRole={userRole}
        userId={Number(userId)}
        teamResponse={teamResponse}
      />
      <ErrorPopup ref={refErrorTeams} />
    </PageLayout>
  );
}

export default TeamList;
