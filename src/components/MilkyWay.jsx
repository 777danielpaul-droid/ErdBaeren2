import { useEffect, useRef } from "react";

// Milchstraße als Canvas: diffuses Galaxie-Band (lila->türkis->gold) +
// hunderte Sterne + dichte Cluster (Sternhaufen), die fast wie eine
// leuchtende Masse wirken. Fix, vollflächig, hinter dem Content.
export default function MilkyWay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let stars = [];
    let band = null;
    let W, H, DPR;

    function rand(a, b) { return a + Math.random() * (b - a); }

    // Galaxie-Band als Offscreen-Gradient (einmal rendern, dann wiederholt zeichnen)
    function buildBand() {
      const b = document.createElement("canvas");
      b.width = 400; b.height = 240;
      const bctx = b.getContext("2d");
      const g = bctx.createLinearGradient(0, 0, 400, 0);
      g.addColorStop(0.0, "rgba(192,38,211,0.0)");
      g.addColorStop(0.18, "rgba(192,38,211,0.40)");
      g.addColorStop(0.44, "rgba(124,58,237,0.34)");
      g.addColorStop(0.70, "rgba(34,211,238,0.30)");
      g.addColorStop(0.88, "rgba(245,197,66,0.22)");
      g.addColorStop(1.0, "rgba(245,197,66,0.0)");
      bctx.fillStyle = g;
      bctx.fillRect(0, 0, 400, 240);
      // weichzeichnen via mehrfache Transparenz-Schicht
      bctx.globalAlpha = 0.5;
      bctx.filter = "blur(20px)";
      bctx.drawImage(b, 0, 0);
      band = b;
    }

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
      // EBENE 1: feine, sehr dichte Streuung
      for (let i = 0; i < 900; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(0.4, 1.0), a: rand(0.4, 0.9),
          tw: rand(0.5, 1.5), ph: Math.random() * Math.PI * 2,
          c: "255,255,255",
        });
      }
      // EBENE 2: mittlere Sterne, leicht farbig
      for (let i = 0; i < 280; i++) {
        const tint = Math.random();
        const c = tint < 0.33 ? "210,235,255" : tint < 0.66 ? "232,215,255" : "255,230,200";
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(1.0, 1.7), a: rand(0.55, 0.95),
          tw: rand(0.4, 1.2), ph: Math.random() * Math.PI * 2, c,
        });
      }
      // EBENE 3: helle Akzent-Sterne
      for (let i = 0; i < 40; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: rand(1.8, 2.6), a: rand(0.7, 1.0),
          tw: rand(0.3, 0.9), ph: Math.random() * Math.PI * 2,
          c: "255,255,255",
        });
      }
      // CLUSTER: dichte Haufen (fast wie leuchtende Masse)
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
    let drift = 0;
    function draw() {
      t += 0.016;
      drift = Math.sin(t * 0.05) * 0.03; // langsamer Drift
      ctx.clearRect(0, 0, W, H);

      // Galaxie-Band (rotiert, zentriert, weich)
      if (band) {
        ctx.save();
        ctx.translate(W * (0.5 + drift), H * 0.5);
        ctx.rotate(-16 * Math.PI / 180);
        ctx.globalAlpha = 0.9;
        const bw = W * 1.6, bh = H * 0.6;
        ctx.drawImage(band, -bw / 2, -bh / 2, bw, bh);
        ctx.restore();
      }

      // Sterne
      for (const s of stars) {
        const a = s.a * (0.7 + 0.3 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.c},${a.toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    buildBand();
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
