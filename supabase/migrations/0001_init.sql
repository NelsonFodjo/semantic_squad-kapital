-- ============================================================
-- STAGE.MU — initial database schema
-- ============================================================
-- HOW TO RUN THIS:
--   1. Open your project at supabase.com
--   2. Go to SQL Editor -> New query
--   3. Paste this whole file and press Run
--   4. Then do the same with seed.sql
--
-- Read it top to bottom: types, then tables, then security, then
-- the trigger that creates a profile when someone signs up.

-- ------------------------------------------------------------
-- 1. ENUM TYPES
-- ------------------------------------------------------------
-- An enum is a column that only accepts values from a fixed list.
-- The database rejects anything else, so a typo in the app cannot
-- put nonsense in the table. These must match src/data/taxonomy.ts.

create type user_role as enum ('student', 'professional', 'coordinator', 'admin');
create type opportunity_kind as enum ('internship', 'part_time', 'graduate');
create type work_mode as enum ('onsite', 'hybrid', 'remote');
create type listing_status as enum ('draft', 'open', 'closed');
create type challenge_kind as enum ('challenge', 'open_source');
create type application_status as enum
  ('applied', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn');
create type proposal_status as enum
  ('submitted', 'shortlisted', 'accepted', 'rejected');

-- ------------------------------------------------------------
-- 2. PROFILES
-- ------------------------------------------------------------
-- Supabase keeps logins in a private table called auth.users, which
-- we cannot add columns to. So every user gets a matching row here
-- for the public details.
--
-- "references auth.users on delete cascade" means: if the login is
-- deleted, this row goes too. No orphaned profiles.

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  role        user_role not null default 'student',
  full_name   text not null,
  slug        text not null unique,          -- used in /students/<slug>
  headline    text,                          -- one line under the name
  bio         text,
  avatar_url  text,
  locality    text,
  phone       text,
  linkedin_url text,
  is_public   boolean not null default true, -- show on the public site?
  created_at  timestamptz not null default now(),

  -- Constraints are the database's own validation, mirroring the
  -- regexes in src/validation/. Never trust the browser alone: a
  -- request can always be sent straight to the API.
  constraint slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint name_length check (char_length(full_name) between 3 and 70)
);

-- ------------------------------------------------------------
-- 3. STUDENTS
-- ------------------------------------------------------------
-- The extra fields only students need. Split from profiles so an
-- employer row is not full of empty student columns.

create table students (
  profile_id       uuid primary key references profiles on delete cascade,
  institution      text not null,
  faculty          text not null,
  programme        text,
  year_of_study    smallint not null,
  graduation_year  smallint,
  skills           text[] not null default '{}',  -- an array of tags
  cv_url           text,
  portfolio_url    text,
  github_url       text,
  available_from   date,
  available_to     date,
  -- Set to true once the student confirms a university email address.
  is_verified      boolean not null default false,

  constraint year_range check (year_of_study between 1 and 6),
  -- A date range that runs backwards is always a mistake.
  constraint availability_order check (
    available_from is null or available_to is null or available_from <= available_to
  )
);

-- ------------------------------------------------------------
-- 4. ORGANISATIONS
-- ------------------------------------------------------------

create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  brn         text,                 -- Business Registration Number
  sector      text not null,
  locality    text,
  website     text,
  logo_url    text,
  about       text,
  -- Set by an admin after checking the BRN. Students should be able
  -- to tell a real company from someone who just signed up.
  is_verified boolean not null default false,
  created_by  uuid not null references profiles on delete cascade,
  created_at  timestamptz not null default now(),

  constraint brn_format check (brn is null or brn ~* '^C[0-9]{8}$'),
  constraint org_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- Which professionals can post on behalf of which organisation.
