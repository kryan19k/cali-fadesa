// Starter content. Shown until the owner loads it into Supabase (admin → Load starter
// content); after that the database is the source of truth. Reviews are placeholders.

export type Es = Record<string, string>;

export type ServiceCategory = "Fades" | "Cuts" | "Beard" | "Combos";

export type Service = {
  es?: Es;
  id: string;
  name: string;
  category: ServiceCategory;
  blurb: string;
  price: number;
  minutes: number;
  deposit: number;
};

export type Addon = { es?: Es; id: string; name: string; blurb: string; price: number; minutes: number };

export const services: Service[] = [
  { id: "skin-fade", name: "Skin Fade", category: "Fades", blurb: "Skin-to-length blend, razor-clean transition and a crisp line-up. The classic.", price: 35, minutes: 45, deposit: 0 },
  { id: "taper-fade", name: "Taper Fade", category: "Fades", blurb: "A clean, subtle taper at the sideburns and neckline. Sharp but low-maintenance.", price: 32, minutes: 40, deposit: 0 },
  { id: "burst-fade", name: "Burst / Drop Fade", category: "Fades", blurb: "Curved fade that wraps around the ear. Built for texture, waves and curls on top.", price: 38, minutes: 45, deposit: 0 },
  { id: "classic-cut", name: "Classic Scissor Cut", category: "Cuts", blurb: "Scissor-over-comb cut shaped to your head and finished with a hot towel and style.", price: 30, minutes: 40, deposit: 0 },
  { id: "buzz-cut", name: "Buzz Cut", category: "Cuts", blurb: "One guard, all over, with clean edges. Quick and fresh.", price: 20, minutes: 20, deposit: 0 },
  { id: "kids-cut", name: "Kids Cut (12 & under)", category: "Cuts", blurb: "Patient, fun and sharp. Fades and cuts for the little ones.", price: 25, minutes: 30, deposit: 0 },
  { id: "line-up", name: "Line Up / Shape Up", category: "Cuts", blurb: "Hairline, temples and neckline cleaned to razor edges. Perfect between cuts.", price: 15, minutes: 15, deposit: 0 },
  { id: "beard-trim", name: "Beard Trim & Shape", category: "Beard", blurb: "Beard sculpted and lined to match your face shape, with a hot towel finish.", price: 20, minutes: 20, deposit: 0 },
  { id: "hot-shave", name: "Hot Towel Shave", category: "Beard", blurb: "Straight-razor shave with hot towels and aftershave. The full treatment.", price: 30, minutes: 30, deposit: 0 },
  { id: "fade-beard", name: "Fade + Beard", category: "Combos", blurb: "Your fade and a full beard trim, blended and lined to match.", price: 50, minutes: 60, deposit: 0 },
  { id: "full-works", name: "The Full Works", category: "Combos", blurb: "Fade, beard sculpt, hot towel shave finish and line-up. Walk out brand new.", price: 65, minutes: 75, deposit: 10 },
];

export const addons: Addon[] = [
  { id: "add-towel", name: "Hot Towel Finish", blurb: "Steam towel and aftershave", price: 8, minutes: 10 },
  { id: "add-design", name: "Hair Design", blurb: "Parts, lines and custom designs", price: 10, minutes: 15 },
  { id: "add-brows", name: "Eyebrow Clean-Up", blurb: "Quick shape with the razor", price: 8, minutes: 5 },
  { id: "add-wash", name: "Shampoo & Style", blurb: "Wash, condition and product", price: 10, minutes: 10 },
];

export const categories: ServiceCategory[] = ["Fades", "Cuts", "Beard", "Combos"];

/* ---------- Portfolio ---------- */

// Placeholder-art styles. "skin" = high skin fade, "low" = low taper, "mid" = mid fade,
// "crop" = textured crop/buzz, "top" = high top / long top, "beard" = beard work.
export type LookKind = "skin" | "low" | "mid" | "crop" | "top" | "beard";
export type LookCategory = "Fades" | "Tapers" | "Beards" | "Styles";

export type Look = {
  es?: Es;
  id: string;
  title: string;
  category: LookCategory;
  kind: LookKind;
  /** [hair, skin, accent line] — used only by the placeholder art. */
  palette: [string, string, string];
  serviceId: string;
  story: string;
  hours: string;
  seed: number;
  // Drop real photos in /public/looks and set these — art falls back to generated art.
  image?: string;
  before?: string;
};

