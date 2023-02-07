import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useLogout } from "../LoginAPI";

describe("Testing LoginAPI", () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useLogout should return mutation", () => {
    const { result } = renderHook(() => useLogout(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
