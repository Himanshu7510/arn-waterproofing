# ARN Waterproofing & Insulation Solution – Website

A fully dynamic website with an admin panel, built with **Next.js 15** and **Postgres**, deployed on **Vercel**.

## Features

- **Public website:** Home, About, Services (list + one page per service), FAQs, Contact, enquiry forms, floating WhatsApp/Call buttons
- **Admin panel** (`/admin`): manage every piece of content
  - Home page text, About, Contact page
  - Services (add/edit/reorder/hide, each with its own SEO page)
  - Why Choose Us, Work Process, FAQs, Testimonials
  - Business info (phone, email, address, hours, map)
  - Logo, favicon and brand colours
  - SEO: page titles/descriptions, keywords, social share image, Search Console/Bing verification, local-business schema
  - Google Analytics 4, Google Tag Manager, Meta Pixel, Google Ads conversion and custom code
  - Social media links and floating buttons
  - Email notifications for new enquiries (SMTP: Gmail/Zoho/Hostinger etc.), test-email button, customer auto-reply
  - Enquiries inbox with statuses, notes, search and CSV export
  - Admin login management: change email/password, add/remove admins
- **SEO:** dynamic `sitemap.xml` and `robots.txt`, canonical URLs, Open Graph/Twitter tags, JSON-LD (LocalBusiness, Service, FAQPage, BreadcrumbList)
- **Tracking events:** `generate_lead` (GA4/GTM) + `Lead` (Meta) on form submit; `click_call` / `click_whatsapp` + Meta `Contact` on clicks

## Environment variables

| Name | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string (set automatically by Neon on Vercel) |
| `AUTH_SECRET` | Yes | Long random string used to sign admin sessions |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First run | Creates the first admin if none exists |
| `BLOB_READ_WRITE_TOKEN` | Optional | Use Vercel Blob for uploads (otherwise images are stored in Postgres) |

Tables are created and default content is seeded automatically on the first request.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL etc.
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/admin.
