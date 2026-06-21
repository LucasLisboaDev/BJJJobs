"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

type ChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  isMine: boolean;
  senderLabel: string;
};

export function ApplicationChat({
  applicationId,
  viewerRole,
}: {
  applicationId: string;
  viewerRole: "gym" | "coach";
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    const res = await fetch(`/api/applications/${applicationId}/messages`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoading(false);
  }, [applicationId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 8000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/applications/${applicationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setDraft("");
      } else {
        setError(data.error || "Failed to send message");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <MessageCircle className="w-4 h-4" style={{ color: "#1D9E75" }} />
        <span className="text-sm font-medium">Messages</span>
        <span className="text-xs text-gray-400">
          {viewerRole === "gym" ? "Chat with this coach" : "Chat with the gym"}
        </span>
      </div>

      <div className="h-56 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="text-xs text-gray-400 text-center py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-xs text-gray-400 text-center py-8">
            No messages yet. Say hello to start the conversation.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
            >
              {!msg.isMine && (
                <span className="text-[10px] text-gray-400 mb-0.5">{msg.senderLabel}</span>
              )}
              <div
                className="max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed"
                style={
                  msg.isMine
                    ? { background: "#1D9E75", color: "#fff" }
                    : { background: "#f3f4f6", color: "#374151" }
                }
              >
                {msg.body}
              </div>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {new Date(msg.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t border-gray-100 p-3 flex gap-2">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
          placeholder="Write a message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white disabled:opacity-50"
          style={{ background: "#1D9E75" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      {error && <p className="px-3 pb-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
