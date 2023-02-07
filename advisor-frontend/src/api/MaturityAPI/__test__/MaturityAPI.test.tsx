import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  useDeleteMaturity,
  useGetMaturity,
  useGetMaturities,
  usePatchMaturity,
  usePostMaturity,
  maturityToAPP,
  maturityToAPI,
} from "../MaturityAPI";

describe("Testing MaturityAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      maturityToAPP({
        maturity_id: 0,
        maturity_name: "",
        order: 0,
        template_id: 0,
        disabled: false,
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      order: 0,
      templateId: 0,
      enabled: true,
    });
  });

  it("toAPP should give API object", () => {
    expect(
      maturityToAPI({
        id: 0,
        name: "",
        order: 0,
        templateId: 0,
        enabled: true,
      })
    ).toStrictEqual({
      maturity_id: 0,
      maturity_name: "",
      order: 0,
      template_id: 0,
      disabled: false,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetMaturitys should return query", () => {
    const { result } = renderHook(() => useGetMaturities(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetMaturity should return query", () => {
    const { result } = renderHook(() => useGetMaturity(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostMaturity should return mutation", () => {
    const { result } = renderHook(() => usePostMaturity(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchMaturity should return mutation", () => {
    const { result } = renderHook(() => usePatchMaturity(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteMaturity should return mutation", () => {
    const { result } = renderHook(() => useDeleteMaturity(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
