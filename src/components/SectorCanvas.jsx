import { useState, useEffect } from "react";

const SECTORS = [
  {
    id: "SEKTOR01",
    label: "SEKTOR 01",
    subtitle: "Nebelregion · Chrom-Frakturen",
    xPct: 0.76,
    yPct: 0.18,
    glow: "rgba(192, 38, 211, 0.12)",
    text: "#e879f9",
    starTints: [
      [210, 150, 255],
      [225, 180, 255],
      [180, 120, 220],
    ],
    nebula: [
      "radial-gradient(circle at 30% 35%, rgba(192,38,211,0.24) 0%, transparent 58%)",
      "radial-gradient(circle at 65% 60%, rgba(124,58,237,0.20) 0%, transparent 55%)",
      "radial-gradient(circle at 50% 50%, rgba(192,38,211,0.12) 0%, transparent 75%)",
    ],
    planets: [
      { x: 100, y: 90, r: 7, c: "#c084fc" },
      { x: 130, y: 150, r: 5, c: "#e879f9" },
    ],
  },
  {
    id: "SEKTOR02",
    label: "SEKTOR 02",
    subtitle: "Eiskristall · Ikosa-Nebel",
    xPct: 0.22,
    yPct: 0.55,
    glow: "rgba(34, 211, 238, 0.12)",
    text: "#a5f3fc",
    starTints: [
      [140, 225, 255],
      [180, 240, 255],
      [255, 255, 255],
    ],
    nebula: [
      "radial-gradient(circle at 35% 40%, rgba(34,211,238,0.22) 0%, transparent 58%)",
      "radial-gradient(circle at 65% 60%, rgba(6,182,212,0.18) 0%, transparent 55%)",
      "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.10) 0%, transparent 75%)",
    ],
    planets: [
      { x: 120, y: 100, r: 6, c: "#67e8f9" },
      { x: 150, y: 170, r: 9, c: "#a5f3fc" },
      { x: 170, y: 140, r: 4, c: "#cffafe" },
    ],
  },
  {
    id: "SEKTOR03",
    label: "SEKTOR 03",
    subtitle: "Jade-Schatten · Ur-Wolke",
    xPct: 0.12,
    yPct: 0.22,
    glow: "rgba(45, 212, 191, 0.12)",
    text: "#99f6e4",
    starTints: [
      [180, 240, 220],
      [200, 255, 245],
      [255, 255, 255],
    ],
    nebula: [
      "radial-gradient(circle at 35% 40%, rgba(45,212,191,0.22) 0%, transparent 58%)",
      "radial-gradient(circle at 65% 60%, rgba(20,184,166,0.18) 0%, transparent 55%)",
      "radial-gradient(circle at 50% 50%, rgba(45,212,191,0.10) 0%, transparent 75%)",
    ],
    planets: [
      { x: 110, y: 100, r: 6, c: "#5eead4" },
      { x: 140, y: 170, r: 8, c: "#99f6e4" },
    ],
  },
];

const STAR_COUNT = 110;
const STAR_SPREAD = 40;
const BASE = 0.45;
const RADIUS = 140;

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function makeSectorStars(sec) {
  const tints = sec.starTints;
  return Array.from({ length: STAR_COUNT }, () => {
    const ang = Math.random() * Math.PI * 2;
    const rad = Math.abs(rand(-1, 1)) * STAR_SPREAD + rand(0, 8);
    const tint = tints[(Math.random() * tints.length) | 0];
    const size = rand(0.6, 1.8) * rand(0.8, 1.3);
    const baseA = rand(0.35, 0.7);
    const tw = rand(0.25, 0.55);
    const phase = Math.random() * Math.PI * 2;
    const bg = tint.map((v) => Math.round(v * rand(0.85, 1.0))).join(",");
    const x = RADIUS + Math.cos(ang) * rad;
    const y = RADIUS + Math.sin(ang) * rad;
    return { x, y, size, baseA, tw, phase, bg };
  });
}

function twinkle(star, t) {
  const wave = Math.sin(t * star.tw + star.phase);
  const a = Math.max(0.2, Math.min(1, star.baseA + wave * 0.35));
  const r = Math.max(0.4, star.size * (0.85 + 0.15 * wave));
  return { a, r };
}

export default function SectorCanvas() {
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);
  const sectors = SECTORS.map((sec) => ({
    sec,
    stars: makeSectorStars(sec),
  }));

  useEffect(() => {
    let raf;
    let last = 0;
    const step = (now) => {
      const dt = now - last || 0;
      if (dt >= 50) {
        setTick((n) => n + 1);
        last = now;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const t = tick * 0.5;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{``}</style>
      {sectors.map(({ sec, stars }) => {
        const isHovered = hovered === sec.id;
        const scale = isHovered ? 1.45 : 1;

        return (
          <div
            key={sec.id}
            className="absolute pointer-events-auto cursor-pointer overflow-visible"
            style={{
              left: `${sec.xPct * 100}%`,
              top: `${sec.yPct * 100}%`,
              width: 280,
              height: 280,
              transform: `translate(-50%, -50%) scale(${scale})`,
              zIndex: 10,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            onMouseEnter={() => setHovered(sec.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="absolute inset-0 rounded-full will-change-transform"
              style={{
                background: sec.nebula.join(", "),
                opacity: isHovered ? 0.96 : 0.35,
                transform: isHovered ? "scale(1.12)" : "scale(1)",
                transition: "opacity 2.4s ease, transform 2.4s ease",
              }}
            />

            <div className="absolute inset-0">
              {stars.map((s, i) => {
                const { a, r } = twinkle(s, t);
                return (
                  <span
                    key={`${sec.id}-s-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: s.x,
                      top: s.y,
                      width: r * 2,
                      height: r * 2,
                      margin: `-${r}px 0 0 -${r}px`,
                      background: `rgba(${s.bg},${a.toFixed(3)})`,
                      boxShadow: r > 1.1 ? `0 0 ${r * 1.6}px rgba(${s.bg},${(a * 0.5).toFixed(3)})` : "none",
                    }}
                  />
                );
              })}
            </div>

            <div className="absolute inset-0">
              {(sec.planets || []).map((p, i) => (
                <span
                  key={`${sec.id}-p-${i}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.r * 2,
                    height: p.r * 2,
                    margin: `-${p.r}px 0 0 -${p.r}px`,
                    background: `radial-gradient(circle at 35% 30%, ${p.c} 0%, rgba(0,0,0,0.35) 100%)`,
                    boxShadow: `inset -${p.r * 0.4}px -${p.r * 0.3}px ${p.r * 0.6}px rgba(0,0,0,0.45), 0 0 ${p.r * 1.2}px ${p.c}44`,
                  }}
                />
              ))}
            </div>

            <div
              className="absolute left-2.5 top-2.5 transition-all duration-500 pointer-events-none"
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateY(0)" : "translateY(-4px)",
              }}
            >
              <div className="mono-label text-[11px] tracking-widest leading-tight" style={{ color: sec.text, textShadow: `0 0 10px ${sec.glow}` }}>
                {sec.label}
              </div>
              <div className="mono-label text-[10px] mt-0.5 leading-tight" style={{ color: sec.text, opacity: 0.85, maxWidth: 160 }}>
                {sec.subtitle}
              </div>
            </div>

            {isHovered && (
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -6,
                  zIndex: 20,
                  boxShadow: "inset 0 0 18px rgba(255,255,255,0.06), 0 0 22px rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
