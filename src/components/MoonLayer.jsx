import { useEffect, useRef } from "react";

export default function MoonLayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const moonX = W * 0.10;
    const moonY = H * 0.13;
    const moonR = Math.min(W, H) * 0.065;
    const moonRX = moonR * 1.15;
    const moonRY = moonR * 0.92;

    const draw = () => {
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
      ctx.clearRect(0, 0, W, H);
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
        const shade = ctx.createRadialGradient(
          cx + moonRX * cr.rx * 0.3,
          cy + moonRY * cr.ry * 0.25,
          moonRX * cr.rx * 0.05,
          cx,
          cy,
          moonRX * cr.rx
        );
        shade.addColorStop(0, "rgba(0,0,0,0)");
        shade.addColorStop(0.65, `rgba(0,0,0,${(cr.d * 0.18).toFixed(3)})`);
        shade.addColorStop(1, `rgba(0,0,0,${(cr.d * 0.4).toFixed(3)})`);
        ctx.beginPath();
        ctx.fillStyle = shade;
        ctx.ellipse(cx, cy, moonRX * cr.rx, moonRY * cr.ry, 0, 0, Math.PI * 2);
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
    };

    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
