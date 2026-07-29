// DB — opportunity queries.

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { OpportunityWithOrg } from "@/types/database";

/** The columns we join from organizations, written once. */
const withOrg = `*, organizations (name, slug, logo_url, is_verified)`;

export type OpportunityFilters = {
  sector?: string;
  locality?: string;
  kind?: string;
  mode?: string;
  paidOnly?: boolean;
  search?: string;
};

/**
 * Open opportunities, newest first, optionally filtered.
 * Returns an empty array if Supabase is not configured yet, so the
 * page renders its empty state instead of crashing.
 */
export async function listOpportunities(
  filters: OpportunityFilters = {},
): Promise<OpportunityWithOrg[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  // Build the query up in steps. Each .eq() adds a WHERE clause, and
  // we only add one when that filter was actually chosen.
  let query = supabase
    .from("opportunities")
    .select(withOrg)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (filters.sector) query = query.eq("sector", filters.sector);
  if (filters.locality) query = query.eq("locality", filters.locality);
  if (filters.kind) query = query.eq("kind", filters.kind);
  if (filters.mode) query = query.eq("mode", filters.mode);
  if (filters.paidOnly) query = query.eq("is_paid", true);

  // Free-text search across the title and summary.
  // %text% means "contains", and ilike is case-insensitive.
  if (filters.search) {
    const term = filters.search.trim();
    query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    // Log for us, return empty for the visitor. A broken query should
    // show an empty list, not a stack trace.
    console.error("listOpportunities:", error.message);
    return [];
  }

  return (data ?? []) as OpportunityWithOrg[];
}

/** One opportunity by its URL slug, or null if there is no match. */
export async function getOpportunityBySlug(
  slug: string,
): Promise<OpportunityWithOrg | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("opportunities")
    .select(withOrg)
    // maybeSingle() returns null when nothing matches. single() would
    // treat "not found" as an error, which is wrong here — a bad URL
    // should render our 404 page.
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getOpportunityBySlug:", error.message);
    return null;
  }

  return data as OpportunityWithOrg | null;
}

/** How many open postings there are. Used for the home page stats. */
export async function countOpenOpportunities(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createServerSupabase();

  // head: true asks for the count only, without downloading rows.
  const { count, error } = await supabase
    .from("opportunities")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");

  if (error) return 0;
  return count ?? 0;
}

/** Every posting belonging to one organisation, for the employer dashboard. */
export async function listOpportunitiesByOrg(
  orgId: string,
): Promise<OpportunityWithOrg[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("opportunities")
    .select(withOrg)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listOpportunitiesByOrg:", error.message);
    return [];
  }

  return (data ?? []) as OpportunityWithOrg[];
}
