# QR Kiosk Lead Capture MVP

## Goal
Build a lean pilot app for one kiosk.

User scans QR code → opens landing page → submits contact info → lead stored → admin can view leads.

## Routes

/ad/[adId]
Landing page tied to specific ad

/api/leads
POST endpoint to capture lead

/admin
Simple protected page showing leads

/admin/login
Admin password page

## Stack

Next.js 14 (App Router)
TypeScript
Tailwind CSS
Supabase
Vercel (later)

## Lead fields

name
email
phone

## Database tables

advertisers
ads
leads

## Do NOT build

advertiser login
advertiser dashboards
analytics charts
SMS/email automation
payment system
multi-kiosk logic
CMS
QR generator inside app
complex auth
Prisma
overengineering

Keep simple.
This is a pilot.
