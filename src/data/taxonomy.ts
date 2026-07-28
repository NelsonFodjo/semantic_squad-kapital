// ============================================================
// TAXONOMY — the fixed lists of choices used across the app.
// ============================================================
// Dropdowns and filters all read from here, so a student's "sector"
// can never be spelled differently from an employer's. These must
// stay in step with the enum values in the Supabase migration.
//
// `as const` freezes each list, which lets TypeScript treat the
// values as exact strings rather than plain `string`.

/** Universities and higher-education institutions in Mauritius. */
export const institutions = [
  "University of Mauritius (UoM)",
  "University of Technology, Mauritius (UTM)",
  "Open University of Mauritius",
  "Université des Mascareignes (UdM)",
  "Middlesex University Mauritius",
  "Curtin Mauritius",
  "Other",
] as const;

/** Broad faculty groupings, kept short on purpose. */
export const faculties = [
  "Engineering",
  "Information & Communication Technology",
  "Science",
  "Business & Finance",
  "Law & Management",
  "Social Studies & Humanities",
  "Agriculture",
  "Ocean Studies",
  "Medicine & Health Sciences",
  "Other",
] as const;

/** Industry sectors that actually hire here. */
export const sectors = [
  "ICT & Software",
  "BPO & Shared Services",
  "Financial Services",
  "Fintech",
  "Tourism & Hospitality",
  "Textile & Manufacturing",
  "Agriculture & Agritech",
  "Ocean Economy",
  "Renewable Energy",
  "Logistics & Freeport",
  "Healthcare",
  "Education",
  "Creative & Media",
  "Public Sector & NGO",
] as const;

/** Towns and villages where work actually happens. */
export const localities = [
  "Ebène / Cybercity",
  "Port Louis",
  "Curepipe",
  "Quatre Bornes",
  "Rose Hill / Beau Bassin",
  "Vacoas-Phoenix",
  "Moka",
  "Grand Baie",
  "Flic en Flac",
  "Mahébourg",
  "Rodrigues",
  "Remote (Mauritius-based)",
] as const;

/** How the work is done day to day. */
export const workModes = ["On-site", "Hybrid", "Remote"] as const;

/** What kind of position it is. */
export const opportunityKinds = [
  "Internship",
  "Part-time",
  "Graduate role",
] as const;

/** Challenge or open-source project. */
export const challengeKinds = ["Industry challenge", "Open-source project"] as const;

/** Where an application has got to. Order matters — the dashboard
    pipeline renders the columns in this order. */
export const applicationStages = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
] as const;

/** Where a proposal has got to. */
export const proposalStages = [
  "Submitted",
  "Shortlisted",
  "Accepted",
  "Rejected",
] as const;

// These types are derived from the lists above, so adding an item to
// a list automatically widens the type. No second place to update.
export type Institution = (typeof institutions)[number];
export type Faculty = (typeof faculties)[number];
export type Sector = (typeof sectors)[number];
export type Locality = (typeof localities)[number];
export type WorkMode = (typeof workModes)[number];
export type OpportunityKind = (typeof opportunityKinds)[number];
export type ChallengeKind = (typeof challengeKinds)[number];
export type ApplicationStage = (typeof applicationStages)[number];
export type ProposalStage = (typeof proposalStages)[number];
