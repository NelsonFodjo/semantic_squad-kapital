// SUPABASE — the browser client.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : "https://placeholder.supabase.co";
  const key = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : "placeholder";

  return createBrowserClient(url, key);
}

/**
 * True when the two environment variables are set.
 *
 * The site is built to run without Supabase configured — pages fall
 * back to an empty state instead of crashing — so a new contributor
 * can clone, run, and see the design before creating a project.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      // Guard against someone leaving the .env.example placeholders in.
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-ref"),
  );
}
