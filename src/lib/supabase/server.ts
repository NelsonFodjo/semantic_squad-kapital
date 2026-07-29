// ============================================================
// SUPABASE — the server client.
// ============================================================
// Use this inside server components and route handlers, for reading
// data while a page renders. It reads the session from cookies, so
// Row Level Security knows who is asking.
//
//     const supabase = await createServerSupabase();
//     const { data } = await supabase.from("opportunities").select();

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/** The shape Supabase hands to setAll below. */
type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function createServerSupabase() {
  // In Next.js 16 cookies() is async, so it must be awaited.
  const cookieStore = await cookies();

  const url = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : "https://placeholder.supabase.co";
  const key = isSupabaseConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : "placeholder";

  return createServerClient(url, key, {
    cookies: {
      // Supabase reads the session from here.
      getAll() {
        return cookieStore.getAll();
      },

      // And writes a refreshed session back here.
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components are not allowed to set cookies. That
          // is fine and expected: middleware.ts refreshes the
          // session on every request instead, so we can ignore
          // this rather than crash the page.
        }
      },
    },
  });
}

/**
 * The logged-in user's id, or null when nobody is signed in.
 * Pages use this to decide between "apply" and "log in to apply".
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createServerSupabase();

    // getUser() verifies the token with Supabase rather than trusting
    // the cookie. Slower than getSession(), but a cookie can be forged
    // and this cannot — always use getUser() for anything that matters.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user?.id ?? null;
  } catch {
    return null;
  }
}

