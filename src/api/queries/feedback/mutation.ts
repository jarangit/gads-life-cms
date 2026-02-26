import { http } from "@/api/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateFeedbackRequestPayload } from "@/api/types/feedback";

const endpoint = "/admin/feedback-requests";

export function useUpdateFeedbackRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFeedbackRequestPayload;
    }) =>
      http(`${endpoint}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "feedback-requests",
      });
    },
  });
}
