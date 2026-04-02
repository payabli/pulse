export interface MetricValue {
  current: number;
  previous: number;
  changePercent: number;
  trend: number[];
  forecast: number[];
}

export interface MetricsSummary {
  period: {
    start: string;
    end: string;
    label: string;
  };
  payIn: {
    transactionVolume: MetricValue;
    transactionCount: MetricValue;
    customers: MetricValue;
    newCustomers: MetricValue;
  };
  payOut: {
    transactionVolume: MetricValue;
    transactionCount: MetricValue;
    vendors: MetricValue;
    newVendors: MetricValue;
  };
}

export interface AlertDetail {
  description: string;
  severity: "danger" | "warning" | "info" | "ok";
  actionLabel?: string;
  actionType?: string;
  context?: string;
  metadata?: Record<string, string>;
}

export interface LiveAlert {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryLabel: string;
  merchant: string;
  amount: string | null;
  status: "action_needed" | "no_action" | "resolved" | "dismissed" | "watch";
  statusLabel: string;
  time: string;
  timestamp: string;
  details: AlertDetail;
  aiDetected?: boolean;
  aiExplanation?: string;
  signalConfidence?: "high" | "medium";
}

export interface AlertsResponse {
  alerts: LiveAlert[];
  totalCount: number;
}

export interface MerchantHealthItem {
  id: string;
  name: string;
  paypoint: string;
  healthTier: "healthy" | "monitoring" | "at_risk";
  healthLabel: string;
  insight: string;
  volumeTrend: number[];
  declineTrend: number[];
  chargebackTrend: number[];
  alertCount: number;
}

export interface MerchantHealthResponse {
  merchants: MerchantHealthItem[];
}

// Webhook failure alerts

export type WebhookFailureType =
  | "timeout"
  | "rate_limited"
  | "dead_endpoint"
  | "handler_error"
  | "server_error";

export interface WebhookFailureAlert {
  id: string;
  target: string;
  failureType: WebhookFailureType;
  failCount: number;
  affectedEvents: string[];
  affectedPaypoints: number;
  orgNames: string[];
  errorSample: string;
  firstFailure: string;
  lastFailure: string;
  successRate: number;
  suggestedReply: string;
  severity: "danger" | "warning" | "info";
}

export interface WebhookAlertsResponse {
  alerts: WebhookFailureAlert[];
  overallSuccessRate: number;
  totalFailures: number;
}

// ── Notification Failures (AI-analyzed) ─────────────────────────────

export interface NotificationFailureOrg {
  id: number;
  name: string;
}

export interface NotificationFailureAI {
  summary: string;
  rootCause: string;
  impact: string;
  ticketTitle: string;
  ticketBody: string;
  priority: "critical" | "high" | "medium" | "low";
}

export interface NotificationFailureGroup {
  id: string;
  groupKey: string;
  endpoint: string;
  endpointHost: string;
  failureType: WebhookFailureType;
  failureLabel: string;
  statusCode: number;
  failCount: number;
  firstFailure: string;
  lastFailure: string;
  affectedEvents: string[];
  affectedPaypoints: number;
  orgs: NotificationFailureOrg[];
  errorSamples: string[];
  successRate: number;
  totalDeliveries: number;
  isOngoing: boolean;
  aiAnalysis: NotificationFailureAI;
}

export interface NotificationFailuresResponse {
  groups: NotificationFailureGroup[];
  fromCache: boolean;
  generatedAt: string;
}

// ── Linear Integration ─────────────────────────────────────────────

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearConfigResponse {
  configured: boolean;
  teams: LinearTeam[];
}

export interface LinearIssueResponse {
  id: string;
  identifier: string;
  title: string;
  url: string;
  groupId: string;
}

// ── Partner Risk (ML Pipeline) ──────────────────────────────────────

export interface RateDetail {
  observed_rate: number;
  posterior_mean: number;
  ci_lower: number;
  ci_upper: number;
  p_elevated: number;
  z_score: number;
  peer_group: string;
  peer_mean: number;
  rolling_z: number;
  cusum_alarm: boolean;
  trend_direction: "rising" | "falling" | "stable";
  weekly_rates: number[];
}

export interface PartnerRiskScore {
  partner_id: string;
  combined_score: number;
  tier: "elevated" | "watch" | "normal";
  decline: RateDetail | null;
  returns: RateDetail | null;
  chargeback: RateDetail | null;
  n_paypoints: number;
  total_txns: number;
  total_amount: number;
}

export interface PartnerRiskResponse {
  total: number;
  limit: number;
  offset: number;
  partners: PartnerRiskScore[];
}
