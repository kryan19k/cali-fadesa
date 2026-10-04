"use client";
import { useSyncExternalStore } from "react";

// Each shade = accent + analogous partner + complementary "counter" (color-theory trio).
// Swatches show the dark-mode values; globals.css re-tunes each for light mode.
export const shades = [
  { id: "classic", name: "Classic Red", accent: "#e63946", accent2: "#ff7b82", counter: "#3a86ff" },
  { id: "royal", name: "Royal Blue", accent: "#3a86ff", accent2: "#8ec0ff", counter: "#ff4d5a" },
  { id: "cali", name: "Cali Orange", accent: "#ff8a3d", accent2: "#ffc08a", counter: "#2ec4b6" },
  { id: "gold", name: "Gold", accent: "#d4a94a", accent2: "#f0d58c", counter: "#e63946" },
  { id: "chrome", name: "Chrome", accent: "#c9ced6", accent2: "#f4f6f8", counter: "#e63946" },
] as const;
export type ShadeId = (typeof shades)[number]["id"];
export type Theme = "light" | "dark";

const SHADE_KEY = "cali-shade";
const THEME_KEY = "cali-theme";

function makeStore<T extends string>(key: string, attr: "shade" | "theme", valid: (v: string) => boolean, fallback: T) {
  const listeners = new Set<() => void>();
  let current: T | null = null;
  const read = (): T => {
    try {
      const v = localStorage.getItem(key);
      if (v && valid(v)) return v as T;
    } catch {}
    // Otherwise whatever the server stamped on <html> (the owner's chosen default).
    const d = document.documentElement.dataset[attr];
    return (d && valid(d) ? d : fallback) as T;
  };
  return {
    get: () => (current ??= read()),
    set(v: T) {
      current = v;
      document.documentElement.dataset[attr] = v;
      try {
        localStorage.setItem(key, v);
      } catch {}
      listeners.forEach((l) => l());
    },
    subscribe(cb: () => void) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    fallback,
  };
}

const shadeStore = makeStore<ShadeId>(SHADE_KEY, "shade", (v) => shades.some((s) => s.id === v), "classic");
const themeStore = makeStore<Theme>(THEME_KEY, "theme", (v) => v === "light" || v === "dark", "dark");

export const setShade = shadeStore.set;
export const setTheme = themeStore.set;
export const useShade = () => useSyncExternalStore(shadeStore.subscribe, shadeStore.get, () => "classic" as ShadeId);
export const useTheme = () => useSyncExternalStore(themeStore.subscribe, themeStore.get, () => "dark" as Theme);

// Runs in <head> before paint so a returning visitor never flashes the wrong shade/theme.
export const bootScript = `try{var d=document.documentElement,s=localStorage.getItem("${SHADE_KEY}"),t=localStorage.getItem("${THEME_KEY}");if(s)d.dataset.shade=s;if(t)d.dataset.theme=t}catch(e){}`;
