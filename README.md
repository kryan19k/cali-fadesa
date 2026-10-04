# Cali Fades: booking site

Next.js 16 + Tailwind 4 + Supabase. Barbershop site for **James Gibbs at Cali Fades**: single page with
tabs (Menu, Book, Stories, Shop), a separate `/portfolio` page, black/bone modes, 5 barber-pole color
shades, English/Spanish, and an owner dashboard at `/admin`.

## Run
```
npm install
cp .env.example .env.local   # fill in this shop's own Supabase URL + publishable key
npm run dev
```

## Database: which SQL file do I run?
Pick ONE, depending on where it goes. Run it in Supabase -> **SQL Editor** -> New query -> Run.

| Where it goes | Run this | `.env.local` extras |
|---|---|---|
| A **new, empty** Supabase project just for this shop | `supabase/schema-own-project.sql` | none |
| A project that **already has another site** (e.g. the hair salon's) | `supabase/schema-shared.sql` | `NEXT_PUBLIC_SUPABASE_SCHEMA=cali` and `NEXT_PUBLIC_SUPABASE_BUCKET=cali-media` |

Then run `supabase/owner-login.local.sql` (set `v_schema` at the top to `cali` or `public` to match) to create the
dashboard login. That file is git-ignored so the password stays out of the repo; keep a copy locally.

Dashboard login: **username `MrGibbs`**, password as set in that file. Open `/admin`, sign in, then press
**Load starter content** and **Add Spanish translations**.

The shared option keeps this site in its own schema + image bucket, so tables never collide with the other site
(the schema file also exposes it to the API automatically).

Until Supabase is connected the site runs on built-in sample content and bookings are kept in memory.

## Notes
- Phone, email, Instagram and address are blank on purpose: add them under **Shop & site** in the dashboard.
- Reviews in the starter content are placeholders. Replace them with real ones before launch.
- No emails/SMS or deposit payments are sent yet; the owner confirms bookings from the dashboard.
