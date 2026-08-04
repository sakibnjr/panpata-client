import { api } from "@/lib/api-client";
import type { DbProperty } from "@/lib/properties";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AgentProfile = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  bio: string | null;
  email: string;
  createdAt: string;
  roles: { role: string }[];
  _count: { properties: number };
  properties: DbProperty[];
};

export type AgentReview = {
  id: string;
  agentId: string;
  reviewerId: string;
  rating: number;
  text: string;
  createdAt: string;
  reviewer: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type ReviewsResponse = {
  reviews: AgentReview[];
  meta: {
    count: number;
    avgRating: number | null;
  };
};

// ── Fetch helpers ─────────────────────────────────────────────────────────────

export async function fetchAgentProfile(
  agentId: string,
  fetchOptions?: RequestInit,
): Promise<AgentProfile | null> {
  try {
    return await api.get<AgentProfile>(`/agents/${agentId}`, fetchOptions);
  } catch {
    return null;
  }
}

export async function fetchAgentReviews(
  agentId: string,
  fetchOptions?: RequestInit,
): Promise<ReviewsResponse> {
  try {
    return await api.get<ReviewsResponse>(`/agents/${agentId}/reviews`, fetchOptions);
  } catch {
    return { reviews: [], meta: { count: 0, avgRating: null } };
  }
}
