import { api } from "@/lib/api-client";
import type { Property, PropertyType } from "@/lib/mock";

// ── Types that match the NestJS API response ──────────────────────────────────

type DbPropertyType = "apartment" | "house" | "land" | "commercial";
type DbPropertyStatus = "active" | "pending" | "open_house" | "sold";

const TYPE_TO_DISPLAY: Record<DbPropertyType, PropertyType> = {
  apartment: "Apartment",
  house: "House",
  land: "Land",
  commercial: "Commercial",
};

const STATUS_TO_DISPLAY: Record<DbPropertyStatus, Property["status"]> = {
  active: "Active",
  pending: "Pending",
  open_house: "Open House",
  sold: "Active",
};

export type DbProperty = {
  id: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: DbPropertyStatus;
  address: string;
  area: string;
  zip: string;
  type: DbPropertyType;
  image: string;
  images: string[];       // up to 5 Cloudinary URLs; index 0 = cover
  features: string[];     // list of amenity/feature strings
  tag: string | null;
  tagColor: string | null;
  description: string | null;
  ownerName?: string | null;
  ownerAddress?: string | null;
  ownerPhone?: string | null;
  ownerProfession?: string | null;
  ownerEmail?: string | null;
  views: number;
  createdAt: string;
  agentId: string | null;
  agent?: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
    phone: string | null;
    bio?: string | null;
  } | null;
};

export type PropertyDetail = Property & {
  description: string | null;
  views: number;
  createdAt: string;
  agentId?: string | null;
  agent?: DbProperty["agent"];
  images: string[];
  features: string[];
};

export function mapRow(row: DbProperty): PropertyDetail {
  return {
    id: row.id,
    price: Number(row.price),
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    status: STATUS_TO_DISPLAY[row.status],
    address: row.address,
    area: row.area,
    zip: row.zip,
    type: TYPE_TO_DISPLAY[row.type],
    image: row.image,
    images: row.images ?? [],
    features: row.features ?? [],
    tag: row.tag ?? undefined,
    tagColor: (row.tagColor as Property["tagColor"]) ?? undefined,
    description: row.description,
    views: row.views,
    createdAt: row.createdAt,
    agentId: row.agentId,
    agent: row.agent,
  };
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

type PaginatedResponse = {
  data: DbProperty[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export async function fetchProperties(
  params?: Record<string, string | number>,
  fetchOptions?: RequestInit,
): Promise<PropertyDetail[]> {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : "";
  const res = await api.get<PaginatedResponse>(`/properties${qs}`, fetchOptions);
  return (res.data ?? []).map(mapRow);
}

export async function fetchProperty(
  id: string,
  fetchOptions?: RequestInit,
): Promise<PropertyDetail | null> {
  try {
    const row = await api.get<DbProperty>(`/properties/${id}`, fetchOptions);
    return row ? mapRow(row) : null;
  } catch {
    return null;
  }
}

export function daysSince(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// ── Area autocomplete ──────────────────────────────────────────────────────

export type AreaSuggestion = {
  area: string;
  zip: string;
  count: number;
};

export async function fetchAreaSuggestions(q: string): Promise<AreaSuggestion[]> {
  if (!q.trim()) return [];
  try {
    const qs = new URLSearchParams({ q: q.trim() }).toString();
    return await api.get<AreaSuggestion[]>(`/properties/areas?${qs}`);
  } catch {
    return [];
  }
}
