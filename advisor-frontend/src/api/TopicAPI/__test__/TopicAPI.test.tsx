import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  topicToAPI,
  topicToAPP,
  useDeleteTopic,
  useGetTopic,
  useGetTopics,
  usePatchTopic,
  usePostTopic,
} from "../TopicAPI";

describe("Testing TopicAPI", () => {
  it("toAPP should give APP object", () => {
    expect(
      topicToAPP({
        topic_id: 0,
        topic_name: "",
        template_id: 0,
        disabled: false,
      })
    ).toStrictEqual({
      id: 0,
      name: "",
      templateId: 0,
      enabled: true,
    });
  });

  it("toAPP should give API object", () => {
    expect(
      topicToAPI({
        id: 0,
        name: "",
        templateId: 0,
        enabled: true,
      })
    ).toStrictEqual({
      topic_id: 0,
      topic_name: "",
      template_id: 0,
      disabled: false,
    });
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("useGetTopics should return query", () => {
    const { result } = renderHook(() => useGetTopics(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useGetTopic should return query", () => {
    const { result } = renderHook(() => useGetTopic(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePostTopic should return mutation", () => {
    const { result } = renderHook(() => usePostTopic(-1), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("usePatchTopic should return mutation", () => {
    const { result } = renderHook(() => usePatchTopic(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });

  it("useDeleteTopic should return mutation", () => {
    const { result } = renderHook(() => useDeleteTopic(), { wrapper });
    expect(result.current.data).toEqual(undefined);
  });
});
