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
    let hoveredSector = null;
    let starBGs = [];
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

    const updateHover = () => {
      hoveredSector = hitSector(mouse.x, mouse.y);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      updateHover();
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      hoveredSector = null;
    };

    const onClick = () => {};

    const drawHoverLabel = (text, x, y) => {
      ctx.save();
      ctx.font = 'bold 13px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = '#ff2255';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelY = y - 62;
      ctx.fillText(text, x, labelY);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,34,85,0.45)';
      ctx.lineWidth = 1;
      ctx.moveTo(x, labelY + 14);
      ctx.lineTo(x, y + 6);
      ctx.stroke();
      ctx.restore();
    };

    function build() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const cellSize = 72;
      const picks = [
        { x: W * 0.75, y: H * 0.18, name: "SEKTOR01", fog: { c: "180,210,255", a: 0.16, r: cellSize * 1.55 } },
        { x: W * 0.06, y: H * 0.86, name: "SEKTOR02", fog: { c: "210,180,255", a: 0.14, r: cellSize * 1.35 } },
        { x: W * 0.16, y: H * 0.30, name: "SEKTOR03", fog: { c: "160,220,240", a: 0.14, r: cellSize * 1.4 } },
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

      for (let i = 0; i < sectorRects.length; i++) {
        const pt = sectorRects[i];
        const group = starBGs[i];
        const isHovered = hoveredSector && hoveredSector.name === pt.name;
        const isDimmed = hoveredSector && !isHovered;

        if (pt.fog) {
          const fog = ctx.createRadialGradient(pt.x, pt.y, pt.fog.r * 0.05, pt.x, pt.y, pt.fog.r);
          fog.addColorStop(0, `rgba(${pt.fog.c},${pt.fog.a.toFixed(3)})`);
          fog.addColorStop(1, `rgba(${pt.fog.c},0)`);
          ctx.save();
          ctx.globalCompositeOperation = "screen";
          ctx.beginPath();
          ctx.fillStyle = fog;
          ctx.arc(pt.x, pt.y, pt.fog.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (isHovered && pt.fog) {
          const fog = ctx.createRadialGradient(pt.x, pt.y, pt.fog.r * 0.05, pt.x, pt.y, pt.fog.r);
          fog.addColorStop(0, `rgba(${pt.fog.c},${(pt.fog.a * 1.8).toFixed(3)})`);
          fog.addColorStop(1, `rgba(${pt.fog.c},0)`);
          ctx.beginPath();
          ctx.fillStyle = fog;
          ctx.arc(pt.x, pt.y, pt.fog.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${pt.fog.c},${(pt.fog.a * 1.6).toFixed(3)})`;
          ctx.lineWidth = 1.8;
          ctx.arc(pt.x, pt.y, pt.fog.r * 1.1, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${pt.fog.c},${(pt.fog.a * 0.6).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.arc(pt.x, pt.y, pt.fog.r * 1.35 + 8 * Math.sin(t * 3), 0, Math.PI * 2);
          ctx.stroke();
        }

        if (!group) continue;
        for (const s of group.stars) {
          const wave = Math.sin(t * s.tw + s.ph);
          let a = s.a * (0.35 + 0.65 * ((wave + 1) / 2));
          let r = s.r * (0.8 + 0.2 * ((wave + 1) / 2));
          let sx = s.x;
          let sy = s.y;
          if (isHovered) {
            a = Math.min(1, a * 1.8);
            r *= 2;
            sx = group.x + (s.x - group.x) * 2;
            sy = group.y + (s.y - group.y) * 2;
          } else if (isDimmed) {
            a *= 0.45;
          }
          ctx.beginPath();
          ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
        }

        if (isHovered) {
          drawHoverLabel(group.name, group.x, group.y);
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

    canvas.addEventListener("mousemove", () => {
      canvas.style.cursor = hoveredSector ? "pointer" : "crosshair";
    });

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
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
