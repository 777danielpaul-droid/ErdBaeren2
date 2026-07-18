import { useEffect, useRef } from "react";

/* Volumetrische Nebel-Wolken via fraktalem Perlin-Noise (fbm) im
   Fragment-Shader.
   - weiche Kanten (fbm + weiche smoothstep-Masken)
   - langsame Bewegung (Drift im Noise-Feld)
   - Tiefe durch Transparenz-Gradienten (unten satter, oben auslaufend)
   Deckung über den ganzen Himmel (oberhalb des Horizonts), rechts dichter. */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2  uRes;

// ---------- Ashima 3D simplex noise ----------
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ---------- fbm (4 Oktaven: Kompromiss Qualität/Performance) ----------
float fbm(vec3 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<4;i++){ v += a * snoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.022;   // langsames Wabern

  // --- fraktales Perlin-Noise: viele kleine, schadenartige Wolken (Wisps) ---
  // grobe Wirbel
  vec3 q = vec3(p * 1.7, t);
  float n1 = fbm(q);
  vec3 r = vec3(p * 1.7 + vec2(n1*0.6 + 0.3, n1*0.4 - 0.2), t*1.2 + 1.7);
  float n2 = fbm(r);
  // feine, hoeherfrequente Schaerung -> zerfaellt in viele kleine Schwaden
  float n3 = fbm(vec3(p * 4.2 + vec2(1.7, -0.9), t * 1.5 + 3.3));
  // Dichte 0..1
  float dens = (n1 + 0.6*n2) * 0.5 + 0.5;
  dens = clamp(dens, 0.0, 1.0);
  // scharfe Kante -> klare, kleine Wolken-Inseln statt einer Masse
  dens = smoothstep(0.46, 0.60, dens);
  // feine Schaerung als Multiplikator: fresst Luecken in die Form -> Wisps
  float detail = smoothstep(0.30, 0.72, n3 * 0.5 + 0.5);
  dens *= mix(0.55, 1.0, detail);
  dens = clamp(dens, 0.0, 1.0);

  // ===== Wolkenbank ueber das obere Viertel =====
  // Verwirbelung: alle Ränder werden durch fraktales Rauschen verschoben,
  // damit es KEINE klaren, geraden Kanten gibt. Türkis & Lila mischen sich
  // in den turbulenten Übergangszonen zufällig.
  // Fraktale Verschiebung der Rand-Positionen (Domain-Warp):
  float sw = fbm(vec3(p * 3.2 + vec2(t * 0.7, -t * 0.5), t * 1.1));        // -1..1
  float sw2 = fbm(vec3(p * 5.5 + vec2(-t * 0.5, t * 0.8), t * 1.5 + 9.0));
  vec2 pS = p + vec2(sw, sw2) * 0.16;   // gewarpte Position für Kanten
  float botY = 0.74;                                  // Unterkante der Bank
  float vis = smoothstep(0.12, 0.5, dens);            // lokale Wolkenbreite 0..1
  float topY = mix(0.80, 1.02, vis);                  // schmal flach, voll hoch
  // TURBULENTE Oberkante (statt glatter Sinus): fbm-Krause + Wobble
  float wob = fbm(vec3(pS * 3.5, t * 0.9)) * 0.14 + sw * 0.05;
  float lump = sin(p.x * 3.0 + t * 0.6) * 0.03 + sin(p.y * 4.0) * 0.02;
  float body = smoothstep(botY + lump, botY + 0.06 + lump, uv.y)
             * (1.0 - smoothstep(topY - 0.06 + wob, topY + wob, uv.y));
  // Seitenränder TURBULENT ausklingen (kein gerader Schnitt):
  body *= smoothstep(0.0, 0.05, uv.x + sw2 * 0.06)
        * smoothstep(1.0, 0.95, uv.x - sw2 * 0.06);
  body = clamp(body, 0.0, 1.0);
  float cloud = vis * body;
  // AUFBRUCH: feine fbm-Lücken fressen die solide "Masse" auf -> strukturierte
  // Schwaden statt Block. Besonders links-mittig (wo Eck+Bank treffen) wirksam.
  float gap = fbm(vec3(p * 2.3 + vec2(3.1, 1.7), t * 0.7 + 2.0));
  float breaker = smoothstep(0.40, 0.62, gap);     // 0..1, feine Inseln
  cloud *= mix(1.0, breaker, 0.4);                  // 40% der Fläche strukturiert (mehr Türkis)
  cloud = clamp(cloud, 0.0, 1.0);

  // --- Tiefe durch Transparenz-Gradient (oben satt, nach unten wischern) ---
  float vN = clamp((uv.y - botY) / 0.26, 0.0, 1.0);
  float vFall = mix(1.0, 0.35, 1.0 - vN);  // unten auslaufend
  float edge = smoothstep(0.0, 0.5, body);
  float alpha = cloud * vFall * edge;
  alpha = clamp(alpha, 0.0, 1.0);

  // ===== Eine dezente, kleine Wolke weiter unten (rechts-mittig) =====
  // (weiche ovale Maske, geringere Intensitaet -> zurueckhaltend)
  // Blob 1 (links-mittig) entfernt - gehoert nicht dorthin.
  // --- Blob 2: rechts-mittig ---
  vec2 c2 = vec2(0.74 * aspect, 0.46);
  vec2 r2 = vec2(0.15 * aspect, 0.075);
  float rr2 = length((p - c2) / r2);
  float l2 = sin(p.x * 2.7 - 3.0 + t * 0.7) * 0.06 + sin(p.y * 3.3 + t * 0.5) * 0.04;
  float b2 = smoothstep(1.0 + l2, 0.62 + l2, rr2);
  float a2 = smoothstep(0.16, 0.52, dens) * b2 * 0.42;  // dezenter

  // ===== Untere Wolkenbank (humblbee skill reuse overlay) =====
  float botTop = mix(0.24, 0.30, vis);
  float botWob = fbm(vec3(pS * 3.2, t * 0.85)) * 0.14 + sw * 0.05;
  float botThreshold = botTop + botWob;
  float botBody = 1.0 - smoothstep(botThreshold - 0.10, botThreshold + 0.04, uv.y);
  botBody *= smoothstep(0.0, 0.09, uv.x + sw2 * 0.08)
           * smoothstep(1.0, 0.91, uv.x - sw2 * 0.08);
  botBody = clamp(botBody, 0.0, 1.0);
  float botCloud = dens * botBody;
  float botGap = fbm(vec3(p * 2.1 + vec2(1.3, 2.7), t * 0.6 + 5.0));
  float botBreaker = smoothstep(0.36, 0.66, botGap);
  botCloud *= mix(1.0, botBreaker, 0.36);
  botCloud = clamp(botCloud, 0.0, 1.0);
  float botAlpha = clamp(botCloud * 1.0, 0.0, 1.0);

  // ===== Zwei kleine LILA Wolken in den oberen Ecken (links + rechts) =====
  // WIE DIE HAUPTWOLKEN: Domain-Warp (n1/n2/n3) fuer fliessendes Morphen,
  // lokale fbm-Textur x weicher Gaussscher Falloff (randlos, kein Container).
  // --- Eck-Wolke 1: links-oben (HOTSPOT) ---
  // 1 fbm + billiger sin-Warp (statt 2 fbm) -> performanter
  vec2 cL = vec2(0.06 * aspect, 0.92);
  float wL = fbm(vec3(p * 1.9, t * 1.5));
  float densL = wL * 0.5 + 0.5;
  densL = clamp(densL, 0.0, 1.0);
  densL = smoothstep(0.15, 0.55, densL);
  densL = max(densL, 0.30);                // dezent (nicht dominant)
  vec2 pL = (p - cL) / vec2(0.46 * aspect, 0.34);
  float warbL = wL;   // fbm direkt als Krause wiederverwenden
  float dL = length(pL) + warbL * 0.55;
  float fallL = exp(-dL * dL * 0.85);
  float aL = densL * fallL * 0.85;
  // --- Eck-Wolke 2: rechts-oben (HOTSPOT) ---
  vec2 cR = vec2(0.94 * aspect, 0.92);
  float wR = fbm(vec3(p * 1.9, t * 1.5 + 5.0));
  float densR = wR * 0.5 + 0.5;
  densR = clamp(densR, 0.0, 1.0);
  densR = smoothstep(0.15, 0.55, densR);
  densR = max(densR, 0.30);                // dezent (nicht dominant)
  vec2 pR = (p - cR) / vec2(0.44 * aspect, 0.33);
  float warbR = wR;
  float dR = length(pR) + warbR * 0.55;
  float fallR = exp(-dR * dR * 0.85);
  float aR = densR * fallR * 0.85;

  // kombinieren: lila Corner = OVERLAY UEBER türkis (beide existieren uebereinander)
  float blobA = clamp(a2, 0.0, 1.0);
  float tAlpha = clamp(alpha + blobA - alpha * blobA, 0.0, 1.0); // Bank + Blobs (türkis)
  float cornerA = clamp(aL + aR, 0.0, 1.0);                       // lila Eck-Hotspots
  // Alpha: türkis UND lila addieren sich (beides sichtbar, übereinander)
  alpha = clamp(tAlpha + cornerA * (1.0 - tAlpha), 0.0, 1.0);
  cloud = max(cloud, max(blobA, cornerA));

  // untere Bank als Overlay über alles
  float topA = clamp(alpha, 0.0, 1.0);
  float botAdd = clamp(botAlpha * 0.92, 0.0, 1.0);
  alpha = clamp(topA + botAdd - topA * botAdd, 0.0, 1.0);
  cloud = max(cloud, botCloud);

  if(alpha < 0.008) discard;

  // --- Farbe: weich, hell. Licht von oben-links. ---
  float lit = clamp(dens * 0.6 + 0.4 + n2 * 0.2, 0.0, 1.0);
  vec3 lila    = vec3(0.50, 0.38, 0.72);   // kuehle Schatten (zurueckhaltend)
  vec3 tuerkis = vec3(0.32, 0.95, 0.97);   // LEBHAFTES Türkis-Highlight (satt, cyan)
  vec3 weiss   = vec3(0.93, 0.98, 1.00);   // cremige Gipfel
  vec3 gold    = vec3(1.00, 0.82, 0.42);   // goldener Saum an Rändern
  vec3 cornerWeiss = vec3(0.96, 0.94, 1.00);   // heller lila-weißer Kern
  vec3 cornerLila  = vec3(0.68, 0.50, 1.00);   // helles Violett (dezent)
  float litC = clamp(aL * 0.7 + aR * 0.3, 0.0, 1.0);
  vec3 cornerCol = mix(cornerLila, cornerWeiss, smoothstep(0.1, 0.7, litC) * 0.55);
  vec3 turkCol = mix(lila, tuerkis, smoothstep(0.25, 0.65, lit));  // frueher tuerkis
  turkCol = mix(turkCol, weiss, smoothstep(0.66, 0.95, lit) * 0.8);
  // goldener Saum: wo die Wolke dünn wird (Rand)
  float rim = cloud * (1.0 - cloud) * 4.0;
  turkCol = mix(turkCol, gold, clamp(rim, 0.0, 1.0) * 0.35);
  // LILA = HINTERGRUND (dezenter Eck-Schimmer), TÜRKIS = VORDERGRUND (Main-Wolken).
  // Türkis legt sich als leuchtende Schicht DARÜBER - beides sichtbar, lila schimmert dezent hinter den Ecken.
  // TURBULENTER Farb-Mix: fbm steuert die Grenze, damit Türkis & Lila sich
  // windig/zufällig verweben. 1 Noise (performant).
  float mixN = fbm(vec3(p * 3.4 + vec2(t * 0.6, t * 0.4), t * 1.0)) * 0.5 + 0.5;
  float mixMask = (mixN - 0.5) * 1.2;  // -0.6..+0.6 Wind
  // MEHR TÜRKIS: turkMask stark Richtung Türkis biasen (Lila nur dezenter Schimmer)
  float turkMask = clamp(tAlpha + mixMask + 0.40, 0.0, 1.0);
  vec3 col = cornerCol;
  col = mix(col, turkCol, clamp(turkMask, 0.0, 1.0));   // türkis DOMINANT, lila schimmert

  gl_FragColor = vec4(col, alpha);
}`;

function createShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("CloudVolume shader error:", gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

export default function CloudVolume() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("CloudVolume link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf;
    let last = 0;
    const FRAME = 1000 / 30;   // 30 fps: langsame Wolken -> unmerklich, halbiert die GPU-Last
    const start = performance.now();
    const render = (now) => {
      raf = requestAnimationFrame(render);
      if (now - last < FRAME) return;   // Frame überspringen -> Drosselung
      last = now;
      resize();
      gl.uniform1f(uTime, (now - start) / 1000 * 0.87);  // 15% langsamer
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cloud-volume"
      aria-hidden="true"
    />
  );
}