-- A person could work for two, so this is its own table.
create table org_members (
  org_id      uuid not null references organizations on delete cascade,
  profile_id  uuid not null references profiles on delete cascade,
  member_role text not null default 'member',   -- 'owner' or 'member'
  created_at  timestamptz not null default now(),
  primary key (org_id, profile_id)
);

-- ------------------------------------------------------------
-- 5. OPPORTUNITIES
-- ------------------------------------------------------------

create table opportunities (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references organizations on delete cascade,
  title           text not null,
  slug            text not null unique,
  summary         text not null,          -- one line for the card
  description     text not null,          -- the full posting
  kind            opportunity_kind not null default 'internship',
  sector          text not null,
  locality        text not null,
  mode            work_mode not null default 'onsite',
  is_paid         boolean not null default true,
  -- Stipend in rupees. Required when is_paid — see the check below.
  stipend_min     integer,
  stipend_max     integer,
  duration_weeks  smallint,
  skills_required text[] not null default '{}',
  positions       smallint not null default 1,
  closes_at       date,
  status          listing_status not null default 'draft',
  created_by      uuid not null references profiles on delete cascade,
  created_at      timestamptz not null default now(),

  constraint title_length check (char_length(title) between 6 and 90),
  constraint duration_range check (duration_weeks is null or duration_weeks between 1 and 52),
  constraint stipend_order check (
    stipend_min is null or stipend_max is null or stipend_min <= stipend_max
  ),
  -- The fair-pay rule, enforced by the database: if you say the role
  -- is paid, you must state what it pays.
  constraint paid_needs_stipend check (
    is_paid = false or stipend_min is not null
  )
);

-- Indexes make the board's filters fast once there are thousands of
-- rows. Postgres uses them to avoid scanning the whole table.
create index opportunities_status_idx on opportunities (status, closes_at desc);
create index opportunities_sector_idx on opportunities (sector);
create index opportunities_skills_idx on opportunities using gin (skills_required);

-- ------------------------------------------------------------
-- 6. APPLICATIONS
-- ------------------------------------------------------------

create table applications (
  id             uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities on delete cascade,
  student_id     uuid not null references profiles on delete cascade,
  cover_note     text not null,
  cv_url         text,
  status         application_status not null default 'applied',
  employer_note  text,                    -- private to the employer
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- Stops a student applying to the same role twice. The database
  -- guarantees it, so the app does not have to check first.
  unique (opportunity_id, student_id),
  constraint cover_note_length check (char_length(cover_note) between 40 and 2000)
);

create index applications_student_idx on applications (student_id, created_at desc);
create index applications_opportunity_idx on applications (opportunity_id, status);

-- ------------------------------------------------------------
-- 7. CHALLENGES
-- ------------------------------------------------------------
-- The distinctive part: companies post a real problem or an
-- open-source project, and students answer with a proposal.

create table challenges (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references organizations on delete cascade,
  title       text not null,
  slug        text not null unique,
  summary     text not null,
  brief       text not null,            -- the full problem statement
  kind        challenge_kind not null default 'challenge',
  sector      text not null,
  repo_url    text,                     -- for open-source projects
  skills      text[] not null default '{}',
  reward      text,                     -- "Rs 25,000" or "Paid internship"
  team_size_max smallint not null default 1,
  deadline    date not null,
  status      listing_status not null default 'draft',
  created_by  uuid not null references profiles on delete cascade,
  created_at  timestamptz not null default now(),

  constraint challenge_title_length check (char_length(title) between 6 and 90),
  constraint team_size_range check (team_size_max between 1 and 6),
  constraint repo_format check (
    repo_url is null or repo_url ~* '^https?://(www\.)?github\.com/[\w.-]+/[\w.-]+/?$'
  )
);

create index challenges_status_idx on challenges (status, deadline);

-- ------------------------------------------------------------
-- 8. PROPOSALS
-- ------------------------------------------------------------

