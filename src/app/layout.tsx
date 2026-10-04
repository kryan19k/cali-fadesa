import type { Metadata, Viewport } from "next";
import { Anton, Manrope } from "next/font/google";
import { bootScript } from "@/lib/shade";
import { getContent } from "@/lib/content";
import { ContentProvider } from "@/components/ContentProvider";
import Clippers from "@/components/Clippers";
import "./globals.css";

export const revalidate = 30; // content edits in /admin also trigger an instant revalidate

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getContent();
  return {
    title: `${s.name} ${s.tagline} — Fades, Cuts & Beards in ${s.city}`,
    description: `Book ${s.stylist} at ${s.name} ${s.tagline} in ${s.city}. Skin fades, tapers, line-ups and beard work. Browse the cuts and reserve your chair online.`,
  };
}
export const viewport: Viewport = { themeColor: "#0c0c0e" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getContent();
  const { defaultShade, defaultTheme } = content.settings;
  return (
    <html
      lang="en"
      data-shade={defaultShade}
      data-theme={defaultTheme}
      className={`${anton.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <ContentProvider content={content}>{children}</ContentProvider>
        <Clippers />
      </body>
    </html>
  );
}
