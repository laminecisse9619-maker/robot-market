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

-- ─────────────────────────────────────────────────────────────────────────
-- Demandes de devis ("Demander un devis" sur la fiche produit)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  request_ref text not null unique,      -- identifiant lisible ex. DEV-A1B2C3D4
  robot_id text not null,
  robot_name text not null,
  seller_id text,
  seller_name text,
  buyer_name text not null,
  buyer_email text not null,
  buyer_company text,
  buyer_phone text,
  message text,
  quantity int not null default 1,
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;

-- Le formulaire public peut créer une demande (l'insertion passe en réalité
-- par /api/send-quote avec la clé service_role, mais cette policy garde la
-- table utilisable même en insertion directe depuis le client).
create policy "Anyone can submit a quote request"
  on public.quote_requests for insert
  with check (true);

-- ⚠️ Remplacez l'adresse ci-dessous par votre véritable e-mail admin avant
-- d'exécuter ce script (ou par une liste plus large si plusieurs admins).
create policy "Admins can view quote requests"
  on public.quote_requests for select
  using (auth.jwt() ->> 'email' in ('admin@obovia.com'));

create policy "Admins can update quote requests"
  on public.quote_requests for update
  using (auth.jwt() ->> 'email' in ('admin@obovia.com'));

-- ─────────────────────────────────────────────────────────────────────────
-- Revendications de fiche ("Vous êtes le constructeur ? Revendiquez ce profil")
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.claim_requests (
  id uuid primary key default gen_random_uuid(),
  robot_id text not null,
  robot_name text not null,
  seller_id text not null,
  seller_name text not null,
  full_name text not null,
  job_title text not null,
  professional_email text not null,
  proof text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.claim_requests enable row level security;

create policy "Anyone can submit a claim request"
  on public.claim_requests for insert
  with check (true);

create policy "Admins can view claim requests"
  on public.claim_requests for select
  using (auth.jwt() ->> 'email' in ('admin@obovia.com'));

create policy "Admins can update claim requests"
  on public.claim_requests for update
  using (auth.jwt() ->> 'email' in ('admin@obovia.com'));
