import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  answerToAPI,
  answerToAPP,
  useDeleteAnswer,
  useGetAnswer,
  useGetAnswers,
  usePatchAnswer,
  usePostAnswer,
} from "../AnswerAPI";

describe("Testing AnswerAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      answerToAPP({
        answer_id: 0,
        answer_text: "",
        answer_weight: 0,
        template_id: 0,
        disabled: false,
      })
    ).toStrictEqual({
      id: 0,
      label: "",
      value: 0,
      templateId: 0,
      enabled: true,
    });
  });

  it("toAPP should give API object", () => {
    expect(
      answerToAPI({ id: 0, label: "", value: 0, templateId: 0, enabled: true })
    ).toStrictEqual({
      answer_id: 0,
      answer_text: "",
      answer_weight: 0,
      template_id: 0,
      disabled: false,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetAnswers should return query", () => {
    const { result } = renderHook(() => useGetAnswers(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetAnswer should return query", () => {
    const { result } = renderHook(() => useGetAnswer(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostAnswer should return mutation", () => {
    const { result } = renderHook(() => usePostAnswer(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchAnswer should return mutation", () => {
    const { result } = renderHook(() => usePatchAnswer(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteAnswer should return mutation", () => {
    const { result } = renderHook(() => useDeleteAnswer(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
