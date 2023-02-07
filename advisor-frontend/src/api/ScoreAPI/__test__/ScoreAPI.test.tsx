import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { scoreToAPP, useGetScores } from "../ScoreAPI";

describe("Testing ScoreAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      scoreToAPP({
        maturity_id: 0,
        category_id: 0,
        score: 0,
      })
    ).toStrictEqual({
      maturityId: 0,
      categoryId: 0,
      score: 0,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetScores should return query", () => {
    const { result } = renderHook(() => useGetScores(-1, -1), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });
});
