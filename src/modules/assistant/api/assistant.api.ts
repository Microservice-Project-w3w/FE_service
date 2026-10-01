import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

export interface AssistantSource {
  service: string;
  endpoint: string;
}

export interface AssistantChatResponse {
  conversationId: string;
  answer: string;
  data: Record<string, unknown>[];
  actions: string[];
  sources: AssistantSource[];
}

export const assistantApi = {
  chat(message: string, conversationId?: string): Promise<AssistantChatResponse> {
    return authenticatedRequest<AssistantChatResponse>("POST", "/api/v1/ai/chat", {
      body: { message, conversationId },
      timeoutMs: 60_000,
    });
  },

  async clear(conversationId: string): Promise<void> {
    await authenticatedRequest<null>("DELETE", `/api/v1/ai/chat/${conversationId}`);
  },
};
