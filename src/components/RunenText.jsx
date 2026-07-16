import { useLang } from "./RunenContext"

// RunenText — rendert lateinischen Text in selbstgebauten Runen-Glyphen (SVG).
// HORIZONTALE Orientierung: das "Rückgrat" jeder Glyphe ist eine waagerechte
// Grundlinie (y=40), die über die volle Breite läuft. Aneinandergereiht ergeben
// die Glyphen EINE durchgehende horizontale Linie; Merkmale hängen darüber/darunter.
//
// Grundformen (aus dem Alphabet-Key, um 90 Grad gedreht):
//   Vokale a e i o u  -> Grundlinie + 3 Zinken nach unten ("Kamm")
//   m                 -> Grundlinie + 1 senkrechter Kreuzstrich
//   n                 -> Grundlinie + Kreuzstrich + diagonales Bein
//   j l r w           -> Grundlinie + diagonales Bein
//   b d h p t v c     -> Grundlinie + X (straddelt die Linie)
//   f s x z y         -> X + Stern
//   g                 -> Grundlinie + X unterhalb
//   k q               -> X + Stern

// Vier-Zack-Stern (symmetrisch)
function Star({ x, y, r = 7 }) {
  return (
    <>
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x} y1={y - r} x2={x} y2={y + r} />
      <line x1={x - r * 0.6} y1={y - r * 0.6} x2={x + r * 0.6} y2={y + r * 0.6} />
      <line x1={x - r * 0.6} y1={y + r * 0.6} x2={x + r * 0.6} y2={y - r * 0.6} />
    </>
  )
}

// Waagerechte Grundlinie, über beide Ränder hinaus (-6..86) → benachbarte
// Glyphen überlappen minimal und bilden EINE nahtlose durchgehende Linie.
const BASE = <line x1="-6" y1="40" x2="86" y2="40" />
const X = (
  <>
    {BASE}
    <line x1="24" y1="16" x2="56" y2="64" />
    <line x1="56" y1="16" x2="24" y2="64" />
  </>
)
const X_LOW = (
  <>
    {BASE}
    <line x1="28" y1="40" x2="56" y2="70" />
    <line x1="56" y1="40" x2="28" y2="70" />
  </>
)
const COMB = (
  <>
    {BASE}
    <line x1="16" y1="40" x2="16" y2="70" />
    <line x1="40" y1="40" x2="40" y2="70" />
    <line x1="64" y1="40" x2="64" y2="70" />
  </>
)
const LEG = (
  <>
    {BASE}
    <line x1="30" y1="40" x2="58" y2="70" />
  </>
)
const PLUS = (
  <>
    {BASE}
    <line x1="40" y1="14" x2="40" y2="58" />
  </>
)
const NGLYPH = (
  <>
    {BASE}
    <line x1="26" y1="14" x2="26" y2="58" />
    <line x1="40" y1="40" x2="64" y2="68" />
  </>
)
const STARX = (
  <>
    {BASE}
    <circle cx="40" cy="40" r="22" />
  </>
)
const GGLYPH = (
  <>
    {BASE}
    {X_LOW}
  </>
)
const KQ = (
  <>
    {X}
    <Star x={44} y={40} />
  </>
)

const GLYPHS = {
  a: COMB, e: COMB, i: COMB, o: COMB, u: COMB, y: STARX,
  m: PLUS, n: NGLYPH,
  j: LEG, l: LEG, r: LEG, w: LEG,
  b: X, d: X, h: X, p: X, t: X, v: X, c: X,
  f: STARX, s: STARX, x: STARX, z: STARX,
  g: GGLYPH, k: KQ, q: KQ,
}

function Glyph({ ch }) {
  const g = GLYPHS[ch.toLowerCase()]
  if (!g) return null
  return (
    <svg
      viewBox="0 0 80 80"
      className="runen-glyph"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    >
      {g}
    </svg>
  )
}

// Normalisiert deutsche Sonderzeichen + Großbuchstaben für den Glyphen-Atlas.
// ä->ae, ö->oe, ü->ue, ß->ss, A-Z->a-z. Nicht-Buchstaben = Wortabstand.
function normalize(ch) {
  const map = { ä: "ae", ö: "oe", ü: "ue", ß: "ss", " ": " " }
  if (map[ch] !== undefined) return map[ch]
  return ch.toLowerCase()
}

// Rendert einen ganzen String; Nicht-Buchstaben (Space, Satzzeichen) = Wortabstand.
export default function RunenText({ text, className = "" }) {
  const chars = [...text].flatMap((ch) => [...normalize(ch)])
  return (
    <span className={`runen ${className}`} role="img" aria-label="Abgefangene Nachricht in unbekannter Schrift">
      {chars.map((ch, i) => {
        if (!/[a-z]/i.test(ch)) return <span key={i} className="runen-space" />
        return <Glyph key={i} ch={ch} />
      })}
    </span>
  )
}

// <T> — Text-Wrapper: im Runes-Mode als Glyphen, im EN-Mode englisch,
// sonst (DE) als deutscher Klartext. Gebrauch:
//   <T en="The old rulers meet the upheaval">Wenn die alten Herrscher auf den Umbruch treffen</T>
export function T({ children, en, className = "" }) {
  const text = typeof children === "string" ? children : String(children);
  const { mode } = useLang();
  if (mode === "runes") return <RunenText text={text} className={className} />;
  if (mode === "en" && en) return <span className={className}>{en}</span>;
  return <span className={className}>{text}</span>;
}
