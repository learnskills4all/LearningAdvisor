import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  useDeleteMemberTeamOne,
  useDeleteMemberTeamTwo,
  useDeleteUser,
  useGetMembersTeam,
  useGetUser,
  useGetUsers,
  useIsUserInTeam,
  usePatchUser,
  userToAPI,
  userToAPP,
} from "../UserAPI";

describe("Testing UserAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      userToAPP({
        user_id: 0,
        username: "",
        role: "USER",
        created_at: "",
        updated_at: "",
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      role: "USER",
      createdAt: "",
      updatedAt: "",
    });
  });

  it("toAPI should give APP object", () => {
    expect(
      userToAPI({
        id: 0,
        name: "",
        role: "USER",
        createdAt: "",
        updatedAt: "",
      })
    ).toStrictEqual({
      user_id: 0,
      username: "",
      role: "USER",
      created_at: "",
      updated_at: "",
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetUsers should return query", () => {
    const { result } = renderHook(() => useGetUsers(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetUser should return query", () => {
    const { result } = renderHook(() => useGetUser(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchUser should return mutation", () => {
    const { result } = renderHook(() => usePatchUser(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteUser should return mutation", () => {
    const { result } = renderHook(() => useDeleteUser(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useIsUserInTeam should return query", () => {
    const { result } = renderHook(() => useIsUserInTeam(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetMembersTeam should return query", () => {
    const { result } = renderHook(() => useGetMembersTeam(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteMemberTeamOne should return mutation", () => {
    const { result } = renderHook(() => useDeleteMemberTeamOne(-1), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteMemberTeamTwo should return mutation", () => {
    const { result } = renderHook(() => useDeleteMemberTeamTwo(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
