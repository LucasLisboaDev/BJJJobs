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
    <div className="ios-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-separator/40 bg-fill-quaternary/30">
        <MessageCircle className="w-4 h-4 text-brand" />
        <span className="text-subheadline font-semibold">Messages</span>
        <span className="text-caption-1 text-label-tertiary">
          {viewerRole === "gym" ? "Chat with this coach" : "Chat with the gym"}
        </span>
      </div>

      <div className="h-56 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="text-caption-1 text-label-tertiary text-center py-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-caption-1 text-label-tertiary text-center py-8">
            No messages yet. Say hello to start the conversation.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"}`}
            >
              {!msg.isMine && (
                <span className="text-[10px] text-label-tertiary mb-0.5">{msg.senderLabel}</span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-subheadline leading-relaxed ${
                  msg.isMine ? "bg-brand text-white" : "bg-fill-tertiary text-label"
                }`}
              >
                {msg.body}
              </div>
              <span className="text-[10px] text-label-tertiary mt-0.5">
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

      <form onSubmit={handleSend} className="border-t border-separator/40 p-3 flex gap-2">
        <input
          className="flex-1 rounded-xl px-3 py-2 text-subheadline outline-none border-none"
          style={{ background: "var(--fill-tertiary)" }}
          placeholder="Write a message..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center disabled:opacity-50 tap"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      {error && <p className="px-3 pb-2 text-caption-1 text-red-600">{error}</p>}
    </div>
  );
}
