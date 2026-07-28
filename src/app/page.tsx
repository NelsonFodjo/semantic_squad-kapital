// ============================================================
// HOME PAGE  ->  the "/" route
// ============================================================
// Assembles the landing page from its section components. Each section
// owns its own layout, animation and stylesheet, so this file stays a
// table of contents you can read at a glance — reordering the page
// means reordering these lines.
//
// It is a server component: the three counts below are fetched on the
// server, so the numbers in the stats band are real rather than
// hard-coded, and the browser gets HTML with them already in it.
//
// Signed-in visitors are sent straight to /dashboard instead — the
// marketing page is for people deciding whether to join, not for
// people who already have.

import { redirect } from "next/navigation";
import VideoHero from "@/components/hero/VideoHero";
import StatsSection from "@/components/sections/StatsSection";
import SectorMarquee from "@/components/sections/SectorMarquee";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import PhilosophySection from "@/components/sections/PhilosophySection";
import ServicesSection from "@/components/sections/ServicesSection";
import { countOpenOpportunities } from "@/lib/db/opportunities";
import { countOpenChallenges } from "@/lib/db/challenges";
import { listShowcase } from "@/lib/db/showcase";
import { getCurrentUserId } from "@/lib/supabase/server";

export default async function HomePage() {
  const userId = await getCurrentUserId();
  if (userId) redirect("/dashboard");

  const [openOpportunities, openChallenges, showcase] = await Promise.all([
    countOpenOpportunities(),
    countOpenChallenges(),
    listShowcase(),
  ]);

  return (
    <>
      <VideoHero />

      <StatsSection
        openOpportunities={openOpportunities}
        openChallenges={openChallenges}
        publishedWork={showcase.length}
      />

      <SectorMarquee />
      <HowItWorksSection />
      <PhilosophySection />
      <ServicesSection />
    </>
  );
}
