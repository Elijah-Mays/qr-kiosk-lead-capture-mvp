# QR Kiosk Lead Capture MVP

Lean MVP web app for a single kiosk pilot.

The app supports one flow only:

1. A user scans a QR code
2. The QR code opens `/ad/[adId]`
3. The user submits name, email, and phone
4. The lead is stored in Supabase with `ad_id` and `advertiser_id`
5. An internal admin views all leads at `/admin`

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel-friendly structure

## What This App Includes

- public landing page for a specific ad
- lead capture form
- `POST /api/leads` endpoint
- simple admin password login
- cookie-based admin session
- middleware protection for `/admin`
- admin leads table with ad and advertiser names

## What This App Does Not Include

- advertiser accounts
- advertiser dashboards
- analytics charts
- SMS or email automation
- payment or billing
- CMS
- multi-kiosk logic
- QR generation inside the app
- Prisma or any ORM
- complex auth

## Environment Variables

Create a `.env.local` file from `.env.example` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_SECRET=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` come from your Supabase project settings.
- `SUPABASE_SERVICE_ROLE_KEY` is used only on the server for ad lookup, lead inserts, and admin queries.
- `ADMIN_SECRET` is the internal password for `/admin/login`.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
```

3. Add your real Supabase credentials and an `ADMIN_SECRET`.

4. Start the app:

```bash
npm run dev
```

5. Open:

- `http://localhost:3000`
- `http://localhost:3000/admin/login`

## Supabase Setup

Run the schema in:

- `supabase/schema.sql`

Optional sample data:

- `supabase/seed.sql`

Recommended order:

1. Open the Supabase SQL editor
2. Run `supabase/schema.sql`
3. Run `supabase/seed.sql` if you want a sample advertiser and sample ad

## Database Schema

Tables:

- `advertisers`
- `ads`
- `leads`

Important detail:

- `leads` stores both `ad_id` and `advertiser_id` directly for simple reporting

## Sample Data

The optional seed creates:

- advertiser: `Sunrise Dental`
- ad title: `New Patient Special`
- sample ad ID: `22222222-2222-2222-2222-222222222222`

You can test the public offer page locally at:

```bash
http://localhost:3000/ad/22222222-2222-2222-2222-222222222222
```

## How To Create Your Own Ad

Insert a row into `advertisers`, then create an `ads` row using that advertiser's `id`.

Required ad fields:

- `advertiser_id`
- `slug`
- `title`
- `offer_text`

Optional ad fields:

- `logo_url`

Set `active = true` for a live offer.

## How To Test The App

1. Visit a valid offer page:

```bash
http://localhost:3000/ad/YOUR_AD_ID
```

2. Submit the form with:

- name
- email
- phone

3. Confirm the inline success message appears:

`Thanks! We will be in touch.`

4. Visit:

```bash
http://localhost:3000/admin/login
```

5. Enter the password from `ADMIN_SECRET`

6. Confirm the lead appears in the `/admin` table

## Error States

This MVP handles:

- invalid ad ID: `This offer is no longer available.`
- inactive ad: `This promotion has ended.`
- incomplete form submission: inline validation error
- lead insert failure: `Something went wrong. Please try again.`
- no admin leads yet: `No leads yet. Waiting for first scan.`

## Manual QR Code Use

You can generate a QR code manually using any external QR tool and point it to:

```text
https://yourdomain.com/ad/[adId]
```

Example:

```text
https://yourdomain.com/ad/22222222-2222-2222-2222-222222222222
```

## Deployment Notes

This project is structured to deploy cleanly on Vercel.

Before deploying:

1. Set the four environment variables in Vercel
2. Apply `supabase/schema.sql`
3. Add at least one active ad in Supabase
