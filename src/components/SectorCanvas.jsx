import { useMemo, useState, useEffect } from "react";

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
      "radial-gradient(circle at 35% 40%, rgba(192,38,211,0.18) 0%, transparent 60%)",
      "radial-gradient(circle at 65% 60%, rgba(124,58,237,0.15) 0%, transparent 55%)",
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
      "radial-gradient(circle at 35% 40%, rgba(34,211,238,0.18) 0%, transparent 60%)",
      "radial-gradient(circle at 65% 60%, rgba(6,182,212,0.15) 0%, transparent 55%)",
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
      "radial-gradient(circle at 35% 40%, rgba(45,212,191,0.18) 0%, transparent 60%)",
      "radial-gradient(circle at 65% 60%, rgba(20,184,166,0.15) 0%, transparent 55%)",
    ],
  },
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function makeStars(count, tints, spread = 60) {
  return Array.from({ length: count }, () => {
    const ang = Math.random() * Math.PI * 2;
    const rad = Math.abs(rand(-1, 1)) * spread + rand(0, 8);
    const tint = tints[(Math.random() * tints.length) | 0];
    const scale = rand(0.6, 1.3);
    const r = rand(0.6, 1.8) * scale;
    const tinted = tint.map((v) => Math.round(v * rand(0.85, 1.0))).join(",");
    const baseA = rand(0.4, 0.75).toFixed(3);
    return {
      x: Math.cos(ang) * rad,
      y: Math.sin(ang) * rad,
      r,
      baseA: parseFloat(baseA),
      aMin: rand(0.2, 0.55),
      aMax: rand(0.75, 1.0),
      tw: rand(0.6, 1.2),
      ph: Math.random() * Math.PI * 2,
      style: {
        left: 140 + Math.cos(ang) * rad,
        top: 140 + Math.sin(ang) * rad,
        width: r * 2,
        height: r * 2,
        margin: `-${r}px 0 0 -${r}px`,
        background: `rgba(${tinted},${baseA})`,
        boxShadow: r > 1.1 ? `0 0 ${r * 1.8}px rgba(${tinted},0.5)` : "none",
      },
      tinted,
    };
  });
}

export default function SectorCanvas() {
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);
  const groups = useMemo(() => SECTORS.map((s) => makeStars(110, s.starTints)), []);

  useEffect(() => {
    let raf;
    const step = () => {
      setTick((n) => n + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const t = tick / 60;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {SECTORS.map((sec, idx) => {
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
                opacity: isHovered ? 0.95 : 0.35,
                transform: isHovered ? "scale(1.12)" : "scale(1)",
                transition: "opacity 2.4s ease, transform 2.4s ease",
              }}
            />

            <div className="absolute inset-0">
              {groups[idx].map((s, i) => {
                const wave = Math.sin(t * s.tw + s.ph);
                const a = s.baseA + wave * (s.aMax - s.baseA);
                const r = s.r * (0.88 + 0.12 * wave);
                return (
                  <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: 140 + s.x,
                      top: 140 + s.y,
                      width: r * 2,
                      height: r * 2,
                      margin: `-${r}px 0 0 -${r}px`,
                      background: `rgba(${s.tinted},${a.toFixed(3)})`,
                      boxShadow: a > 0.5 ? `0 0 ${r * 1.8}px rgba(${s.tinted},${(a * 0.5).toFixed(3)})` : "none",
                    }}
                  />
                );
              })}
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
