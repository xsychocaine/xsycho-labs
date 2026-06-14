-- Run this in the Supabase SQL editor before using order matching.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product text not null,
  stripe_session_id text unique not null,
  file_urls jsonb not null default '[]'::jsonb,
  files_submitted boolean not null default false,
  created_at timestamptz not null default now()
);

-- If the table already exists without file_urls, run:
-- alter table orders add column if not exists file_urls jsonb not null default '[]'::jsonb;

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  notes text,
  session_id text,
  service_type text,
  bpm text,
  track_key text,
  reference_notes text,
  general_notes text,
  files jsonb not null default '[]'::jsonb,
  order_id uuid references orders (id) on delete set null,
  created_at timestamptz not null default now()
);

-- If submissions already exists, run:
-- alter table submissions add column if not exists session_id text;
-- alter table submissions add column if not exists service_type text;
-- alter table submissions add column if not exists bpm text;
-- alter table submissions add column if not exists track_key text;
-- alter table submissions add column if not exists reference_notes text;
-- alter table submissions add column if not exists general_notes text;

create index if not exists orders_email_idx on orders (lower(email));
create index if not exists orders_pending_idx on orders (lower(email), files_submitted, created_at desc);
