// ============================================================
// POST AN OPPORTUNITY  ->  "/dashboard/employer/new"
// ============================================================
// Checks the employer has an organisation, then renders the form.

import { redirect } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import NewOpportunityForm from "./NewOpportunityForm";
import { getMyProfile, getMyOrganization } from "@/lib/db/profiles";

export const metadata = { title: "Post an opportunity" };

export default async function NewOpportunityPage() {
  const profile = await getMyProfile();

  if (!profile) redirect("/login");
  if (profile.role === "student") redirect("/dashboard/student");

  const org = await getMyOrganization();

  // Without an organisation the RLS policy would reject the insert,
  // so send them to set one up rather than let them fill in a form
  // that cannot save.
  if (!org) redirect("/onboarding");

  return (
    <div className="container-narrow section">
      <SectionHeading
        as="h1"
        eyebrow={org.name}
        title="Post an opportunity."
        description="Stating the stipend is required. Students see it on the card before they click, which is the whole point."
      />

      <NewOpportunityForm orgId={org.id} />
    </div>
  );
}
