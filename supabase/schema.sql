-- Run this in your Supabase project's SQL Editor (Database > SQL Editor > New query)

create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  business_name text,
  country text not null,
  email text not null,
  phone text not null,
  seller_type text not null check (seller_type in ('individual', 'manufacturer', 'distributor', 'business')),
  store_name text not null,
  store_description text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- Row Level Security: a logged-in user can create their own store, view any
-- store (needed for the public /sellers directory), and only update their own.
alter table public.sellers enable row level security;

create policy "Users can create their own store"
  on public.sellers for insert
  with check (auth.uid() = user_id);

create policy "Anyone can view sellers"
  on public.sellers for select
  using (true);

create policy "Users can update their own store"
  on public.sellers for update
  using (auth.uid() = user_id);
