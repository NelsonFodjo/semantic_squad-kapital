// ============================================================
// SUPABASE — session refresh, used by the root middleware.ts.
// ============================================================
// Middleware runs before every page. Two jobs here:
//   1. Refresh the login session so it does not silently expire
//   2. Send anonymous visitors away from the dashboard
//
// The logic lives in this file and the root middleware.ts just calls
// it, which keeps the Supabase details out of the app's front door.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** The shape Supabase hands to setAll below. */
type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

/** URLs that require you to be logged in. */
const protectedPaths = ["/dashboard", "/onboarding"];

export async function updateSession(request: NextRequest) {
  // Start with a response that passes the request straight through.
  let response = NextResponse.next({ request });

  // If Supabase is not configured yet, do nothing. This lets the
  // site run before anyone has created a project.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // Write refreshed cookies onto both the request (so the page
          // being rendered sees them straight away) and the response
          // (so the browser stores them).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // This call is the point of the middleware: it refreshes an expiring
  // token. Do not remove it, or users get logged out mid-session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const needsAuth = protectedPaths.some((prefix) => path.startsWith(prefix));

  // Not logged in and asking for a private page: send them to login,
  // remembering where they wanted to go so we can return them after.
  if (needsAuth && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", path);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
