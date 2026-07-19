import { useEffect, useState } from "react";

const SECTORS = [
  {
    name: "SEKTOR01",
    left: "62%",
    top: "18%",
    fog: "rgba(180,210,255,0.16)",
    ring: "rgba(180,210,255,0.45)",
  },
  {
    name: "SEKTOR02",
    left: "6%",
    top: "72%",
    fog: "rgba(210,180,255,0.14)",
    ring: "rgba(210,180,255,0.4)",
  },
  {
    name: "SEKTOR03",
    left: "6%",
    top: "8%",
    fog: "rgba(160,220,240,0.14)",
    ring: "rgba(160,220,240,0.4)",
  },
];

export default function SectorCanvas() {
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const onMove = (e) => {
      const hero = document.querySelector(".hero-holo") || document.body;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      let hit = null;
      for (const s of SECTORS) {
        const cx = parseFloat(s.left) / 100 * rect.width;
        const cy = parseFloat(s.top) / 100 * rect.height;
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= 90000) hit = s.name;
      }
      setHovered(hit);
    };
    const onLeave = () => setHovered(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 3, pointerEvents: "none" }}
      aria-hidden="true"
    >
      {SECTORS.map((s) => {
        const active = hovered === s.name;
        return (
          <div
            key={s.name}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              transform: "translate(-50%, -50%)",
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${s.fog} 0%, transparent 70%)`,
              border: active ? `2px solid ${s.ring}` : "1px solid transparent",
              boxShadow: active ? `0 0 40px ${s.ring}` : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              pointerEvents: "auto",
              cursor: "crosshair",
            }}
            title={s.name}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  top: -28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.75)",
                  color: "#fff",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {s.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
