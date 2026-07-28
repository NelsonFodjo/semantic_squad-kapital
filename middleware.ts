// ============================================================
// MIDDLEWARE — runs before every matching request.
// ============================================================
// This file must sit at the project root (next to package.json), not
// inside src/app/. Next.js looks for it by name.
//
// All it does is hand off to the Supabase session refresher.

import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Which URLs this runs on. The pattern skips static files and
  // images — running auth logic for every icon would be wasteful.
  //
  // (?!...) means "not followed by", so this reads as: match
  // everything EXCEPT these paths and file extensions.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
