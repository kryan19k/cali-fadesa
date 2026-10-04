import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings: s } = await getContent();
  return {
    name: `${s.name} ${s.tagline}`,
    short_name: s.name,
    description: `Book ${s.stylist} online at ${s.name} ${s.tagline}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0e",
    theme_color: "#0c0c0e",
    icons: [{ src: "/icon.png", sizes: "256x256", type: "image/png" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  };
}
