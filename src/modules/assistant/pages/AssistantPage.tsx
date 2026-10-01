import {
  Bot,
  LoaderCircle,
  RotateCcw,
  Send,
  UserRound,
} from "lucide-react";
import {
  useState,
} from "react";

import {
  assistantApi,
  type AssistantChatResponse,
} from "@/modules/assistant/api/assistant.api";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: AssistantChatResponse["sources"];
}

export const AssistantPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [error, setError] = useState<string>();
  const [isSending, setIsSending] = useState(false);

  const send = async (): Promise<void> => {
    const message = draft.trim();
    if (!message || isSending) return;

    setDraft("");
    setError(undefined);
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: message },
    ]);
    setIsSending(true);

    try {
      const response = await assistantApi.chat(message, conversationId);
      setConversationId(response.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Không thể gửi câu hỏi đến trợ lý AI.");
    } finally {
      setIsSending(false);
    }
  };

  const clear = async (): Promise<void> => {
    if (isSending) return;
    setError(undefined);
    try {
      if (conversationId) await assistantApi.clear(conversationId);
      setConversationId(undefined);
      setMessages([]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Không thể xoá cuộc hội thoại.");
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-5xl flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white"><Bot size={22} /></span>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Trợ lý AI</h1>
            <p className="mt-1 text-sm text-slate-500">Tra cứu thông tin nghiệp vụ từ các API đang chạy.</p>
          </div>
        </div>
        <button type="button" onClick={() => void clear()} disabled={isSending || messages.length === 0}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
          <RotateCcw size={16} /> Cuộc trò chuyện mới
        </button>
      </header>

      <section className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="grid min-h-72 place-items-center text-center">
              <div>
                <Bot className="mx-auto text-blue-600" size={34} />
                <p className="mt-3 font-semibold text-slate-900">Hỏi trợ lý về dữ liệu thuê thiết bị</p>
                <p className="mt-1 text-sm text-slate-500">Ví dụ: “Các đơn thuê nào đang chờ duyệt?”</p>
              </div>
            </div>
          ) : messages.map((item) => (
            <article key={item.id} className={item.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"}>
              <div className={item.role === "user"
                ? "rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm leading-6 text-white"
                : "rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-800"}>
                <span className="mb-1 flex items-center gap-1.5 text-xs font-bold opacity-80">
                  {item.role === "user" ? <UserRound size={14} /> : <Bot size={14} />}
                  {item.role === "user" ? "Bạn" : "Trợ lý AI"}
                </span>
                <p className="whitespace-pre-wrap">{item.content}</p>
              </div>
              {item.sources && item.sources.length > 0 ? (
                <p className="mt-1 px-1 text-xs text-slate-400">Nguồn: {item.sources.map((source) => source.service).join(", ")}</p>
              ) : null}
            </article>
          ))}
          {isSending ? <div className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={17} /> AI đang xử lý...</div> : null}
          {error ? <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        </div>
        <form className="flex gap-2 border-t border-slate-100 p-4" onSubmit={(event) => { event.preventDefault(); void send(); }}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={4000}
            placeholder="Nhập câu hỏi cho trợ lý AI..." className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <button type="submit" disabled={!draft.trim() || isSending}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Send size={16} /> Gửi
          </button>
        </form>
      </section>
    </main>
  );
};
