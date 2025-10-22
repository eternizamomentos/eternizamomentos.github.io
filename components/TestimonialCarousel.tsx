import { useEffect, useRef, useState } from "react";

type Testimonial = { name: string; role?: string; text: string; };

const DATA: Testimonial[] = [
  { name: "Ana & João", role: "Casamento", text: "Quando ouvimos pela primeira vez, choramos juntos. Era a nossa história em música. Inesquecível." },
  { name: "Marina", role: "Homenagem à mãe", text: "Minha mãe se emocionou do começo ao fim. A letra descreve exatamente o que eu queria dizer." },
  { name: "Eduardo", role: "Tributo", text: "Respeito, sensibilidade e qualidade. O processo foi claro e as revisões deixaram tudo perfeito." },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = (dir: "prev" | "next") => {
    setIndex((i) => {
      const next = dir === "next" ? i + 1 : i - 1;
      if (next < 0) return DATA.length - 1;
      if (next >= DATA.length) return 0;
      return next;
    });
  };

  // teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // swipe simples (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) go("next"); else go("prev");
    }
    touchStartX.current = null;
  };

  return (
    <section aria-labelledby="depoimentos" className="bg-white">
      <div className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="depoimentos" className="text-2xl md:text-3xl font-bold text-gray-900">Depoimentos</h2>
            <p className="text-gray-600 mt-1">Histórias reais, emoções verdadeiras.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => go("prev")} className="rounded-md border px-3 py-2 text-sm hover:bg-soft-bg" aria-label="Depoimento anterior">←</button>
            <button onClick={() => go("next")} className="rounded-md border px-3 py-2 text-sm hover:bg-soft-bg" aria-label="Próximo depoimento">→</button>
          </div>
        </div>

        <div className="mt-6 relative" role="region" aria-live="polite" aria-atomic="true"
             onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {DATA.map((t, i) => (
            <article key={t.name + i}
              className={`transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
              <div className="rounded-2xl border border-gray-200 bg-soft-bg p-5 md:p-8">
                <div className="flex items-center gap-2 text-amber-500 mb-3" aria-label="Avaliação 5 estrelas">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-[var(--step-1)] text-gray-800 leading-relaxed">“{t.text}”</p>
                <div className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">{t.name}</span>
                  {t.role ? <> • {t.role}</> : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir para depoimento ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-accent-gold" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
