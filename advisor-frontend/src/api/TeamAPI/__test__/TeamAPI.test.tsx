import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  teamToAPI,
  teamToAPP,
  useDeleteTeam,
  useGetInviteTokenTeam,
  useGetMyTeams,
  useGetTeam,
  useJoinInviteTokenTeam,
  usePatchTeam,
  usePostTeam,
} from "../TeamAPI";

describe("Testing TeamAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      teamToAPP({
        team_id: 0,
        team_name: "",
        invite_token: 0,
        team_country: "",
        team_department: "",
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      inviteToken: 0,
      country: "",
      department: "",
    });
  });

  it("toAPP should give API object", () => {
    expect(
      teamToAPI({
        id: 0,
        name: "",
        inviteToken: 0,
        country: "",
        department: "",
      })
    ).toStrictEqual({
      team_id: 0,
      team_name: "",
      invite_token: 0,
      team_country: "",
      team_department: "",
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetTeams should return query", () => {
    const { result } = renderHook(() => useGetMyTeams(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetTeam should return query", () => {
    const { result } = renderHook(() => useGetTeam(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostTeam should return mutation", () => {
    const { result } = renderHook(() => usePostTeam(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchTeam should return mutation", () => {
    const { result } = renderHook(() => usePatchTeam(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteTeam should return mutation", () => {
    const { result } = renderHook(() => useDeleteTeam(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetInviteTokenTeam should return mutation", () => {
    const { result } = renderHook(() => useGetInviteTokenTeam(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useJoinInviteTokenTeam should return mutation", () => {
    const { result } = renderHook(() => useJoinInviteTokenTeam(""), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });
});
