create extension if not exists pgcrypto;

create table if not exists public.advertisers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references public.advertisers(id) on delete cascade,
  slug text not null unique,
  title text not null,
  offer_text text not null,
  redemption_instructions text,
  logo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  advertiser_id uuid not null references public.advertisers(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ad_visits (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  visitor_id text,
  ip_hash text,
  visited_at timestamptz not null default now()
);

create index if not exists advertisers_slug_idx on public.advertisers (slug);
create index if not exists ads_advertiser_id_idx on public.ads (advertiser_id);
create index if not exists ads_slug_idx on public.ads (slug);
create index if not exists ad_visits_ad_id_idx on public.ad_visits (ad_id);
create index if not exists ad_visits_visitor_id_idx on public.ad_visits (visitor_id);
create index if not exists ad_visits_ip_hash_idx on public.ad_visits (ip_hash);
create index if not exists ad_visits_visited_at_idx on public.ad_visits (visited_at desc);
create index if not exists leads_ad_id_idx on public.leads (ad_id);
create index if not exists leads_advertiser_id_idx on public.leads (advertiser_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
