// PhyrexianText — rendert lateinischen Text in selbstgebauten Phyrexian-Glyphen (SVG).
// HORIZONTALE Orientierung wie auf der Karte: das "Rueckgrat" jeder Glyphe ist eine
// waagerechte Grundlinie (y=40), die ueber die volle Breite laeuft. Aneinandergereiht
// ergeben die Glyphen EINE durchgehende horizontale Linie; die Merkmale (Kaemme,
// Kreuze, Sterne, Beine) haengen darueber/darunter.
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

// Waagerechte Grundlinie, ueber beide Raender hinausgezogen (-6..86) -> benachbarte
// Glyphen ueberlappen minimal und bilden EINE nahtlose durchgehende Linie.
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
    {X}
    <Star x={60} y={14} />
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
      className="phyrexian-glyph"
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

// Rendert einen ganzen String; Nicht-Buchstaben (Space, Satzzeichen) = Wortabstand.
export default function PhyrexianText({ text, className = "" }) {
  const chars = [...text]
  return (
    <span className={`phyrexian ${className}`} role="img" aria-label="Abgefangene Nachricht in unbekannter Schrift">
      {chars.map((ch, i) => {
        if (!/[a-z]/i.test(ch)) return <span key={i} className="phyrexian-space" />
        return <Glyph key={i} ch={ch} />
      })}
    </span>
  )
}
