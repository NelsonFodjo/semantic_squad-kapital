// ============================================================
// DB — showcase queries.
// ============================================================
// The public gallery of published student work.

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { ShowcaseWithAuthor } from "@/types/database";

// Joins the author's name and the organisation the work was done for.
const withAuthor = `*, profiles (full_name, slug), organizations (name, slug)`;

/**
 * Published showcase items, newest first.
 * `limit` lets the home page ask for just the first three.
 */
export async function listShowcase(limit?: number): Promise<ShowcaseWithAuthor[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  let query = supabase
    .from("showcase_items")
    .select(withAuthor)
    // "not published_at is null" is how you say "has been published".
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("listShowcase:", error.message);
    return [];
  }

  return (data ?? []) as ShowcaseWithAuthor[];
}

/** One case study by slug, or null. */
export async function getShowcaseBySlug(
  slug: string,
): Promise<ShowcaseWithAuthor | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("showcase_items")
    .select(withAuthor)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) {
    console.error("getShowcaseBySlug:", error.message);
    return null;
  }

  return data as ShowcaseWithAuthor | null;
}

/** Everything one student has published, for their public profile. */
export async function listShowcaseByStudent(
  studentId: string,
): Promise<ShowcaseWithAuthor[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("showcase_items")
    .select(withAuthor)
    .eq("student_id", studentId)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as ShowcaseWithAuthor[];
}
