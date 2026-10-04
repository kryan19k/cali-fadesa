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

## One-time Supabase setup (use a NEW Supabase project for this shop)
1. Supabase dashboard -> **SQL Editor** -> paste `supabase/schema.sql` -> **Run**.
2. **Authentication -> Users -> Add user** (email + password, tick "Auto confirm"). This is the owner login.
   Then turn OFF "Allow new users to sign up".
3. Open `/admin`, sign in, press **Claim it** (works once), then **Load starter content**, then **Add Spanish translations**.

Until Supabase is connected the site runs on built-in sample content and bookings are kept in memory.

## Notes
- Phone, email, Instagram and address are blank on purpose: add them under **Shop & site** in the dashboard.
- Reviews in the starter content are placeholders. Replace them with real ones before launch.
- No emails/SMS or deposit payments are sent yet; the owner confirms bookings from the dashboard.
