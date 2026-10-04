// Default (fallback) site settings. The owner overrides these from /admin → Shop & site;
// whatever is saved in Supabase `site_settings` is merged over this object.
export type Hours = Record<number, [string, string] | null>;

export type SiteSettings = {
  name: string;
  tagline: string;
  stylist: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  yearsExperience: number;
  clientsServed: string;
  rating: number;
  /** JS getDay(): 0 = Sun … 6 = Sat. null = closed. 24h "HH:MM". */
  hours: Hours;
  slotStepMinutes: number;
  leadHours: number;
  heroBlurb: string;
  aboutTitle: string;
  aboutBody: string;
  portraitUrl: string;
  directionsNote: string;
  defaultShade: string;
  defaultTheme: "light" | "dark";
  seeded: boolean;
  /** Hero headline, three words (blank = built-in text). */
  heroWord1: string;
  heroWord2: string;
  heroWord3: string;
  /** Words in the ticker under the hero, separated by commas (blank = built-in list). */
  marquee: string;
  /** "Meet James" section labels (blank = built-in text). */
  aboutKicker: string;
  aboutMeet: string;
  aboutCta: string;
  /** The owner's own working days (null = same as the shop hours) and whether they take bookings. */
  ownerSchedule: Hours | null;
  ownerTakesBookings: boolean;
  /** Search & sharing (blank = automatic). */
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  googleVerification: string;
  /** Gift card section. */
  showGiftCards: boolean;
  giftAmounts: string;
  /** Aftercare tips (empty list = built-in four tips). */
  aftercare: AftercareTip[];
  /** Spanish overrides for owner-written text; empty = fall back to the English / built-in text. */
  es: Partial<Record<EsKey, string>>;
};

export type AftercareTip = { t: string; b: string; tEs?: string; bEs?: string };
export type EsKey =
  | "tagline" | "heroBlurb" | "aboutTitle" | "aboutBody" | "directionsNote"
  | "heroWord1" | "heroWord2" | "heroWord3" | "marquee" | "aboutKicker" | "aboutMeet" | "aboutCta";

export const defaultSettings: SiteSettings = {
  name: "Cali Fades",
  tagline: "Barbershop",
  stylist: "James Gibbs",
  city: "California",
  address: "",
  phone: "",
  email: "",
  instagram: "",
  yearsExperience: 8,
  clientsServed: "3,000+",
  rating: 4.9,
  hours: {
    0: null,
    1: null,
    2: ["09:00", "19:00"],
    3: ["09:00", "19:00"],
    4: ["09:00", "19:00"],
    5: ["09:00", "19:00"],
    6: ["08:00", "17:00"],
  },
  slotStepMinutes: 15,
  leadHours: 2,
  heroBlurb: "Fades, tapers and line-ups cut with precision. Clean shop, easy vibe, and a chair that's always ready for you.",
  aboutTitle: "A good cut changes how you walk in.",
  aboutBody:
    "I'm James. My job is simple: listen, give you a clean cut, and send you out looking better than you walked in. Fades, tapers, beards and line-ups, one chair at a time and never rushed.",
  portraitUrl: "",
  directionsNote: "",
  defaultShade: "classic",
  defaultTheme: "dark",
  seeded: false,
  heroWord1: "",
  heroWord2: "",
  heroWord3: "",
  marquee: "",
  aboutKicker: "",
  aboutMeet: "",
  aboutCta: "",
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
  googleVerification: "",
  showGiftCards: true,
  ownerSchedule: null,
  ownerTakesBookings: true,
  giftAmounts: "50, 100, 150, 250",
  aftercare: [],
  es: {
    tagline: "Barbería",
    heroBlurb: "Fades, tapers y delineados de precisión. Corte limpio, ambiente tranquilo y una silla que siempre te espera.",
    aboutTitle: "Un buen corte cambia cómo caminas.",
    aboutBody:
      "Soy James. Mi trabajo es simple: escuchar, hacerte un corte limpio y sacarte de aquí viéndote mejor de lo que llegaste. Fades, tapers, barbas y delineados, una silla a la vez y sin prisas.",
    directionsNote: "",
  },
};

export const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Overlay the owner's saved settings on the defaults (hours keys arrive as strings from JSON). */
export function mergeSettings(data: Partial<SiteSettings> | null | undefined): SiteSettings {
  const d = data ?? {};
  // JSON turns numeric keys into strings and may drop days; rebuild hours safely.
  const hours = { ...defaultSettings.hours, ...(d.hours ?? {}) };
  const es = { ...defaultSettings.es, ...(d.es ?? {}) };
  // If the owner rewrote the English text but never touched the (default) Spanish, drop the stale
  // default Spanish so Spanish visitors see the owner's text instead of the old sample copy.
  for (const k of Object.keys(defaultSettings.es) as EsKey[]) {
    const edited = d[k as keyof SiteSettings] !== undefined && d[k as keyof SiteSettings] !== defaultSettings[k as keyof SiteSettings];
    if (edited && (!d.es?.[k] || d.es[k] === defaultSettings.es[k])) es[k] = "";
  }
  return { ...defaultSettings, ...d, hours, es, aftercare: Array.isArray(d.aftercare) ? d.aftercare : [] };
}
