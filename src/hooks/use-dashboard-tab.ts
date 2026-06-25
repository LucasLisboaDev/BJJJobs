"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DashboardTab } from "@/components/dashboard-tab-bar";

export function useDashboardTab(defaultTab: DashboardTab = "overview") {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const applicationId = searchParams.get("application");
  const activeTab: DashboardTab =
    tabParam === "messages" || applicationId ? "messages" : defaultTab;

  const setTab = useCallback(
    (tab: DashboardTab) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "overview") {
        params.delete("tab");
        params.delete("application");
      } else {
        params.set("tab", "messages");
      }
      const query = params.toString();
      router.replace(query ? `/dashboard?${query}` : "/dashboard", { scroll: false });
    },
    [router, searchParams]
  );

  const setSelectedApplication = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "messages");
      if (id) {
        params.set("application", id);
      } else {
        params.delete("application");
      }
      router.replace(`/dashboard?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return { activeTab, applicationId, setTab, setSelectedApplication };
}
