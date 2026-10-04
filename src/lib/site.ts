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
  /** Spanish overrides for the owner-written text (tagline, hero, about, directions). */
  es: Partial<Record<"tagline" | "heroBlurb" | "aboutTitle" | "aboutBody" | "directionsNote", string>>;
};

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
  return { ...defaultSettings, ...d, hours, es: { ...defaultSettings.es, ...(d.es ?? {}) } };
}

