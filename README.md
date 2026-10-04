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

## Database (free): share one Supabase project
Free Supabase accounts only get 2 projects, so this site keeps its tables in its **own schema (`cali`)** and its
own image bucket (`cali-media`) inside a project you already have. Nothing is shared except the project itself.

1. Supabase dashboard -> **SQL Editor** -> paste `supabase/schema.sql` -> **Run**.
2. **Project Settings -> Data API -> Exposed schemas**: add `cali` -> **Save**.
3. **Authentication -> Users -> Add user** for the owner (James): email + password, tick "Auto confirm".
   (Auth users are shared by the whole project; each site has its own owner list, so a user only gets
   dashboard access to the site they claim.)
4. `.env.local`: the project's URL + publishable key, plus `NEXT_PUBLIC_SUPABASE_SCHEMA=cali` and
   `NEXT_PUBLIC_SUPABASE_BUCKET=cali-media`.
5. Open `/admin`, sign in, press **Claim it** right away (works once), then **Load starter content**
   and **Add Spanish translations**.

Using a dedicated project instead? Leave the schema/bucket variables unset and replace `cali.` with `public.`
in `supabase/schema.sql` (and `cali-media` with `site-media`).

Until Supabase is connected the site runs on built-in sample content and bookings are kept in memory.

## Notes
- Phone, email, Instagram and address are blank on purpose: add them under **Shop & site** in the dashboard.
- Reviews in the starter content are placeholders. Replace them with real ones before launch.
- No emails/SMS or deposit payments are sent yet; the owner confirms bookings from the dashboard.
