"use client";
import { LayoutDashboard, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export type DashboardTab = "overview" | "messages";

export function DashboardTabBar({
  activeTab,
  unreadCount = 0,
  onTabChange,
}: {
  activeTab: DashboardTab;
  unreadCount?: number;
  onTabChange: (tab: DashboardTab) => void;
}) {
  const { t } = useLanguage();

  const tabs: { key: DashboardTab; label: string; icon: typeof LayoutDashboard }[] = [
    { key: "overview", label: t("dashboard.tabOverview"), icon: LayoutDashboard },
    { key: "messages", label: t("dashboard.tabMessages"), icon: MessageCircle },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`chip-toggle text-sm flex items-center gap-1.5 ${isActive ? "chip-toggle-active" : ""}`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {tab.key === "messages" && unreadCount > 0 && (
              <span
                className={`ml-0.5 min-w-[1.25rem] h-5 px-1 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  isActive ? "bg-white/25 text-white" : "bg-brand text-white"
                }`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
