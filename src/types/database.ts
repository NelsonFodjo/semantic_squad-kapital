// ============================================================
// DATABASE TYPES — the shape of each table row.
// ============================================================
// Written by hand to match supabase/migrations/0001_init.sql. If you
// change a column there, change it here too.
//
// TypeScript uses these to catch mistakes before the code runs: ask
// for `opportunity.stipend` and it will tell you the field is called
// `stipend_min`.
//
// `| null` marks a column that is nullable in the database.

/* ---------- enums, matching the SQL types ---------- */

export type UserRole = "student" | "professional" | "coordinator" | "admin";
export type OpportunityKind = "internship" | "part_time" | "graduate";
export type WorkMode = "onsite" | "hybrid" | "remote";
export type ListingStatus = "draft" | "open" | "closed";
export type ChallengeKind = "challenge" | "open_source";
export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
export type ProposalStatus = "submitted" | "shortlisted" | "accepted" | "rejected";

/* ---------- tables ---------- */

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  slug: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  locality: string | null;
  phone: string | null;
  linkedin_url: string | null;
  is_public: boolean;
  created_at: string;
};

export type Student = {
  profile_id: string;
  institution: string;
  faculty: string;
  programme: string | null;
  year_of_study: number;
  graduation_year: number | null;
  skills: string[];
  cv_url: string | null;
  portfolio_url: string | null;
  github_url: string | null;
  available_from: string | null;
  available_to: string | null;
  is_verified: boolean;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  brn: string | null;
  sector: string;
  locality: string | null;
  website: string | null;
  logo_url: string | null;
  about: string | null;
  is_verified: boolean;
  created_by: string;
  created_at: string;
};

export type Opportunity = {
  id: string;
  org_id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  kind: OpportunityKind;
  sector: string;
  locality: string;
  mode: WorkMode;
  is_paid: boolean;
  stipend_min: number | null;
  stipend_max: number | null;
  duration_weeks: number | null;
  skills_required: string[];
  positions: number;
  closes_at: string | null;
  status: ListingStatus;
  created_by: string;
  created_at: string;
};

export type Challenge = {
  id: string;
  org_id: string;
  title: string;
  slug: string;
  summary: string;
  brief: string;
  kind: ChallengeKind;
  sector: string;
  repo_url: string | null;
  skills: string[];
  reward: string | null;
  team_size_max: number;
  deadline: string;
  status: ListingStatus;
  created_by: string;
  created_at: string;
  cover_image_url?: string | null;
};

export type Application = {
  id: string;
  opportunity_id: string;
  student_id: string;
  cover_note: string;
  cv_url: string | null;
  status: ApplicationStatus;
  employer_note: string | null;
  created_at: string;
  updated_at: string;
};

export type Proposal = {
  id: string;
  challenge_id: string;
  lead_student_id: string;
  team_name: string | null;
  approach: string;
  timeline: string;
  tech_stack: string[];
  attachment_url: string | null;
  status: ProposalStatus;
  score: number | null;
  reviewer_note: string | null;
  created_at: string;
};

export type ShowcaseItem = {
  id: string;
  proposal_id: string | null;
  student_id: string;
  org_id: string | null;
  title: string;
  slug: string;
  summary: string;
  body: string | null;
  cover_image_url: string | null;
  tags: string[];
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
};

/* ---------- joined shapes ----------
   Supabase can return related rows in one query. These types describe
   what comes back, so the pages know what they are getting.

   `&` combines two types: "an Opportunity, plus an organization
   field". Postgres returns a joined single row as an object. */

export type OpportunityWithOrg = Opportunity & {
  organizations: Pick<Organization, "name" | "slug" | "logo_url" | "is_verified"> | null;
};

export type ChallengeWithOrg = Challenge & {
  organizations: Pick<Organization, "name" | "slug" | "logo_url" | "is_verified"> | null;
};

export type ShowcaseWithAuthor = ShowcaseItem & {
  profiles: Pick<Profile, "full_name" | "slug"> | null;
  organizations: Pick<Organization, "name" | "slug"> | null;
};

export type ApplicationWithOpportunity = Application & {
  opportunities: OpportunityWithOrg | null;
};

export type ProposalWithChallenge = Proposal & {
  challenges: ChallengeWithOrg | null;
};
