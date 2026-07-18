import { useEffect, useRef } from "react";

// Milchstraße als Canvas: nur Sterne + Sternhaufen, kein Galaxie-Band mehr.
export default function MilkyWay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars = [];
    let meteors = [];
    let ship = null;
    let planets = [];
    let W, H, DPR;
    let raf = 0;
    let visible = false;

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
        vx: rand(0.4, 0.9),
        size: rand(8, 13),
        a: rand(0.55, 0.85),
        tw: rand(0.5, 1.2),
        ph: Math.random() * Math.PI * 2,
        blink: rand(0.8, 2.2),
        curveAmp: rand(20, 55),
        curveFreq: rand(0.35, 0.7),
        curvePh: Math.random() * Math.PI * 2,
      };

      planets = [];
      const planetCount = 4;
      for (let i = 0; i < planetCount; i++) {
        const hasRings = i === planetCount - 1;
        planets.push({
          x: rand(W * 0.08, W * 0.85),
          y: rand(H * 0.08, H * 0.55),
          r: rand(7, 16),
          a: rand(0.25, 0.6),
          c:
            i % 2 === 0
              ? "255,255,255"
              : i % 3 === 0
              ? "210,220,255"
              : "245,230,210",
          tw: rand(0.25, 0.55),
          ph: Math.random() * Math.PI * 2,
          hasRings,
          ringTilt: rand(0.35, 0.65),
        });
      }
    }

    let t = 0;
    let dx = 0;
    function draw() {
      t += 0.016;
      dx = (dx + 0.18) % W;
      ctx.clearRect(0, 0, W, H);

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
        if (ship.x > W + 90) ship.x = -90;
        const baseY = Math.sin(t * ship.curveFreq + ship.curvePh) * ship.curveAmp;
        const sy = ship.y + baseY;
        const a = ship.a * (0.8 + 0.2 * Math.sin(t * ship.tw + ship.ph));
        const pulse = 0.85 + 0.15 * Math.sin(t * ship.blink + ship.ph);
        const s = ship.size;
        ctx.save();
        ctx.translate(ship.x, sy);
        ctx.scale(1, 0.85 + 0.15 * pulse);
        ctx.globalAlpha = a * pulse;

        const flameGrad = ctx.createLinearGradient(-s * 2.6, 0, -s * 9.2, 0);
        flameGrad.addColorStop(0, "rgba(255,255,255,0)");
        flameGrad.addColorStop(0.35, "rgba(255,255,255,0)");
        flameGrad.addColorStop(0.45, `rgba(124,58,237,${(a * 0.55).toFixed(3)})`);
        flameGrad.addColorStop(0.72, `rgba(124,58,237,${(a * 0.95).toFixed(3)})`);
        flameGrad.addColorStop(0.88, `rgba(217,70,239,${(a * 1.0).toFixed(3)})`);
        flameGrad.addColorStop(1, "rgba(217,70,239,0)");
        ctx.beginPath();
        ctx.moveTo(-s * 1.55, -s * 0.35);
        ctx.bezierCurveTo(-s * 4.0, -s * 1.0, -s * 7.4, -s * 0.6, -s * 9.2, 0);
        ctx.bezierCurveTo(-s * 7.4, s * 0.6, -s * 4.0, s * 1.0, -s * 1.55, s * 0.35);
        ctx.closePath();
        ctx.fillStyle = flameGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${(a * 0.95).toFixed(3)})`;
        ctx.moveTo(-s * 1.55, -s * 0.38);
        ctx.lineTo(s * 2.0, -s * 0.52);
        ctx.lineTo(s * 2.4, 0);
        ctx.lineTo(s * 2.0, s * 0.52);
        ctx.lineTo(-s * 1.55, s * 0.38);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.arc(-s * 0.35, 0, s * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    }

    const loop = () => {
      if (visible) draw();
      else raf = requestAnimationFrame(loop);
    };
    const loopResume = () => {
      if (visible && !raf) raf = requestAnimationFrame(loop);
    };

    build();
    visible = true;
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      (entries) => {
        const next = entries.some((e) => e.isIntersecting);
        visible = next;
        loopResume();
      },
      { rootMargin: "80px" }
    );
    io.observe(canvas);

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      build();
      loopResume();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="milkyway"
      aria-hidden="true"
    />
  );
}
