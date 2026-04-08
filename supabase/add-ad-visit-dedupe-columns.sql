alter table public.ad_visits
add column if not exists visitor_id text,
add column if not exists ip_hash text;

create index if not exists ad_visits_visitor_id_idx on public.ad_visits (visitor_id);
create index if not exists ad_visits_ip_hash_idx on public.ad_visits (ip_hash);
