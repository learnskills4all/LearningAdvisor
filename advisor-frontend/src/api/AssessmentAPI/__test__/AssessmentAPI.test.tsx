import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  assessmentToAPI,
  assessmentToAPP,
  useDeleteAssessment,
  useGetAssessment,
  useGetAssessments,
  useGetMyIndividualAssessments,
  useGetMyTeamAssessments,
  useGetSaveAssessment,
  usePatchAssessment,
  usePostAssessment,
  usePostCompleteAssessment,
  usePostFeedbackAssessment,
  usePostSaveAssessment,
  filterCompletedAssessments,
  AssessmentAPP,
  AssessmentAPI,
} from "../AssessmentAPI";

describe("Testing AssessmentAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      assessmentToAPP({
        assessment_id: 0,
        assessment_name: "",
        assessment_type: "TEAM",
        country_name: "",
        department_name: "",
        template_id: 0,
        feedback_text: "",
        information: "",
        created_at: "",
        updated_at: "",
        completed_at: "",
        team_id: 0,
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      assessmentType: "TEAM",
      countryName: "",
      departmentName: "",
      templateId: 0,
      feedbackText: "",
      information: "",
      createdAt: "",
      updatedAt: "",
      completedAt: "",
      teamId: 0,
    });
  });

  const assessmentAPP: AssessmentAPP = {
    id: 0,
    name: "",
    assessmentType: "TEAM",
    countryName: "",
    departmentName: "",
    templateId: 0,
    feedbackText: "",
    information: "",
    createdAt: "",
    updatedAt: "",
    completedAt: "",
    teamId: 0,
  };

  const assessmentAPI: AssessmentAPI = {
    assessment_id: 0,
    assessment_name: "",
    assessment_type: "TEAM",
    country_name: "",
    department_name: "",
    template_id: 0,
    feedback_text: "",
    information: "",
    created_at: "",
    updated_at: "",
    completed_at: "",
    team_id: 0,
  };

  it("toAPP should give API object", () => {
    expect(assessmentToAPI(assessmentAPP)).toStrictEqual(assessmentAPI);
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetAnswers should return query", () => {
    const { result } = renderHook(() => useGetAssessments(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetAssessment should return query", () => {
    const { result } = renderHook(() => useGetAssessment(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetMyIndividualAssessments should return query", () => {
    const { result } = renderHook(() => useGetMyIndividualAssessments(true), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetMyTeamAssessments should return query", () => {
    const { result } = renderHook(() => useGetMyTeamAssessments(true, -1), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostAssessment should return mutation", () => {
    const { result } = renderHook(() => usePostAssessment("INDIVIDUAL"), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchAssessment should return mutation", () => {
    const { result } = renderHook(() => usePatchAssessment(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteAssessment should return mutation", () => {
    const { result } = renderHook(() => useDeleteAssessment(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostCompleteAssessment should return mutation", () => {
    const { result } = renderHook(() => usePostCompleteAssessment(-1), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostSaveAssessment should return mutation", () => {
    const { result } = renderHook(() => usePostSaveAssessment(-1, ""), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetSaveAssessment should return query", () => {
    const { result } = renderHook(() => useGetSaveAssessment(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostFeedbackAssessment should return mutation", () => {
    const { result } = renderHook(() => usePostFeedbackAssessment(-1), {
      wrapper,
    });
    expect(result.current.data).toEqual(undefined);
  });

  const assessmentAPICompleted: AssessmentAPI = {
    ...assessmentAPI,
    completed_at: "15-09-2017",
  };

  const assessmentAPPCompleted: AssessmentAPP = {
    ...assessmentAPP,
    completedAt: "15-09-2017",
  };

  it("filter for completed assessments", () => {
    expect(
      filterCompletedAssessments([assessmentAPI, assessmentAPICompleted], true)
    ).toEqual([assessmentAPPCompleted]);
  });

  it("filter for ongoing assessments", () => {
    expect(
      filterCompletedAssessments([assessmentAPI, assessmentAPICompleted], false)
    ).toEqual([assessmentAPP]);
  });
});
