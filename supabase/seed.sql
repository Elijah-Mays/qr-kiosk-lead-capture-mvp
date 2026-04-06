insert into public.advertisers (id, name, slug)
values (
  '11111111-1111-1111-1111-111111111111',
  'Sunrise Dental',
  'sunrise-dental'
)
on conflict (id) do nothing;

insert into public.ads (
  id,
  advertiser_id,
  slug,
  title,
  offer_text,
  logo_url,
  active
)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'sunrise-dental-new-patient',
  'New Patient Special',
  'Claim a free consultation and a discounted first cleaning when you leave your details today.',
  null,
  true
)
on conflict (id) do nothing;
