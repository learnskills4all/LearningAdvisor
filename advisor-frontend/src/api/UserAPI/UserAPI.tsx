import { useMutation, useQuery } from "react-query";
import { GridRowId } from "@mui/x-data-grid";
import API from "../_API";
import { UserRole } from "../../types/UserRole";

// APP/API types for topics
export type UserAPP = {
  id: GridRowId;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type UserAPI = {
  user_id: number;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

/**
 * Convert API object to APP object
 * @param userAPI
 * @returns UserAPP object
 */
export function userToAPP(userAPI: UserAPI) {
  return {
    id: userAPI.user_id,
    name: userAPI.username,
    role: userAPI.role,
    createdAt: userAPI.created_at,
    updatedAt: userAPI.updated_at,
  } as UserAPP;
}

/**
 * Convert APP object to API object
 * @param userAPP
 * @returns UserAPI object
 */
export function userToAPI(userAPP: UserAPP) {
  return {
    user_id: userAPP.id,
    username: userAPP.name,
    role: userAPP.role,
    created_at: userAPP.createdAt,
    updated_at: userAPP.updatedAt,
  };
}

/**
 * Get all users from database
 */
export function useGetUsers(
  roleFilter?: UserRole,
  onError?: (err: unknown) => void
) {
  return useQuery(
    roleFilter === undefined ? ["GET", "/user"] : ["GET", "/user", roleFilter],
    async () => {
      // Get data from database
      const { data } = await API.get(`/user`);

      // Convert data to usersAPP
      const usersAPP = data.map((userAPI: UserAPI) => userToAPP(userAPI));

      // If defined, filter on user role
      if (roleFilter !== undefined) {
        const usersFilteredAPP = usersAPP.filter(
          (userAPP: UserAPP) => userAPP.role === roleFilter
        );

        return usersFilteredAPP as UserAPP[];
      }

      return usersAPP as UserAPP[];
    },
    { onError }
  );
}

/**
 * Get user with id from database
 */
export function useGetUser(onError?: (err: unknown) => void) {
  return useQuery(
    ["GET", "/user", "/{user_id}"],
    async (userId) => {
      // Get data from database
      const { data } = await API.get(`/user/${userId}`);

      return userToAPP(data) as UserAPP;
    },
    { onError }
  );
}

/**
 * Patch user with id in database
 */
export function usePatchUser(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/user", "/{user_id}"],
    async (userAPP: UserAPP) => {
      // Convert userAPP to userAPI
      const userAPI = userToAPI(userAPP);

      // Get data from database
      const { data } = await API.patch(`/user/${userAPI.user_id}`, userAPI);

      return userToAPP(data) as UserAPP;
    },
    { onError }
  );
}

/**
 * Delete user with id from database
 */
export function useDeleteUser(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/user", "/{user_id}"],
    async (userId) => {
      // Get data from database
      const { data } = await API.delete(`/user/${userId}`);

      return userToAPP(data) as UserAPP;
    },
    { onError }
  );
}

/**
 * Get is user in team with team id from database
 */
export function useIsUserInTeam(
  teamId: number,
  onError?: (err: unknown) => void
) {
  return useQuery(
    ["GET", "/teams", teamId, "/isUserInTeam"],
    async () => {
      // Get data from database
      const { data } = await API.get(`/teams/${teamId}/isUserInTeam`);

      return data as boolean;
    },
    { onError }
  );
}

/**
 * Get meembers of team with team id from database
 */
export function useGetMembersTeam(
  teamId: number,
  roleFilter?: UserRole,
  onError?: (err: unknown) => void
) {
  return useQuery(
    roleFilter === undefined
      ? ["GET", "/teams", teamId, "/members"]
      : ["GET", "/teams", teamId, "/members", roleFilter],
    async () => {
      // Get data from database
      const { data } = await API.get(`/teams/${teamId}/members`);

      // Convert data to usersAPP
      const usersAPP = data.team_members.map((userAPI: UserAPI) =>
        userToAPP(userAPI)
      );

      // If defined, filter on user role
      if (roleFilter !== undefined) {
        const usersFilteredAPP = usersAPP.filter(
          (userAPP: UserAPP) => userAPP.role === roleFilter
        );

        return usersFilteredAPP as UserAPP[];
      }

      return usersAPP as UserAPP[];
    },
    { onError }
  );
}

/**
 * Delete user from team with team id from database
 */
export function useDeleteMemberTeamOne(
  teamId: number,
  onError?: (err: unknown) => void
) {
  return useMutation(
    ["DELETE", "/teams", teamId, "/members", "/user_id"],
    async (userId: number) => {
      // Get response data from database
      const { data } = await API.delete(`/teams/${teamId}/member/${userId}`);

      // Convert data to userAPP
      return userToAPP(data) as UserAPP;
    },
    { onError }
  );
}

/**
 * Delete user from team with team id from database
 */
export function useDeleteMemberTeamTwo(onError?: (err: unknown) => void) {
  return useMutation(
    ["DELETE", "/teams", "{team_id}", "/members", "/{user_id}"],
    async ({ teamId, userId }: { teamId: number; userId: number }) => {
      // Get response data from database
      const { data } = await API.delete(`/teams/${teamId}/member/${userId}`);

      // Convert data to userAPP
      return userToAPP(data) as UserAPP;
    },
    { onError }
  );
}
