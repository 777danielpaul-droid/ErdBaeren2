import { useEffect, useRef } from "react";

// Milchstraße als Canvas: nur Sterne + Sternhaufen, kein Galaxie-Band mehr.
export default function MilkyWay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let stars = [];
    let W, H, DPR;

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
          x: Math.random() * W, y: Math.random() * H,
          r: rand(0.4, 1.0), a: rand(0.5, 1.0),
          tw: rand(0.8, 2.8), ph: Math.random() * Math.PI * 2,
          c: "245,238,255",
        });
      }
      for (let i = 0; i < 260; i++) {
        const tint = Math.random();
        const c = tint < 0.33 ? "210,235,255" : tint < 0.66 ? "232,215,255" : "255,230,200";
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(1.1, 2.1), a: rand(0.65, 1.0),
          tw: rand(0.9, 2.4), ph: Math.random() * Math.PI * 2, c,
        });
      }
      for (let i = 0; i < 35; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(2.2, 3.2), a: rand(0.8, 1.0),
          tw: rand(0.9, 2.0), ph: Math.random() * Math.PI * 2,
          c: "255,250,245",
        });
      }
      const clusters = [
        [W * 0.14, H * 0.26], [W * 0.62, H * 0.62],
        [W * 0.84, H * 0.70], [W * 0.40, H * 0.18],
        [W * 0.30, H * 0.80], [W * 0.75, H * 0.35],
      ];
      clusters.forEach(([cx, cy]) => {
        const n = 90;
        for (let i = 0; i < n; i++) {
          const ang = Math.random() * Math.PI * 2;
          const rad = Math.abs(rand(-1, 1)) * 55;
          const x = cx + Math.cos(ang) * rad;
          const y = cy + Math.sin(ang) * rad;
          const tint = Math.random();
          const c = tint < 0.25 ? "255,235,205" : tint < 0.5 ? "210,240,255" : "255,255,255";
          stars.push({
            x, y, r: rand(0.6, 1.4), a: rand(0.75, 1.0),
            tw: rand(1.0, 2.6), ph: Math.random() * Math.PI * 2, c,
          });
        }
      });
    }

    let t = 0;
    let dx = 0;
    function draw() {
      t += 0.016;
      dx = (dx + 0.18) % W;
      ctx.clearRect(0, 0, W, H);
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
      raf = requestAnimationFrame(draw);
    }

    build();
    draw();
    const onResize = () => { cancelAnimationFrame(raf); build(); draw(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="milkyway"
      aria-hidden="true"
    />
  );
}
