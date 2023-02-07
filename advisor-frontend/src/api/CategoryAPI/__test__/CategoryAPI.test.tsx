import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  useDeleteCategory,
  useGetCategory,
  useGetCategories,
  usePatchCategory,
  usePostCategory,
  categoryToAPP,
  categoryToAPI,
} from "../CategoryAPI";

describe("Testing CategoryAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      categoryToAPP({
        category_id: 0,
        category_name: "",
        color: "",
        order: 0,
        disabled: false,
        template_id: 0,
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      color: "",
      order: 0,
      enabled: true,
      templateId: 0,
    });
  });

  it("toAPP should give APP object", () => {
    expect(
      categoryToAPI({
        id: 0,
        name: "",
        color: "",
        order: 0,
        enabled: true,
        templateId: 0,
      })
    ).toStrictEqual({
      category_id: 0,
      category_name: "",
      color: "",
      order: 0,
      disabled: false,
      template_id: 0,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetCategorys should return query", () => {
    const { result } = renderHook(() => useGetCategories(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetCategory should return query", () => {
    const { result } = renderHook(() => useGetCategory(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostCategory should return mutation", () => {
    const { result } = renderHook(() => usePostCategory(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchCategory should return mutation", () => {
    const { result } = renderHook(() => usePatchCategory(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteCategory should return mutation", () => {
    const { result } = renderHook(() => useDeleteCategory(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
