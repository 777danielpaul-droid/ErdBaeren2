import { useEffect, useRef } from "react";
import { useTimeline } from "./TimelineProvider";

// Milchstraße als Canvas: nur Sterne + Sternhaufen, kein Galaxie-Band mehr.
export default function MilkyWay() {
  const canvasRef = useRef(null);
  const { phase } = useTimeline();

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
    let sectorRects = [];

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
    };

    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onClick = () => {};

    function rand(a, b) { return a + Math.random() * (b - a); }

    function build() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      stars = [];
      for (let i = 0; i < 900; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(0.4, 1.0),
          a: rand(0.5, 1.0),
          tw: rand(0.8, 2.8),
          ph: Math.random() * Math.PI * 2,
          c: "245,238,255",
        });
      }
      for (let i = 0; i < 260; i++) {
        const tint = Math.random();
        const c =
          tint < 0.33
            ? "210,235,255"
            : tint < 0.66
            ? "232,215,255"
            : "255,230,200";
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(1.1, 2.1),
          a: rand(0.65, 1.0),
          tw: rand(0.9, 2.4),
          ph: Math.random() * Math.PI * 2,
          c,
        });
      }
      for (let i = 0; i < 35; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(2.2, 3.2),
          a: rand(0.8, 1.0),
          tw: rand(0.9, 2.0),
          ph: Math.random() * Math.PI * 2,
          c: "255,250,245",
        });
      }
      const clusters = [
        [W * 0.14, H * 0.26],
        [W * 0.62, H * 0.62],
        [W * 0.84, H * 0.70],
        [W * 0.40, H * 0.18],
        [W * 0.30, H * 0.80],
        [W * 0.75, H * 0.35],
      ];
      clusters.forEach(([cx, cy]) => {
        const n = 90;
        for (let i = 0; i < n; i++) {
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.abs(rand(-1, 1)) * 55;
          const x = cx + Math.cos(ang) * rad;
          const y = cy + Math.sin(ang) * rad;
          const tint = Math.random();
          const c =
            tint < 0.25
              ? "255,235,205"
              : tint < 0.5
              ? "210,240,255"
              : "255,255,255";
          stars.push({
            x,
            y,
            r: rand(0.6, 1.4),
            a: rand(0.75, 1.0),
            tw: rand(1.0, 2.6),
            ph: Math.random() * Math.PI * 2,
            c,
          });
        }
      });

      meteors = [];
      for (let i = 0; i < 14; i++) {
        meteors.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.5,
          vx: rand(-1.6, -0.6),
          vy: rand(0.3, 1.0),
          len: rand(18, 44),
          a: rand(0.35, 0.85),
          tw: rand(0.6, 1.4),
          ph: Math.random() * Math.PI * 2,
        });
      }

      ship = {
        x: Math.random() * W * 0.8 + W * 0.1,
        y: Math.random() * H * 0.3 + H * 0.1,
        vx: Math.random() < 0.5 ? rand(-0.9, -0.4) : rand(0.4, 0.9),
        size: rand(8, 13),
        a: rand(0.55, 0.85),
        tw: rand(0.5, 1.2),
        ph: Math.random() * Math.PI * 2,
        blink: rand(0.8, 2.2),
        curveAmp: rand(20, 55),
        curveFreq: rand(0.35, 0.7),
        curvePh: Math.random() * Math.PI * 2,
        jetColor: Math.random() < 0.5 ? "120,180,255" : "0,220,255",
      };

      planets = [];
      const planetDefs = [
        { x: W * 0.18, y: H * 0.15, r: 9, a: 0.35, c: "210,220,255", hasRings: true, ringTilt: 0.45 },
        { x: W * 0.78, y: H * 0.12, r: 7, a: 0.28, c: "255,255,255", hasRings: false },
        { x: W * 0.65, y: H * 0.35, r: 11, a: 0.32, c: "255,230,210", hasRings: false },
        { x: W * 0.35, y: H * 0.42, r: 8, a: 0.25, c: "245,230,210", hasRings: true, ringTilt: 0.55 },
      ];
      planetDefs.forEach((d) => {
        planets.push({
          x: d.x,
          y: d.y,
          r: d.r,
          a: d.a,
          c: d.c,
          tw: rand(0.25, 0.55),
          ph: Math.random() * Math.PI * 2,
          hasRings: d.hasRings,
          ringTilt: d.ringTilt,
        });
      });

      starBGs = [];
      const cellSize = 72;
      const gridW = Math.floor(W / cellSize)
      const gridH = Math.floor(H / cellSize)

      const candidates = []
      for (let row = 3; row < gridH - 2; row++) {
        for (let col = 1; col < gridW - 1; col++) {
          const x = col * cellSize + cellSize * 0.5
          const y = row * cellSize + cellSize * 0.5
          candidates.push({ x, y })
        }
      }

      const picks = [
        { x: W * 0.75, y: H * 0.18, name: 'SEKTOR01', fog: { c: '180,210,255', a: 0.16, r: cellSize * 1.55 } },
        { x: W * 0.06, y: H * 0.86, name: 'SEKTOR02', fog: { c: '210,180,255', a: 0.14, r: cellSize * 1.35 } },
        { x: W * 0.16, y: H * 0.30, name: 'SEKTOR03', fog: { c: '160,220,240', a: 0.14, r: cellSize * 1.4 } },
      ].filter(Boolean)

      const picked = picks

      sectorRects = picked.map((pt) => ({
        x: pt.x,
        y: pt.y,
        name: pt.name,
        r: pt.fog ? pt.fog.r : cellSize,
        fog: pt.fog || null,
      }))

      picked.forEach((pt) => {
        const pts = []
        const n = 18
        const palette = [
          { c: "0,220,220", a: 1.0 },
          { c: "255,255,255", a: 0.95 },
          { c: "80,160,255", a: 0.95 },
          { c: "120,80,255", a: 0.95 },
        ]
        for (let i = 0; i < n; i++) {
          const ang = rand(0, Math.PI * 2)
          const radX = Math.abs(rand(0, 1)) * cellSize * 0.75
          const radY = Math.abs(rand(0, 1)) * cellSize * 0.42
          const base = palette[i % palette.length]
          pts.push({
            x: pt.x + Math.cos(ang) * radX,
            y: pt.y + Math.sin(ang) * radY,
            r: rand(2.2, 4.0),
            a: base.a,
            tw: rand(1.0, 2.2),
            ph: Math.random() * Math.PI * 2,
            c: base.c,
            palette,
          })
        }
        starBGs.push({ x: pt.x, y: pt.y, name: pt.name, stars: pts, fog: pt.fog || null })
      })
    }

    let t = 0;
    let dx = 0;
    function draw() {      t += 0.016;
      dx = (dx + 0.18) % W;

      ctx.clearRect(0, 0, W, H);

      for (const group of starBGs) {
        for (const s of group.stars) {
          const wave = Math.sin(t * s.tw + s.ph);
          const a = s.a * (0.35 + 0.65 * ((wave + 1) / 2));
          const r = s.r * (0.8 + 0.2 * ((wave + 1) / 2));
          ctx.beginPath();
          ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
          ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const moonX = W * 0.10;
      const moonY = H * 0.13;
      const moonR = Math.min(W, H) * 0.065;
      const moonRX = moonR * 1.15;
      const moonRY = moonR * 0.92;

      const bodyGrad = ctx.createRadialGradient(
        moonX - moonRX * 0.25,
        moonY - moonRY * 0.25,
        moonRX * 0.05,
        moonX,
        moonY,
        moonRX
      );
      bodyGrad.addColorStop(0, "rgba(255,252,242,0.98)");
      bodyGrad.addColorStop(0.45, "rgba(250,246,230,0.94)");
      bodyGrad.addColorStop(0.78, "rgba(225,212,185,0.72)");
      bodyGrad.addColorStop(1, "rgba(160,148,125,0.45)");
      ctx.beginPath();
      ctx.fillStyle = bodyGrad;
      ctx.ellipse(moonX, moonY, moonRX, moonRY, 0, 0, Math.PI * 2);
      ctx.fill();

      const craters = [
        { dx: -0.28, dy: -0.32, rx: 0.22, ry: 0.18, d: 0.7 },
        { dx: 0.14, dy: -0.1, rx: 0.18, ry: 0.14, d: 0.55 },
        { dx: -0.12, dy: 0.28, rx: 0.2, ry: 0.17, d: 0.65 },
        { dx: 0.25, dy: 0.2, rx: 0.14, ry: 0.11, d: 0.5 },
        { dx: -0.05, dy: -0.05, rx: 0.12, ry: 0.1, d: 0.4 },
      ];
      for (const cr of craters) {
        const cx = moonX + moonRX * cr.dx;
        const cy = moonY + moonRY * cr.dy;
        const cRx = moonRX * cr.rx;
        const cRy = moonRY * cr.ry;
        const shade = ctx.createRadialGradient(
          cx + cRx * 0.3,
          cy + cRy * 0.25,
          cRx * 0.05,
          cx,
          cy,
          cRx
        );
        shade.addColorStop(0, "rgba(0,0,0,0)");
        shade.addColorStop(0.65, `rgba(0,0,0,${(cr.d * 0.18).toFixed(3)})`);
        shade.addColorStop(1, `rgba(0,0,0,${(cr.d * 0.4).toFixed(3)})`);
        ctx.beginPath();
        ctx.fillStyle = shade;
        ctx.ellipse(cx, cy, cRx, cRy, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(moonX, moonY, moonRX, moonRY, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.beginPath();
      ctx.moveTo(moonX + moonRX * 0.7, moonY - moonRY * 0.15);
      ctx.quadraticCurveTo(moonX + moonRX * 1.25, moonY - moonRY * 0.9, moonX + moonRX * 1.45, moonY - moonRY * 0.15);
      ctx.quadraticCurveTo(moonX + moonRX * 1.55, moonY + moonRY * 0.55, moonX + moonRX * 0.9, moonY + moonRY * 0.75);
      ctx.quadraticCurveTo(moonX + moonRX * 0.5, moonRY * 0.45, moonX + moonRX * 0.7, moonY - moonRY * 0.15);
      ctx.closePath();
      ctx.fillStyle = "rgba(10,10,20,0.65)";
      ctx.fill();

      const holes = [
        { dx: -0.28, dy: -0.25, r: 0.09 },
        { dx: 0.08, dy: -0.35, r: 0.07 },
        { dx: -0.18, dy: 0.32, r: 0.08 },
        { dx: 0.3, dy: 0.05, r: 0.06 },
        { dx: -0.06, dy: -0.1, r: 0.12 },
      ];
      for (const h of holes) {
        ctx.beginPath();
        ctx.arc(moonX + moonRX * h.dx, moonY + moonRY * h.dy, moonRX * h.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.38)";
        ctx.fill();
      }
      ctx.restore();

      const rim = ctx.createRadialGradient(
        moonX - moonRX * 0.35,
        moonY - moonRY * 0.35,
        moonRX * 0.05,
        moonX,
        moonY,
        moonRX
      );
      rim.addColorStop(0, "rgba(255,255,255,0.18)");
      rim.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.fillStyle = rim;
      ctx.ellipse(moonX, moonY, moonRX, moonRY, 0, 0, Math.PI * 2);
      ctx.fill();

      const sideShadow = ctx.createRadialGradient(
        moonX + moonRX * 0.4,
        moonY + moonRY * 0.1,
        moonRX * 0.05,
        moonX,
        moonY,
        moonRX * 1.05
      );
      sideShadow.addColorStop(0, "rgba(0,0,0,0)");
      sideShadow.addColorStop(0.65, "rgba(0,0,0,0.08)");
      sideShadow.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.beginPath();
      ctx.fillStyle = sideShadow;
      ctx.ellipse(moonX, moonY, moonRX, moonRY, 0, 0, Math.PI * 2);
      ctx.fill();

      for (const s of stars) {
        const wave = Math.sin(t * s.tw + s.ph);
        const a = s.a * (0.15 + 0.85 * ((wave + 1) / 2));
        const r = s.r * (0.6 + 0.4 * ((wave + 1) / 2));
        const sx = ((s.x - dx) % W + W) % W;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
        ctx.arc(sx, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of planets) {
        const wave = Math.sin(t * p.tw + p.ph);
        const pa = p.a * (0.75 + 0.25 * ((wave + 1) / 2));
        ctx.save();
        ctx.globalAlpha = pa;
        const body = ctx.createRadialGradient(
          p.x - p.r * 0.3,
          p.y - p.r * 0.3,
          p.r * 0.1,
          p.x,
          p.y,
          p.r
        );
        body.addColorStop(0, `rgba(255,255,255,0.95)`);
        body.addColorStop(0.55, `rgba(${p.c},0.82)`);
        body.addColorStop(0.78, `rgba(${p.c},0.65)`);
        body.addColorStop(1, `rgba(${p.c},0.45)`);
        ctx.beginPath();
        ctx.fillStyle = body;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (p.hasRings) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ringTilt);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${p.c},0.18)`;
          ctx.lineWidth = p.r * 0.28;
          ctx.ellipse(0, 0, p.r * 2.0, p.r * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${p.c},0.35)`;
          ctx.lineWidth = p.r * 0.12;
          ctx.ellipse(0, 0, p.r * 1.55, p.r * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }

      for (const m of meteors) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.x < -60 || m.y > H + 60) {
          m.x = W + Math.random() * 120;
          m.y = Math.random() * H * 0.4;
        }
        const a = m.a * (0.7 + 0.3 * Math.sin(t * m.tw + m.ph));
        const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.len;
        const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.len;
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(255,255,255,${a.toFixed(3)})`);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${(a * 1.2).toFixed(3)})`;
        ctx.arc(m.x, m.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (ship) {
        ship.x += ship.vx;
        if (ship.x < -90) ship.x = W + 90;
        if (ship.x > W + 90) ship.x = -90;
        const baseY = Math.sin(t * ship.curveFreq + ship.curvePh) * ship.curveAmp;
        const sy = ship.y + baseY;
        const a = ship.a * (0.8 + 0.2 * Math.sin(t * ship.tw + ship.ph));
        const pulse = 0.85 + 0.15 * Math.sin(t * ship.blink + ship.ph);
        const s = ship.size;
        ctx.save();
        ctx.translate(ship.x, sy);
        if (ship.vx < 0) {
          ctx.scale(1, pulse);
        } else {
          ctx.scale(-1, -pulse);
        }
        ctx.beginPath();
        ctx.moveTo(-s * 1.4, 0);
        ctx.lineTo(s * 0.2, -s * 0.55);
        ctx.lineTo(s * 0.05, 0);
        ctx.lineTo(s * 0.2, s * 0.55);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.fill();
        const jetLen = s * 3;
        const jetGrad = ctx.createLinearGradient(s * 0.15, 0, s * 0.15 + jetLen, 0);
        jetGrad.addColorStop(0, `rgba(${ship.jetColor},${(a * 0.95).toFixed(3)})`);
        jetGrad.addColorStop(0.4, `rgba(${ship.jetColor},${(a * 0.6).toFixed(3)})`);
        jetGrad.addColorStop(1, `rgba(${ship.jetColor},0)`);
        ctx.beginPath();
        ctx.moveTo(s * 0.15, -s * 0.35);
        ctx.lineTo(s * 0.15 + jetLen, 0);
        ctx.lineTo(s * 0.15, s * 0.35);
        ctx.closePath();
        ctx.fillStyle = jetGrad;
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    const start = () => {
      if (visible) return
      visible = true
      build()
      raf = requestAnimationFrame(draw)
    }

    const stop = () => {
      visible = false
      cancelAnimationFrame(raf)
    }

    start()

    const onResize = () => {
      stop()
      start()
    }
    window.addEventListener("resize", onResize)

    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("mouseleave", onLeave)
    canvas.addEventListener("click", onClick)

    return () => {
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("mouseleave", onLeave)
      canvas.removeEventListener("click", onClick)
      stop()
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
    }
  }, [phase])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      aria-hidden="true"
    />
  )
}
