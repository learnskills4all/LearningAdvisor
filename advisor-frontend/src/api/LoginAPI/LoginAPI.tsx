import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../_API";
import { UserAPI } from "../UserAPI/UserAPI";
import {
  setUserRole,
  setUserId,
  setUserName,
  setPassword,
} from "../../app/userDataSlice";

/**
 * @params {role: "USERTYPE"} object that contains the body for the POST request
 * @returns Object of login details for the user
 */
export function useRegister(onError?: (err: unknown) => void, teamId?: string) {
  // Navigation hook, to be used after the user is logged in
  const navigate = useNavigate();

  // Make the global state variable functions available
  const dispatch = useDispatch();

  return useMutation(
    ["Register new user"],
    async (userRole: { role: string }) => {
      const { data } = await API.post(`/auth/register`, userRole);
      return data;
    },
    {
      onSuccess: async (data: { username: string; password: string }) => {
        dispatch(setUserName(data.username));
        dispatch(setPassword(data.password));
        var path = `/signup/details`;
        if (teamId != "") {
          try {
            await API.patch(`/teams/join/${teamId}`);
            path += "?teamId=" + teamId;
          } catch (ex) {
            console.log(ex);
          }
        }
        await navigate(path);
      },
      onError,
    }
  );
}

/**
 * Checks if the user is logged in and retrieves the userId and userRole.
 * Contains functionality to redirect the user to their homepage and update the global state values.
 */
export function authProfile(onError?: (err: unknown) => void) {
  // Import the Slice functions to access the Redux functions
  const dispatch = useDispatch();

  return useMutation(
    ["Auth profile"],
    async () => {
      const { data } = await API.get(`/auth/profile`);
      return data;
    },
    {
      onSuccess: async (userAPI: UserAPI) => {
        dispatch(setUserRole(userAPI.role));
        dispatch(setUserId(userAPI.user_id.toString()));
      },
      onError,
    }
  );
}

/**
 * Login API function that uses an object as specified in the backend API.
 * @param username String value
 * @param password String value
 * @returns onError: display the error message received from the backend API.
 */
export function useLogin(onError?: (err: unknown) => void) {
  // Calls authentication API this way to avoid hook-in-hook issues
  const auth = authProfile(onError);

  // Navigation hook, to be used after the user is logged in
  const navigate = useNavigate();

  return useMutation(
    ["Login"],
    (loginInfo: { username: string; password: string }) =>
      API.post(`/auth/login`, loginInfo),
    {
      onSuccess: async () => {
        await auth.mutate();
        await navigate(`/`);
      },
      onError,
    }
  );
}

/**
 * API Call to logout the current user.
 * Removes the cookie token and resets the session state
 */
export function useLogout(onError?: (err: unknown) => void) {
  return useMutation(["User Logout"], () => API.post(`/auth/logout`), {
    onError,
  });
}
