-- ══════════════════════════════════════════════════════════════
--  Task Manager — Supabase Schema
--  Colle ce SQL dans : Supabase Dashboard → SQL Editor → Run
-- ══════════════════════════════════════════════════════════════

-- ── USERS TABLE ──────────────────────────────────────────────
create table if not exists public.users (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text not null unique,
  password   text not null,
  created_at timestamptz not null default now()
);

-- ── TASKS TABLE ──────────────────────────────────────────────
create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  title        text not null,
  description  text,
  category     text not null default 'autre'
                 check (category in ('work','perso','sante','projet','autre')),
  priority     text not null default 'medium'
                 check (priority in ('high','medium','low')),
  status       text not null default 'pending'
                 check (status in ('pending','in_progress','done')),
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── AUTO updated_at ──────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();

-- ── INDEXES ──────────────────────────────────────────────────
create index if not exists idx_tasks_user_id on public.tasks (user_id);
create index if not exists idx_tasks_status  on public.tasks (status);
create index if not exists idx_tasks_created on public.tasks (created_at desc);
create index if not exists idx_users_email   on public.users (email);
