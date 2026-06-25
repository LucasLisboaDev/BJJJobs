"use client";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ApplicationChat } from "@/components/application-chat";
import { ProfileAvatar } from "@/components/profile-avatar";
import { useLanguage } from "@/components/language-provider";
import { STATUS_CONFIG } from "@/lib/application-status";

type ConversationItem = {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  status: string;
  counterpartName: string;
  counterpartPhoto: string | null;
  lastMessage: {
    body: string;
    createdAt: string;
    isMine: boolean;
  } | null;
  unreadCount: number;
  updatedAt: string;
};

export function DashboardMessages({
  viewerRole,
  selectedApplicationId,
  onSelectApplication,
  onUnreadChange,
}: {
  viewerRole: "coach" | "gym";
  selectedApplicationId: string | null;
  onSelectApplication: (applicationId: string | null) => void;
  onUnreadChange?: (count: number) => void;
}) {
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/conversations");
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    setConversations(data.conversations ?? []);
    onUnreadChange?.(data.totalUnread ?? 0);
    setLoading(false);
  }, [onUnreadChange]);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedApplicationId && conversations.length > 0) {
      onSelectApplication(conversations[0].applicationId);
    }
  }, [conversations, selectedApplicationId, onSelectApplication]);

  const selected = conversations.find((c) => c.applicationId === selectedApplicationId) ?? null;
  const showMobileChat = !!selectedApplicationId;

  function formatPreview(body: string) {
    const trimmed = body.replace(/\s+/g, " ").trim();
    return trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed;
  }

  function formatTime(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) {
      return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    }
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  if (loading) {
    return (
      <div className="ios-card-lg p-10 text-center text-footnote text-label-tertiary">
        {t("dashboard.messagesLoading")}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="ios-card-lg p-10 text-center">
        <MessageCircle className="w-10 h-10 text-label-tertiary mx-auto mb-3" />
        <div className="text-headline mb-2">{t("dashboard.noMessagesTitle")}</div>
        <p className="text-footnote text-label-secondary">
          {viewerRole === "coach" ? t("dashboard.noMessagesSub") : t("dashboard.noMessagesSubGym")}
        </p>
      </div>
    );
  }

  return (
    <div className="ios-card-lg overflow-hidden min-h-[28rem]">
      <div className="grid md:grid-cols-[minmax(0,18rem)_1fr] min-h-[28rem]">
        <div
          className={`border-b md:border-b-0 md:border-r border-separator/40 bg-fill-quaternary/20 ${
            showMobileChat ? "hidden md:block" : "block"
          }`}
        >
          <div className="px-4 py-3 border-b border-separator/40">
            <h2 className="text-headline">{t("dashboard.tabMessages")}</h2>
            <p className="text-caption-1 text-label-tertiary mt-0.5">
              {viewerRole === "coach"
                ? t("dashboard.messagesCoachHint")
                : t("dashboard.messagesGymHint")}
            </p>
          </div>
          <div className="max-h-[24rem] md:max-h-[calc(28rem-4rem)] overflow-y-auto">
            {conversations.map((conv) => {
              const isSelected = conv.applicationId === selectedApplicationId;
              const statusCfg = STATUS_CONFIG[conv.status] ?? STATUS_CONFIG.pending;
              return (
                <button
                  key={conv.applicationId}
                  type="button"
                  onClick={() => onSelectApplication(conv.applicationId)}
                  className={`w-full text-left px-4 py-3 border-b border-separator/20 hover:bg-fill-quaternary/60 transition-colors tap ${
                    isSelected ? "bg-brand-light/60" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <ProfileAvatar
                      src={conv.counterpartPhoto}
                      alt={conv.counterpartName}
                      fallback={conv.counterpartName.slice(0, 1)}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-subheadline truncate ${conv.unreadCount > 0 ? "font-semibold" : ""}`}
                        >
                          {conv.counterpartName}
                        </span>
                        <span className="text-[11px] text-label-tertiary shrink-0">
                          {formatTime(conv.updatedAt)}
                        </span>
                      </div>
                      <div className="text-caption-1 text-label-secondary truncate">
                        {conv.jobTitle}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span
                          className={`text-caption-1 truncate ${
                            conv.unreadCount > 0 ? "text-label font-medium" : "text-label-tertiary"
                          }`}
                        >
                          {conv.lastMessage
                            ? `${conv.lastMessage.isMine ? `${t("dashboard.you")}: ` : ""}${formatPreview(conv.lastMessage.body)}`
                            : t("dashboard.noMessagesYet")}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[1.25rem] h-5 px-1 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center">
                            {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <span
                        className="inline-flex mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-capsule"
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`flex flex-col ${showMobileChat ? "block" : "hidden md:flex"}`}>
          {selected ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-separator/40 md:hidden">
                <button
                  type="button"
                  onClick={() => onSelectApplication(null)}
                  className="w-9 h-9 rounded-xl bg-fill-tertiary flex items-center justify-center tap"
                  aria-label={t("common.back")}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <div className="text-subheadline font-semibold truncate">
                    {selected.counterpartName}
                  </div>
                  <div className="text-caption-1 text-label-tertiary truncate">
                    {selected.jobTitle}
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3 px-4 py-3 border-b border-separator/40 bg-fill-quaternary/30">
                <ProfileAvatar
                  src={selected.counterpartPhoto}
                  alt={selected.counterpartName}
                  fallback={selected.counterpartName.slice(0, 1)}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="text-subheadline font-semibold truncate">
                    {selected.counterpartName}
                  </div>
                  <div className="text-caption-1 text-label-tertiary truncate">
                    {selected.jobTitle}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <ApplicationChat
                  applicationId={selected.applicationId}
                  viewerRole={viewerRole}
                  variant="embedded"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-footnote text-label-tertiary">
              {t("dashboard.selectConversation")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
