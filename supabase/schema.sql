-- Run this in the Supabase SQL editor before using order matching.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  product text not null,
  stripe_session_id text unique not null,
  files_submitted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  notes text,
  files jsonb not null default '[]'::jsonb,
  order_id uuid references orders (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists orders_email_idx on orders (lower(email));
create index if not exists orders_pending_idx on orders (lower(email), files_submitted, created_at desc);
