// HOME PAGE 


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
