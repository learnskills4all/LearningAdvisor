import { render } from "@testing-library/react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import API from "../_API";


export function useForgotPassword(onError?: (err: unknown) => void) {
    // Navigation hook, to be used after the user is logged in
    const navigate = useNavigate();
    return useMutation(
      ["Forgot Password"],
      (passInfo: { username: string; email: string }) =>
        API.post(`/forgotpassword/postByUserName`, passInfo),
      {
        onSuccess: async () => {
          await navigate('/login');

        },
        onError,
      }
    );
  }

  export function getData(
    id: any,
    token: any,
    onError?: (err: unknown) => void
    ) {
    const navigate = useNavigate();
    

    return useMutation (
      ["Get Data From URL"],
      async () => {
        const { data } = await API.post(
          `/forgotpassword/getURLData`,
          {urlId: id, urlToken: token})
          console.log("check")
          console.log(data)
          
        },
      {
        onSuccess: async () => {
          navigate(`/resetPassword/${id}/${token}`);
        },
        onError: async () => {
          await navigate(`/errorMail`);
          console.log(onError);
          onError
        }
      }
    );
  }

  export function useResetPassword(onError?: (err: unknown) => void) {
    // Navigation hook, to be used after the user is logged in
    const navigate = useNavigate();

    return useMutation(
      ["Reset Password"],
      (passInfo: { userId: any, newPassword: string, token: any }) =>
        API.patch(`/forgotpassword/patchByPass`, passInfo),
      {
        onSuccess: async () => {
          await navigate('/login');

        },
        onError,
      }
    );
  }