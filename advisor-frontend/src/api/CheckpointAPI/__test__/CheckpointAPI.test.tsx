import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  checkpointToAPI,
  checkpointToAPP,
  useDeleteCheckpoint,
  useGetCheckpoint,
  useGetCheckpoints,
  usePatchCheckpoint,
  usePostCheckpoint,
} from "../CheckpointAPI";

describe("Testing CheckpointAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      checkpointToAPP({
        checkpoint_id: 0,
        checkpoint_description: "",
        checkpoint_additional_information: "",
        weight: 0,
        order: 0,
        category_id: 0,
        maturity_id: 0,
        topics: [0],
        disabled: false,
      })
    ).toStrictEqual({
      id: 0,
      description: "",
      additionalInfo: "",
      weight: 0,
      order: 0,
      categoryId: 0,
      maturityId: 0,
      topics: [0],
      enabled: true,
    });
  });

  it("toAPP should give API object", () => {
    expect(
      checkpointToAPI({
        id: 0,
        description: "",
        additionalInfo: "",
        weight: 0,
        order: 0,
        categoryId: 0,
        maturityId: 0,
        topics: [0],
        enabled: true,
      })
    ).toStrictEqual({
      checkpoint_id: 0,
      checkpoint_description: "",
      checkpoint_additional_information: "",
      weight: 0,
      order: 0,
      category_id: 0,
      maturity_id: 0,
      topics: [0],
      disabled: false,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetCheckpoints should return query", () => {
    const { result } = renderHook(() => useGetCheckpoints(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetCheckpoint should return query", () => {
    const { result } = renderHook(() => useGetCheckpoint(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostCheckpoint should return mutation", () => {
    const { result } = renderHook(() => usePostCheckpoint(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchCheckpoint should return mutation", () => {
    const { result } = renderHook(() => usePatchCheckpoint(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteCheckpoint should return mutation", () => {
    const { result } = renderHook(() => useDeleteCheckpoint(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
