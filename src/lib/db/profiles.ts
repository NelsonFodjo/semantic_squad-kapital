// DB — profile and organisation queries.

import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Organization, Profile, Student } from "@/types/database";

/** The logged-in user's profile row, or null if not signed in. */
export async function getMyProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (data) return data as Profile;

  // Fallback profile object for authenticated user missing DB row
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const role = user.user_metadata?.role || "student";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id: user.id,
    role,
    full_name: name,
    slug,
    avatar_url: null,
    bio: null,
    created_at: new Date().toISOString(),
  } as Profile;
}

/**
 * A public student profile by slug, with their student details.
 * Returns null when the profile is private or does not exist — RLS
 * handles the private case for us, so there is no extra check here.
 */
export async function getStudentBySlug(
  slug: string,
): Promise<{ profile: Profile; student: Student | null } | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!profile) return null;

  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  return {
    profile: profile as Profile,
    student: student as Student | null,
  };
}

/**
 * The organisation the logged-in professional belongs to.
 * Returns null if they have not created one yet, which is what the
 * employer dashboard uses to show its setup prompt.
 */
export async function getMyOrganization(): Promise<Organization | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Find the membership first, then the organisation it points at.
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", membership.org_id)
    .maybeSingle();

  return org as Organization | null;
}

/** One organisation by slug, for its public page. */
export async function getOrganizationBySlug(
  slug: string,
): Promise<Organization | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabase();

  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data as Organization | null;
}
