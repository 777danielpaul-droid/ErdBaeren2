import { useEffect, useRef, useState } from "react";
import { useTimeline } from "./TimelineProvider";

export default function SectorCanvas() {
  const canvasRef = useRef(null);
  const { phase } = useTimeline();
  const [activeSector, setActiveSector] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars = [];
    let meteors = [];
    let ship = null;
    let planets = [];
    let starBGs = [];
    let W, H, DPR;
    let raf = 0;
    let visible = false;
    const mouse = { x: -9999, y: -9999 };
    let hoveredSector = null;
    let sectorRects = [];
    let t = 0;
    let dx = 0;

    const scopeTarget = { x: 0, y: 0, r: 1, a: 1 };
    const scopeCur = { x: 0, y: 0, r: 1, a: 1 };

    function rand(a, b) { return a + Math.random() * (b - a); }

    const hitSector = (x, y) => {
      for (let i = sectorRects.length - 1; i >= 0; i--) {
        const s = sectorRects[i];
        const ddx = x - s.x;
        const ddy = y - s.y;
        if (ddx * ddx + ddy * ddy <= s.r * s.r) return s;
      }
      return null;
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      hoveredSector = hitSector(x, y);
      mouse.x = x;
      mouse.y = y;
      canvas.style.cursor = hoveredSector ? "pointer" : "crosshair";
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hoveredSector = null;
      canvas.style.cursor = "crosshair";
    };

    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const s = hitSector(x, y);
      setActiveSector((cur) => (cur && cur.name === s?.name ? null : s));
    };

    function build() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const cellSize = 72;
      const picks = [
        { x: W * 0.75, y: H * 0.18, name: "SEKTOR01", fog: { c: "180,210,255", a: 0.16, r: cellSize * 1.55 } },
        { x: W * 0.06, y: H * 0.86, name: "SEKTOR02", fog: { c: "210,180,255", a: 0.14, r: cellSize * 1.35 } },
        { x: W * 0.82, y: H * 0.72, name: "SEKTOR03", fog: { c: "160,220,240", a: 0.14, r: cellSize * 1.4 } },
      ];

      sectorRects = picks.map((pt) => ({
        x: pt.x,
        y: pt.y,
        name: pt.name,
        r: pt.fog ? pt.fog.r : cellSize,
        fog: pt.fog || null,
      }));

      starBGs = [];
      const palette = [
        { c: "0,220,220", a: 1.0 },
        { c: "255,255,255", a: 0.95 },
        { c: "80,160,255", a: 0.95 },
        { c: "120,80,255", a: 0.95 },
      ];

      picks.forEach((pt) => {
        const pts = [];
        const n = 18;
        for (let i = 0; i < n; i++) {
          const ang = rand(0, Math.PI * 2);
          const radX = Math.abs(rand(0, 1)) * cellSize * 0.75;
          const radY = Math.abs(rand(0, 1)) * cellSize * 0.42;
          const base = palette[i % palette.length];
          pts.push({
            x: pt.x + Math.cos(ang) * radX,
            y: pt.y + Math.sin(ang) * radY,
            r: rand(2.2, 4.0),
            a: base.a,
            tw: rand(1.0, 2.2),
            ph: Math.random() * Math.PI * 2,
            c: base.c,
            palette,
          });
        }
        starBGs.push({ x: pt.x, y: pt.y, name: pt.name, stars: pts, fog: pt.fog || null });
      });

      // meteors and ship are rendered in MilkyWayBackground now;
      // these placeholders keep SectorCanvas self-contained without duplicating logic.
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;
      dx = (dx + 0.18) % W;

      const activeHovered = hoveredSector || activeSector;

      if (activeHovered) {
        scopeTarget.x = activeHovered.x;
        scopeTarget.y = activeHovered.y;
        scopeTarget.r = activeHovered.fog?.r || 90;
        scopeTarget.a = 1;
      } else {
        scopeTarget.x = -9999;
        scopeTarget.y = -9999;
        scopeTarget.r = 1;
        scopeTarget.a = 0;
      }

      const k = 1 - Math.exp(-10 * 0.016);
      scopeCur.x += (scopeTarget.x - scopeCur.x) * k;
      scopeCur.y += (scopeTarget.y - scopeCur.y) * k;
      scopeCur.r += (scopeTarget.r - scopeCur.r) * k;
      scopeCur.a += (scopeTarget.a - scopeCur.a) * k;

      for (const group of starBGs) {
        if (group.fog && phase >= 6) {
          const fg = ctx.createRadialGradient(group.x, group.y, group.fog.r * 0.15, group.x, group.y, group.fog.r);
          fg.addColorStop(0, `rgba(${group.fog.c},${group.fog.a})`);
          fg.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.fillStyle = fg;
          ctx.arc(group.x, group.y, group.fog.r, 0, Math.PI * 2);
          ctx.fill();
        }

        const isHovered = group === hoveredSector;
        const isActive = group === activeSector;
        const highlighted = isHovered || isActive;
        const dimFactor = activeHovered && !highlighted ? 0.28 : 1;

        if (highlighted) {
          ctx.save();
          ctx.globalAlpha = 0.18 * scopeCur.a;
          ctx.beginPath();
          ctx.strokeStyle = "rgba(255,255,255,1)";
          ctx.lineWidth = 1.1;
          ctx.arc(scopeCur.x, scopeCur.y, scopeCur.r * 1.05, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        for (const s of group.stars) {
          const rawWave = Math.sin(t * s.tw + s.ph);
          const rawAlpha = s.a * (0.35 + 0.65 * ((rawWave + 1) / 2));
          const rawColorIndex = ((Math.floor(((rawWave + 1) / 2) * s.palette.length) % s.palette.length) + s.palette.length) % s.palette.length;
          const rawBase = s.palette[rawColorIndex];
          const rawR = s.r * (0.8 + 0.2 * ((rawWave + 1) / 2));

          let drawX = s.x;
          let drawY = s.y;
          let drawR = rawR;
          let drawAlpha = rawAlpha * dimFactor;

          if (highlighted) {
            const ddx = s.x - scopeCur.x;
            const ddy = s.y - scopeCur.y;
            const dist = Math.hypot(ddx, ddy) || 1;
            const falloff = Math.max(0, 1 - dist / (scopeCur.r * 1.05));
            const fisheyeK = 1 + 0.30 * falloff;
            drawX = scopeCur.x + ddx * fisheyeK;
            drawY = scopeCur.y + ddy * fisheyeK;
            drawR = rawR * (1 + 0.45 * falloff);
            drawAlpha = rawAlpha;
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(${rawBase.c},${drawAlpha.toFixed(3)})`;
          ctx.arc(drawX, drawY, drawR, 0, Math.PI * 2);
          ctx.fill();
        }

        if (highlighted && group.name && group.stars.length) {
          const tx = Math.min(...group.stars.map((s) => s.x)) - 16;
          const ty = Math.max(...group.stars.map((s) => s.y)) + 24;
          ctx.save();
          ctx.strokeStyle = "rgba(255,20,90,0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(tx + 16, ty - 24);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = "rgba(255,20,90,0.8)";
          ctx.fillText(group.name, tx, ty);
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (visible) return;
      visible = true;
      build();
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      visible = false;
      cancelAnimationFrame(raf);
    };

    start();

    const onResize = () => {
      stop();
      start();
    };
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto"
      style={{ zIndex: 3, cursor: "crosshair" }}
      aria-hidden="true"
    />
  );
}
