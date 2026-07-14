// Public-Asset-Helfer: hängt den Vite-base-Pfad (z.B. /ErdBaeren/) voran,
// damit Bilder unter github.io/ErdBaeren/ nicht 404en.
export function asset(path) {
  const base = import.meta.env.BASE_URL || "/"
  const clean = path.replace(/^\/+/, "")
  return base.endsWith("/") ? base + clean : base + "/" + clean
}
