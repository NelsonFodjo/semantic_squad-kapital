// ============================================================
// ONBOARDING  ->  the "/onboarding" route
// ============================================================
// Shown once, straight after signing up. Which form appears depends
// on the role chosen at signup, so this page decides and then hands
// off to one of two client components.

import { redirect } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import StudentOnboarding from "./StudentOnboarding";
import OrgOnboarding from "./OrgOnboarding";
import { getMyProfile, getMyOrganization } from "@/lib/db/profiles";

export const metadata = { title: "Complete your profile" };

export default async function OnboardingPage() {
  const profile = await getMyProfile();

  if (!profile) redirect("/login");

  // Employers who already have an organisation have nothing to do here.
  if (profile.role === "professional") {
    const org = await getMyOrganization();
    if (org) redirect("/dashboard/employer");

    return (
      <div className="container-narrow section">
        <SectionHeading
          as="h1"
          eyebrow="One more step"
          title="Tell us about your organisation."
          description="Postings belong to an organisation rather than a person, so students can see who they would be working for."
        />
        <OrgOnboarding />
      </div>
    );
  }

  return (
    <div className="container-narrow section">
      <SectionHeading
        as="h1"
        eyebrow="One more step"
        title="Complete your student profile."
        description="Employers see this when you apply. It takes about two minutes and you only do it once."
      />
      <StudentOnboarding />
    </div>
  );
}
