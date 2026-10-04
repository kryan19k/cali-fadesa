import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Barbershop preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

// barber-pole stripes as hard-stop gradient bands
const stripes = (() => {
  const c = ["#e63946", "#f5f5f5", "#3a86ff", "#f5f5f5"];
  return `linear-gradient(135deg, ${Array.from({ length: 24 }, (_, i) => `${c[i % 4]} ${(i * 100) / 24}%, ${c[i % 4]} ${((i + 1) * 100) / 24}%`).join(", ")})`;
})();

export default async function Image() {
  const { settings: s } = await getContent();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0c0c0e" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, padding: "0 90px" }}>
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#9aa0ad", textTransform: "uppercase" }}>{s.city}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 150, fontWeight: 900, color: "#f5f5f5", lineHeight: 0.95, textTransform: "uppercase" }}>{s.name}</div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 40, letterSpacing: 6, color: "#e63946", textTransform: "uppercase" }}>{s.tagline} · {s.stylist}</div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 34, color: "#cfd3dc" }}>Skin fades · Tapers · Beards · Book online</div>
        </div>
        <div style={{ display: "flex", width: 150, height: 630, background: stripes }} />
      </div>
    ),
    size,
  );
}