export const looks: Look[] = [
  { id: "mid-skin-fade", title: "Mid Skin Fade", category: "Fades", kind: "skin", palette: ["#111113", "#8a5a3c", "#e63946"], serviceId: "skin-fade", story: "Skin-to-length blend starting mid-temple, razor-clean transition and a sharp line-up.", hours: "45 min", seed: 11 },
  { id: "low-taper", title: "Low Taper", category: "Tapers", kind: "low", palette: ["#1d1612", "#a06b48", "#3a86ff"], serviceId: "taper-fade", story: "Subtle taper at the sideburns and neckline. Professional, clean, easy to maintain.", hours: "40 min", seed: 23 },
  { id: "burst-fade", title: "Burst Fade", category: "Fades", kind: "mid", palette: ["#0e0e10", "#6e4630", "#ff8a3d"], serviceId: "burst-fade", story: "Curved burst around the ear with length and texture left up top.", hours: "45 min", seed: 37 },
  { id: "high-top", title: "High Top Fade", category: "Styles", kind: "top", palette: ["#26190f", "#9a6544", "#e63946"], serviceId: "skin-fade", story: "Tight skin fade into a sculpted high top, shaped flat and sharp.", hours: "50 min", seed: 41 },
  { id: "textured-crop", title: "Textured Crop", category: "Styles", kind: "crop", palette: ["#17171a", "#b07a56", "#3a86ff"], serviceId: "classic-cut", story: "Short, textured top with a clean mid taper. Wake up and go.", hours: "40 min", seed: 53 },
  { id: "drop-fade-waves", title: "Drop Fade + Waves", category: "Fades", kind: "skin", palette: ["#111113", "#5d3a27", "#e63946"], serviceId: "burst-fade", story: "Drop fade that follows the head, with brushed-in waves on top.", hours: "45 min", seed: 67 },
  { id: "beard-sculpt", title: "Beard Sculpt", category: "Beards", kind: "beard", palette: ["#1d1612", "#8a5a3c", "#ff8a3d"], serviceId: "beard-trim", story: "Full beard shaped to the jaw, cheek line cleaned and blended into the fade.", hours: "20 min", seed: 79 },
  { id: "lineup-beard", title: "Line Up + Beard", category: "Beards", kind: "beard", palette: ["#0e0e10", "#a06b48", "#3a86ff"], serviceId: "fade-beard", story: "Razor line-up on the hairline and a trimmed, blended beard.", hours: "60 min", seed: 83 },
  { id: "side-part", title: "Classic Side Part", category: "Styles", kind: "low", palette: ["#26190f", "#b27d59", "#e63946"], serviceId: "classic-cut", story: "Hard part, scissor-cut top and a tight taper. Timeless.", hours: "40 min", seed: 97 },
  { id: "buzz-cut", title: "Buzz + Edge", category: "Tapers", kind: "crop", palette: ["#17171a", "#7a4d33", "#ff8a3d"], serviceId: "buzz-cut", story: "Even buzz all over with crisp edges and a clean neckline.", hours: "20 min", seed: 101 },
  { id: "taper-curls", title: "Taper + Curls", category: "Tapers", kind: "top", palette: ["#111113", "#6e4630", "#3a86ff"], serviceId: "taper-fade", story: "Low taper with defined curls left long on top.", hours: "40 min", seed: 113 },
  { id: "hot-shave", title: "Hot Towel Shave", category: "Beards", kind: "beard", palette: ["#1d1612", "#b88562", "#e63946"], serviceId: "hot-shave", story: "Straight-razor shave with steaming towels. Smooth as it gets.", hours: "30 min", seed: 127 },
];

export const lookCategories: ("All" | LookCategory)[] = ["All", "Fades", "Tapers", "Beards", "Styles"];

/* ---------- Reviews (placeholder) ---------- */

export type Review = { es?: Es; id: string; name: string; service: string; quote: string; stars: number };
export type Faq = { es?: Es; id: string; q: string; a: string };
export type TeamMember = { es?: Es; id: string; name: string; role: string; bio: string; photoUrl: string; instagram: string };

export const reviews: Omit<Review, "id">[] = [
  { name: "Marcus T.", service: "Skin Fade", quote: "Best fade I've had in years. The blend is flawless and the line-up stays sharp for two weeks. Not going anywhere else.", stars: 5 },
  { name: "Devon R.", service: "Fade + Beard", quote: "Showed him a picture and he nailed it first try. Clean shop, good vibes, and he actually listens.", stars: 5 },
  { name: "Andre W.", service: "Burst Fade", quote: "Finally a barber who knows how to work with my texture. The curve around the ear is perfect.", stars: 5 },
  { name: "Luis M.", service: "The Full Works", quote: "Hot towel, razor line-up, beard sculpt. Walked in tired and walked out feeling like a new man.", stars: 5 },
  { name: "Chris B.", service: "Kids Cut", quote: "My son sat still the whole time and loves his haircut. Patient and fast. We'll be back every month.", stars: 5 },
  { name: "Tyler H.", service: "Taper Fade", quote: "Clean taper, great conversation, and he's always on time. Easy booking too.", stars: 5 },
];

export const faqs: Omit<Faq, "id">[] = [
  { q: "Do you take walk-ins?", a: "Booking online guarantees your time. If there's an opening we'll fit walk-ins in, but appointments always come first." },
  { q: "How often should I get a fade?", a: "Most fades look sharpest for 2 to 3 weeks. For skin fades and beards we recommend every 2 weeks; tapers can go 3 to 4." },
  { q: "What if I need to cancel or reschedule?", a: "No problem. Just give us at least 2 hours' notice so we can offer your spot to someone else." },
  { q: "Can I bring a reference photo?", a: "Please do. Show it at the start of your cut or add it to your booking notes and we'll tell you what works for your head shape and hair type." },
  { q: "Do you cut all hair types?", a: "Yes. Straight, wavy, curly and coily. Fades, tapers, waves and designs are all on the menu." },
  { q: "How long will my appointment take?", a: "The booking tool adds up your services and shows the exact finish time before you confirm." },
];
