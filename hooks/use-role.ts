"use client";

import { useAuth } from "@/hooks/use-auth";

export type AppRole = "buyer" | "agent" | "admin";

/**
 * Derives role booleans from the user object loaded by use-auth.
 * Roles are embedded in the /api/users/me response — no extra request needed.
 */
export function useRoles() {
  const { user, loading } = useAuth();

  const roles: AppRole[] = (user?.roles ?? []).map(
    (r) => r.role as AppRole,
  );

  return {
    roles,
    isLoading: loading,
    isAgent: roles.includes("agent") || roles.includes("admin"),
    isAdmin: roles.includes("admin"),
  };
}