create table proposals (
  id               uuid primary key default gen_random_uuid(),
  challenge_id     uuid not null references challenges on delete cascade,
  -- The student who submitted. Team mates go in proposal_members.
  lead_student_id  uuid not null references profiles on delete cascade,
  team_name        text,
  approach         text not null,        -- how they would solve it
  timeline         text not null,        -- how long, in what stages
  tech_stack       text[] not null default '{}',
  attachment_url  text,                  -- slides, mockups, a repo
  status           proposal_status not null default 'submitted',
  score            smallint,             -- optional, set by the reviewer
  reviewer_note    text,
  created_at       timestamptz not null default now(),

  unique (challenge_id, lead_student_id),
  constraint approach_length check (char_length(approach) between 80 and 4000),
  constraint score_range check (score is null or score between 0 and 100)
);

create index proposals_challenge_idx on proposals (challenge_id, status);
create index proposals_student_idx on proposals (lead_student_id, created_at desc);

-- Team mates on a proposal.
create table proposal_members (
  proposal_id uuid not null references proposals on delete cascade,
  profile_id  uuid not null references profiles on delete cascade,
  primary key (proposal_id, profile_id)
);

-- ------------------------------------------------------------
-- 9. SHOWCASE
-- ------------------------------------------------------------
-- Published work. This is what the public gallery reads, and what
-- a student can send an employer as a portfolio.

create table showcase_items (
  id              uuid primary key default gen_random_uuid(),
  -- Optional link back to the proposal it came from.
  proposal_id     uuid references proposals on delete set null,
  student_id      uuid not null references profiles on delete cascade,
  org_id          uuid references organizations on delete set null,
  title           text not null,
  slug            text not null unique,
  summary         text not null,
  body            text,
  cover_image_url text,
  tags            text[] not null default '{}',
  is_featured     boolean not null default false,
  -- null means "still a draft". Only non-null rows are public.
  published_at    timestamptz,
  created_at      timestamptz not null default now(),

  constraint showcase_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index showcase_published_idx on showcase_items (published_at desc nulls last);

-- ------------------------------------------------------------
-- 10. HELPER FUNCTION
-- ------------------------------------------------------------
-- Used by the policies below to answer "does the logged-in user
-- belong to this organisation?".
--
-- security definer lets the function read org_members regardless of
-- the caller's own permissions, which avoids a policy that needs a
-- policy to check itself. `set search_path` is required with
-- security definer, otherwise a caller could point the function at
-- their own lookalike tables.

create or replace function is_org_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from org_members
    where org_id = target_org and profile_id = auth.uid()
  );
$$;

-- The next two exist for the same reason, plus one more: without them
-- the proposals and proposal_members policies would each read the
-- other's table, and each read would run the other's policy. Postgres
-- spots the loop and fails every query with 42P17, "infinite
-- recursion detected in policy". Wrapping the lookup in a security
-- definer function skips RLS on the table it reads, so the loop
-- cannot form.

-- Is the current user a named team member on this proposal?
create or replace function is_proposal_member(target_proposal uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from proposal_members
    where proposal_id = target_proposal and profile_id = auth.uid()
  );
$$;

