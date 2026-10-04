"use client";
import { useEffect, useRef } from "react";
import { useShade, useTheme } from "@/lib/shade";

/* The hero is a haircut in progress: a field of stubble that fades from dense (top right)
   to bare skin (bottom left), like a skin fade. Dragging runs the clippers: the pointer
   shaves a clean track through the stubble, which slowly grows back. With no pointer
   (phones, idle desktop) a virtual clipper makes passes on its own. */
export default function FadeField() {
  const wrap = useRef<HTMLDivElement>(null);
  const shade = useShade();
  const theme = useTheme();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const base = document.createElement("canvas"); // stubble, drawn once
    const cut = document.createElement("canvas"); // shaved tracks, painted + decayed
    for (const c of [base, cut]) {
      Object.assign(c.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
      el.appendChild(c);
    }
    const b = base.getContext("2d")!;
    const k = cut.getContext("2d")!;

    const css = getComputedStyle(document.documentElement);
    const hair = css.getPropertyValue("--cream").trim();
    const accent = css.getPropertyValue("--accent").trim();
    const bg = css.getPropertyValue("--ink").trim();

    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let last: { x: number; y: number; t: number } | null = null;
    let lastReal = -9999;
    const phone = () => w < 760;

    // simple seeded-ish rng so a resize doesn't reshuffle every hair
    let seed = 1337;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const drawStubble = () => {
      seed = 1337;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, w, h);
      b.lineCap = "round";
      const sx = phone() ? 6 : 5, sy = phone() ? 5 : 4.5;
      for (let y = 0; y < h; y += sy) {
        for (let x = 0; x < w; x += sx) {
          const u = x / w, v = y / h;
          let d = u * 0.8 + (1 - v) * 0.7 - 0.42; // dense top-right → bare bottom-left
          d = Math.max(0, Math.min(1, d));
          d = Math.pow(d, 1.1);
          if (rnd() > d * 1.1) continue;
          const len = 2 + d * 13 + rnd() * 3;
          const ang = (rnd() - 0.5) * 0.55 + 0.18;
          const px = x + (rnd() - 0.5) * sx, py = y + (rnd() - 0.5) * sy;
          b.globalAlpha = 0.09 + d * 0.36 * (0.6 + rnd() * 0.4);
          b.strokeStyle = rnd() < 0.045 ? accent : hair; // a few strands pick up the brand color
          b.lineWidth = 1 + d * 0.5;
          b.beginPath();
          b.moveTo(px, py);
          b.lineTo(px + Math.sin(ang) * len, py - Math.cos(ang) * len);
          b.stroke();
        }
      }
      b.globalAlpha = 1;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = el.clientWidth;
      h = el.clientHeight;
      for (const c of [base, cut]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      k.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStubble();
    };
    resize();

    const shave = (x: number, y: number) => {
      const now = performance.now();
      const width = phone() ? 28 : 40;
      k.globalCompositeOperation = "source-over";
      k.strokeStyle = bg;
      k.fillStyle = bg;
      k.lineCap = "round";
      k.lineWidth = width;
      if (last && now - last.t < 120) {
        k.beginPath();
        k.moveTo(last.x, last.y);
        k.lineTo(x, y);
        k.stroke();
      } else {
        k.beginPath();
        k.arc(x, y, width / 2, 0, Math.PI * 2);
        k.fill();
      }
      last = { x, y, t: now };
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      lastReal = performance.now();
      shave(x, y);
    };

    let ap = 0;
    const frame = (now: number) => {
      // regrow: fade the shaved tracks back out
      k.globalCompositeOperation = "destination-out";
      k.fillStyle = "rgba(0,0,0,0.028)";
      k.fillRect(0, 0, w, h);
      // idle autopilot: a virtual clipper makes slow passes
      if (now - lastReal > 1800) {
        ap += 0.012;
        shave(w * (0.5 + 0.44 * Math.sin(ap * 1.1)), h * (0.5 + 0.38 * Math.sin(ap * 1.7 + 1.2)));
      }
      if (visible) raf = requestAnimationFrame(frame);
    };
    if (!reduce) raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      base.remove();
      cut.remove();
    };
  }, [shade, theme]);

  return <div ref={wrap} aria-hidden className="absolute inset-0" />;
}
