"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const BASE_TILT = 18;
const TIP_X = 16;
const TIP_Y = 44;

// A pair of clippers that IS the cursor over the hero. The blade tip sits on the pointer,
// the body leans into your motion, and it buzzes while you hold the button down.
// Everywhere else the normal pointer is used.
export default function Clippers() {
  const [shown, setShown] = useState(false);
  const [press, setPress] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 46, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 46, mass: 0.35 });
  const tilt = useMotionValue(BASE_TILT);
  const rot = useSpring(tilt, { stiffness: 170, damping: 15 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    const root = document.documentElement;
    let idle: ReturnType<typeof setTimeout>;

    const move = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const inHero = !!t?.closest("#hero") && !t?.closest("a, button, [role='radio'], input");
      root.classList.toggle("has-brush", inHero);
      setShown(inHero);
      if (!inHero) return;
      x.set(e.clientX);
      y.set(e.clientY);
      tilt.set(BASE_TILT - Math.max(-24, Math.min(24, e.movementX * 1.4)));
      clearTimeout(idle);
      idle = setTimeout(() => tilt.set(BASE_TILT), 90);
    };
    const down = () => setPress(true);
    const up = () => setPress(false);
    const leave = () => { root.classList.remove("has-brush"); setShown(false); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      clearTimeout(idle);
      root.classList.remove("has-brush");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [x, y, tilt]);

  return (
    <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[100]" style={{ x: sx, y: sy, opacity: shown ? 1 : 0, transition: "opacity .12s" }}>
      <motion.div
        style={{ rotate: rot, transformOrigin: `${TIP_X}px ${TIP_Y}px`, left: -TIP_X, top: -TIP_Y, position: "absolute" }}
        animate={press ? { x: [0, 1.4, -1.4, 0], scale: 0.94 } : { x: 0, scale: 1 }}
        transition={press ? { x: { repeat: Infinity, duration: 0.07 }, scale: { duration: 0.1 } } : { type: "spring", stiffness: 500, damping: 22 }}
      >
        <svg width="32" height="48" viewBox="0 0 32 48" style={{ overflow: "visible", filter: "drop-shadow(0 3px 4px rgb(0 0 0 / .4))" }}>
          <defs>
            <linearGradient id="cl-body" x1="0" x2="1">
              <stop offset="0" stopColor="var(--accent2)" />
              <stop offset="1" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
          {/* body */}
          <rect x="5" y="2" width="22" height="30" rx="8" fill="url(#cl-body)" />
          <rect x="9" y="6" width="5" height="20" rx="2.5" fill="rgb(255 255 255 / .35)" />
          <circle cx="20" cy="9" r="2.2" fill="rgb(0 0 0 / .3)" />
          {/* blade guard */}
          <rect x="4" y="30" width="24" height="5" rx="1.5" fill="var(--ink-3)" />
          {/* blade teeth */}
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={5.2 + i * 2.5} y="35" width="1.5" height="9" rx="0.6" fill="var(--cream)" />
          ))}
        </svg>
      </motion.div>
    </motion.div>
  );
}
