import { useQuery, useMutation } from "@tanstack/react-query";
import type { MetricsSummary, AlertsResponse, MerchantHealthResponse, WebhookAlertsResponse, PartnerRiskResponse, NotificationFailuresResponse, LinearConfigResponse, LinearIssueResponse } from "@/types/api";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export function useMetricsSummary() {
  return useQuery<MetricsSummary>({
    queryKey: ["metrics", "summary"],
    queryFn: () => fetchJson<MetricsSummary>("/api/metrics/summary"),
    refetchInterval: 60_000, // refresh every minute
    staleTime: 30_000,
  });
}

export function useAlerts() {
  return useQuery<AlertsResponse>({
    queryKey: ["alerts"],
    queryFn: () => fetchJson<AlertsResponse>("/api/alerts"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useMerchantHealth() {
  return useQuery<MerchantHealthResponse>({
    queryKey: ["merchant-health"],
    queryFn: () => fetchJson<MerchantHealthResponse>("/api/merchant-health"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useWebhookAlerts() {
  return useQuery<WebhookAlertsResponse>({
    queryKey: ["alerts", "webhooks"],
    queryFn: () => fetchJson<WebhookAlertsResponse>("/api/alerts/webhooks"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useNotificationFailures() {
  return useQuery<NotificationFailuresResponse>({
    queryKey: ["notification-failures"],
    queryFn: () => fetchJson<NotificationFailuresResponse>("/api/notification-failures"),
    staleTime: 5 * 60_000, // AI analysis is cached server-side, no need to refetch often
    refetchInterval: 5 * 60_000,
  });
}

export function useLinearConfig() {
  return useQuery<LinearConfigResponse>({
    queryKey: ["linear", "config"],
    queryFn: () => fetchJson<LinearConfigResponse>("/api/linear/config"),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateLinearIssue() {
  return useMutation<LinearIssueResponse, Error, {
    teamId: string;
    title: string;
    body: string;
    priority: string;
    groupId: string;
  }>({
    mutationFn: async (data) => {
      const res = await fetch("/api/linear/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Failed to create issue");
      }
      return res.json();
    },
  });
}

export function usePartnerRisk(tier?: string) {
  const params = new URLSearchParams({ limit: "200" });
  if (tier) params.set("tier", tier);
  return useQuery<PartnerRiskResponse>({
    queryKey: ["partner-risk", tier ?? "all"],
    queryFn: () => fetchJson<PartnerRiskResponse>(`/api/partner-risk?${params}`),
    refetchInterval: 120_000,
    staleTime: 60_000,
  });
}
