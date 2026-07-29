// DB — challenge queries.

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { ChallengeWithOrg } from "@/types/database";

const withOrg = `*, organizations (name, slug, logo_url, is_verified)`;

export type ChallengeFilters = {
  kind?: string; // "challenge" or "open_source"
  sector?: string;
  search?: string;
};

/**
 * Open challenges, soonest deadline first — the one closing this week
 * matters more than the one closing in three months.
 */
export async function listChallenges(
  filters: ChallengeFilters = {},
): Promise<ChallengeWithOrg[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  let query = supabase
    .from("challenges")
    .select(withOrg)
    .eq("status", "open")
    .order("deadline", { ascending: true });

  if (filters.kind) query = query.eq("kind", filters.kind);
  if (filters.sector) query = query.eq("sector", filters.sector);

  if (filters.search) {
    const term = filters.search.trim();
    query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("listChallenges:", error.message);
    return [];
  }

  return (data ?? []) as ChallengeWithOrg[];
}

/** One challenge by slug, or null. */
export async function getChallengeBySlug(
  slug: string,
): Promise<ChallengeWithOrg | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("challenges")
    .select(withOrg)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getChallengeBySlug:", error.message);
    return null;
  }

  return data as ChallengeWithOrg | null;
}

/** Count of open challenges, for the home page stats. */
export async function countOpenChallenges(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createServerSupabase();

  const { count, error } = await supabase
    .from("challenges")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");

  if (error) return 0;
  return count ?? 0;
}

/**
 * Has this student already submitted to this challenge?
 * Used to show "You have submitted" instead of the form again. The
 * database also enforces this with a unique constraint — this check
 * is for the message, not the safety.
 */
export async function hasSubmittedProposal(
  challengeId: string,
  studentId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createServerSupabase();

  const { count } = await supabase
    .from("proposals")
    .select("id", { count: "exact", head: true })
    .eq("challenge_id", challengeId)
    .eq("lead_student_id", studentId);

  return (count ?? 0) > 0;
}
