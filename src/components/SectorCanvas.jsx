import { useEffect, useRef } from "react";

export default function SectorCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W, H, DPR;
    let raf = 0;
    let visible = false;
    const mouse = { x: -9999, y: -9999 };
    let sectorRects = [];
    let starBGs = [];
    let hoveredSector = null;
    let t = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    const hitSector = (x, y) => {
      for (let i = sectorRects.length - 1; i >= 0; i--) {
        const s = sectorRects[i];
        const dx = x - s.x;
        const dy = y - s.y;
        if (dx * dx + dy * dy <= s.r * s.r) return s;
      }
      return null;
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      hoveredSector = hitSector(mouse.x, mouse.y);
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hoveredSector = null;
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

      starBGs = picks.map((pt) => {
        const pts = [];
        const n = 18;
        const palette = [
          { c: "0,220,220", a: 1.0 },
          { c: "255,255,255", a: 0.95 },
          { c: "80,160,255", a: 0.95 },
          { c: "120,80,255", a: 0.95 },
        ];
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
          });
        }
        return { x: pt.x, y: pt.y, name: pt.name, stars: pts, fog: pt.fog || null };
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      for (const group of starBGs) {
        const isHovered = group === hoveredSector;

        if (group.fog) {
          const fog = ctx.createRadialGradient(group.x, group.y, group.fog.r * 0.05, group.x, group.y, group.fog.r);
          const fogA = isHovered ? Math.min(1, group.fog.a * 1.8) : group.fog.a;
          fog.addColorStop(0, `rgba(${group.fog.c},${fogA.toFixed(3)})`);
          fog.addColorStop(1, `rgba(${group.fog.c},0)`);
          ctx.beginPath();
          ctx.fillStyle = fog;
          ctx.arc(group.x, group.y, group.fog.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (const s of group.stars) {
          const wave = Math.sin(t * s.tw + s.ph);
          const a = isHovered ? Math.min(1, s.a * (0.35 + 0.65 * ((wave + 1) / 2)) * 1.6) : s.a * (0.35 + 0.65 * ((wave + 1) / 2));
          const r = isHovered ? s.r * 1.25 : s.r * (0.8 + 0.2 * ((wave + 1) / 2));
          ctx.beginPath();
          ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
          ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
          ctx.fill();
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

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto"
      style={{ zIndex: 3, cursor: "crosshair" }}
      aria-hidden="true"
    />
  );
}
