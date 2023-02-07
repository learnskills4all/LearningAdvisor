import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserName } from "../../app/userDataSlice";
import { UserAPI } from "../UserAPI/UserAPI";
import API from "../_API";

  export function useChangePassword(onError?: (err: unknown) => void) {
    // Navigation hook, to be used after the user is logged in
    const navigate = useNavigate();
    return useMutation(
      ["Change Password"],
      (passInfo: { currentPassword: string; newPassword: string }) =>
        API.put(`/changepassword/putByUserName`, passInfo),
      {
        onSuccess: async () => {
          await navigate('/');  
        },
        onError,
      }
    );
  }