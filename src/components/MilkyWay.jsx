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
          r: rand(0.4, 1.0), a: rand(0.4, 0.9),
          tw: rand(0.5, 1.5), ph: Math.random() * Math.PI * 2,
          c: "255,255,255",
        });
      }
      for (let i = 0; i < 280; i++) {
        const tint = Math.random();
        const c = tint < 0.33 ? "210,235,255" : tint < 0.66 ? "232,215,255" : "255,230,200";
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(1.0, 1.7), a: rand(0.55, 0.95),
          tw: rand(0.4, 1.2), ph: Math.random() * Math.PI * 2, c,
        });
      }
      for (let i = 0; i < 40; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(1.8, 2.6), a: rand(0.7, 1.0),
          tw: rand(0.3, 0.9), ph: Math.random() * Math.PI * 2,
          c: "255,255,255",
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
            x, y, r: rand(0.5, 1.3), a: rand(0.7, 1.0),
            tw: rand(0.5, 1.4), ph: Math.random() * Math.PI * 2, c,
          });
        }
      });
    }

    let t = 0;
    function draw() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const a = s.a * (0.7 + 0.3 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
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
