// ============================================================
// DB — applications and proposals.
// ============================================================
// The private side of the app. Every query here relies on Row Level
// Security to decide what comes back: a student sees their own rows,
// an employer sees rows sent to their own postings. Neither can see
// anyone else's, and that rule lives in the database, not here.

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type {
  ApplicationWithOpportunity,
  ProposalWithChallenge,
  Application,
  Proposal,
} from "@/types/database";

/* ------------------------------------------------------------ *
 * Student side
 * ------------------------------------------------------------ */

/** Everything the logged-in student has applied to. */
export async function listMyApplications(
  studentId: string,
): Promise<ApplicationWithOpportunity[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("applications")
    .select(
      `*, opportunities (*, organizations (name, slug, logo_url, is_verified))`,
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listMyApplications:", error.message);
    return [];
  }

  return (data ?? []) as ApplicationWithOpportunity[];
}

/** Every proposal the logged-in student has submitted. */
export async function listMyProposals(
  studentId: string,
): Promise<ProposalWithChallenge[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("proposals")
    .select(`*, challenges (*, organizations (name, slug, logo_url, is_verified))`)
    .eq("lead_student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listMyProposals:", error.message);
    return [];
  }

  return (data ?? []) as ProposalWithChallenge[];
}

/** Has this student already applied to this posting? */
export async function hasApplied(
  opportunityId: string,
  studentId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const supabase = await createServerSupabase();

  const { count } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("opportunity_id", opportunityId)
    .eq("student_id", studentId);

  return (count ?? 0) > 0;
}

/* ------------------------------------------------------------ *
 * Employer side
 * ------------------------------------------------------------ */

/**
 * Applications to one posting, for the employer's review screen.
 * The student's name comes along via the join.
 */
export async function listApplicationsForOpportunity(
  opportunityId: string,
): Promise<(Application & { profiles: { full_name: string; slug: string } | null })[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("applications")
    // The !student_id part tells Supabase which foreign key to follow,
    // because applications points at profiles more than one way.
    .select(`*, profiles!student_id (full_name, slug)`)
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listApplicationsForOpportunity:", error.message);
    return [];
  }

  return data as (Application & {
    profiles: { full_name: string; slug: string } | null;
  })[];
}

/** Proposals submitted to one challenge. */
export async function listProposalsForChallenge(
  challengeId: string,
): Promise<(Proposal & { profiles: { full_name: string; slug: string } | null })[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("proposals")
    .select(`*, profiles!lead_student_id (full_name, slug)`)
    .eq("challenge_id", challengeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("listProposalsForChallenge:", error.message);
    return [];
  }

  return data as (Proposal & {
    profiles: { full_name: string; slug: string } | null;
  })[];
}
