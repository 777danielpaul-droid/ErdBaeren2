import Reveal from "../motion/Reveal"
import { site } from "../../data/content"
import { T } from "../RunenText"

export default function Conflict() {
  const c = site.conflict
  return (
    <section id="konflikt" className="relative py-28 bg-ink/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="mb-14 max-w-3xl" variant="up">
          <p className="mono-label text-neon mb-4"><T en={c.eyebrow.en}>{c.eyebrow.de}</T></p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
            <T en={c.title.en}>{c.title.de}</T>
          </h2>
          <p className="mt-5 text-bone/65 leading-relaxed"><T en={c.body.en}>{c.body.de}</T></p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {c.aspects.map((side, i) => (
            <Reveal key={side.side} delay={i * 0.1} variant={i % 2 === 0 ? "left" : "right"}>
              <div
                className={`rounded-2xl neon-border glass p-8 h-full ${
                  side.side === "MILCHMÄUSE"
                    ? "border-cyan/30 bg-panel"
                    : "border-neon/30 bg-panel"
                }`}
              >
                <div
                  className={`mono-label mb-6 ${
                    side.side === "MILCHMÄUSE" ? "text-cyan" : "text-neon"
                  }`}
                >
                  <T en={side.side.en}>{side.side.de}</T>
                </div>
                <ul className="space-y-4">
                  {side.items.map((it) => (
                    <li
                      key={it}
                      className="flex gap-3 text-bone/75 leading-relaxed text-sm sm:text-base"
                    >
                      <span
                        className={`mt-2 w-2 h-2 rounded-full shrink-0 ${
                          side.side === "MILCHMÄUSE" ? "bg-cyan" : "bg-neon"
                        }`}
                      />
                      <T en={it.en}>{it.de}</T>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
