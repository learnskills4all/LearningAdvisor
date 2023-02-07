import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  templateToAPI,
  templateToAPP,
  useDeleteTemplate,
  useDuplicateTemplate,
  useGetTemplate,
  useGetTemplates,
  usePatchTemplate,
  usePostTemplate,
} from "../TemplateAPI";

describe("Testing TemplateAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      templateToAPP({
        template_id: 0,
        template_name: "",
        template_description: "",
        template_type: "TEAM",
        template_feedback: "",
        information: "",
        enabled: true,
        weight_range_min: 0,
        weight_range_max: 0,
        score_formula: "",
        include_no_answer: true,
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      description: "",
      templateType: "TEAM",
      feedback: "",
      information: "",
      enabled: true,
      weightRangeMin: 0,
      weightRangeMax: 0,
      scoreFormula: "",
      includeNoAnswer: true,
    });
  });

  it("toAPP should give API object", () => {
    expect(
      templateToAPI({
        id: 0,
        name: "",
        description: "",
        templateType: "TEAM",
        feedback: "",
        information: "",
        enabled: true,
        weightRangeMin: 0,
        weightRangeMax: 0,
        scoreFormula: "",
        includeNoAnswer: true,
      })
    ).toStrictEqual({
      template_id: 0,
      template_name: "",
      template_description: "",
      template_type: "TEAM",
      template_feedback: "",
      information: "",
      enabled: true,
      weight_range_min: 0,
      weight_range_max: 0,
      score_formula: "",
      include_no_answer: true,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetTemplates should return query", () => {
    const { result } = renderHook(() => useGetTemplates("INDIVIDUAL"), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetTemplate should return query", () => {
    const { result } = renderHook(() => useGetTemplate(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostTemplate should return mutation", () => {
    const { result } = renderHook(() => usePostTemplate("INDIVIDUAL"), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchTemplate should return mutation", () => {
    const { result } = renderHook(() => usePatchTemplate(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteTemplate should return mutation", () => {
    const { result } = renderHook(() => useDeleteTemplate(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDuplicateTemplate should return mutation", () => {
    const { result } = renderHook(() => useDuplicateTemplate(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
