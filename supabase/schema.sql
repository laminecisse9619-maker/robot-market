-- Run this in your Supabase project's SQL Editor (Database > SQL Editor > New query)

create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  business_name text,
  country text not null,
  email text not null,
  phone text not null,
  seller_type text not null check (seller_type in ('individual', 'manufacturer', 'distributor', 'business')),
  store_name text not null,
  store_description text,
  created_at timestamptz not null default now()
);

-- Row Level Security: allow anyone to sign up (insert), and to read seller
-- directory info (needed for the /sellers pages later). Tighten this once
-- you add real authentication (e.g. restrict select to the seller's own row).
alter table public.sellers enable row level security;

create policy "Anyone can register as a seller"
  on public.sellers for insert
  with check (true);

create policy "Anyone can view sellers"
  on public.sellers for select
  using (true);
