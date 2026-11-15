
create extension if not exists pgcrypto;

create table if not exists public.pathfinder_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  student_name text not null,
  email text not null,
  phone text,
  city text not null,

  stream text not null,
  interests text[] not null,
  experience text,
  favorite_subject text,
  career_goal text,
  language text not null,

  consent boolean not null default false,
  guardian_consent boolean not null default false,

  lead_score integer default 0,
  lead_category text default 'new',
  source text default 'pathfinder_ai',

  report jsonb,
  followup_status text default 'pending'
);

create table if not exists public.pathfinder_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  session_id text,
  metadata jsonb default '{}'::jsonb
);

create index if not exists pathfinder_leads_created
on public.pathfinder_leads(created_at desc);

create index if not exists pathfinder_leads_category
on public.pathfinder_leads(lead_category);

create index if not exists pathfinder_events_type
on public.pathfinder_events(event_type);

alter table public.pathfinder_leads enable row level security;
alter table public.pathfinder_events enable row level security;

-- No public access policies.
-- All database operations go through protected server APIs.
