-- ============================================================
-- STAGE.MU — sample data
-- ============================================================
-- Run this AFTER 0001_init.sql, in the Supabase SQL Editor.
-- It gives the site something to show so no page looks broken.
--
-- Part A creates demo logins. Part B creates the content.
-- If Part A fails on your Supabase version (the auth.users table is
-- managed by Supabase and its columns change occasionally), just
-- sign up two accounts through the site instead, then replace the
-- UUIDs in Part B with the real ids from Table Editor -> profiles.
--
-- Demo password for every account below: StageMu!2026x

-- ------------------------------------------------------------
-- PART A — demo accounts
-- ------------------------------------------------------------
-- The on_auth_user_created trigger from the migration reads
-- raw_user_meta_data and creates the matching profiles row, so we do
-- not insert into profiles directly here.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data
)
values
  -- Two employers
  ('00000000-0000-0000-0000-000000000000',
   'a1111111-1111-4111-8111-111111111111',
   'authenticated', 'authenticated', 'talent@cloudfactory.mu',
   crypt('StageMu!2026x', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Priya Ramdin","role":"professional"}'),

  ('00000000-0000-0000-0000-000000000000',
   'a2222222-2222-4222-8222-222222222222',
   'authenticated', 'authenticated', 'people@lagoonanalytics.mu',
   crypt('StageMu!2026x', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Kevin Appadoo","role":"professional"}'),

  -- Three students
  ('00000000-0000-0000-0000-000000000000',
   'b1111111-1111-4111-8111-111111111111',
   'authenticated', 'authenticated', 'anjali.p@umail.uom.ac.mu',
   crypt('StageMu!2026x', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Anjali Peerthum","role":"student"}'),

  ('00000000-0000-0000-0000-000000000000',
   'b2222222-2222-4222-8222-222222222222',
   'authenticated', 'authenticated', 'j.laurent@utm.ac.mu',
   crypt('StageMu!2026x', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Jerome Laurent","role":"student"}'),

  ('00000000-0000-0000-0000-000000000000',
   'b3333333-3333-4333-8333-333333333333',
   'authenticated', 'authenticated', 's.hossen@umail.uom.ac.mu',
   crypt('StageMu!2026x', gen_salt('bf')), now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"full_name":"Sarah Hossen","role":"student"}')
on conflict (id) do nothing;

-- Fill in the student-only details.
insert into students (
  profile_id, institution, faculty, programme, year_of_study,
  graduation_year, skills, github_url, available_from, available_to, is_verified
)
values
  ('b1111111-1111-4111-8111-111111111111',
   'University of Mauritius (UoM)', 'Information & Communication Technology',
   'BSc Software Engineering', 3, 2027,
   '{React,TypeScript,PostgreSQL,Figma}',
   'https://github.com/anjali-p/mesh-dashboard', '2026-07-01', '2026-12-20', true),

  ('b2222222-2222-4222-8222-222222222222',
   'University of Technology, Mauritius (UTM)', 'Engineering',
   'BEng Electronics & Instrumentation', 4, 2026,
   '{Python,"Embedded C",IoT,KiCad}',
   'https://github.com/jlaurent/sensor-node', '2026-08-01', '2027-01-31', true),

  ('b3333333-3333-4333-8333-333333333333',
   'University of Mauritius (UoM)', 'Business & Finance',
   'BSc Finance & Data Analytics', 2, 2028,
   '{SQL,"Power BI",Excel,Python}',
   null, '2026-07-15', '2026-11-30', false)
on conflict (profile_id) do nothing;

-- Give the students a headline so profile cards are not bare.
update profiles set
  headline = 'Third-year software engineering student — React and Postgres',
  locality = 'Quatre Bornes'
where id = 'b1111111-1111-4111-8111-111111111111';

update profiles set
  headline = 'Final-year electronics engineer building low-power sensors',
  locality = 'Curepipe'
where id = 'b2222222-2222-4222-8222-222222222222';

update profiles set
  headline = 'Finance student who would rather write SQL than slides',
  locality = 'Port Louis'
where id = 'b3333333-3333-4333-8333-333333333333';

-- ------------------------------------------------------------
-- PART B — organisations
-- ------------------------------------------------------------

insert into organizations (id, name, slug, brn, sector, locality, website, about, is_verified, created_by)
values
  ('c1111111-1111-4111-8111-111111111111',
   'CloudFactory Mauritius', 'cloudfactory-mauritius', 'C12345678',
   'ICT & Software', 'Ebène / Cybercity', 'https://cloudfactory.mu',
   'We build back-office platforms for insurers across the Indian Ocean region. Team of 40, half of whom joined as interns.',
   true, 'a1111111-1111-4111-8111-111111111111'),

  ('c2222222-2222-4222-8222-222222222222',
   'Lagoon Analytics', 'lagoon-analytics', 'C87654321',
   'Ocean Economy', 'Port Louis', 'https://lagoonanalytics.mu',
   'Marine data for fisheries, ports and coastal resilience. Small, technical, and very hands-on.',
   true, 'a2222222-2222-4222-8222-222222222222')
on conflict (id) do nothing;

-- The professionals must be members of their organisation, otherwise
-- the RLS policies will not let them post anything.
insert into org_members (org_id, profile_id, member_role)
values
  ('c1111111-1111-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'owner'),
  ('c2222222-2222-4222-8222-222222222222', 'a2222222-2222-4222-8222-222222222222', 'owner')
on conflict do nothing;

-- ------------------------------------------------------------
-- PART C — opportunities
-- ------------------------------------------------------------

insert into opportunities (
  org_id, title, slug, summary, description, kind, sector, locality, mode,
  is_paid, stipend_min, stipend_max, duration_weeks, skills_required,
  positions, closes_at, status, created_by
)
values
  ('c1111111-1111-4111-8111-111111111111',
   'Frontend Engineering Intern', 'frontend-engineering-intern-cloudfactory',
   'Build real customer-facing screens in React with a mentor reviewing every pull request.',
   E'You will join the claims platform team and work on screens used daily by insurance assessors.\n\nWhat you will actually do:\n- Build and test React components against a design system\n- Pair with a senior engineer twice a week\n- Take one feature from ticket to production yourself\n\nWe expect you to know some React and to be comfortable reading code you did not write. We do not expect you to know our stack on day one.',
   'internship', 'ICT & Software', 'Ebène / Cybercity', 'hybrid',
   true, 15000, 20000, 12, '{React,JavaScript,CSS,Git}',
   2, '2026-09-15', 'open', 'a1111111-1111-4111-8111-111111111111'),

  ('c1111111-1111-4111-8111-111111111111',
   'Data Engineering Intern', 'data-engineering-intern-cloudfactory',
   'Move messy insurer data into a warehouse that analysts can actually query.',
   E'Our data arrives as spreadsheets, SFTP drops and the occasional PDF. Your job is to help turn that into clean tables.\n\nYou will write Python and SQL, document what you build, and see your pipelines run in production before the internship ends.',
   'internship', 'ICT & Software', 'Ebène / Cybercity', 'onsite',
   true, 16000, 22000, 16, '{Python,SQL,ETL}',
   1, '2026-09-30', 'open', 'a1111111-1111-4111-8111-111111111111'),

  ('c2222222-2222-4222-8222-222222222222',
   'Marine Data Analyst Intern', 'marine-data-analyst-intern-lagoon',
   'Turn buoy and satellite readings into charts the Fisheries Ministry uses.',
   E'You will work with three years of sensor readings from the lagoon monitoring network.\n\nExpect to spend real time on data cleaning — the readings are noisy and the interesting work is deciding what to trust. You will present findings to an external stakeholder at least once.',
   'internship', 'Ocean Economy', 'Port Louis', 'onsite',
   true, 14000, 18000, 10, '{Python,"Data Visualisation",Statistics}',
   2, '2026-08-31', 'open', 'a2222222-2222-4222-8222-222222222222'),

  ('c2222222-2222-4222-8222-222222222222',
   'Embedded Systems Intern', 'embedded-systems-intern-lagoon',
   'Help build the next revision of our solar-powered lagoon sensor.',
   E'The current sensor lasts nine months on a charge. We want eighteen.\n\nYou will work on firmware in C, measure actual power draw on the bench, and go out on the boat to retrieve units. Bring sunscreen.',
   'internship', 'Ocean Economy', 'Mahébourg', 'onsite',
   true, 15000, 19000, 14, '{"Embedded C",Electronics,IoT}',
   1, '2026-10-10', 'open', 'a2222222-2222-4222-8222-222222222222'),

  ('c1111111-1111-4111-8111-111111111111',
   'QA Automation Assistant', 'qa-automation-assistant-cloudfactory',
   'Part-time, evenings, writing the test suite nobody has had time for.',
   E'A part-time role that fits around lectures: 15 hours a week, hours are yours to choose.\n\nYou will write end-to-end tests with Playwright and file the bugs you find. Good first technical job if you are methodical.',
   'part_time', 'ICT & Software', 'Remote (Mauritius-based)', 'remote',
   true, 8000, 10000, 24, '{JavaScript,Testing}',
   1, '2026-08-20', 'open', 'a1111111-1111-4111-8111-111111111111'),

  ('c2222222-2222-4222-8222-222222222222',
   'Graduate Software Engineer', 'graduate-software-engineer-lagoon',
   'A full-time first job for someone graduating this year.',
   E'We hire one graduate a year and we invest heavily in them.\n\nFirst six months: pairing, code review, and a mentor. After that you own a service. You should be graduating in 2026 or have graduated in 2025.',
   'graduate', 'Ocean Economy', 'Port Louis', 'hybrid',
   true, 32000, 40000, null, '{Python,PostgreSQL,Linux}',
   1, '2026-11-30', 'open', 'a2222222-2222-4222-8222-222222222222'),

  -- An unpaid but clearly-labelled research placement.
  ('c2222222-2222-4222-8222-222222222222',
   'Coastal Research Volunteer', 'coastal-research-volunteer-lagoon',
   'Unpaid field research placement, transport and lunch covered.',
   E'This one is unpaid and we say so up front. It suits a student who needs field hours for a dissertation.\n\nTwo days a week for eight weeks. We cover transport and lunch, and you get co-authorship on any resulting note.',
   'internship', 'Ocean Economy', 'Mahébourg', 'onsite',
   false, null, null, 8, '{"Field Research","Data Collection"}',
   3, '2026-09-05', 'open', 'a2222222-2222-4222-8222-222222222222')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- PART D — challenges and open-source projects
-- ------------------------------------------------------------

insert into challenges (
  id, org_id, title, slug, summary, brief, kind, sector, repo_url,
  skills, reward, team_size_max, deadline, status, cover_image_url, created_by
)
values
  ('d1111111-1111-4111-8111-111111111111',
   'c2222222-2222-4222-8222-222222222222',
   'Predict lagoon water quality 48 hours ahead',
   'predict-lagoon-water-quality',
   'We have three years of sensor data. Can you forecast a bloom before it happens?',
   E'THE PROBLEM\nAlgal blooms close swimming areas and hurt fisheries. Right now we find out when the water is already bad.\n\nWHAT WE HAVE\nThree years of readings from 12 buoys: temperature, salinity, turbidity, dissolved oxygen, at 15-minute intervals. Plus daily rainfall from the meteorological service.\n\nWHAT WE WANT\nA model that flags a likely bloom 48 hours out, and an honest account of how often it would be wrong. We care more about your reasoning than your accuracy score.\n\nWHAT TO SUBMIT\nYour approach, how you would validate it, and what you would need from us. You do not need to have built it yet.',
   'challenge', 'Ocean Economy', null,
   '{Python,"Machine Learning","Time Series"}',
   'Rs 30,000 and a paid internship offer', 3, '2026-10-31', 'open',
   '/images/lagoon-water-quality.svg',
   'a2222222-2222-4222-8222-222222222222'),

  ('d2222222-2222-4222-8222-222222222222',
   'c1111111-1111-4111-8111-111111111111',
   'Make our claims form usable on a bad connection',
   'offline-first-claims-form',
   'Assessors lose form data in areas with patchy signal. Fix that.',
   E'THE PROBLEM\nOur assessors fill in a 40-field claim form on a tablet, often in cane fields with one bar of signal. When the connection drops mid-form, they lose everything and start again.\n\nWHAT WE WANT\nAn offline-first approach: the form keeps working with no connection and syncs when signal returns. Conflicts need handling — two assessors can edit the same claim.\n\nCONSTRAINTS\nIt has to work on a five-year-old Android tablet. No native app; this must stay a web app.\n\nWHAT TO SUBMIT\nYour architecture, which storage API you would use and why, and how you would handle a sync conflict.',
   'challenge', 'ICT & Software', null,
   '{JavaScript,"Service Workers",IndexedDB,"Offline First"}',
   'Rs 25,000', 2, '2026-09-20', 'open',
   '/images/claims-form.svg',
   'a1111111-1111-4111-8111-111111111111'),

  ('d3333333-3333-4333-8333-333333333333',
   'c2222222-2222-4222-8222-222222222222',
   'Open-source: Creole place-name geocoder',
   'creole-place-name-geocoder',
   'Help build a geocoder that understands how Mauritians actually write addresses.',
   E'THE PROJECT\nCommercial geocoders fail on Mauritian addresses. "Camp Diable", "Bambous Virieux", spellings that vary by household — none of it resolves cleanly.\n\nWe have started an open-source geocoder and we want contributors. This is a real repository with real issues, not a toy exercise.\n\nGOOD FIRST ISSUES\n- Fuzzy matching for common Creole spelling variants\n- Import and clean the official village boundary dataset\n- A test suite built from real posted addresses\n\nWHAT TO SUBMIT\nWhich issue you want, and how you would approach it. Contributors who land a pull request get a reference from us.',
   'open_source', 'ICT & Software',
   'https://github.com/lagoon-analytics/creole-geocoder',
   '{Python,NLP,"Open Source",GIS}',
   'Mentorship and a written reference', 4, '2026-12-15', 'open',
   '/images/geocoder.svg',
   'a2222222-2222-4222-8222-222222222222'),

  ('d4444444-4444-4444-8444-444444444444',
   'c1111111-1111-4111-8111-111111111111',
   'Cut our warehouse query costs in half',
   'cut-warehouse-query-costs',
   'Our analytics bill doubled in a year. Find the waste.',
   E'THE PROBLEM\nWe run roughly 4,000 analytical queries a day. The bill has doubled while the data has grown maybe 20%.\n\nWHAT WE WILL GIVE YOU\nAnonymised query logs with runtimes and bytes scanned, plus the table schemas.\n\nWHAT WE WANT\nWhere the money is going, and the three changes that would save the most. Partitioning, materialised views, or just deleting the dashboard nobody opens — we do not mind which, as long as you show the working.\n\nWHAT TO SUBMIT\nHow you would investigate, and what you would need from us.',
   'challenge', 'ICT & Software', null,
   '{SQL,"Query Optimisation","Data Warehousing"}',
   'Rs 20,000', 2, '2026-11-15', 'open',
   '/images/warehouse-cost.svg',
   'a1111111-1111-4111-8111-111111111111'),

  ('d5555555-5555-4555-8555-555555555555',
   'c1111111-1111-4111-8111-111111111111',
   'Open-source: accessible date picker for forms',
   'accessible-date-picker',
   'Every date picker we tried fails a screen reader. Help us ship one that does not.',
   E'THE PROJECT\nWe need a date picker that works with a keyboard alone and announces correctly in NVDA and VoiceOver. We have looked at eight libraries and all of them fail somewhere.\n\nWe are building one in the open. It is small, self-contained, and a genuinely good first open-source contribution.\n\nWHAT TO SUBMIT\nTell us about a keyboard or screen-reader problem you have hit before, and how you would test this component. Enthusiasm for accessibility matters more than experience here.',
   'open_source', 'ICT & Software',
   'https://github.com/cloudfactory-mu/a11y-datepicker',
   '{TypeScript,Accessibility,"Open Source",Testing}',
   'Mentorship and conference ticket', 3, '2026-10-01', 'open',
   '/images/date-picker.svg',
   'a1111111-1111-4111-8111-111111111111')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- PART E — a couple of applications and proposals
-- ------------------------------------------------------------
-- So the dashboards are not empty on first login.

insert into applications (opportunity_id, student_id, cover_note, status)
select o.id, 'b1111111-1111-4111-8111-111111111111',
  'I have built two React apps with Postgres behind them, including a dashboard for my faculty''s lab bookings. I am most interested in the design-system side of this role and can start in July.',
  'shortlisted'
from opportunities o where o.slug = 'frontend-engineering-intern-cloudfactory'
on conflict do nothing;

insert into applications (opportunity_id, student_id, cover_note, status)
select o.id, 'b2222222-2222-4222-8222-222222222222',
  'I built a solar sensor node for my final-year project and measured its draw down to 40 microamps in sleep. Extending battery life from nine to eighteen months is exactly the problem I want to work on.',
  'applied'
from opportunities o where o.slug = 'embedded-systems-intern-lagoon'
on conflict do nothing;

insert into proposals (
  challenge_id, lead_student_id, team_name, approach, timeline, tech_stack, status
)
values
  ('d2222222-2222-4222-8222-222222222222',
   'b1111111-1111-4111-8111-111111111111',
   null,
   E'I would treat the form as a local-first document rather than a form that posts. Every field change writes immediately to IndexedDB keyed by claim id, so a dropped connection loses nothing.\n\nFor sync I would use a service worker with a queue, retrying with backoff. For conflicts I would keep per-field timestamps rather than whole-record versions — two assessors editing different fields of the same claim should not conflict at all, and that is the common case.\n\nWhere I am less sure: whether per-field timestamps are worth the complexity versus showing the assessor both versions and asking. I would want to test that with real users before committing.',
   E'Week 1-2: audit the current form, instrument where data is actually lost.\nWeek 3-4: IndexedDB persistence layer with tests.\nWeek 5-6: service worker sync queue.\nWeek 7: conflict handling, tested on a throttled connection and an old tablet.\nWeek 8: write up what did not work.',
   '{JavaScript,IndexedDB,"Service Workers",Playwright}',
   'shortlisted')
on conflict do nothing;

-- ------------------------------------------------------------
-- PART F — showcase
-- ------------------------------------------------------------
-- Cover images use fast local SVG assets in /public/images/.

insert into showcase_items (
  student_id, org_id, title, slug, summary, body,
  cover_image_url, tags, is_featured, published_at
)
values
  ('b1111111-1111-4111-8111-111111111111',
   'c1111111-1111-4111-8111-111111111111',
   'Offline-first claims form', 'offline-first-claims-form-build',
   'Rebuilt a 40-field insurance form so it survives losing signal mid-entry.',
   E'The assessors were losing an average of two forms a week to dropped connections, and re-entering a claim takes eleven minutes.\n\nI moved the form to a local-first model: every keystroke persists to IndexedDB, and a service worker queues changes for when signal returns. Per-field timestamps mean two assessors editing different parts of the same claim never conflict.\n\nTested on a 2019 Android tablet on a throttled connection. Zero data loss across 200 simulated drops.',
   '/images/claims-form.svg',
   '{React,"Offline First",IndexedDB}', true, now() - interval '9 days'),

  ('b2222222-2222-4222-8222-222222222222',
   'c2222222-2222-4222-8222-222222222222',
   'Solar lagoon sensor, revision three', 'solar-lagoon-sensor-rev-three',
   'Took a buoy sensor from nine months of battery life to nineteen.',
   E'The original board slept at 3.1 milliamps, which was the whole problem.\n\nI replaced the regulator, moved the radio to a duty cycle keyed to tide state rather than a fixed interval, and cut the sample rate at night when readings barely move. Sleep draw is now 41 microamps.\n\nNineteen months projected, measured on the bench over six weeks and confirmed on two units in the lagoon.',
   '/images/solar-sensor.svg',
   '{"Embedded C",IoT,Electronics}', true, now() - interval '21 days'),

  ('b3333333-3333-4333-8333-333333333333',
   'c1111111-1111-4111-8111-111111111111',
   'Where the warehouse bill actually went', 'warehouse-cost-teardown',
   'Traced a doubled analytics bill to four dashboards nobody opened.',
   E'I started from the query logs rather than the schema, because the bill is charged on bytes scanned.\n\nFour scheduled dashboards accounted for 61% of spend. Two had no viewer in six months. Partitioning the two that mattered by claim date cut their scan volume by 88%.\n\nTotal saving: 54% of monthly spend, with no change to anything a person actually looks at.',
   '/images/warehouse-cost.svg',
   '{SQL,"Data Warehousing","Cost Optimisation"}', false, now() - interval '34 days'),

  ('b1111111-1111-4111-8111-111111111111',
   null,
   'Lab booking system for the ICT faculty', 'faculty-lab-booking',
   'Replaced a paper sign-up sheet used by 400 students.',
   E'The computer labs were booked on a clipboard by the door, which meant double bookings every week and no way to check availability without walking there.\n\nI built a booking app with a conflict-free slot model — the database rejects overlapping bookings rather than the app checking first, so a race between two students cannot double-book.\n\nIn use by four labs. Double bookings went to zero.',
   '/images/lab-booking.svg',
   '{React,PostgreSQL,"Full Stack"}', false, now() - interval '52 days'),

  ('b2222222-2222-4222-8222-222222222222',
   null,
   'Creole spelling variants for a geocoder', 'creole-geocoder-fuzzy-matching',
   'First open-source contribution: matching how people really write addresses.',
   E'"Bambous Virieux" appears in our test data eleven different ways.\n\nI added a matcher that handles the common Creole and French spelling variants rather than generic edit distance, which was matching unrelated villages to each other.\n\nMerged upstream. Match rate on the real posted-address test set went from 71% to 94%.',
   '/images/geocoder.svg',
   '{Python,NLP,"Open Source"}', false, now() - interval '68 days'),

  ('b3333333-3333-4333-8333-333333333333',
   'c2222222-2222-4222-8222-222222222222',
   'Fisheries landings, five years in one chart', 'fisheries-landings-visual',
   'A visualisation the Ministry now uses in its quarterly briefing.',
   E'Five years of landing records across 14 sites, in spreadsheets with three different column layouts.\n\nMost of the work was reconciling the schemas and deciding which records to drop — about 4% were unusable and saying so mattered more than filling the gaps.\n\nThe final chart shows seasonal collapse at two sites that nobody had noticed because the sites were always looked at separately.',
   '/images/fisheries.svg',
   '{"Data Visualisation",Python,Statistics}', false, now() - interval '80 days')
on conflict (slug) do nothing;
