// Sprach-/Schrift-Modus der Seite. Drei Zustände, die der Button zyklisch durchschaltet:
//   "de"    (default) — deutscher Klartext
//   "en"               — englischer Klartext
//   "runes"            — Runenschrift (Phyrexian-Glyphen)
// Persistiert in localStorage; als data-lang auf <html> für CSS-Regeln.

const KEY = "erdbaeren-lang";

// Zyklen-Reihenfolge: DE -> EN -> RUNES -> DE ...
export const MODE_ORDER = ["de", "en", "runes"];

export function getInitialLang() {
  if (typeof window === "undefined") return "de";
  const v = localStorage.getItem(KEY);
  return MODE_ORDER.includes(v) ? v : "de";
}

export function applyLang(mode) {
  document.documentElement.setAttribute("data-lang", mode);
  localStorage.setItem(KEY, mode);
}

// Nächster Modus im Zyklus; gibt ihn zurück (und persistiert bereits).
export function cycleLang() {
  const cur = getInitialLang();
  const next = MODE_ORDER[(MODE_ORDER.indexOf(cur) + 1) % MODE_ORDER.length];
  applyLang(next);
  return next;
}