-- Is the current user the student who submitted this proposal?
create or replace function is_proposal_lead(target_proposal uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from proposals
    where id = target_proposal and lead_student_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- 11. ROW LEVEL SECURITY
-- ------------------------------------------------------------
-- THIS IS THE IMPORTANT PART.
--
-- The anon key in the browser is public — anyone can read it out of
-- the page source and call the API directly. RLS is what stops them
-- reading other people's data. Without it, every table is wide open.
--
-- Once enabled, the default is DENY. Nothing is readable until a
-- policy explicitly allows it.
--
--   auth.uid()  = the id of the logged-in user, or null if anonymous
--   using       = which existing rows you may see or change
--   with check  = which new or edited rows are allowed

alter table profiles         enable row level security;
alter table students         enable row level security;
alter table organizations    enable row level security;
alter table org_members      enable row level security;
alter table opportunities    enable row level security;
alter table applications     enable row level security;
alter table challenges       enable row level security;
alter table proposals        enable row level security;
alter table proposal_members enable row level security;
alter table showcase_items   enable row level security;

-- ---------- profiles ----------
-- Anyone may read public profiles; you may always read your own.
create policy "profiles are readable when public"
  on profiles for select
  using (is_public = true or id = auth.uid());

create policy "users insert their own profile"
  on profiles for insert
  with check (id = auth.uid());

create policy "users update their own profile"
  on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------- students ----------
create policy "student details follow profile visibility"
  on students for select
  using (
    profile_id = auth.uid()
    or exists (
      select 1 from profiles
      where profiles.id = students.profile_id and profiles.is_public = true
    )
  );

create policy "students manage their own details"
  on students for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- ---------- organizations ----------
create policy "organisations are public"
  on organizations for select
  using (true);

create policy "professionals create organisations"
  on organizations for insert
  with check (created_by = auth.uid());

create policy "members update their organisation"
  on organizations for update
  using (is_org_member(id))
  with check (is_org_member(id));

-- ---------- org_members ----------
create policy "members see their own memberships"
  on org_members for select
  using (profile_id = auth.uid() or is_org_member(org_id));

create policy "owners add members"
  on org_members for insert
  with check (profile_id = auth.uid() or is_org_member(org_id));

-- ---------- opportunities ----------
-- Open postings are visible to everyone, logged in or not. Drafts
-- are visible only to the organisation that owns them.
create policy "open opportunities are public"
  on opportunities for select
  using (status = 'open' or is_org_member(org_id));

create policy "org members post opportunities"
  on opportunities for insert
  with check (is_org_member(org_id) and created_by = auth.uid());

create policy "org members edit their opportunities"
  on opportunities for update
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

create policy "org members delete their opportunities"
  on opportunities for delete
  using (is_org_member(org_id));

-- ---------- applications ----------
-- The privacy-critical table. A student sees their own applications.
-- The employer sees applications to their own postings. No student
-- can ever see another student's application.
create policy "applications visible to owner and employer"
  on applications for select
  using (
    student_id = auth.uid()
    or exists (
      select 1 from opportunities o
      where o.id = applications.opportunity_id and is_org_member(o.org_id)
    )
  );

-- A student may only apply as themselves, and only to a posting that
-- is actually open. The second half stops applications to drafts or
-- closed roles.
create policy "students apply as themselves"
  on applications for insert
  with check (
    student_id = auth.uid()
    and exists (
      select 1 from opportunities o
      where o.id = opportunity_id and o.status = 'open'
    )
  );

-- Both sides can update, for different reasons: the student to
-- withdraw, the employer to move the status along.
create policy "student or employer updates an application"
  on applications for update
  using (
    student_id = auth.uid()
    or exists (
      select 1 from opportunities o
      where o.id = applications.opportunity_id and is_org_member(o.org_id)
    )
  );

-- ---------- challenges ----------
create policy "open challenges are public"
  on challenges for select
  using (status = 'open' or is_org_member(org_id));

create policy "org members post challenges"
  on challenges for insert
  with check (is_org_member(org_id) and created_by = auth.uid());

create policy "org members edit their challenges"
  on challenges for update
  using (is_org_member(org_id))
  with check (is_org_member(org_id));

-- ---------- proposals ----------
-- Same shape as applications: yours, or ones sent to your challenge.
-- Team mates can see a proposal they are named on.
create policy "proposals visible to team and challenge owner"
  on proposals for select
  using (
    lead_student_id = auth.uid()
    -- is_proposal_member, not a subquery: see the note on the helper
    -- functions above. A direct subquery here causes 42P17.
    or is_proposal_member(id)
    or exists (
      select 1 from challenges c
      where c.id = proposals.challenge_id and is_org_member(c.org_id)
    )
  );

-- Submit as yourself, to an open challenge, before the deadline.
-- The deadline check belongs here as well as in the form: a form can
-- be bypassed, this cannot.
create policy "students submit their own proposal"
  on proposals for insert
  with check (
    lead_student_id = auth.uid()
    and exists (
      select 1 from challenges c
      where c.id = challenge_id
        and c.status = 'open'
        and c.deadline >= current_date
    )
  );

create policy "lead student or reviewer updates a proposal"
  on proposals for update
  using (
    lead_student_id = auth.uid()
    or exists (
      select 1 from challenges c
      where c.id = proposals.challenge_id and is_org_member(c.org_id)
    )
  );

-- ---------- proposal_members ----------
create policy "team members visible with the proposal"
  on proposal_members for select
  using (profile_id = auth.uid() or is_proposal_lead(proposal_id));

create policy "lead student manages the team"
  on proposal_members for all
  using (is_proposal_lead(proposal_id))
  with check (is_proposal_lead(proposal_id));

-- ---------- showcase_items ----------
-- Published items are public. Drafts belong to their author.
create policy "published showcase items are public"
  on showcase_items for select
  using (published_at is not null or student_id = auth.uid());

create policy "students manage their showcase items"
  on showcase_items for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- ------------------------------------------------------------
-- 12. NEW USER TRIGGER
-- ------------------------------------------------------------
-- When someone signs up, Supabase inserts into auth.users. This
-- trigger creates the matching profiles row automatically, so the
-- app never has a logged-in user with no profile.
--
-- The values come from the metadata passed at signup — see
-- src/app/signup/SignUpForm.tsx.

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  final_slug text;
  suffix integer := 0;
begin
  -- Turn "Ada Lovelace" into "ada-lovelace": lowercase, strip
  -- anything that is not a letter or number, collapse to hyphens.
  base_slug := trim(both '-' from regexp_replace(
    lower(coalesce(new.raw_user_meta_data->>'full_name', 'member')),
    '[^a-z0-9]+', '-', 'g'
  ));

  if base_slug = '' then
    base_slug := 'member';
  end if;

  -- Two people called Ada Lovelace would collide on the unique slug,
  -- so add -1, -2 until the slug is free.
  final_slug := base_slug;
  while exists (select 1 from profiles where slug = final_slug) loop
    suffix := suffix + 1;
    final_slug := base_slug || '-' || suffix;
  end loop;

  insert into profiles (id, role, full_name, slug)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', 'New member'),
    final_slug
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- 13. STORAGE BUCKETS
-- ------------------------------------------------------------
-- Buckets hold uploaded files. Avatars and showcase covers are
-- public because they appear on public pages. CVs and proposal
-- attachments are private: the app hands out short-lived signed
-- URLs instead, so a CV cannot be found by guessing a filename.

insert into storage.buckets (id, name, public)
values
  ('avatars',        'avatars',        true),
  ('showcase',       'showcase',       true),
  ('cvs',            'cvs',            false),
  ('proposal-files', 'proposal-files', false)
on conflict (id) do nothing;

-- Anyone may look at the public buckets.
create policy "public buckets are readable"
  on storage.objects for select
  using (bucket_id in ('avatars', 'showcase'));

-- For the private buckets, a user may only touch files inside a
-- folder named after their own user id. The app must therefore
-- upload to `cvs/<user-id>/cv.pdf`.
create policy "users read their own private files"
  on storage.objects for select
  using (
    bucket_id in ('cvs', 'proposal-files')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users upload to their own folder"
  on storage.objects for insert
  with check (
    bucket_id in ('avatars', 'showcase', 'cvs', 'proposal-files')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users replace their own files"
  on storage.objects for update
  using ((storage.foldername(name))[1] = auth.uid()::text);

create policy "users delete their own files"
  on storage.objects for delete
  using ((storage.foldername(name))[1] = auth.uid()::text);
