// Theme: "dark" (default) | "light". Persistiert in localStorage,
// gesetzt als data-theme auf <html>. Overlays (scanlines/crt/grain)
// sind nur im Dark Mode aktiv (siehe index.css [data-theme="light"]).

const KEY = "erdbaeren-theme";

export function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(KEY);
  return saved === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  const el = document.documentElement;
  el.setAttribute("data-theme", theme);
  el.classList.toggle("dark", theme === "dark");
  // Overlays nur im Dark Mode
  ["scanlines", "crt-vignette", "grain"].forEach((c) =>
    el.classList.toggle(c, theme === "dark")
  );
  localStorage.setItem(KEY, theme);
}

export function toggleTheme() {
  const next = getInitialTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
