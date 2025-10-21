import { useMutation, useQuery } from "@tanstack/react-query";

import type { Resposne } from "../routine/useAddFoodToRoutine";
import { getChatAI } from "../../service/aiService";

function useChatAI() {
  const { isPending, mutate: chatWithAI } = useMutation<
    Resposne,
    Error,
    { query: string }
  >({
    mutationFn: ({ query }) => getChatAI(query),
  });

  return { isPending, chatWithAI };
}

export default useChatAI;
