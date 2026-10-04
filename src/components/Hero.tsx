"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import FadeField from "./FadeField";
import { goTab } from "@/lib/tabs";
import { useContent } from "./ContentProvider";
import { useClientValue } from "@/lib/client-value";
import { openNowLabel } from "@/lib/availability";
import { useNextLabel } from "@/lib/use-next";
import { useT, useLocale, intlTag } from "@/lib/locale";

const wordKeys = ["hero.w1", "hero.w2", "hero.w3"];
const marqueeKeys = Array.from({ length: 10 }, (_, i) => `marquee.${i + 1}`);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { settings: site } = useContent();
  const t = useT();
  const tag = intlTag(useLocale());
  const open = useClientValue(() => openNowLabel(new Date(), site.hours, t, tag), "");
  const next = useNextLabel();

  return (
    <section id="hero" ref={ref} className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pt-28 pb-24">
      {/* the haircut in progress */}
      <div className="absolute inset-0 -z-10">
        <FadeField />
        <div className="absolute inset-0 bg-[linear-gradient(to_top_right,var(--ink)_10%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      {/* barber pole */}
      <div aria-hidden className="absolute top-24 right-3 bottom-44 hidden w-3 flex-col items-center sm:flex lg:right-10">
        <span className="h-2 w-5 rounded-t-md bg-cream/70" />
        <span className="pole w-3 flex-1 rounded-sm shadow-[0_0_30px_-4px_var(--accent)]" />
        <span className="h-2 w-5 rounded-b-md bg-cream/70" />
      </div>

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs tracking-[0.22em] text-muted uppercase sm:mb-5"
        >
          <span className="flex items-center gap-2"><span className="pole h-4 w-1.5 rounded-full" />{site.city}</span>
          <span>{t("hero.by", { name: site.stylist })}</span>
          {open && (
            <span className="flex items-center gap-2 text-counter"><span className="pulse-dot size-1.5 rounded-full bg-counter" />{open}</span>
          )}
        </motion.div>

        <h1 className="font-display text-[clamp(2.8rem,7.2vw,6rem)] leading-[0.98] tracking-wide text-cream/95">
          {wordKeys.map((k, i) => (
            <span key={k} className="mr-[0.2em] inline-block overflow-hidden pb-[0.1em] align-bottom">
              <motion.span
                className={`inline-block ${i === 1 ? "text-shade -skew-x-6" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {t(k)}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 flex flex-col gap-7 sm:mt-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-cream/75">{site.heroBlurb}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => goTab("book")} className="btn-accent rounded-md px-5 py-3 text-sm tracking-wide uppercase sm:px-7 sm:py-3.5">{t("hero.cta")}</button>
              <Link href="/portfolio" className="btn-ghost rounded-md px-5 py-3 text-sm tracking-wide uppercase sm:px-7 sm:py-3.5">{t("hero.work")}</Link>
            </div>
            <p className="mt-4 hidden text-[0.65rem] tracking-[0.25em] text-muted uppercase [@media(hover:hover)]:block">✂ {t("hero.drag")}</p>
          </div>

          {/* quick-book card */}
          <div className="glass w-full rounded-xl p-5 sm:w-80 lg:self-auto">
            <div className="flex items-center justify-between text-[0.65rem] tracking-[0.25em] text-muted uppercase">
              <span>{t("nav.next")}</span>
              <span className="text-cream/80">★ {site.rating.toFixed(1)}</span>
            </div>
            <p className="font-display mt-2 text-3xl tracking-wide">{next || "—"}</p>
            <p className="mt-1 text-xs text-muted">{site.clientsServed} {t("stylist.clients")}</p>
            <button onClick={() => goTab("book")} className="btn-accent mt-4 w-full rounded-md py-3 text-sm tracking-wide uppercase">{t("hero.bookSlot")}</button>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative mt-12 overflow-hidden border-y border-line bg-ink-2/70 py-3 backdrop-blur-sm" aria-hidden>
        <div className="marquee flex w-max gap-8 whitespace-nowrap">
          {[...marqueeKeys, ...marqueeKeys].map((m, i) => (
            <span key={i} className="font-display flex items-center gap-8 text-xl text-cream/70">
              {t(m)}<span className="text-accent">{"//"}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
