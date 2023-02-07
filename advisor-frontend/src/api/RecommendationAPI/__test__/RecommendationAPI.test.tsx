import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  recommendationToAPI,
  recommendationToAPP,
  useGetRecommendations,
  usePatchRecommendation,
} from "../RecommendationAPI";

describe("Testing RecommendationAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      recommendationToAPP({
        feedback_id: 0,
        order: 0,
        feedback_text: "",
        feedback_additional_information: "",
      })
    ).toStrictEqual({
      id: 0,
      order: 0,
      description: "",
      additionalInfo: "",
    });
  });

  it("toAPP should give API object", () => {
    expect(
      recommendationToAPI({
        id: 0,
        order: 0,
        description: "",
        additionalInfo: "",
      })
    ).toStrictEqual({
      feedback_id: 0,
      order: 0,
      feedback_text: "",
      feedback_additional_information: "",
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetRecommendations should return query", () => {
    const { result } = renderHook(() => useGetRecommendations(-1, -1), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchRecommendation should return mutation", () => {
    const { result } = renderHook(() => usePatchRecommendation(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
