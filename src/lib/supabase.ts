import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const hasSupabase = Boolean(url && key);

/**
 * Which Postgres schema holds this site's tables. One free Supabase project can host several
 * sites: each site gets its own schema (this one: "cali") and its own image bucket.
 * Leave unset to use the default "public" schema of a dedicated project.
 */
export const DB_SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || "public";
export const MEDIA_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "site-media";

// The generic parameters differ per schema name, so the schema option is cast once here.
const opts = { db: { schema: DB_SCHEMA } } as never;

/** Server-side anonymous client (public reads + visitor booking inserts). */
export function serverClient(): SupabaseClient {
  return createClient(url!, key!, { ...(opts as object), auth: { persistSession: false, autoRefreshToken: false } });
}

let browser: SupabaseClient | null = null;
/** Browser client — keeps the owner's session in localStorage for /admin. */
export function browserClient(): SupabaseClient {
  return (browser ??= createClient(url!, key!, opts));
}
