// Phyrexian-Mode: "off" (default) | "on". Persistiert in localStorage,
// gesetzt als data-phyrexian auf <html>. Wenn "on", rendern <T>-Texte
// als Phyrexian-Glyphen statt als deutschen Klartext.

const KEY = "erdbaeren-phyrexian";

export function getInitialPhyrexian() {
  if (typeof window === "undefined") return "off";
  return localStorage.getItem(KEY) === "on" ? "on" : "off";
}

export function applyPhyrexian(mode) {
  document.documentElement.setAttribute("data-phyrexian", mode);
  localStorage.setItem(KEY, mode);
}

export function togglePhyrexian() {
  const next = getInitialPhyrexian() === "on" ? "off" : "on";
  applyPhyrexian(next);
  return next;
}
