"use client";
import { useClientValue } from "./client-value";
import { dateKey, formatTime, nextAvailable, parseDateKey } from "./availability";
import { useSlotOpts } from "./use-slots";
import { useT, useLocale, intlTag, type TFn } from "./locale";

function nextLabel(opts: Parameters<typeof nextAvailable>[2], t: TFn, tag: string) {
  const now = new Date();
  const n = nextAvailable(now, 60, opts);
  if (!n) return "";
  const d = parseDateKey(n.key);
  const day = n.key === dateKey(now) ? t("common.today") : d.toLocaleDateString(tag, { weekday: "short" });
  return `${day} ${formatTime(n.time)}`;
}

/** "Tue 9:30 am": the next open slot, computed on the client (empty string on the server). */
export function useNextLabel() {
  const opts = useSlotOpts();
  const t = useT();
  const tag = intlTag(useLocale());
  return useClientValue(() => nextLabel(opts, t, tag), "");
}
