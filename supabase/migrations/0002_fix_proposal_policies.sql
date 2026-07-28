-- ============================================================
-- FIX — infinite recursion between proposals and proposal_members
-- ============================================================
-- Run this in the SQL Editor if you already applied 0001_init.sql.
-- (0001 has been corrected too, so a fresh database does not need
-- this file.)
--
-- THE BUG
--   The policy on `proposals` asked "is the current user in
--   proposal_members?", and the policy on `proposal_members` asked
--   "is the current user the lead on that proposal?".
--
--   When a policy reads another table, that table's policies run too.
--   So checking proposals ran proposal_members, which ran proposals,
--   which ran proposal_members... Postgres detects the loop and
--   aborts with 42P17: "infinite recursion detected in policy".
--
-- THE FIX
--   Move both lookups into `security definer` functions. Those run
--   with the function owner's rights, which skips row level security
--   on the table they read — so the loop never starts.
--
--   This is the same trick is_org_member() already uses. `set
--   search_path = public` is mandatory with security definer,
--   otherwise a caller could redirect the function to their own
--   lookalike tables.

-- ------------------------------------------------------------
-- 1. Helper functions
-- ------------------------------------------------------------

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
-- 2. Replace the recursive policies
-- ------------------------------------------------------------
-- "if exists" makes this safe to run twice.

drop policy if exists "proposals visible to team and challenge owner" on proposals;
drop policy if exists "team members visible with the proposal" on proposal_members;
drop policy if exists "lead student manages the team" on proposal_members;

-- Readable by: the student who submitted it, a named team mate, or a
-- member of the organisation that posted the challenge.
create policy "proposals visible to team and challenge owner"
  on proposals for select
  using (
    lead_student_id = auth.uid()
    or is_proposal_member(id)
    or exists (
      select 1 from challenges c
      where c.id = proposals.challenge_id and is_org_member(c.org_id)
    )
  );

-- A team row is visible to the person named in it and to the lead.
create policy "team members visible with the proposal"
  on proposal_members for select
  using (profile_id = auth.uid() or is_proposal_lead(proposal_id));

-- Only the lead student adds or removes team mates.
create policy "lead student manages the team"
  on proposal_members for all
  using (is_proposal_lead(proposal_id))
  with check (is_proposal_lead(proposal_id));
