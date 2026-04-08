create table if not exists public.ad_visits (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid not null references public.ads(id) on delete cascade,
  visitor_id text,
  ip_hash text,
  visited_at timestamptz not null default now()
);

create index if not exists ad_visits_ad_id_idx on public.ad_visits (ad_id);
create index if not exists ad_visits_visitor_id_idx on public.ad_visits (visitor_id);
create index if not exists ad_visits_ip_hash_idx on public.ad_visits (ip_hash);
create index if not exists ad_visits_visited_at_idx on public.ad_visits (visited_at desc);
