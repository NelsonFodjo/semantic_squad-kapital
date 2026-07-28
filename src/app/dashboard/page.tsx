// ============================================================
// DASHBOARD  ->  the "/dashboard" route
// ============================================================
// This page renders nothing. It looks at who you are and forwards you
// to the right dashboard, so every "go to my dashboard" link in the
// app can point at one address regardless of role.
//
// Middleware has already bounced anonymous visitors to /login before
// we get here — see middleware.ts.

import { redirect } from "next/navigation";
import { getMyProfile } from "@/lib/db/profiles";

export default async function DashboardIndex() {
  const profile = await getMyProfile();

  // Logged in but no profile row. That means the handle_new_user
  // trigger has not run — most likely the migration was never
  // applied. Send them somewhere that explains itself.
  if (!profile) redirect("/onboarding");

  // redirect() throws internally to stop rendering, so there is no
  // need for else branches or a return after it.
  if (profile.role === "professional") redirect("/dashboard/employer");

  redirect("/dashboard/student");
}
