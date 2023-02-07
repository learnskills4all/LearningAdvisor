import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  subareaToAPI,
  subareaToAPP,
  useDeleteSubarea,
  useGetSubarea,
  useGetSubareas,
  usePatchSubarea,
  usePostSubarea,
} from "../SubareaAPI";

describe("Testing SubareaAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      subareaToAPP({
        subarea_id: 0,
        subarea_name: "",
        order: 0,
        subarea_description: "",
        subarea_summary: "",
        category_id: 0,
        disabled: false,
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      order: 0,
      description: "",
      summary: "",
      categoryId: 0,
      enabled: true,
    });
  });

  it("toAPP should give API object", () => {
    expect(
      subareaToAPI({
        id: 0,
        name: "",
        order: 0,
        description: "",
        summary: "",
        categoryId: 0,
        enabled: true,
      })
    ).toStrictEqual({
      subarea_id: 0,
      subarea_name: "",
      order: 0,
      subarea_description: "",
      subarea_summary: "",
      category_id: 0,
      disabled: false,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetSubareas should return query", () => {
    const { result } = renderHook(() => useGetSubareas(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetSubarea should return query", () => {
    const { result } = renderHook(() => useGetSubarea(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostSubarea should return mutation", () => {
    const { result } = renderHook(() => usePostSubarea(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchSubarea should return mutation", () => {
    const { result } = renderHook(() => usePatchSubarea(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteSubarea should return mutation", () => {
    const { result } = renderHook(() => useDeleteSubarea(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
